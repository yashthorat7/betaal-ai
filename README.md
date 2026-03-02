# Betaal AI — Monorepo

## What Is This

An AI-powered digital rehabilitation ecosystem that combats smartphone addiction through adaptive, gradual interruptions instead of hard app-blocking.

**Components:**

| Component | Directory | Tech | Status |
|-----------|-----------|------|--------|
| Mobile App | `mobile-app/` | Flutter + Kotlin | 🔨 Building |
| AI Backend | `ai-backend/` | Python FastAPI | 🔨 Building |
| Website | `web-dashboard/` | Next.js + Tailwind | 🔨 Building |
| Extension | `browser-extension/` | Chrome Manifest V3 | 🔨 Building |

## Quick Start

### AI Backend
```bash
cd ai-backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env      # fill in your keys
uvicorn main:app --reload
```

### Mobile App
```bash
cd mobile-app
flutter pub get
# Put google-services.json in android/app/
flutter run
```

### Website
```bash
cd web-dashboard
npm install
cp .env.local.example .env.local  # fill in your keys
npm run dev
```

### Browser Extension
```
1. Open chrome://extensions
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the browser-extension/ folder
```

## Documentation

All vibecoding docs live in `vibecoding/`. Start with `vibecoding/rules.md`.

## Team

| Name | Role |
|------|------|
| Yash | Lead, Ideation, AI/Backend, Integration |
| Divesh | Flutter Mobile App |
| Bhumika | Website, UI/UX |
| Diya | Browser Extension, Dummy Data |
