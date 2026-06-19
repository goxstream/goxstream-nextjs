package pkg

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
)

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
