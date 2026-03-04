import { BACKEND_URL, BACKEND_ENABLED } from './config.js';

export function syncWithBackend() {
    if (!BACKEND_ENABLED) return;
    chrome.storage.local.get(['userId', 'todayUsage', 'domainUsage'], (data) => {
        if (!data.userId) return;

        const domainObj = data.domainUsage || {};
        const domains = Object.entries(domainObj).map(([domain, seconds]) => ({
            domain,
            seconds: Math.round(seconds)
        }));

        fetch(`${BACKEND_URL}/extension/heartbeat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid:               data.userId,
                today_browser_sec: Math.round(data.todayUsage || 0),
                domains:           domains,
            }),
        }).catch(() => {});
    });
}
