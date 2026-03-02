# Phase 4 — Browser Extension (Core + Layout)

**Goal:** Fully working Chrome extension. Timer tracks browsing, overlay triggers at limit, popup shows stats. Minimal UI.

**Time estimate:** 3 hours
**Prerequisite:** None (can run parallel)

---

## Step 1: File Setup

Create all files in `browser-extension/` matching `vibecoding/extension/directory_structure.md`:
- `manifest.json`, `background.js`, `content.js`, `content.css`
- `popup/popup.html`, `popup.css`, `popup.js`
- `options/options.html`, `options.css`, `options.js`
- `icons/` — use placeholder colored squares for now

**Checkpoint:** Extension loads in Chrome developer mode without errors

---

## Step 2: manifest.json

```json
{
  "manifest_version": 3,
  "name": "Betaal AI",
  "version": "1.0.0",
  "description": "Digital rehabilitation — track and limit browser time",
  "permissions": ["alarms", "idle", "storage", "activeTab", "tabs"],
  "background": { "service_worker": "background.js" },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"],
    "css": ["content.css"]
  }],
  "action": { "default_popup": "popup/popup.html", "default_icon": "icons/icon-48.png" },
  "options_page": "options/options.html",
  "icons": { "16": "icons/icon-16.png", "48": "icons/icon-48.png", "128": "icons/icon-128.png" }
}
```

**Checkpoint:** Extension appears in chrome://extensions

---

## Step 3: background.js — Timer + Tracking

1. On install: initialize `chrome.storage.local` with `{ todayUsage: 0, dailyLimit: 120, lastReset: today, extraGrants: 0 }`
2. Create 1-minute alarm (`chrome.alarms.create`)
3. On alarm:
   - Check `chrome.idle.queryState(60)` — if idle, skip
   - Get active tab URL — extract domain
   - Check whitelist — if whitelisted, track but don't trigger overlay
   - Increment `todayUsage` by 1 minute
   - If `todayUsage >= dailyLimit - warningBefore`: send `SHOW_WARNING` to content script
   - If `todayUsage >= dailyLimit`: send `SHOW_OVERLAY` to content script
4. On new day (midnight): reset `todayUsage` to 0, `extraGrants` to 0

**Checkpoint:** `todayUsage` increments every minute in storage

---

## Step 4: content.js — Overlay + Warning

1. Listen for messages from background.js
2. On `SHOW_WARNING`:
   - Inject a fixed-top banner div: "⚠️ You have X minutes left today [×]"
   - Auto-hide after 10 seconds or on dismiss click
3. On `SHOW_OVERLAY`:
   - Inject full-page overlay: backdrop blur + centered card
   - Card content: "Time's Up!", remaining countdown, "+10 Minutes" button
   - Cannot be closed except via +10 min button
4. On `HIDE_OVERLAY` (after +10 min granted):
   - Remove overlay elements

**Checkpoint:** Warning banner and blur overlay appear/disappear correctly

---

## Step 5: Popup (click extension icon)

**popup.html:**
- Extension name header
- Large text: "Xh Ym used"
- Text: "Limit: Xh Ym"
- Text: "Remaining: Xm"
- List: top 3 domains with minutes
- Link: "Open Dashboard"

**popup.js:**
- Read `todayUsage`, `dailyLimit` from `chrome.storage.local`
- Calculate remaining
- Populate HTML

**Checkpoint:** Popup shows correct usage data

---

## Step 6: Options Page (Settings)

**options.html:**
- Number input: daily limit (default 120)
- Number input: warning before limit (default 10)
- Toggle: enable overlay
- Toggle: enable warning banner
- Textarea: whitelist (comma-separated domains)
- Text input: Betaal AI user ID (for future backend link)
- Save button

**options.js:**
- Load values from `chrome.storage.local` on open
- Save to `chrome.storage.local` on save button click

**Checkpoint:** Settings persist after closing and reopening

---

## Step 7: +10 Minute Extra Time

1. In content.js: "+10 Minutes" button click → send message to background.js
2. In background.js: increment `dailyLimit` by 10, increment `extraGrants` (max 2/day)
3. Send `HIDE_OVERLAY` to content.js
4. If `extraGrants >= 2`: disable the button (show "No more extra time today")

**Checkpoint:** Overlay disappears on +10 min, limit increases, max 2 grants

---

## Step 8: Demo Mode

For hackathon demo — set `dailyLimit` to 2 minutes in options:
1. Browse for ~1 min → warning banner appears
2. Keep browsing → full overlay with blur
3. Click +10 min → overlay vanishes
4. Click popup → shows stats

**Checkpoint:** Full demo flow works in under 3 minutes

---

## Step 9: Update Docs

- Update `vibecoding/extension/progress.md`
- Create `browser-extension/CONTEXT.md`
