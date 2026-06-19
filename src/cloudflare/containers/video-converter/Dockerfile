# Stage 1: Build the Go transcode server
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod ./
COPY main.go ./
COPY pkg/ ./pkg/
RUN go build -o transcode-server .

# Stage 2: Create runtime image with ffmpeg
FROM alpine:3.19
RUN apk add --no-cache ffmpeg bash libc6-compat
WORKDIR /app
COPY --from=builder /app/transcode-server .
EXPOSE 8080
ENTRYPOINT ["./transcode-server"]
