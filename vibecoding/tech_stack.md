# Tech Stack & Directory Structure — Betaal AI Monorepo

Global summary. Each component's `tech_stack.md` has the full breakdown.

---

## Stack at a Glance

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Mobile App  │     │   Website    │     │  Extension   │
│  (Flutter)   │     │  (Next.js)   │     │  (Vanilla JS)│
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       └────────────┬───────┴────────────────────┘
                    │
              ┌─────▼──────┐
              │  FastAPI    │
              │  Backend    │
              │  (Python)   │
              └─────┬───────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
  ┌─────▼──┐ ┌─────▼────┐ ┌───▼─────┐
  │Firebase│ │ ML Model │ │ Gemini  │
  │  Auth  │ │(sklearn) │ │  API    │
  │+ Fstore│ └──────────┘ └─────────┘
  └────────┘
```

---

## Per-Component Summary

| Component | Framework | Language | Key Dependencies |
|-----------|-----------|----------|-----------------|
| **Mobile App** | Flutter 3.x | Dart + Kotlin | firebase_auth, cloud_firestore, dio, flutter_overlay_window, usage_stats, fl_chart |
| **AI Backend** | FastAPI | Python 3.11+ | uvicorn, firebase-admin, scikit-learn, numpy, pandas, google-generativeai, pydantic |
| **Website** | Next.js 14 (App Router) | TypeScript + React | tailwindcss, recharts, firebase, zustand, next-auth |
| **Extension** | Chrome Manifest V3 | Vanilla JavaScript | chrome.alarms, chrome.idle, chrome.storage, fetch API |

---

## Shared Infrastructure

| Service | Technology | Purpose |
|---------|-----------|---------|
| Authentication | Firebase Auth | Google Sign-In across all platforms |
| Database | Cloud Firestore | User profiles, usage logs, rehab plans, chat history |
| AI Chat | Google Gemini API | Personalized AI assistant |
| ML Model | scikit-learn | Usage prediction (pre-trained on synthetic data) |

---

## Deployment (Hackathon)

| Component | Host | Notes |
|-----------|------|-------|
| Mobile App | Sideloaded APK | Direct install on demo phone |
| AI Backend | Railway / Render | Free tier, single instance |
| Website | Vercel | Zero-config Next.js deploy |
| Extension | Chrome developer mode | Unpacked extension |
| Firebase | Google Cloud (free tier) | Auth + Firestore |

---

## Monorepo Directory Structure

```
betaal-ai/
│
├── mobile-app/                  # Flutter Android application
│   ├── android/                 # Native Kotlin code (overlays, usage stats)
│   ├── lib/                     # Dart source code
│   └── pubspec.yaml             # Flutter dependencies
│
├── ai-backend/                  # Python FastAPI server
│   ├── routers/                 # API route handlers
│   ├── services/                # Business logic
│   ├── engine/                  # Math engine (interruptions, rehab formulas)
│   ├── ml/                      # Machine learning (train, predict)
│   ├── main.py                  # Entry point
│   └── requirements.txt         # Python dependencies
│
├── web-dashboard/               # Next.js website
│   ├── app/                     # Next.js App Router pages
│   ├── components/              # React components
│   ├── lib/                     # Firebase init, utilities
│   └── package.json             # Node dependencies
│
├── browser-extension/           # Chrome extension (Manifest V3)
│   ├── popup/                   # Extension popup UI
│   ├── background.js            # Service worker
│   ├── content.js               # Page injection script
│   └── manifest.json            # Extension config
│
├── vibecoding/                  # Documentation directory
│   ├── rules.md                 # Vibecoding rules
│   ├── prd.md                   # Ecosystem PRD (includes idea)
│   ├── tech_stack.md            # This file (stack + directory)
│   ├── ai/                      # Backend-specific docs
│   ├── mobile/                  # Mobile-specific docs
│   ├── website/                 # Website-specific docs
│   ├── extension/               # Extension-specific docs
│   └── todo/                    # Phase-by-phase development plan
│
├── .gitignore
└── README.md
```

Each component directory within `vibecoding/` contains:
- `prd.md` — What to build
- `tech_stack.md` — What tools to use
- `directory_structure.md` — Where files go
- `progress.md` — What's been done
