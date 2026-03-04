import { TICK_INTERVAL, BACKEND_ENABLED, DEFAULT_LIMIT } from './config.js';
import { tickUsage } from './usage_tracker.js';
import { startInterruptions, stopInterruptions } from './cooldown_manager.js';
import { syncWithBackend } from './sync_manager.js';

let userState = 'active';

// ── Install / Init ──────────────────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
    const today = new Date().toDateString();
    chrome.storage.local.get(
        ['lastReset', 'todayUsage', 'dailyLimit', 'extraGrants', 'whitelist', 'domainUsage', 'interruptionsEnabled'],
        (result) => {
            const updates = {};
            if (!result.lastReset || result.lastReset !== today) {
                updates.lastReset   = today;
                updates.todayUsage  = 0;
                updates.extraGrants = 0;
                updates.domainUsage = {};
            }
            if (result.dailyLimit === undefined) updates.dailyLimit = DEFAULT_LIMIT;
            if (result.whitelist === undefined) updates.whitelist = 'docs.google.com, notion.so';
            if (result.interruptionsEnabled === undefined) updates.interruptionsEnabled = true;

            if (Object.keys(updates).length > 0) {
                chrome.storage.local.set(updates);
            }
        }
    );
});

// ── Idle Detection ──────────────────────────────────────────────────────────
chrome.idle.setDetectionInterval(60);
chrome.idle.onStateChanged.addListener((newState) => {
    userState = newState;
    if (userState !== 'active') stopInterruptions();
});

// ── Usage Tick ──────────────────────────────────────────────────────────────
setInterval(() => {
    tickUsage(
        userState, 
        () => startInterruptions(userState), 
        () => stopInterruptions()
    );
}, TICK_INTERVAL);

// ── Backend Sync ────────────────────────────────────────────────────────────
if (BACKEND_ENABLED) {
    chrome.alarms.create('syncHeartbeat', { periodInMinutes: 5 });
    chrome.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name === 'syncHeartbeat') syncWithBackend();
    });
}
