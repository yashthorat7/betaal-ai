import { TICK_SECONDS, DEFAULT_LIMIT } from './config.js';

export function tickUsage(userState, onOverLimit, onUnderLimit) {
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
                    onUnderLimit();
                    return;
                }

                // Accumulate usage
                const newUsage      = (data.todayUsage || 0) + TICK_SECONDS;
                const domainUsage   = data.domainUsage || {};
                domainUsage[domain] = (domainUsage[domain] || 0) + TICK_SECONDS;
                chrome.storage.local.set({ todayUsage: newUsage, domainUsage });

                // Manage interruptions
                const overLimit = newUsage >= (data.dailyLimit || DEFAULT_LIMIT);
                if (overLimit && data.interruptionsEnabled !== false) {
                    onOverLimit();
                } else {
                    onUnderLimit();
                }
            }
        );
    });
}
