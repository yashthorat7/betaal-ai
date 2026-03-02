# Mobile App PRD — Betaal AI

## 1. Overview

**Platform:** Android only
**Framework:** Flutter (Dart) + Kotlin (native bridge)
**Purpose:** The primary user-facing product. Runs persistently in background, monitors real-time app usage, and delivers AI-driven, math-computed, gradual interruptions to combat screen addiction.

**Hackathon Constraint:** Must be demonstrable with dummy data. Judges evaluate the idea, not the code.

---

## 2. User Flow

### Phase 1 — Launch & Authentication

**Splash Screen →** Animated logo, auto-navigates after 2–3 seconds. If authenticated → Home. If not → Sign-In.

**Sign-In Screen →** Single "Sign in with Google" button. Uses `firebase_auth` + `google_sign_in`. On success → Onboarding.

### Phase 2 — Onboarding (4-step walkthrough)

| Step | Title | Elements |
|------|-------|----------|
| 1 | "Let's start with you" | Avatar picker, name input, age stepper (← 21 →) |
| 2 | "What smartphone has done to you" | Addiction level selector (1–10), emoji indicator |
| 3 | "How dedicated are you?" | Strictness selector (1–10), computed rehab days |
| 4 | "Setup permissions" | Usage access, overlay, battery exemption, notifications — each with checkbox |

Navigation: Arrow buttons (< >) at bottom. Step 4 completion → Home Screen.

### Phase 3 — Main App (Bottom Navigation, 4 Tabs)

| Tab | Label | Screen |
|-----|-------|--------|
| 1 | Home | Home Screen |
| 2 | Report | Analytics Dashboard |
| 3 | AI | AI Chat Assistant |
| 4 | Settings | Settings (Personalization) |

---

## 3. Screen Layouts

> **No styling details.** Only layout structure. Styling applied at the end.

### 3.1 Home Screen (Top → Bottom)

| Section | Content |
|---------|---------|
| Top bar | User display name (left), profile avatar (right) |
| 7-day summary | Horizontal row of 7 day-indicators (green=under, red=over limit) |
| Monitoring ring | Large circular progress ring — remaining time, daily limit, urgency indicator |

### 3.2 Report Screen

| Section | Content |
|---------|---------|
| Today's summary card | Total time, unlocks, most-used app, vs yesterday |
| Weekly chart | Bar/line graph (Mon–Sun), red highlights for over-limit days |
| Achievements (Badges) | Grid of earned badges (e.g., "7-Day Streak", "Focus Master", "Alpha Rehabber") |
| Rehab progress | Linear progress bar (Day X of Y), milestone markers |
| App breakdown | Horizontal bar chart — top 5 apps with time |
| Monthly trend | Line graph — 30-day avg daily screen time |
| Interruption log | Count today/week, types triggered |

### 3.3 AI Chat Screen

| Section | Content |
|---------|---------|
| Header | "Betaal AI Chat" title |
| Chat area | Scrollable message list with bubbles (user right, AI left) |
| Input | Text field + send button at bottom |
| Backend | POST /chat → FastAPI → Gemini API with user stats as context |

### 3.4 Settings (Personalization) Screen

| Section | Content |
|---------|---------|
| Profile Monitoring | View friends' profiles, real-time screen time comparison, shared streaks |
| Stealth Mode | Icon picker (calculator, notes, weather), name input, toggle |
| Rehab Parameters | Addiction level stepper, strictness stepper, computed days |
| Interruption Preferences | Cooldown duration selector, preview interruption types |
| Profile | Edit name, age, photo; linked Google email |
| Language | Language selector (follows system locale by default) |
| Notifications | Toggles: daily summary, milestone alerts, rehab reminders |
| Data & Privacy | Export data, delete account, privacy policy |
| About | App version, licenses, contact |
| Sign Out | Button |

---

## 4. Background Service & Overlay Engine

This runs independently of the UI — the core of the rehab system.

| Component | Behavior |
|-----------|----------|
| Usage Tracker | Monitors foreground app via `UsageStatsManager` (Kotlin native bridge) |
| Sync Service | Periodically pushes usage data to FastAPI backend + Firestore |
| Interruption Executor | Receives interval arrays from backend; triggers overlay at each offset |
| Safety Cooldown | On every phone unlock → 10–15 min grace period, zero interruptions |

### Interruption Types (executed as overlays)

| Type | Effect |
|------|--------|
| Screen Blur | Gaussian blur overlay on entire screen |
| Black Screen | Full opaque black overlay + motivational message |
| Reverse Scroll | Inverts scroll direction system-wide |
| Touch Offset | Shifts touch input coordinates |
| Flicker | Rapid brightness/opacity oscillation |

### Cooldown Logic

```
User sees interruptions → locks phone
→ Cooldown timer starts (10–15 min, configurable)
→ If unlocked during cooldown: NO interruptions (grace period)
→ Cooldown expires: resume from saved position in array
```

### Interruption Array (from backend)

```json
[
  { "time_offset_min": 5,  "type": "blur",          "intensity": 0.3 },
  { "time_offset_min": 12, "type": "black_screen",   "intensity": 1.0 },
  { "time_offset_min": 20, "type": "reverse_scroll",  "intensity": 0.7 }
]
```

App sets local timers for each item; arrays regenerated daily based on performance.

---

## 5. Stealth Mode Architecture

```
AndroidManifest.xml activity-aliases:
  ├── "default"     → icon: ic_launcher_default, label: "Betaal AI"     (enabled)
  ├── "calculator"  → icon: ic_launcher_calculator, label: "Calculator Pro" (disabled)
  ├── "notes"       → icon: ic_launcher_notes, label: "Quick Notes"     (disabled)
  └── "weather"     → icon: ic_launcher_weather, label: "Weather App"   (disabled)

User selects "Calculator" → StealthService (Dart) → MethodChannel → Kotlin
→ PackageManager.setComponentEnabledSetting()
→ Launcher refreshes → App appears as "Calculator Pro"
```

---

## 6. Permissions Required

| Permission | Why |
|-----------|-----|
| `PACKAGE_USAGE_STATS` | Read app usage data |
| `SYSTEM_ALERT_WINDOW` | Draw overlay interruptions |
| `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` | Keep background service alive |
| `BIND_NOTIFICATION_LISTENER_SERVICE` | Manage rehab notifications |
| `INTERNET` | Sync with backend |
| `RECEIVE_BOOT_COMPLETED` | Restart service after reboot |

---

## 7. Demo Strategy

- Pre-populate Firestore with 14 days of synthetic usage data
- Charts, rings, and trends render dummy data
- AI chat responds to synthetic context live via Gemini
- Interruptions demo-triggered via hidden dev button (set low threshold)
- Weekly heat map shows realistic improvement curve
