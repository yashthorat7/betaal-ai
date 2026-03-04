import { DEFAULT_LIMIT, BACKEND_URL } from './config.js';

let interruptTimer = null;
let fetchCooldownTimer = null;
let cooldownArray = [];

export function startInterruptions(userState) {
    if (interruptTimer || fetchCooldownTimer || userState !== 'active') return;
    
    fetchCooldownArray(userState);
    fetchCooldownTimer = setInterval(() => fetchCooldownArray(userState), 10 * 60 * 1000);
}

export function stopInterruptions() {
    if (interruptTimer) {
        clearTimeout(interruptTimer);
        interruptTimer = null;
    }
    if (fetchCooldownTimer) {
        clearInterval(fetchCooldownTimer);
        fetchCooldownTimer = null;
    }
    cooldownArray = [];
}

async function fetchCooldownArray(userState) {
    if (userState !== 'active') return;

    try {
        const data = await new Promise(resolve => {
            chrome.storage.local.get(['userId', 'dailyLimit'], data => resolve(data));
        });
        const userId = data.userId || 'demo_user';
        const dailyLimit = data.dailyLimit || DEFAULT_LIMIT;
        const numEffects = 4;

        const response = await fetch(`${BACKEND_URL}/extension/cooldown`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                uid: userId,
                daily_limit_sec: Math.round(dailyLimit),
                num_effects: numEffects
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            cooldownArray = result.interruptions || [];
        } else {
            throw new Error(`Backend returned ${response.status}`);
        }
    } catch (e) {
        console.warn("Falling back to local matrix", e.message);
        generateLocalCooldownMatrix();
    } finally {
        if (cooldownArray.length > 0) {
            if (interruptTimer) clearTimeout(interruptTimer);
            processNextInterrupt(userState);
        }
    }
}

function generateLocalCooldownMatrix() {
    const numEffects = 4;
    cooldownArray = [];
    for (let i = 0; i < 60; i++) {
        const interval = Math.floor(Math.random() * (15 - 10 + 1)) + 10;
        const effectId = Math.floor(Math.random() * numEffects) + 1;
        cooldownArray.push([interval, effectId]);
    }
}

function processNextInterrupt(userState) {
    if (cooldownArray.length === 0 || userState !== 'active') return;
    const [intervalSec, effectId] = cooldownArray.shift();

    interruptTimer = setTimeout(() => {
        sendInterrupt(effectId);
        processNextInterrupt(userState);
    }, intervalSec * 1000);
}

function sendInterrupt(effectId) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (!tab) return;

        const domain = tab.url ? new URL(tab.url).hostname : 'unknown';

        chrome.storage.local.get(['enabledInterruptions', 'interruptLogs'], (data) => {
            const enabled = data.enabledInterruptions || { blur: true, flash: true, black: true, drift: true };
            let type = 'Blur';
            if (effectId === 1 && enabled.blur !== false) type = 'Blur';
            else if (effectId === 2 && enabled.flash !== false) type = 'Flash';
            else if (effectId === 3 && enabled.black !== false) type = 'Black';
            else if (effectId === 4 && enabled.drift !== false) type = 'Drift';
            else {
                const pool = [];
                if (enabled.blur  !== false) pool.push('Blur');
                if (enabled.flash !== false) pool.push('Flash');
                if (enabled.black !== false) pool.push('Black');
                if (enabled.drift !== false) pool.push('Drift');
                if (pool.length === 0) return;
                type = pool[Math.floor(Math.random() * pool.length)];
            }

            // Send to ALL frames in the tab to ensure visibility on sites with complex layouts (iframes)
            chrome.scripting.executeScript({
                target: { tabId: tab.id, allFrames: true },
                func: (t) => {
                    window.dispatchEvent(new CustomEvent('betaal-interrupt', { detail: { type: t } }));
                },
                args: [type]
            }).catch(() => {
                // Fallback for sites where executeScript might fail or if scripting permission is missing
                chrome.tabs.sendMessage(tab.id, { action: 'interrupt', type }).catch(() => {});
            });

            const logs = data.interruptLogs || [];
            logs.unshift({ type, domain, timestamp: new Date().toISOString() });
            if (logs.length > 50) logs.length = 50;
            chrome.storage.local.set({ interruptLogs: logs });
        });
    });
}
