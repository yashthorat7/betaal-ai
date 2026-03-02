# Betaal AI — Monorepo

## What Is This

An AI-powered digital rehabilitation ecosystem that combats smartphone addiction through adaptive, gradual interruptions instead of hard app-blocking.

**Components:**

| Component | Directory | Tech | Status |
|-----------|-----------|------|--------|
| AI Backend | `betaal_ai/` | Python FastAPI | ⏳ Not started |
| Mobile App | `betaal_app/` | Flutter + Kotlin | ⏳ Not started |
| Website | `betaal_web/` | Next.js + Tailwind | ⏳ Not started |
| Extension | `betaal_ex/` | Chrome Manifest V3 | ⏳ Not started |

## Quick Start

### AI Backend
```bash
cd betaal_ai
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env      # fill in your keys
uvicorn main:app --reload
```

### Mobile App
```bash
cd betaal_app
flutter pub get
# Put google-services.json in android/app/
flutter run
```

### Website
```bash
cd betaal_web
npm install
cp .env.local.example .env.local  # fill in your keys
npm run dev
```

### Browser Extension
```
1. Open chrome://extensions
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the betaal_ex/ folder
```

## Documentation

All vibecoding docs live in `vibecoding/`. Start with `vibecoding/rules.md`.

Each component folder also has copies of its relevant vibecoding docs (`prd.md`, `tech_stack.md`, `directory_structure.md`, `progress.md`).

## Team

| Name | Role |
|------|------|
| Yash | Lead, Ideation, AI/Backend, Integration |
| Divesh | Flutter Mobile App |
| Bhumika | Website, UI/UX |
| Diya | Browser Extension, Dummy Data |
