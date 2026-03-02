# Website Tech Stack — Betaal AI

## Core

| Component | Technology | Why |
|-----------|-----------|-----|
| Framework | Next.js 14 (App Router) | SSR, file-based routing, optimized for Vercel |
| Language | JavaScript + React | Component-based UI, rapid development |
| Styling | Tailwind CSS | Utility-first, rapid iteration, zero unused CSS |
| State Management | Zustand | Lightweight, zero-boilerplate |
| Animations | Framer Motion | Subtle scroll reveals, hover effects |

## Data & Auth

| Component | Technology | Why |
|-----------|-----------|-----|
| Auth | NextAuth.js (Google provider) or Firebase JS SDK | Google Sign-In |
| Database | Firebase Firestore (client SDK) | Real-time data for dashboard |
| API Calls | Axios or native `fetch` | REST calls to FastAPI backend |

## Visualization

| Component | Technology | Why |
|-----------|-----------|-----|
| Charts | Recharts or Chart.js | Line charts, bar charts, pie charts |
| Heat Map | react-calendar-heatmap or custom SVG | GitHub-style usage grid |
| Icons | Lucide or Heroicons | Clean, consistent icon set |

## Deployment

| Component | Technology | Why |
|-----------|-----------|-----|
| Hosting | Vercel | Zero-config Next.js deployment |
| Domain | Vercel subdomain (free) | Quick setup for hackathon |

## Key Dependencies (package.json)

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^3.4.0",
    "zustand": "^4.4.0",
    "framer-motion": "^10.0.0",
    "recharts": "^2.8.0",
    "firebase": "^10.7.0",
    "next-auth": "^4.24.0",
    "axios": "^1.6.0",
    "lucide-react": "^0.294.0"
  }
}
```

---

## Environment Variables (.env.local)

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXTAUTH_SECRET=your_nextauth_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```
