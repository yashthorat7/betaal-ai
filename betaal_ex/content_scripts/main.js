const EFFECT_MAP = {
    Blur:  doBlur,
    Flash: doFlash,
    Black: doFullBlack,
    Drift: doDrift,
};

function triggerInterrupt(type) {
    const fn = EFFECT_MAP[type];
    if (fn) {
        fn();
    } else {
        const fns = Object.values(EFFECT_MAP);
        fns[Math.floor(Math.random() * fns.length)]();
    }
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'interrupt') {
        triggerInterrupt(message.type);
    }
});

// Broadcast listener (handles messages sent via executeScript to all frames)
window.addEventListener('betaal-interrupt', (e) => {
    triggerInterrupt(e.detail?.type);
});
