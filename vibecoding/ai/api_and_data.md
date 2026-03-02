# API Contracts & Seed Data — Betaal AI Backend

This file contains two things:
1. **API Contracts** — exact request → response shapes for every endpoint
2. **Seed Data** — pre-seeded dummy data JSON for the hackathon demo

---

# Part 1: API Contracts

## Auth

### POST /auth/verify

```json
// Request
{ "id_token": "eyJhbGciOi..." }

// Response 200
{ "uid": "demo_user_001", "email": "arjun.demo@gmail.com", "session_token": "sess_abc123" }
```

---

## User

### GET /user/profile?uid=demo_user_001

```json
// Response 200
{
  "uid": "demo_user_001",
  "name": "Arjun",
  "age": 19,
  "email": "arjun.demo@gmail.com",
  "addiction_level": 8,
  "strictness": 3,
  "stealth_icon": "default",
  "linked_parent_id": "demo_parent_001"
}
```

### PUT /user/profile

```json
// Request
{ "uid": "demo_user_001", "name": "Arjun", "age": 19, "addiction_level": 7, "strictness": 4 }

// Response 200
{ "status": "updated", "uid": "demo_user_001" }
```

---

## Rehab

### GET /rehab/plan?uid=demo_user_001

```json
// Response 200
{
  "uid": "demo_user_001",
  "duration_days": 24,
  "current_day": 8,
  "current_phase": 2,
  "phase_name": "Reduction",
  "daily_quota_min": 273,
  "intensity": 0.5,
  "phases": [
    { "phase": 1, "name": "Awareness",  "start_day": 1,  "end_day": 5,  "daily_quota_min": 378, "intensity": 0.2 },
    { "phase": 2, "name": "Reduction",  "start_day": 6,  "end_day": 12, "daily_quota_min": 273, "intensity": 0.5 },
    { "phase": 3, "name": "Discipline", "start_day": 13, "end_day": 19, "daily_quota_min": 168, "intensity": 0.8 },
    { "phase": 4, "name": "Freedom",    "start_day": 20, "end_day": 24, "daily_quota_min": 84,  "intensity": 0.5 }
  ]
}
```

### POST /rehab/recalculate

```json
// Request
{ "uid": "demo_user_001", "addiction_level": 7, "strictness": 4 }

// Response 200
{
  "uid": "demo_user_001",
  "new_duration_days": 14,
  "new_daily_quota_min": 250,
  "message": "Plan recalculated. New duration: 14 days."
}
```

---

## Interruption

### POST /interruption/schedule

```json
// Request
{
  "uid": "demo_user_001",
  "current_app": "Instagram",
  "category": "social",
  "session_start": "2025-01-14T10:00:00Z",
  "cumulative_today_min": 150,
  "last_interruption_time": "2025-01-14T09:45:00Z"
}

// Response 200
{
  "interruptions": [
    { "time_offset_min": 5,  "type": "blur_screen",       "intensity": 0.3, "duration_sec": 10 },
    { "time_offset_min": 12, "type": "motivational_quote", "intensity": 0.5, "duration_sec": 8  },
    { "time_offset_min": 20, "type": "black_screen",       "intensity": 0.8, "duration_sec": 15 },
    { "time_offset_min": 25, "type": "reverse_scroll",     "intensity": 0.7, "duration_sec": 30 }
  ],
  "cooldown_minutes": 10,
  "quota_remaining_min": 123
}
```

### POST /interruption/extra-time

```json
// Request
{ "uid": "demo_user_001", "source": "ad_watched" }

// Response 200
{ "granted_minutes": 10, "new_quota_remaining_min": 133, "grants_left_today": 1 }
```

---

## Usage

### POST /usage/log

```json
// Request
{
  "uid": "demo_user_001",
  "events": [
    { "app_name": "Instagram", "category": "social", "start": "2025-01-14T10:00:00Z", "end": "2025-01-14T10:25:00Z" },
    { "app_name": "YouTube",   "category": "entertainment", "start": "2025-01-14T10:25:00Z", "end": "2025-01-14T10:50:00Z" }
  ]
}

// Response 200
{ "status": "logged", "events_count": 2 }
```

### GET /usage/stats?uid=demo_user_001

