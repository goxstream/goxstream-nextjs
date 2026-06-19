package main

import (
	"bufio"
	"bytes"
	"crypto/sha1"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"
)

// JobState menyimpan status pekerjaan transcoding dan koneksi client WebSocket yang aktif
type JobState struct {
	JobID      string            `json:"job_id"`
	Status     string            `json:"status"` // "processing", "completed", "failed"
	Progress   float64           `json:"progress"`
	Error      string            `json:"error,omitempty"`
	Clients    map[net.Conn]bool `json:"-"`
	Mu         sync.Mutex        `json:"-"`
}

var (
	jobs   = make(map[string]*JobState)
	jobsMu sync.RWMutex
)

func getOrCreateJob(jobID string) *JobState {
	jobsMu.Lock()
	defer jobsMu.Unlock()
	if job, exists := jobs[jobID]; exists {
		return job
	}
	job := &JobState{
		JobID:   jobID,
		Status:  "processing",
		Clients: make(map[net.Conn]bool),
	}
	jobs.Store(jobID, job)
	jobs[jobID] = job
	return job
}

func main() {
	http.HandleFunc("/transcode", handleTranscode)
	http.HandleFunc("/ws", handleWebSocket)

	log.Println("Goxstream Container Server listening on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

type TranscodeRequest struct {
	JobID        string `json:"job_id"`
	InputKey     string `json:"input_key"`
	OutputPrefix string `json:"output_prefix"`
}

func handleTranscode(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req TranscodeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Bad request payload", http.StatusBadRequest)
		return
	}

	if req.JobID == "" || req.InputKey == "" || req.OutputPrefix == "" {
		http.Error(w, "job_id, input_key, and output_prefix are required", http.StatusBadRequest)
		return
	}

	// Buat atau dapatkan objek Job
	job := getOrCreateJob(req.JobID)

	// Jalankan transcoding secara asinkron di background goroutine
	go runTranscoding(req.JobID, req.InputKey, req.OutputPrefix, job)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status": "processing",
		"job_id": req.JobID,
	})
}

