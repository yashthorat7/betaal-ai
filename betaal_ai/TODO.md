# TODO — AI Backend (betaal_ai)

> **Owner:** Yash
> **Estimated Time:** 4–5 hours (Phase 5) + 2–3 hours (Integration)
> **Rule:** Demo-first hackathon project. No over-engineered rate limiting or strict industry-level restrictions. All endpoints must match `api_and_data.md` contracts.
> **Demo Focus:** Prioritize a working core. If the core logic or DB connection fails, endpoints should gracefully catch errors and return the default fallback data (`api_and_data.md`) as a **Plan B** to ensure the frontend never crashes.

---

## Phase 5 — Backend Support Core

### Step 1: Project Setup
- [x] Create virtual environment (`python -m venv venv`)
- [x] Copy `requirements.txt` from `tech_stack.md` (remove heavy ML libs like scikit-learn/pandas if present)
- [x] `pip install -r requirements.txt`
- [x] Create `main.py` — FastAPI app with CORS middleware
- [x] Create `config.py` — env vars, Firebase init, constants
- [x] Create `.env.example` with placeholder keys
- [x] Verify: `uvicorn main:app --reload` → `localhost:8000` works, Swagger at `/docs`

### Step 2: Firebase Admin Setup
- [x] Create `firebase/firebase_admin_init.py` — initialize Admin SDK
- [x] Create `firebase/firestore_client.py` — read/write helpers
- [x] Add `service_account_key.json` (gitignored)
- [x] Verify: can read/write a test document to Firestore

### Step 3: Seed Database Script
- [x] Create `scripts/seed_database.py`
- [x] Import JSON from `api_and_data.md` (user, rehab plan, 14 days usage, devices)
- [x] Run once: `python scripts/seed_database.py`
- [x] Verify: Firebase Console shows seeded collections

### Step 4: Auth & User Router
- [x] Create `models/user_models.py` — UserProfile, UserCreate, UserUpdate (Pydantic)
- [x] Create `routers/auth.py` — POST `/auth/verify` (Firebase token verification)
- [x] Create `routers/user.py` — GET/PUT `/user/profile`
- [x] Create `services/user_service.py` — Firestore CRUD
- [x] Verify: GET returns seeded user data matching `api_and_data.md`

### Step 5: Rehab logic
- [x] Create `services/rehab_service.py` — basic plan creation (duration, phases)
- [x] Create `routers/rehab.py` — GET `/rehab/plan`, POST `/rehab/recalculate`
- [x] Verify: changing strictness returns an updated plan

### Step 6: Usage Analytics & Reports
- [x] Create `models/usage_models.py` — UsageEvent, UsageStats
- [x] Create `services/usage_service.py` — simple aggregation, heat maps
- [x] Create `routers/usage.py` — GET `/usage/stats`, GET `/usage/heatmap`
- [x] Create `routers/report.py` — GET `/report/weekly` (for Web Dashboard charts)
- [x] Ensure all user stats (app usage, screen time, rehab progress) are consistently stored and updated in Firebase
- [x] Confirm stats are linked to the right user profiles and ensure proper data refresh in the extension and app
- [x] Verify: stats endpoint returns correct aggregated data from seeded logs for the Next.js frontend

### Step 7: Chat AI (Gemini)
- [x] Create `services/chat_service.py` — Gemini API integration (gemini-pro)
- [x] Create `models/chat_models.py` — ChatMessage, ChatResponse
- [x] Create `routers/chat.py` — POST `/chat`
- [x] Identify and integrate APIs for Voice-Based AI (e.g., Google Cloud Speech-to-Text + Gemini for Text-to-Speech)
- [x] Design a simple conversational flow for real-time voice interaction (can be mocked for demo readiness)
- [x] Build system prompt: "You are Betaal, a rehab assistant. User data: [stats]..."
- [x] Verify: live chat returns personalized response mentioning user's actual stats

### Step 8: Extension API & Monitor
- [x] Create `routers/extension.py` — POST `/extension/heartbeat` (sync time from browser extension)
- [x] Create `services/extension_service.py` — update top-level stats in Firestore
- [x] Create `routers/monitor.py` — GET `/monitor/{child_id}/stats` (Parental monitoring)
- [x] Add endpoints to link accounts (child/peer) and monitor their usage stats
- [x] Create dashboard aggregation logic for parent and linked users' screen time and app usage
- [x] Verify: all endpoints return responses matching `api_and_data.md` to support Web and Extension

### Step 9: YouTube Recommendation Logic
- [x] Integrate YouTube Data API with Gemini-generated search queries to fetch video recommendations based on user prompts
- [x] Create `services/youtube_service.py` and `routers/youtube.py` — POST `/youtube/recommend`
- [x] Ensure API call returns a list of videos to be displayed within the website dashboard
- [x] Verify: integration works or is mock-ready for the demo (Plan B Fallback enabled if API key is missing)

### Step 10: Documentation
- [x] Create `CONTEXT.md` in `betaal_ai/`
- [x] Update `progress.md`
- [x] Verify ALL responses match `api_and_data.md` contracts

---

## Phase 6 — Integration (Backend Tasks)

- [ ] Deploy FastAPI to Railway or Render
- [ ] Set environment variables on hosting platform (Firebase creds, Gemini API key)
- [ ] Run seed script against production Firestore
- [ ] Verify: all endpoints accessible from `https://your-app.railway.app/docs`
- [x] Support CORS for all frontend origins (mobile, web, extension) (Set to `*` in `.env.example`/`config.py` for hackathon)

---

## Phase 7 — Final Polish

- [x] Identify hardcoded parts for the demo (YouTube logic, mocked responses handled as fallback plan B)
- [x] Document modular design architecture for future scalability (Included in `CONTEXT.md` and `tutorial.md`)
- [x] Final API response format polish
- [x] Performance check (response times generally sub-100ms via pure FastAPI)
- [x] Final update to `progress.md` and `CONTEXT.md`
