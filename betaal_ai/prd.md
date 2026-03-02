# AI Backend PRD — Betaal AI

## 1. Overview

The AI backend is the **brain** of the Betaal AI ecosystem. It serves the mobile app, website, and browser extension through a REST API. It handles:

- User authentication verification
- Personalized rehabilitation plan generation
- Math-driven interruption scheduling
- Usage analytics and aggregation
- Predictive ML model (screen time forecasting)
- AI chat assistant (Gemini-powered)
- Report generation
- Extension usage syncing
- Parental monitoring

---

## 2. Consumers

| Consumer | Protocol | Priority |
|----------|----------|----------|
| Flutter Mobile App | REST API | P0 |
| Next.js Website | REST API | P1 |
| Chrome Extension | REST API | P2 |

---

## 3. Modules

### M1 — Auth & User Management

| ID | Requirement |
|----|-------------|
| M1.1 | Accept Firebase ID token, verify, return session |
| M1.2 | Create user profile on first login |
| M1.3 | Store name, age, addiction_level (1-10), strictness (1-5) |
| M1.4 | Support linked/child accounts for parental monitoring |
| M1.5 | Return user profile on GET request |

### M2 — Rehabilitation Engine

| ID | Requirement |
|----|-------------|
| M2.1 | Accept addiction_level + strictness → output rehab plan |
| M2.2 | Plan includes: duration_days, daily_quota_minutes, phase_schedule |
| M2.3 | Phases: Awareness → Reduction → Discipline → Freedom |
| M2.4 | Each phase has its own interruption intensity curve |
| M2.5 | Re-calculate plan when user performance data changes |
| M2.6 | Expose GET /rehab/plan and POST /rehab/recalculate |

**Rehab Plan Generation Flow:**

```
POST /rehab/plan { user_id, addiction_level, strictness }
    │
    ▼
1. duration_days = clamp(addiction_level × 3 × (6 - strictness), 7, 90)
2. Split into 4 phases: Awareness(20%) → Reduction(30%) → Discipline(30%) → Freedom(20%)
3. Assign quotas: P1: avg×0.9, P2: avg×0.65, P3: avg×0.4, P4: avg×0.2
4. Assign intensity: P1: 0.2, P2: 0.5, P3: 0.8, P4: 0.5
5. Save to Firestore → return plan JSON
```

### M3 — Interruption Scheduler

| ID | Requirement |
|----|-------------|
| M3.1 | Accept current session data → return interruption array |
| M3.2 | Array format: [{time_offset, type, intensity, duration}] |
| M3.3 | 20 interruption types supported |
| M3.4 | Selection uses weighted randomness (math-driven) |
| M3.5 | Intensity curve: gentle → moderate → aggressive (sigmoid) |
| M3.6 | Factor in: app_category, time_of_day, cumulative_usage, phase |
| M3.7 | Cooldown: if phone locked, pause timer; resume after cooldown_minutes |
| M3.8 | Cooldown duration: 5–15 min (from intensity at pause) |
| M3.9 | 2-minute grace window on unlock before any interruption fires |
| M3.10 | Extra time endpoint: user watches ad → grants +10 min quota |

**Interruption Types:**

| # | Type | # | Type |
|---|------|---|------|
| 1 | blur_screen | 11 | grayscale_filter |
| 2 | black_screen | 12 | slow_touch_response |
| 3 | reverse_scroll | 13 | random_vibration |
| 4 | touch_offset | 14 | screen_shake |
| 5 | flicker | 15 | countdown_overlay |
| 6 | color_invert | 16 | motivational_quote |
| 7 | shrink_screen | 17 | breathing_exercise |
| 8 | rotate_display | 18 | lock_for_n_seconds |
| 9 | ghost_touch | 19 | audio_alert |
| 10 | progressive_dim | 20 | full_block |

### M4 — Usage Analytics

| ID | Requirement |
|----|-------------|
| M4.1 | Ingest usage events: {app_name, category, start, end, date} |
| M4.2 | Aggregate daily totals per app category |
| M4.3 | Compute 7-day rolling average |
| M4.4 | Generate heat map data (hour × day_of_week matrix) |
| M4.5 | Return top-5 most used apps |
| M4.6 | Calculate streak (consecutive days under quota) |
| M4.7 | Serve data to mobile app, website dashboard, extension |

