# Krakens Analytics - Backend

Real-time web analytics platform backend built with Go.

## Features

- Real-time traffic tracking
- WebSocket-based live updates
- API key authentication
- Domain verification
- Event streaming with NATS
- Redis for real-time counters
- MongoDB for persistent storage

## Tech Stack

- **Framework**: Gin
- **Database**: MongoDB
- **Cache**: Redis
- **Message Queue**: NATS
- **Real-time**: WebSocket

## Getting Started

### Prerequisites

- Go 1.22+
- MongoDB
- Redis
- NATS

### Installation

1. Clone the repository
2. Copy `.env.example` to `.env` and configure
3. Install dependencies:
   ```bash
   go mod download
   ```

### Running

```bash
# Development
make dev

# Production
make build
make run

# Docker
make docker-up
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token

### Domains
- `GET /api/domains` - List domains
- `POST /api/domains` - Add domain
- `PUT /api/domains/:id` - Update domain
- `DELETE /api/domains/:id` - Delete domain

### Tracking
- `POST /api/track` - Track event (public)
- `GET /api/stats/realtime` - Real-time stats
- `GET /api/stats/overview` - Overview stats

### Widgets
- `GET /api/widget/active` - Active visitors widget
- `GET /api/widget/total` - Total hits widget

## License

MIT
