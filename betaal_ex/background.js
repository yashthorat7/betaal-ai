// ── Config ──────────────────────────────────────────────────────────────────
const BACKEND_ENABLED = false;
const DEFAULT_LIMIT   = 2;      // minutes
const TICK_INTERVAL   = 10000;  // ms  (10 s = 1/6 min increment)
const TICK_MINUTES    = 10 / 60;
const INTERRUPT_INTERVAL = 10000; // ms between interrupts

let interruptTimer = null;
let userState      = 'active';

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
            if (result.dailyLimit          === undefined) updates.dailyLimit          = DEFAULT_LIMIT;
            if (result.whitelist           === undefined) updates.whitelist           = 'docs.google.com, notion.so';
            if (result.interruptionsEnabled=== undefined) updates.interruptionsEnabled = true;

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
setInterval(tickUsage, TICK_INTERVAL);

function tickUsage() {
    if (userState !== 'active') return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (!tab?.url?.startsWith('http')) return;

        const domain = new URL(tab.url).hostname;

        chrome.storage.local.get(
            ['todayUsage', 'dailyLimit', 'domainUsage', 'whitelist', 'lastReset', 'interruptionsEnabled'],
            (data) => {
                // Daily reset check
                const today = new Date().toDateString();
                if (data.lastReset !== today) {
                    chrome.storage.local.set({
                        lastReset:   today,
                        todayUsage:  0,
                        extraGrants: 0,
                        domainUsage: {},
                    });
                    return;
                }

                // Whitelist check
                const whitelist = (data.whitelist || '')
                    .split(',').map(s => s.trim()).filter(Boolean);
                if (whitelist.some(w => domain.includes(w))) {
                    stopInterruptions();
                    return;
                }

                // Accumulate usage
                const newUsage      = (data.todayUsage || 0) + TICK_MINUTES;
                const domainUsage   = data.domainUsage || {};
                domainUsage[domain] = (domainUsage[domain] || 0) + TICK_MINUTES;
                chrome.storage.local.set({ todayUsage: newUsage, domainUsage });

                // Manage interruptions
                const overLimit = newUsage >= (data.dailyLimit || DEFAULT_LIMIT);
                if (overLimit && data.interruptionsEnabled !== false) {
                    if (!interruptTimer) startInterruptions();
                } else {
                    stopInterruptions();
                }
            }
        );
    });
}

// ── Interruptions ───────────────────────────────────────────────────────────
function startInterruptions() {
    if (interruptTimer || userState !== 'active') return;
    sendInterrupt();
    interruptTimer = setInterval(sendInterrupt, INTERRUPT_INTERVAL);
}

function stopInterruptions() {
    if (!interruptTimer) return;
    clearInterval(interruptTimer);
    interruptTimer = null;
}

function sendInterrupt() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (!tab) return;

        const domain = tab.url ? new URL(tab.url).hostname : 'unknown';

        chrome.storage.local.get(['enabledInterruptions', 'interruptLogs'], (data) => {
            const enabled = data.enabledInterruptions || { blur: true, flash: true, black: true, drift: true };

            // Build pool from enabled types
            const pool = [];
            if (enabled.blur  !== false) pool.push('Blur');
            if (enabled.flash !== false) pool.push('Flash');
            if (enabled.black !== false) pool.push('Black');
            if (enabled.drift !== false) pool.push('Drift');

            if (pool.length === 0) return;

            const type = pool[Math.floor(Math.random() * pool.length)];

            // Send to content script
            chrome.tabs.sendMessage(tab.id, { action: 'interrupt', type }).catch(() => {});

            // Log event (cap at 50)
            const logs = data.interruptLogs || [];
            logs.unshift({ type, domain, timestamp: new Date().toISOString() });
            if (logs.length > 50) logs.length = 50;
            chrome.storage.local.set({ interruptLogs: logs });
        });
    });
}

// ── Backend Sync (disabled) ─────────────────────────────────────────────────
if (BACKEND_ENABLED) {
    chrome.alarms.create('syncHeartbeat', { periodInMinutes: 5 });
    chrome.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name === 'syncHeartbeat') syncWithBackend();
    });
}

function syncWithBackend() {
    if (!BACKEND_ENABLED) return;
    chrome.storage.local.get(['userId', 'todayUsage', 'domainUsage'], (data) => {
        if (!data.userId) return;
        fetch('http://localhost:8000/extension/heartbeat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id:         data.userId,
                today_usage_min: data.todayUsage  || 0,
                domain_usage:    data.domainUsage || {},
            }),
        }).catch(() => {});
    });
}
