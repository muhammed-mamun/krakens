# Krakens Analytics

Real-time web analytics platform with privacy-first approach. Built with Go and Next.js.

## Overview

Krakens is a lightweight, self-hosted analytics solution that provides real-time insights into website traffic without compromising user privacy.

**Key Features:**
- Real-time visitor tracking and analytics
- Privacy-focused (IP anonymization, GDPR compliant)
- Lightweight tracking script (<5KB)
- Multi-domain support
- API-first architecture
- Self-hosted and open source

## Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ Tracking SDK
       ▼
┌─────────────┐     ┌──────────────┐
│  Backend    │────▶│   MongoDB    │
│  (Go/Gin)   │     │   Redis      │
│             │     │   NATS       │
└──────┬──────┘     └──────────────┘
       │
       ▼
┌─────────────┐
│  Frontend   │
│  (Next.js)  │
└─────────────┘
```

## Tech Stack

**Backend:** Go 1.22, Gin, MongoDB, Redis, NATS  
**Frontend:** Next.js 14, TypeScript, Tailwind CSS, Recharts  
**Infrastructure:** Docker, Kubernetes

## Quick Start

### Prerequisites
- Go 1.22+
- Node.js 18+
- MongoDB, Redis, NATS

### Development

```bash
# Clone repository
git clone https://github.com/nesohq/krakens.git
cd krakens

# Start backend
cd backend
docker-compose up -d  # Start dependencies
cp .env.example .env
make dev

# Start frontend (new terminal)
cd frontend
cp .env.example .env.local
npm install && npm run dev
```

Access the dashboard at http://localhost:3000

## Deployment

### Docker Images

Images are automatically built and published to GitHub Container Registry:

```bash
# Pull images
docker pull ghcr.io/nesohq/krakens/backend:latest
docker pull ghcr.io/nesohq/krakens/frontend:latest
```

### Kubernetes

Deploy using your own manifests. Required environment variables:

**Backend:**
```yaml
- MONGODB_URI=mongodb://mongodb:27017
- REDIS_URL=redis://redis:6379
- NATS_URL=nats://nats:4222
- JWT_SECRET=<secret>
```

**Frontend:**
```yaml
- NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Usage

1. **Register** an account at `/register`
2. **Add domain** in the Domains section
3. **Generate API key** for your domain
4. **Install tracking script** on your website:

```html
<script src="https://your-domain.com/krakens.js"></script>
<script>
  Krakens.init('YOUR_API_KEY');
</script>
```

5. **View analytics** in real-time on the dashboard

## API Documentation

### Authentication
```bash
POST /api/auth/register
POST /api/auth/login
```

### Tracking
```bash
POST /api/track
Header: X-API-Key: <key>
```

### Analytics
```bash
GET /api/stats/realtime?domain_id=<id>
GET /api/stats/overview?domain_id=<id>
Header: Authorization: Bearer <token>
```

## Project Structure

```
krakens/
├── backend/    # Go backend service
├── frontend/   # Next.js frontend
└── .github/workflows/    # CI/CD pipelines
```

## Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code follows existing style
- Tests pass
- Documentation is updated
- Commits are clear and descriptive

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Support

- **Issues:** [GitHub Issues](https://github.com/nesohq/krakens/issues)
- **Documentation:** See README files in backend/frontend directories
- **Email:** support@krakens.io

---

Built with ❤️ for privacy-conscious analytics
