package pkg

import (
	"bufio"
	"bytes"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
)

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
