# TODO — Browser Extension (betaal_ex)

> **Owner:** Diya
> **Estimated Time:** 3 hours (Phase 4) + 1–2 hours (Integration) + 1 hour (Styling)
> **Rule:** Smallest component. Offline-first. Should work without backend. No build step needed.

---

## Phase 4 — Extension (Core + Layout)

### Step 1: File Setup
- [ ] Create all files matching `directory_structure.md`:
  - `manifest.json`, `background.js`, `content.js`, `content.css`
  - `popup/popup.html`, `popup.css`, `popup.js`
  - `options/options.html`, `options.css`, `options.js`
  - `icons/` — use placeholder colored squares for now
- [ ] Verify: extension loads in Chrome developer mode without errors

### Step 2: manifest.json
- [ ] Manifest V3 config with:
  - Permissions: `alarms`, `idle`, `storage`, `activeTab`, `tabs`
  - Background: service worker (`background.js`)
  - Content scripts: `content.js` + `content.css` on `<all_urls>`
  - Action: popup (`popup/popup.html`)
  - Options page: `options/options.html`
- [ ] Verify: extension appears in `chrome://extensions`

### Step 3: background.js — Timer + Tracking
- [ ] On install: initialize `chrome.storage.local` with `{ todayUsage: 0, dailyLimit: 120, lastReset: today, extraGrants: 0 }`
- [ ] Create 1-minute alarm (`chrome.alarms.create`)
- [ ] On alarm:
  - [ ] Check `chrome.idle.queryState(60)` — if idle, skip
  - [ ] Get active tab URL → extract domain
  - [ ] Check whitelist — if whitelisted, track but don't trigger overlay
  - [ ] Increment `todayUsage` by 1 minute
  - [ ] Track per-domain time breakdown
  - [ ] If near limit → send `SHOW_WARNING` to content script
  - [ ] If at/over limit → send `SHOW_OVERLAY` to content script
- [ ] On new day (midnight): reset `todayUsage` and `extraGrants` to 0
- [ ] Verify: `todayUsage` increments every minute in storage

### Step 4: content.js — Overlay + Warning
- [ ] Listen for messages from background.js
- [ ] On `SHOW_WARNING`:
  - [ ] Inject fixed-top banner: "⚠️ You have X minutes left today [×]"
  - [ ] Auto-hide after 10 seconds or on dismiss click
- [ ] On `SHOW_OVERLAY`:
  - [ ] Inject full-page overlay: backdrop blur + centered card
  - [ ] Card: "Time's Up!" heading, countdown, "+10 Minutes" button, motivational message
  - [ ] Z-index maximum (2147483647)
  - [ ] Cannot be closed except via +10 min button
- [ ] On `HIDE_OVERLAY`:
  - [ ] Remove overlay elements
- [ ] Verify: warning banner and blur overlay appear/disappear correctly

### Step 5: Popup (Extension Icon Click)
- [ ] `popup.html` — extension name header, usage display, stats, remaining time, "Open Dashboard" link
- [ ] `popup.js` — read `todayUsage`, `dailyLimit` from storage, calculate remaining, populate HTML
- [ ] Show top 3 domains with time
- [ ] Verify: popup shows correct usage data

### Step 6: Options Page (Settings)
- [ ] `options.html` — daily limit (number), warning minutes (number), overlay toggle, warning toggle, whitelist (textarea), user ID (text), save button
- [ ] `options.js` — load from `chrome.storage.local` on open, save on button click
- [ ] Defaults: limit=120, warning=10, overlay=on, banner=on, whitelist=mail.google.com,docs.google.com,github.com
- [ ] Verify: settings persist after closing and reopening

### Step 7: +10 Minute Extra Time
- [ ] Content.js: "+10 Minutes" button → send message to background.js
- [ ] Background.js: increment `dailyLimit` by 10, increment `extraGrants` (max 2/day)
- [ ] Send `HIDE_OVERLAY` to content.js
- [ ] If `extraGrants >= 2`: button shows "No more extra time today"
- [ ] Verify: overlay disappears, limit increases, max 2 grants

### Step 8: Demo Mode
- [ ] Set `dailyLimit` to 2 minutes in options
- [ ] Browse for ~1 min → warning banner appears
- [ ] Keep browsing → full overlay with blur
- [ ] Click +10 min → overlay vanishes
- [ ] Click popup → shows stats
- [ ] Verify: full demo flow works in under 3 minutes

### Step 9: Documentation
- [ ] Update `progress.md`
- [ ] Create `CONTEXT.md` in `betaal_ex/`

---

## Phase 6 — Integration (Extension Tasks)

- [ ] In `background.js`: add sync function that POSTs to `/extension/heartbeat` every 5 min
- [ ] On heartbeat response: update `dailyLimit` from backend's `time_left_min`
- [ ] In `options.js`: user ID links to backend user
- [ ] Handle offline: if fetch fails, continue with local data, retry next interval
- [ ] Verify: extension usage appears in website dashboard

---

## Phase 7 — Styling (Extension Tasks)

- [ ] Style popup (progress ring, clean layout)
- [ ] Style blur overlay (glassmorphism effect)
- [ ] Style warning banner
- [ ] Style options page
- [ ] Create real extension icons (16, 48, 128 px)
- [ ] Final update to `progress.md`
