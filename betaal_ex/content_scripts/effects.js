function getContainer() {
    return document.fullscreenElement || document.documentElement;
}

function createOverlay(color, transition) {
    const el = document.createElement('div');
    el.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: ${color};
        opacity: 0;
        z-index: 2147483647;
        pointer-events: none;
        transition: opacity ${transition};
    `;
    getContainer().appendChild(el);
    return el;
}

function doBlur() {
    const el = document.createElement('div');
    el.style.cssText = `
        position: fixed; inset: 0;
        backdrop-filter: blur(0px);
        z-index: 2147483647;
        pointer-events: none;
        transition: backdrop-filter 700ms cubic-bezier(0.4, 0, 0.2, 1);
    `;
    getContainer().appendChild(el);
    requestAnimationFrame(() => {
        el.style.backdropFilter = 'blur(12px)';
    });
    setTimeout(() => {
        el.style.backdropFilter = 'blur(0px)';
        setTimeout(() => el.remove(), 700);
    }, 2000);
}

function doFlash() {
    const el = createOverlay('#FFFFFF', '100ms ease-out');
    requestAnimationFrame(() => (el.style.opacity = '0.9'));
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
    const distance  = 50 + Math.random() * 100;
    const prev = document.body.style.transform;
    const prevTrans = document.body.style.transition;
    
    document.body.style.transition = 'transform 600ms ease-in-out';
    document.body.style.transform = `translateY(${direction * distance}px)`;
    
    setTimeout(() => {
        document.body.style.transform = prev;
        setTimeout(() => {
            document.body.style.transition = prevTrans;
        }, 600);
    }, 600);
}
