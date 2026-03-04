# TODO — AI Backend (betaal_ai)

> **Owner:** Yash
> **Estimated Time:** 4–5 hours (Phase 5) + 2–3 hours (Integration)
> **Rule:** Demo-first. All endpoints must match `api_and_data.md` contracts. No styling. Mostly backend support for Web and Extension.
> **Demo Focus:** Prioritize UX, smooth animations, and polished frontend. Backend calculations can be simplified or mocked if needed for time constraints.

---

## Phase 5 — Backend Support Core

### Step 1: Project Setup
- [ ] Create virtual environment (`python -m venv venv`)
- [ ] Copy `requirements.txt` from `tech_stack.md` (remove heavy ML libs like scikit-learn/pandas if present)
- [ ] `pip install -r requirements.txt`
- [ ] Create `main.py` — FastAPI app with CORS middleware
- [ ] Create `config.py` — env vars, Firebase init, constants
- [ ] Create `.env.example` with placeholder keys
- [ ] Verify: `uvicorn main:app --reload` → `localhost:8000` works, Swagger at `/docs`

### Step 2: Firebase Admin Setup
- [ ] Create `firebase/firebase_admin_init.py` — initialize Admin SDK
- [ ] Create `firebase/firestore_client.py` — read/write helpers
- [ ] Add `service_account_key.json` (gitignored)
- [ ] Verify: can read/write a test document to Firestore

### Step 3: Seed Database Script
- [ ] Create `scripts/seed_database.py`
- [ ] Import JSON from `api_and_data.md` (user, rehab plan, 14 days usage, devices)
- [ ] Run once: `python scripts/seed_database.py`
- [ ] Verify: Firebase Console shows seeded collections

### Step 4: Auth & User Router
- [ ] Create `models/user_models.py` — UserProfile, UserCreate, UserUpdate (Pydantic)
- [ ] Create `routers/auth.py` — POST `/auth/verify` (Firebase token verification)
- [ ] Create `routers/user.py` — GET/PUT `/user/profile`
- [ ] Create `services/user_service.py` — Firestore CRUD
- [ ] Verify: GET returns seeded user data matching `api_and_data.md`

### Step 5: Rehab logic
- [ ] Create `services/rehab_service.py` — basic plan creation (duration, phases)
- [ ] Create `routers/rehab.py` — GET `/rehab/plan`, POST `/rehab/recalculate`
- [ ] Verify: changing strictness returns an updated plan

### Step 6: Usage Analytics & Reports
- [ ] Create `models/usage_models.py` — UsageEvent, UsageStats
- [ ] Create `services/usage_service.py` — simple aggregation, heat maps
- [ ] Create `routers/usage.py` — GET `/usage/stats`, GET `/usage/heatmap`
- [ ] Create `routers/report.py` — GET `/report/weekly` (for Web Dashboard charts)
- [ ] Ensure all user stats (app usage, screen time, rehab progress) are consistently stored and updated in Firebase
- [ ] Confirm stats are linked to the right user profiles and ensure proper data refresh in the extension and app
- [ ] Verify: stats endpoint returns correct aggregated data from seeded logs for the Next.js frontend

### Step 7: Chat AI (Gemini)
- [ ] Create `services/chat_service.py` — Gemini API integration (gemini-pro)
- [ ] Create `models/chat_models.py` — ChatMessage, ChatResponse
- [ ] Create `routers/chat.py` — POST `/chat`
- [ ] Identify and integrate APIs for Voice-Based AI (e.g., Google Cloud Speech-to-Text + Gemini for Text-to-Speech)
- [ ] Design a simple conversational flow for real-time voice interaction (can be mocked for demo readiness)
- [ ] Build system prompt: "You are Betaal, a rehab assistant. User data: [stats]..."
- [ ] Verify: live chat returns personalized response mentioning user's actual stats

### Step 8: Extension API & Monitor
- [ ] Create `routers/extension.py` — POST `/extension/heartbeat` (sync time from browser extension)
- [ ] Create `services/extension_service.py` — update top-level stats in Firestore
- [ ] Create `routers/monitor.py` — GET `/monitor/{child_id}/stats` (Parental monitoring)
- [ ] Add endpoints to link accounts (child/peer) and monitor their usage stats
- [ ] Create dashboard aggregation logic for parent and linked users' screen time and app usage
- [ ] Verify: all endpoints return responses matching `api_and_data.md` to support Web and Extension

### Step 9: YouTube Recommendation Logic
- [ ] Confirm/integrate YouTube Data API (or alternative) to fetch video recommendations based on user topics/keywords
- [ ] Create `services/youtube_service.py` and `routers/youtube.py` — GET `/youtube/recommend`
- [ ] Ensure API call returns a list of videos to be displayed within the website dashboard
- [ ] Verify: integration works or is mock-ready for the demo

### Step 10: Documentation
- [ ] Create `CONTEXT.md` in `betaal_ai/`
- [ ] Update `progress.md`
- [ ] Verify ALL responses match `api_and_data.md` contracts

---

## Phase 6 — Integration (Backend Tasks)

- [ ] Deploy FastAPI to Railway or Render
- [ ] Set environment variables on hosting platform (Firebase creds, Gemini API key)
- [ ] Run seed script against production Firestore
- [ ] Verify: all endpoints accessible from `https://your-app.railway.app/docs`
- [ ] Support CORS for all frontend origins (mobile, web, extension)

---

## Phase 7 — Final Polish

- [ ] Identify hardcoded parts for the demo (e.g., AI model training logic, YouTube logic, stats aggregation)
- [ ] Document modular design architecture for future scalability
- [ ] Final API response format polish
- [ ] Performance check (response times)
- [ ] Final update to `progress.md` and `CONTEXT.md`
