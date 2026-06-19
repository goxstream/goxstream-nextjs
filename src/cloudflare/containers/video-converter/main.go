package main

import (
	"log"
	"net/http"
	"video-converter/pkg"
)

func main() {
	http.HandleFunc("/transcode", pkg.HandleTranscode)
	http.HandleFunc("/ws", pkg.HandleWebSocket)

	log.Println("Goxstream Container Server listening on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
