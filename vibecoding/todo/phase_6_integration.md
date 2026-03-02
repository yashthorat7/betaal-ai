# Phase 6 — Integration

**Goal:** Replace all dummy data with live API calls. All platforms talk to the real backend. End-to-end demo flow works.

**Time estimate:** 3–4 hours
**Prerequisite:** Phases 1–5 complete

---

## Step 1: Backend Deployment

1. Deploy FastAPI to Railway or Render
2. Set environment variables (Firebase credentials, Gemini API key)
3. Run seed script against production Firestore
4. Verify: all endpoints accessible from `https://your-app.railway.app/docs`

**Checkpoint:** Swagger docs accessible on deployed URL

---

## Step 2: Mobile App → Backend

1. Update `ApiService` base URL to deployed backend
2. Replace `DummyDataService` calls with `ApiService` calls:
   - Home screen ring → GET `/usage/stats`
   - Report charts → GET `/report/daily`, `/report/weekly`
   - Rehab progress → GET `/rehab/plan`
   - Chat → POST `/chat` (live Gemini responses)
   - Interruption scheduling → POST `/interruption/schedule`
3. Keep dummy data as fallback (if API fails, show dummy)

**Checkpoint:** Home screen shows real data from backend

---

## Step 3: Website → Backend

1. Update `lib/api.js` base URL to deployed backend
2. Replace `lib/dummy-data.js` calls with API calls:
   - Dashboard ring → GET `/usage/stats`
   - Weekly chart → GET `/report/weekly`
   - App breakdown → GET `/usage/stats` (top apps)
   - Rehab progress → GET `/rehab/plan`
   - Connected devices → GET `/monitor/{child_id}/stats`
   - Heat map → GET `/usage/heatmap`
3. Add Firebase Auth to dashboard page (redirect if not logged in)

**Checkpoint:** Dashboard shows live data from backend

---

## Step 4: Extension → Backend

1. In `background.js`: add sync function that POSTs to `/extension/heartbeat` every 5 min
2. On heartbeat response: update `dailyLimit` from backend's `time_left_min`
3. In `options.js`: user ID links to backend user
4. Handle offline: if fetch fails, continue with local data, retry next interval

**Checkpoint:** Extension usage appears in website dashboard

---

## Step 5: Cross-Platform Verification

Run the full demo script:

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open website landing page | Loads correctly |
| 2 | Sign in on website | Dashboard shows seeded data |
| 3 | Open mobile app | Sign in → home screen shows same user's data |
| 4 | Use phone for 2 min | Usage updates on next sync |
| 5 | Trigger interruption | Overlay appears on phone |
| 6 | Open AI chat on phone | Gemini responds with real stats |
| 7 | Browse with extension | Extension tracks time |
| 8 | Check website dashboard | Phone + extension usage combined |
| 9 | Change strictness on website | Rehab plan updates, phone reflects change |

**Checkpoint:** All 9 steps pass

---

## Step 6: Update Docs

- Update all `progress.md` files
- Update all `CONTEXT.md` files with integration notes
