# Browser Extension Tech Stack — Betaal AI

## Core

| Component | Technology | Why |
|-----------|-----------|-----|
| Type | Chrome Extension (Manifest V3) | Standard, modern extension format |
| Language | Vanilla JavaScript (ES6) | No build step, load directly as unpacked |
| Background Logic | Service Worker (`background.js`) | Timer, sync, messaging |
| Page Injection | Content Script (`content.js`) | Inject overlay & warning into pages |
| Timers | `chrome.alarms` API | Reliable 1-minute tracking intervals |
| Idle Detection | `chrome.idle` API | Pause tracking when user is AFK |
| Local Storage | `chrome.storage.local` | Cache daily limits, usage data |
| API Calls | `fetch()` | Sync with FastAPI backend |

## No Build Step

The extension is loaded directly as an **unpacked extension** in Chrome developer mode. No webpack, no bundler, no npm. Just plain HTML, CSS, and JS files.

## Deployment

| Component | Method | Notes |
|-----------|--------|-------|
| Hackathon Demo | Chrome developer mode → Load unpacked | Direct from repo |
| Distribution | Bundled `.zip` | For sideloading if needed |

---

## Environment Variables

No `.env` file needed. Config stored in `chrome.storage.local` via the options page:
- `API_BASE_URL` — backend URL
- `USER_ID` — linked Betaal AI user ID
- `DAILY_LIMIT_MIN` — daily browsing limit (default: 120)