```json
// Response 200
{
  "today": { "total_min": 185, "unlocks": 25, "top_app": "Instagram", "under_quota": true },
  "week_avg_min": 241,
  "streak_days": 3,
  "top_apps": [
    { "app_name": "Instagram", "minutes": 52 },
    { "app_name": "YouTube",   "minutes": 45 },
    { "app_name": "WhatsApp",  "minutes": 38 },
    { "app_name": "BGMI",      "minutes": 28 },
    { "app_name": "Chrome",    "minutes": 22 }
  ]
}
```

### GET /usage/heatmap?uid=demo_user_001

```json
// Response 200
{
  "matrix": [
    [5, 3, 8, 12, 15, 10, 6],
    [4, 2, 7, 14, 18, 12, 5],
    [3, 1, 6, 10, 12, 8, 4]
  ],
  "labels_x": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "labels_y": ["Morning", "Afternoon", "Evening"],
  "unit": "minutes"
}
```

---

## Predict

### GET /predict/today?uid=demo_user_001

```json
// Response 200
{
  "predicted_screen_time_min": 210,
  "confidence": 0.78,
  "factors": ["Thursday historically high", "Week 2 reduction phase"]
}
```

---

## Chat

### POST /chat

```json
// Request
{ "uid": "demo_user_001", "message": "How am I doing?", "session_id": "chat_session_001" }

// Response 200
{
  "response": "Great progress, Arjun! You're on Day 8 of your 24-day plan and your screen time dropped from 7 hours to about 3 hours. That's a 56% reduction! Keep focusing on reducing Instagram — it's still your #1 app. Try replacing 15 minutes of scrolling with a short walk today.",
  "session_id": "chat_session_001"
}
```

---

## Report

### GET /report/daily?uid=demo_user_001

```json
// Response 200
{
  "date": "2025-01-14",
  "total_min": 185,
  "limit_min": 273,
  "under_quota": true,
  "unlocks": 25,
  "top_app": "Instagram",
  "vs_yesterday": -15,
  "interruptions_triggered": 6
}
```

### GET /report/weekly?uid=demo_user_001

```json
// Response 200
{
  "week_start": "2025-01-08",
  "week_end": "2025-01-14",
  "daily_totals": [285, 260, 240, 255, 220, 200, 185],
  "avg_min": 235,
  "streak": 3,
  "phase": 2,
  "phase_name": "Reduction",
  "progress_pct": 33
}
```

---

## Extension

### POST /extension/heartbeat

```json
// Request
{
  "uid": "demo_user_001",
  "today_browser_min": 63,
  "domains": [
    { "domain": "youtube.com", "minutes": 28 },
    { "domain": "reddit.com",  "minutes": 18 }
  ]
}

// Response 200
{
  "should_blur": false,
  "time_left_min": 88,
  "message": "You have 1h 28m of browsing left today.",
  "daily_limit_min": 120
}
```

---

## Monitor (Parental)

### GET /monitor/demo_user_001/stats

```json
// Response 200
{
  "child_name": "Arjun",
  "today_min": 185,
  "quota_min": 273,
  "under_quota": true,
  "rehab_day": 8,
  "rehab_total_days": 24,
  "phase": "Reduction",
  "streak": 3,
  "weekly_trend": [285, 260, 240, 255, 220, 200, 185]
}
```

### PUT /monitor/demo_user_001/strictness

```json
// Request
{ "parent_uid": "demo_parent_001", "new_strictness": 4 }

// Response 200
{ "status": "updated", "new_strictness": 4, "new_duration_days": 14 }
```

---

# Part 2: Seed Data

Pre-seeded dummy data for the hackathon demo. All components pull from this.

## User Profile (Patient Zero)

```json
{
  "uid": "demo_user_001",
  "name": "Arjun",
  "age": 19,
  "email": "arjun.demo@gmail.com",
  "avatar_url": null,
  "addiction_level": 8,
  "strictness": 3,
  "created_at": "2025-01-01T00:00:00Z",
  "linked_parent_id": "demo_parent_001",
  "stealth_icon": "default",
  "stealth_name": "Betaal AI"
}
```

## Parent Profile

```json
{
  "uid": "demo_parent_001",
  "name": "Sunita",
  "age": 45,
  "email": "sunita.demo@gmail.com",
  "linked_children": ["demo_user_001"]
}
```