// runTranscoding mendownload, mentranscode, dan mengunggah video ke R2 internal
func runTranscoding(jobID, inputKey, outputPrefix string, job *JobState) {
	tempDir := filepath.Join("/tmp", "job-"+jobID)
	if err := os.MkdirAll(tempDir, 0755); err != nil {
		updateJobError(job, fmt.Errorf("failed to create temp dir: %v", err))
		return
	}
	defer os.RemoveAll(tempDir)

	inputPath := filepath.Join(tempDir, "input.mp4")

	// 1. Download file dari R2 internal via Outbound Handler
	log.Printf("[%s] Downloading raw video: %s", jobID, inputKey)
	if err := downloadFile("http://r2.internal/"+inputKey, inputPath); err != nil {
		updateJobError(job, fmt.Errorf("failed to download source: %v", err))
		return
	}

	// 2. Dapatkan total durasi video menggunakan ffprobe
	duration, err := getVideoDuration(inputPath)
	if err != nil {
		log.Printf("[%s] Warning: failed to get video duration: %v, progress estimation will be limited", jobID, err)
		duration = 0
	}

	// Buat folder output lokal untuk HLS segmen
	outputDir := filepath.Join(tempDir, "hls")
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		updateJobError(job, fmt.Errorf("failed to create output dir: %v", err))
		return
	}

	// Buat subdirektori resolusi untuk ffmpeg -var_stream_map
	for _, res := range []string{"360p", "480p", "720p", "1080p"} {
		if err := os.MkdirAll(filepath.Join(outputDir, res), 0755); err != nil {
			updateJobError(job, fmt.Errorf("failed to create output resolution dirs: %v", err))
			return
		}
	}

	// 3. Jalankan ffmpeg untuk konversi HLS multi-quality
	log.Printf("[%s] Starting ffmpeg transcoding for duration: %.2f sec", jobID, duration)
	cmd := exec.Command("ffmpeg",
		"-i", inputPath,
		"-filter_complex", "[0:v]split=4[v1][v2][v3][v4]; [v1]scale=-2:1080[v1out]; [v2]scale=-2:720[v2out]; [v3]scale=-2:480[v3out]; [v4]scale=-2:360[v4out]",
		"-map", "[v1out]", "-map", "0:a", "-c:v:0", "libx264", "-b:v:0", "5000k", "-maxrate:v:0", "5350k", "-bufsize:v:0", "7500k", "-c:a:0", "aac", "-b:a:0", "192k",
		"-map", "[v2out]", "-map", "0:a", "-c:v:1", "libx264", "-b:v:1", "2800k", "-maxrate:v:1", "2996k", "-bufsize:v:1", "4200k", "-c:a:1", "aac", "-b:a:1", "128k",
		"-map", "[v3out]", "-map", "0:a", "-c:v:2", "libx264", "-b:v:2", "1400k", "-maxrate:v:2", "1498k", "-bufsize:v:2", "2100k", "-c:a:2", "aac", "-b:a:2", "128k",
		"-map", "[v4out]", "-map", "0:a", "-c:v:3", "libx264", "-b:v:3", "800k", "-maxrate:v:3", "856k", "-bufsize:v:3", "1200k", "-c:a:3", "aac", "-b:a:3", "96k",
		"-f", "hls",
		"-hls_time", "6",
		"-hls_playlist_type", "vod",
		"-master_pl_name", "master.m3u8",
		"-var_stream_map", "v:0,a:0 v:1,a:1 v:2,a:2 v:3,a:3",
		"-hls_segment_filename", filepath.Join(outputDir, "%v", "segment_%03d.ts"),
		filepath.Join(outputDir, "%v", "play.m3u8"),
	)

	stderr, err := cmd.StderrPipe()
	if err != nil {
		updateJobError(job, fmt.Errorf("failed to get stderr pipe: %v", err))
		return
	}

	if err := cmd.Start(); err != nil {
		updateJobError(job, fmt.Errorf("failed to start ffmpeg: %v", err))
		return
	}

	// Baca stderr secara realtime untuk memantau progress
	scanner := bufio.NewScanner(stderr)
	timeReg := regexp.MustCompile(`time=([0-9:.]+)`)
	for scanner.Scan() {
		line := scanner.Text()
		matches := timeReg.FindStringSubmatch(line)
		if len(matches) > 1 && duration > 0 {
			curSecs := parseDurationToSeconds(matches[1])
			progress := (curSecs / duration) * 100.0
			if progress > 100.0 {
				progress = 100.0
			}
			updateJobProgress(job, progress)
		}
	}

	if err := cmd.Wait(); err != nil {
		updateJobError(job, fmt.Errorf("ffmpeg execution failed: %v", err))
		return
	}

	// Ubah nama folder %v ke resolusi yang sesuai agar serasi
	// FFMpeg var_stream_map menggunakan index (0, 1, 2, 3) untuk %v
	// 0: 1080p, 1: 720p, 2: 480p, 3: 360p
	indexMap := map[string]string{
		"0": "1080p",
		"1": "720p",
		"2": "480p",
		"3": "360p",
	}

	for idx, name := range indexMap {
		srcPath := filepath.Join(outputDir, idx)
		destPath := filepath.Join(outputDir, name)
		
		// Bersihkan target jika ada folder kosong yang dibuat di awal
		os.Remove(destPath)
		
		if err := os.Rename(srcPath, destPath); err != nil {
			log.Printf("[%s] Warning: failed to rename folder %s to %s: %v", jobID, idx, name, err)
		}
	}

	// Edit master.m3u8 untuk merefleksikan perubahan folder dari indeks (0, 1, 2, 3) ke nama resolusi
	masterPath := filepath.Join(outputDir, "master.m3u8")
	if masterData, err := os.ReadFile(masterPath); err == nil {
		content := string(masterData)
		content = strings.ReplaceAll(content, "0/play.m3u8", "1080p/play.m3u8")
		content = strings.ReplaceAll(content, "1/play.m3u8", "720p/play.m3u8")
		content = strings.ReplaceAll(content, "2/play.m3u8", "480p/play.m3u8")
		content = strings.ReplaceAll(content, "3/play.m3u8", "360p/play.m3u8")
		_ = os.WriteFile(masterPath, []byte(content), 0644)
	}

	// 4. Upload file-file HLS ke R2 internal via Outbound Handler
	log.Printf("[%s] Uploading transcoded HLS files to: %s", jobID, outputPrefix)
	err = filepath.Walk(outputDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}

		relPath, err := filepath.Rel(outputDir, path)
		if err != nil {
			return err
		}
		// Standarisasi pemisah path menjadi '/' untuk R2
		relPath = filepath.ToSlash(relPath)
		r2DestURL := fmt.Sprintf("http://r2.internal/%s/%s", outputPrefix, relPath)

		return uploadFile(path, r2DestURL)
	})

	if err != nil {
		updateJobError(job, fmt.Errorf("failed to upload HLS files: %v", err))
		return
	}

	updateJobCompleted(job)
}

// downloadFile mendownload berkas menggunakan klien HTTP default
func downloadFile(url, destPath string) error {
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to download: status code %d", resp.StatusCode)
	}

	out, err := os.Create(destPath)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, resp.Body)
	return err
}

// uploadFile mengunggah berkas lokal menggunakan HTTP PUT ke R2 internal
func uploadFile(localPath, r2URL string) error {
	file, err := os.Open(localPath)
	if err != nil {
		return err
	}
	defer file.Close()

	stat, err := file.Stat()
	if err != nil {
		return err
	}

	req, err := http.NewRequest(http.MethodPut, r2URL, file)
	if err != nil {
		return err
	}
	req.ContentLength = stat.Size()

	// Deteksi content-type sederhana
	contentType := "application/octet-stream"
	if strings.HasSuffix(localPath, ".m3u8") {
		contentType = "application/x-mpegURL"
	} else if strings.HasSuffix(localPath, ".ts") {
		contentType = "video/MP2T"
	}
	req.Header.Set("Content-Type", contentType)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("upload failed: status %d, body: %s", resp.StatusCode, string(body))
	}
	return nil
}

