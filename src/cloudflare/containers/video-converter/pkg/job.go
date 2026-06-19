package pkg

import (
	"encoding/json"
	"log"
	"net"
	"sync"
)

// JobState menyimpan status pekerjaan transcoding dan koneksi client WebSocket yang aktif
type JobState struct {
	JobID    string            `json:"job_id"`
	Status   string            `json:"status"` // "processing", "completed", "failed"
	Progress float64           `json:"progress"`
	Error    string            `json:"error,omitempty"`
	Clients  map[net.Conn]bool `json:"-"`
	Mu       sync.Mutex        `json:"-"`
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
	jobs[jobID] = job
	return job
}

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
