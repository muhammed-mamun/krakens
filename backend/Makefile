.PHONY: help build run dev test clean docker-build docker-up docker-down docker-rebuild

help:
	@echo "Available commands:"
	@echo "  make build         - Build the application"
	@echo "  make run           - Run the application"
	@echo "  make dev           - Run with hot reload"
	@echo "  make test          - Run tests"
	@echo "  make clean         - Clean build artifacts"
	@echo "  make docker-build  - Build Docker image"
	@echo "  make docker-up     - Start Docker containers"
	@echo "  make docker-down   - Stop Docker containers"
	@echo "  make docker-rebuild- Rebuild containers without cache"

build:
	go build -o server ./cmd/main.go

run:
	go run ./cmd/main.go

dev:
	air

test:
	go test -v ./...

clean:
	rm -f server
	go clean

docker-build:
	docker build -t herodotus-backend:latest .

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-rebuild:
	docker compose build --no-cache
	docker compose up -d
