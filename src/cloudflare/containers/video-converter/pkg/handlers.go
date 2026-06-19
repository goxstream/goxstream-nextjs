package pkg

import (
	"encoding/json"
	"log"
	"net/http"
)

type TranscodeRequest struct {
	JobID        string `json:"job_id"`
	InputKey     string `json:"input_key"`
	OutputPrefix string `json:"output_prefix"`
}

// HandleTranscode menangani request HTTP POST untuk memulai transcode asinkron
func HandleTranscode(w http.ResponseWriter, r *http.Request) {
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

// HandleWebSocket menangani koneksi websocket dari klien untuk memantau progress transcode
func HandleWebSocket(w http.ResponseWriter, r *http.Request) {
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
