# Browser Extension PRD — Betaal AI

## 1. Overview

A minimal Chrome extension that tracks how long the user browses the web. When they exceed their daily limit, it blurs the entire webpage and shows a warning. It syncs usage data with the Betaal AI backend so stats appear on the website dashboard.

**Scope:** Smallest component in the ecosystem. ~3 hours of dev time.

---

## 2. Core Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | Time Tracking | Counts minutes of active browsing per day. Pauses when idle/AFK. |
| 2 | Warning Banner | Small top banner appears X minutes before limit is hit |
| 3 | Full-Page Blur Overlay | At limit: entire page blurs, centered card says "Time's Up!" with countdown |
| 4 | +10 Minutes Button | On the overlay, user can request extra time (max 2 times/day) |
| 5 | Popup Summary | Click extension icon → today's usage, top sites, remaining time |
| 6 | Backend Sync | Every 5 min, sends usage data to backend API. Receives updated limits. |
| 7 | Settings Page | User can set daily limit, manage whitelist, link Betaal AI account |

---

## 3. Layouts

> **No styling details.** Structure only.

### Popup (click extension icon)

| Section | Content |
|---------|---------|
| Header | Betaal AI branding |
| Usage display | Progress ring: time used / limit |
| Stats | Top 3 sites with time spent |
| Remaining | "X min left today" |
| Action | "Open Dashboard" link → website |

### Full-Page Overlay (limit hit)

| Element | Content |
|---------|---------|
| Backdrop | Full-page blur + dark semi-transparent layer |
| Card (centered) | "Time's Up!" heading, countdown timer, "+10 Minutes" button, motivational message |
| Z-index | Maximum (2147483647) — on top of everything |
| Dismissal | Only via "+10 Minutes" or cooldown expiry. Cannot be closed. |

### Warning Banner (near limit)

| Element | Content |
|---------|---------|
| Position | Fixed to top of page |
| Content | "⚠️ You have X minutes of browsing left today." + dismiss (×) button |
| Duration | Auto-hides after 10 seconds |

### Settings Page (Options)

| Setting | Type | Default |
|---------|------|---------|
| Daily limit (minutes) | Number input | 120 |
| Warning before limit | Dropdown | 10 min |
| Enable overlay | Toggle | On |
| Enable warning banner | Toggle | On |
| Whitelist | Editable list | mail.google.com, docs.google.com, github.com |
| Account link | Text input (User ID) | Empty |

---

## 4. How It Works

```
User opens browser
    │
    ▼
background.js starts a 1-minute alarm
    │
    ▼
Every minute:
    ├── Is user idle? → Skip
    ├── Is site whitelisted? → Track time but don't overlay
    └── Increment todayUsage
        │
        ├── Near limit → Send "SHOW_WARNING" to content.js
        ├── At/over limit → Send "SHOW_OVERLAY" to content.js
        └── Under limit → Do nothing
    │
    ▼
Every 5 minutes:
    └── Sync todayUsage with backend API
```

---

## 5. API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /extension/sync | Send daily usage + domain breakdown |
| GET | /extension/status/{userId} | Fetch current limit & rehab info |
| POST | /extension/extra-time | Request +10 min |

If backend is unreachable → extension works fully offline with local data and retries later.

---

## 6. Key Behaviors

| Scenario | What Happens |
|----------|-------------|
| User is idle / AFK | Timer pauses (via chrome.idle) |
| User on whitelisted site | Time counts, but overlay never shown |
| New day starts | todayUsage resets to 0, extra time grants reset |
| Multiple tabs open | Only 1 minute counted per minute (not per tab) |
| No internet | Works fully offline; syncs when connection returns |
| User removes overlay via DevTools | Acceptable — this isn't a security tool |

---

## 7. Demo Strategy

Set the limit to **2 minutes** so it triggers fast during hackathon demo:

1. Browse YouTube / Reddit for ~1 min → warning banner appears
2. Keep browsing → full blur overlay with countdown
3. Click "+10 Minutes" → overlay disappears
4. Click extension icon → popup shows stats
5. Open website dashboard → same data is synced there