### M5 — Predictive Model (ML)

| ID | Requirement |
|----|-------------|
| M5.1 | Train a simple regression model on dummy user data |
| M5.2 | Features: day_of_week, hour, past_3_day_avg, addiction_level |
| M5.3 | Target: predicted_screen_time_minutes |
| M5.4 | Model: scikit-learn LinearRegression or RandomForest |
| M5.5 | Retrain on new user data every N sessions (or on demand) |
| M5.6 | Expose GET /predict/today → returns predicted minutes |
| M5.7 | Used by rehab engine to adjust plan proactively |

### M6 — Chat AI Assistant

| ID | Requirement |
|----|-------------|
| M6.1 | Accept user message + usage context → return AI response |
| M6.2 | Prepend system prompt with user stats summary |
| M6.3 | Use Google Gemini API (gemini-pro) |
| M6.4 | Maintain conversation history per session |
| M6.5 | AI gives feedback, tips, motivation based on real data |
| M6.6 | Expose POST /chat with {message, session_id} |

### M7 — Report Generator

| ID | Requirement |
|----|-------------|
| M7.1 | Daily summary: total time, top apps, quota status |
| M7.2 | Weekly summary: trend graph data, streak, phase progress |
| M7.3 | Rehab progress report: % complete, projected end date |
| M7.4 | Exportable as JSON (frontend renders it) |
| M7.5 | Expose GET /report/daily, GET /report/weekly |

### M8 — Extension API

| ID | Requirement |
|----|-------------|
| M8.1 | Accept browser session time from extension |
| M8.2 | Add to user's total screen time pool |
| M8.3 | Return threshold status: {should_blur, message, time_left} |
| M8.4 | Expose POST /extension/heartbeat |

### M9 — Parental Monitoring

| ID | Requirement |
|----|-------------|
| M9.1 | Link parent account to child account via code |
| M9.2 | Parent can GET child's usage stats and rehab progress |
| M9.3 | Parent can adjust strictness remotely |
| M9.4 | Expose GET /monitor/{child_id}/stats |

---

## 4. API Endpoint Summary

| Method | Endpoint | Module |
|--------|----------|--------|
| POST | /auth/verify | auth |
| GET | /user/profile | user |
| PUT | /user/profile | user |
| GET | /rehab/plan | rehab |
| POST | /rehab/recalculate | rehab |
| POST | /interruption/schedule | interruption |
| POST | /interruption/extra-time | interruption |
| POST | /usage/log | usage |
| GET | /usage/stats | usage |
| GET | /usage/heatmap | usage |
| GET | /predict/today | predict |
| POST | /chat | chat |
| GET | /report/daily | report |
| GET | /report/weekly | report |
| POST | /extension/heartbeat | extension |
| GET | /monitor/{child_id}/stats | monitor |
| PUT | /monitor/{child_id}/strictness | monitor |

---

## 5. Firestore Collections

```
users/{uid}/
    ├── name, age, addiction_level, strictness, created_at
    ├── linked_parent_id, stealth_icon
    
rehab_plans/{uid}/
    ├── duration_days, start_date, current_phase
    ├── phases: [{ phase, start_day, end_day, daily_quota_min, intensity }]
    └── last_recalculated

usage_logs/{uid}/{date}/
    └── events: [{ app_name, category, start, end, duration_min }]

chat_logs/{uid}/{session_id}/
    └── messages: [{ role, content, timestamp }]

extension_sessions/{uid}/{date}/
    ├── total_browser_min
    └── last_heartbeat
```

---

## 6. Demo Strategy

- Pre-seed Firestore with 14 days of dummy data for "Patient Zero"
- ML model pre-trained on synthetic dataset (loaded on server startup)
- Chat AI works live via Gemini API
- Interruption demo: simulate a 5-minute session, show escalating interruptions
- Dashboard shows pre-populated heat maps and trends
- Rehab plan visibly adjusts when strictness is changed live
