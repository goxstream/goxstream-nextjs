# Stage 1: Build the Go transcode server
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY main.go .
RUN go mod init video-converter || true
RUN go build -o transcode-server main.go

# Stage 2: Create runtime image with ffmpeg
FROM alpine:3.19
RUN apk add --no-cache ffmpeg bash libc6-compat
WORKDIR /app
COPY --from=builder /app/transcode-server .
EXPOSE 8080
ENTRYPOINT ["./transcode-server"]
