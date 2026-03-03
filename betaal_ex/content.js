// ── Interruption Effects ────────────────────────────────────────────────────
// Each effect is subtle but perceptible — designed to nudge attention, not annoy.

function doBlur() {
    const prev = document.body.style.filter;
    document.body.style.transition = 'filter 700ms cubic-bezier(0.4, 0, 0.2, 1)';
    document.body.style.filter = 'blur(8px)';
    setTimeout(() => {
        document.body.style.filter = prev;
    }, 2000);
}

function doFlash() {
    const el = createOverlay('#000000', '100ms ease-out');
    requestAnimationFrame(() => (el.style.opacity = '0.85'));
    setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 150);
    }, 180);
}

function doFullBlack() {
    const el = createOverlay('#000000', '250ms ease-in-out');
    requestAnimationFrame(() => (el.style.opacity = '1'));
    setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 300);
    }, 700);
}

function doDrift() {
    const direction = Math.random() > 0.5 ? 1 : -1;
    const distance  = 150 + Math.random() * 150;
    window.scrollBy({ top: direction * distance, behavior: 'smooth' });
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function createOverlay(color, transition) {
    const el = document.createElement('div');
    el.style.cssText = `
        position: fixed; inset: 0;
        background: ${color};
        opacity: 0;
        z-index: 2147483647;
        pointer-events: none;
        transition: opacity ${transition};
    `;
    document.documentElement.appendChild(el);
    return el;
}

// ── Dispatch ─────────────────────────────────────────────────────────────────
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
        // Fallback: pick a random effect
        const fns = Object.values(EFFECT_MAP);
        fns[Math.floor(Math.random() * fns.length)]();
    }
}

// ── Message Listener ─────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'interrupt') {
        triggerInterrupt(message.type);
    }
});
