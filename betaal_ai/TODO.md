# TODO — AI Backend (betaal_ai)

> **Owner:** Yash
> **Estimated Time:** 5–6 hours (Phase 5) + 3–4 hours (Integration) + 2 hours (Styling)
> **Rule:** Demo-first. All endpoints must match `api_and_data.md` contracts. No styling until Phase 7.

---

## Phase 5 — AI Backend Core

### Step 1: Project Setup
- [ ] Create virtual environment (`python -m venv venv`)
- [ ] Copy `requirements.txt` from `tech_stack.md`
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

### Step 4: Auth Router
- [ ] Create `routers/auth.py` — POST `/auth/verify`
- [ ] Create `services/auth_service.py` — Firebase token verification
- [ ] Create `middleware/auth_middleware.py` — token extraction from Authorization header
- [ ] Verify: POST with valid token → returns uid

### Step 5: User Router
- [ ] Create `models/user_models.py` — UserProfile, UserCreate, UserUpdate (Pydantic)
- [ ] Create `routers/user.py` — GET/PUT `/user/profile`
- [ ] Create `services/user_service.py` — Firestore CRUD
- [ ] Verify: GET returns seeded user data matching `api_and_data.md`

### Step 6: Rehab Engine
- [ ] Create `engine/rehab_formula.py` — `duration = clamp(addiction × 3 × (6 - strictness), 7, 90)`
- [ ] Create `engine/quota_calculator.py` — daily quota per phase (20/30/30/20 split)
- [ ] Create `services/rehab_service.py` — plan creation & recalculation
- [ ] Create `routers/rehab.py` — GET `/rehab/plan`, POST `/rehab/recalculate`
- [ ] Verify: changing strictness 3→4 returns a different plan

### Step 7: Interruption Scheduler
- [ ] Create `engine/curve_functions.py` — sigmoid, linear ramp, exponential decay
- [ ] Create `engine/interruption_math.py` — weighted random selection from 20 types
- [ ] Create `engine/cooldown_calculator.py` — cooldown period computation
- [ ] Create `services/interruption_service.py` — math engine orchestration
- [ ] Create `routers/interruption.py` — POST `/interruption/schedule`, POST `/interruption/extra-time`
- [ ] Create `data/interruption_types.json` — 20 interruption definitions
- [ ] Verify: returns different arrays for different usage levels

### Step 8: Usage Analytics
- [ ] Create `models/usage_models.py` — UsageEvent, UsageStats, HeatMapData
- [ ] Create `services/usage_service.py` — aggregation, heat maps, streaks
- [ ] Create `routers/usage.py` — POST `/usage/log`, GET `/usage/stats`, GET `/usage/heatmap`
- [ ] Verify: stats endpoint returns correct aggregated data from seeded logs

### Step 9: ML Model
- [ ] Create `ml/dummy_data_generator.py` — generate 500 rows synthetic training data
- [ ] Create `ml/feature_engineering.py` — feature extraction
- [ ] Create `ml/train.py` — train RandomForestRegressor, save to `ml/saved_models/screen_time_model.pkl`
- [ ] Create `ml/inference.py` — load model, predict
- [ ] Create `routers/predict.py` — GET `/predict/today`
- [ ] Run: `python ml/train.py`
- [ ] Verify: prediction endpoint returns plausible minutes + confidence

### Step 10: Chat AI (Gemini)
- [ ] Create `services/chat_service.py` — Gemini API integration, context building
- [ ] Create `models/chat_models.py` — ChatMessage, ChatResponse, ChatContext
- [ ] Create `routers/chat.py` — POST `/chat`
- [ ] Build system prompt: "You are Betaal, a rehab assistant. User data: [stats]..."
- [ ] Verify: live chat returns personalized response mentioning user's actual stats

### Step 11: Reports + Extension API + Monitor
- [ ] Create `routers/report.py` — GET `/report/daily`, GET `/report/weekly`
- [ ] Create `services/report_service.py` — report assembly
- [ ] Create `routers/extension.py` — POST `/extension/heartbeat`
- [ ] Create `services/extension_service.py` — browser time tracking + threshold logic
- [ ] Create `routers/monitor.py` — GET `/monitor/{child_id}/stats`, PUT `/monitor/{child_id}/strictness`
- [ ] Create `services/monitor_service.py` — parent-child linking & data fetch
- [ ] Verify: all endpoints return responses matching `api_and_data.md`

### Step 12: Documentation
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

## Phase 7 — Styling (Backend Tasks)

- [ ] No visual styling needed (API only)
- [ ] Final API response format polish
- [ ] Performance check (response times)
- [ ] Final update to `progress.md` and `CONTEXT.md`
