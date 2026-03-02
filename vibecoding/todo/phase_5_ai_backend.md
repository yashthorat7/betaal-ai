# Phase 5 — AI Backend

**Goal:** All FastAPI endpoints working. Math engine, ML model, Gemini chat, seed data. Responses match `api_examples.md`.

**Time estimate:** 5–6 hours
**Prerequisite:** None (can start anytime, but best after frontends so you know what they need)

---

## Step 1: Project Setup

1. Create `ai-backend/` directory
2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate
   ```
3. Copy `requirements.txt` from `vibecoding/ai/tech_stack.md`
4. `pip install -r requirements.txt`
5. Create `main.py`:
   ```python
   from fastapi import FastAPI
   from fastapi.middleware.cors import CORSMiddleware
   app = FastAPI(title="Betaal AI Backend")
   app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
   
   @app.get("/")
   def root():
       return {"status": "Betaal AI Backend is running"}
   ```
6. `uvicorn main:app --reload`

**Checkpoint:** `localhost:8000` returns JSON, Swagger docs at `/docs`

---

## Step 2: Firebase Admin Setup

**Files:** `firebase/firebase_admin_init.py`, `firebase/firestore_client.py`

1. Initialize Firebase Admin SDK with service account key
2. Create Firestore read/write helpers
3. Test: can read/write a test document

**Checkpoint:** Firestore connection works

---

## Step 3: Seed Database Script

**File:** `scripts/seed_database.py`

1. Read JSON structures from `vibecoding/seed_data.md`
2. Write demo user, rehab plan, 14 days of usage data, devices to Firestore
3. Run once: `python scripts/seed_database.py`

**Checkpoint:** Firebase Console shows seeded collections

---

## Step 4: Auth Router

**Files:** `routers/auth.py`, `services/auth_service.py`

1. POST `/auth/verify` — accept Firebase ID token, verify with Admin SDK, return uid
2. Simple middleware that extracts token from Authorization header

**Checkpoint:** POST with valid token returns uid

---

## Step 5: User Router

**Files:** `routers/user.py`, `services/user_service.py`, `models/user_models.py`

1. GET `/user/profile?uid=X` — return user profile from Firestore
2. PUT `/user/profile` — update user fields

Responses must match `api_examples.md`.

**Checkpoint:** GET returns seeded user data

---

## Step 6: Rehab Engine

**Files:** `routers/rehab.py`, `services/rehab_service.py`, `engine/rehab_formula.py`, `engine/quota_calculator.py`

1. GET `/rehab/plan?uid=X` — return current plan
2. POST `/rehab/recalculate` — accept new addiction/strictness → recompute
3. Implement formula: `duration = clamp(addiction × 3 × (6 - strictness), 7, 90)`
4. Phase splitting: 20/30/30/20 of duration
5. Quota calculation per phase

**Checkpoint:** Changing strictness from 3→4 returns different plan

---

## Step 7: Interruption Scheduler

**Files:** `routers/interruption.py`, `services/interruption_service.py`, `engine/interruption_math.py`, `engine/cooldown_calculator.py`, `engine/curve_functions.py`

1. POST `/interruption/schedule` — accept session data → return interruption array
2. Implement sigmoid intensity curve
3. Implement weighted random selection from 20 types
4. Factor in: category, time_of_day, cumulative usage, phase
5. POST `/interruption/extra-time` — grant +10 min

**Checkpoint:** Returns different arrays for different usage levels

---

## Step 8: Usage Analytics

**Files:** `routers/usage.py`, `services/usage_service.py`

1. POST `/usage/log` — ingest usage events
2. GET `/usage/stats?uid=X` — return today's stats, streak, top apps
3. GET `/usage/heatmap?uid=X` — return hour×day matrix

**Checkpoint:** Stats endpoint returns correct aggregated data from seeded logs

---

## Step 9: ML Model

**Files:** `ml/train.py`, `ml/dummy_data_generator.py`, `ml/inference.py`, `routers/predict.py`

1. Generate synthetic training data (500 rows) with features from PRD
2. Train RandomForestRegressor, save as `saved_models/screen_time_model.pkl`
3. GET `/predict/today?uid=X` — load model, predict today's screen time
4. Run training script once: `python ml/train.py`

**Checkpoint:** Prediction endpoint returns plausible minutes + confidence

---

## Step 10: Chat AI (Gemini)

**Files:** `routers/chat.py`, `services/chat_service.py`

1. POST `/chat` — accept message + uid
2. Fetch user stats from usage_service
3. Build system prompt: "You are Betaal, a rehab assistant. User data: [stats]..."
4. Call Gemini API with system prompt + user message
5. Return AI response

**Checkpoint:** Live chat returns personalized response mentioning user's actual stats

---

## Step 11: Reports + Extension + Monitor

**Files:** remaining routers and services

1. GET `/report/daily`, `/report/weekly` — aggregate from usage data
2. POST `/extension/heartbeat` — accept browser time, return threshold
3. GET `/monitor/{child_id}/stats` — parent view of child data
4. PUT `/monitor/{child_id}/strictness` — parent adjusts child's plan

**Checkpoint:** All endpoints return responses matching `api_examples.md`

---

## Step 12: Update Docs

- Update `vibecoding/ai/progress.md`
- Create `ai-backend/CONTEXT.md`
- Verify all responses match `vibecoding/ai/api_examples.md`
