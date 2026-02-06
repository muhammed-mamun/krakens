# Krakens Analytics - Frontend

Real-time web analytics dashboard built with **Next.js 14**, TypeScript, and Tailwind CSS.

## Features

- Real-time visitor tracking
- Live dashboard with auto-refresh
- Domain management
- API key generation
- Analytics widgets
- Responsive design
- Server-side rendering (SSR)
- Optimized for production

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local` and configure:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

### Running

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm run start
```

The app will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (redirects)
│   ├── login/             # Login page
│   ├── register/          # Register page
│   ├── dashboard/         # Dashboard page
│   ├── domains/           # Domains management
│   └── api-keys/          # API keys management
├── components/            # Reusable components
│   └── DashboardLayout.tsx
├── lib/                   # Utilities and API client
│   └── api.ts
├── store/                 # Zustand stores
│   └── authStore.ts
└── types/                 # TypeScript types
    └── index.ts
```

## Environment Variables

```env
# API Backend URL
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Deployment

### Docker

```bash
docker build -t frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://api.example.com \
  frontend
```

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

## License

MIT