## Rehab Plan

```json
{
  "uid": "demo_user_001",
  "duration_days": 24,
  "start_date": "2025-01-01",
  "current_phase": 2,
  "current_day": 8,
  "phases": [
    { "phase": 1, "name": "Awareness",  "start_day": 1,  "end_day": 5,  "daily_quota_min": 378, "intensity": 0.2 },
    { "phase": 2, "name": "Reduction",  "start_day": 6,  "end_day": 12, "daily_quota_min": 273, "intensity": 0.5 },
    { "phase": 3, "name": "Discipline", "start_day": 13, "end_day": 19, "daily_quota_min": 168, "intensity": 0.8 },
    { "phase": 4, "name": "Freedom",    "start_day": 20, "end_day": 24, "daily_quota_min": 84,  "intensity": 0.5 }
  ],
  "last_recalculated": "2025-01-01T00:00:00Z"
}
```

## Usage Logs (14 days — improvement curve)

```json
[
  { "date": "2025-01-01", "total_min": 420, "unlocks": 78, "top_app": "Instagram", "under_quota": false },
  { "date": "2025-01-02", "total_min": 405, "unlocks": 72, "top_app": "YouTube",   "under_quota": false },
  { "date": "2025-01-03", "total_min": 390, "unlocks": 65, "top_app": "Instagram", "under_quota": false },
  { "date": "2025-01-04", "total_min": 410, "unlocks": 70, "top_app": "TikTok",    "under_quota": false },
  { "date": "2025-01-05", "total_min": 370, "unlocks": 60, "top_app": "YouTube",   "under_quota": true  },
  { "date": "2025-01-06", "total_min": 340, "unlocks": 55, "top_app": "Instagram", "under_quota": false },
  { "date": "2025-01-07", "total_min": 310, "unlocks": 48, "top_app": "YouTube",   "under_quota": false },
  { "date": "2025-01-08", "total_min": 285, "unlocks": 42, "top_app": "Instagram", "under_quota": false },
  { "date": "2025-01-09", "total_min": 260, "unlocks": 38, "top_app": "WhatsApp",  "under_quota": true  },
  { "date": "2025-01-10", "total_min": 240, "unlocks": 35, "top_app": "YouTube",   "under_quota": true  },
  { "date": "2025-01-11", "total_min": 255, "unlocks": 40, "top_app": "TikTok",    "under_quota": true  },
  { "date": "2025-01-12", "total_min": 220, "unlocks": 30, "top_app": "Instagram", "under_quota": true  },
  { "date": "2025-01-13", "total_min": 200, "unlocks": 28, "top_app": "YouTube",   "under_quota": false },
  { "date": "2025-01-14", "total_min": 185, "unlocks": 25, "top_app": "WhatsApp",  "under_quota": true  }
]
```

**Trend:** 420 → 185 min (56% reduction). Small relapses on day 4 and 11 for realism.

## App Breakdown (today)

```json
{
  "date": "2025-01-14",
  "apps": [
    { "app_name": "Instagram", "category": "social",       "minutes": 52 },
    { "app_name": "YouTube",   "category": "entertainment","minutes": 45 },
    { "app_name": "WhatsApp",  "category": "messaging",    "minutes": 38 },
    { "app_name": "BGMI",      "category": "gaming",       "minutes": 28 },
    { "app_name": "Chrome",    "category": "browser",      "minutes": 22 }
  ]
}
```

## Connected Devices

```json
[
  { "device_id": "phone_001",  "name": "Arjun's Phone",  "type": "phone",  "status": "active", "today_min": 185 },
  { "device_id": "laptop_001", "name": "Arjun's Laptop", "type": "laptop", "status": "active", "today_min": 63  },
  { "device_id": "phone_002",  "name": "Child's Phone",  "type": "phone",  "status": "active", "today_min": 225 }
]
```

## Heat Map (30 days)

```json
{
  "weeks": [
    [420, 405, 390, 410, 370, 340, 310],
    [285, 260, 240, 255, 220, 200, 185],
    [175, 160, 150, 165, 140, 130, 120],
    [115, 105, 100, 110,  95,  90,  85]
  ]
}
```