// getVideoDuration mengambil durasi video dalam detik menggunakan ffprobe
func getVideoDuration(path string) (float64, error) {
	cmd := exec.Command("ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", path)
	var out bytes.Buffer
	cmd.Stdout = &out
	if err := cmd.Run(); err != nil {
		return 0, err
	}
	durationStr := strings.TrimSpace(out.String())
	return strconv.ParseFloat(durationStr, 64)
}

// parseDurationToSeconds mengonversi format time HH:MM:SS.xx dari ffmpeg ke detik
func parseDurationToSeconds(tStr string) float64 {
	parts := strings.Split(tStr, ":")
	if len(parts) != 3 {
		return 0
	}
	hours, _ := strconv.ParseFloat(parts[0], 64)
	mins, _ := strconv.ParseFloat(parts[1], 64)
	secs, _ := strconv.ParseFloat(parts[2], 64)
	return hours*3600 + mins*60 + secs
}

// Fungsi helper status update & WebSocket broadcaster

func updateJobProgress(job *JobState, progress float64) {
	job.Mu.Lock()
	job.Progress = progress
	job.Mu.Unlock()
	broadcastJobState(job)
}

func updateJobCompleted(job *JobState) {
	job.Mu.Lock()
	job.Status = "completed"
	job.Progress = 100.0
	job.Mu.Unlock()
	broadcastJobState(job)
	closeClients(job)
}

func updateJobError(job *JobState, err error) {
	log.Printf("[%s] Error: %v", job.JobID, err)
	job.Mu.Lock()
	job.Status = "failed"
	job.Error = err.Error()
	job.Mu.Unlock()
	broadcastJobState(job)
	closeClients(job)
}

func broadcastJobState(job *JobState) {
	job.Mu.Lock()
	defer job.Mu.Unlock()

	data, err := json.Marshal(job)
	if err != nil {
		return
	}

	for client := range job.Clients {
		if err := writeTextMessage(client, string(data)); err != nil {
			log.Printf("[%s] Failed to send update to client, closing conn: %v", job.JobID, err)
			client.Close()
			delete(job.Clients, client)
		}
	}
}

func closeClients(job *JobState) {
	job.Mu.Lock()
	defer job.Mu.Unlock()
	for client := range job.Clients {
		client.Close()
	}
	job.Clients = make(map[net.Conn]bool)
}

// Native WebSocket Handshake & Frame Writer

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	jobID := r.URL.Query().Get("job_id")
	if jobID == "" {
		http.Error(w, "job_id query param required", http.StatusBadRequest)
		return
	}

	if r.Header.Get("Upgrade") != "websocket" {
		http.Error(w, "Expected WebSocket connection", http.StatusBadRequest)
		return
	}

	conn, err := handshake(w, r)
	if err != nil {
		log.Printf("Handshake failed: %v", err)
		return
	}

	job := getOrCreateJob(jobID)

	job.Mu.Lock()
	job.Clients[conn] = true
	// Kirimkan status awal saat ini langsung ke client yang baru terhubung
	initialData, _ := json.Marshal(job)
	job.Mu.Unlock()

	_ = writeTextMessage(conn, string(initialData))

	// Pertahankan koneksi tetap terbuka dengan mendeteksi jika client memutuskan koneksi
	go func() {
		buf := make([]byte, 1024)
		for {
			_, err := conn.Read(buf)
			if err != nil {
				// Client memutus koneksi
				job.Mu.Lock()
				delete(job.Clients, conn)
				job.Mu.Unlock()
				conn.Close()
				break
			}
		}
	}()
}

func handshake(w http.ResponseWriter, r *http.Request) (net.Conn, error) {
	key := r.Header.Get("Sec-WebSocket-Key")
	h := sha1.New()
	h.Write([]byte(key))
	h.Write([]byte("258EAFA5-E914-47DA-95CA-C5AB0DC85B11"))
	accept := base64.StdEncoding.EncodeToString(h.Sum(nil))

	hj, ok := w.(http.Hijacker)
	if !ok {
		http.Error(w, "webserver doesn't support hijacking", http.StatusInternalServerError)
		return nil, errors.New("not a hijacker")
	}
	conn, bufrw, err := hj.Hijack()
	if err != nil {
		return nil, err
	}

	bufrw.WriteString("HTTP/1.1 101 Switching Protocols\r\n")
	bufrw.WriteString("Upgrade: websocket\r\n")
	bufrw.WriteString("Connection: Upgrade\r\n")
	bufrw.WriteString("Sec-WebSocket-Accept: " + accept + "\r\n\r\n")
	bufrw.Flush()

	return conn, nil
}

func writeTextMessage(conn net.Conn, message string) error {
	payload := []byte(message)
	length := len(payload)

	var header []byte
	if length < 126 {
		header = []byte{0x81, byte(length)}
	} else if length <= 65535 {
		header = []byte{0x81, 126, byte(length >> 8), byte(length & 0xff)}
	} else {
		header = []byte{0x81, 127, 0, 0, 0, 0, byte(length >> 24), byte(length >> 16), byte(length >> 8), byte(length & 0xff)}
	}

	_, err := conn.Write(append(header, payload...))
	return err
}
