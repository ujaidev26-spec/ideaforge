# Firecracker Sentinel

Real-time sensor simulation, risk engine, and live monitoring dashboard for firecracker unit safety management.

## Features

- 🔥 **30 Sensors** across 5 zones monitoring temperature, pressure, sound, vibration, gas, and humidity
- ⚡ **Real-time Simulation** with automatic sensor reading updates every 2 seconds
- 🛡️ **AI Risk Engine** with weighted multi-factor risk assessment
- 🚨 **Live Alerts** with severity levels, filtering, and acknowledgment
- 📊 **Interactive Charts** showing real-time sensor trends
- 🗺️ **Zone Monitoring** with visual status indicators
- 💥 **Explosion Simulation** to test emergency response scenarios
- 🌙 **Dark Theme** with orange accent design

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Deployment**: Vercel-ready

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Deployment

This project is configured for seamless deployment on Vercel:

1. Push to your GitHub/GitLab repository
2. Import the project on [vercel.com](https://vercel.com)
3. Deploy!

Or use the Vercel CLI:
```bash
npx vercel
```

## Architecture

```
src/
├── app/                  # Next.js App Router pages
│   ├── api/             # Backend API routes
│   │   ├── sensors/     # Sensor data endpoints
│   │   ├── risk/        # Risk assessment endpoints
│   │   ├── alerts/      # Alert management endpoints
│   │   └── simulate/    # Simulation control endpoints
│   ├── sensors/         # Sensor management page
│   ├── alerts/          # Alert dashboard page
│   ├── analytics/       # Analytics & trends page
│   └── settings/        # Settings page
├── components/          # React UI components
├── hooks/               # Custom React hooks
├── lib/                 # Core business logic
│   ├── sensorSimulator  # Sensor data simulation
│   ├── riskEngine       # Risk assessment engine
│   ├── alertManager     # Alert generation & management
│   └── store            # In-memory data store
└── types/               # TypeScript type definitions
```

## License

MIT
