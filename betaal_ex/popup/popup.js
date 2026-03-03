// ── Constants ──────────────────────────────────────────────────────────────
const RADIUS = 66;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// ── DOM References ─────────────────────────────────────────────────────────
const ring          = document.querySelector('.progress-ring__circle');
const remainingText = document.getElementById('remaining-time');
const dailyLimitText= document.getElementById('daily-limit');
const usageSummary  = document.getElementById('usage-summary');
const domainList    = document.getElementById('domain-list');
const addTimeBtn    = document.getElementById('add-time-btn');
const extraOptions  = document.getElementById('extra-options');
const dashboardBtn  = document.getElementById('dashboard-btn');
const settingsBtn   = document.getElementById('settings-btn');

// ── Init ring ──────────────────────────────────────────────────────────────
ring.style.strokeDasharray  = `${CIRCUMFERENCE} ${CIRCUMFERENCE}`;
ring.style.strokeDashoffset = CIRCUMFERENCE;

// ── Navigation ─────────────────────────────────────────────────────────────
dashboardBtn.addEventListener('click', () => window.open('http://localhost:3000/dashboard', '_blank'));
settingsBtn.addEventListener('click',  () => chrome.runtime.openOptionsPage());

// ── UI Update ──────────────────────────────────────────────────────────────
function updateUI() {
    chrome.storage.local.get(['todayUsage', 'dailyLimit', 'domainUsage', 'extraGrants'], (data) => {
        const todayUsage  = data.todayUsage  || 0;
        const dailyLimit  = data.dailyLimit  || 120;
        const domainUsage = data.domainUsage || {};
        const extraGrants = data.extraGrants || 0;

        const usedMin      = Math.round(todayUsage);
        const remaining    = Math.max(0, Math.round(dailyLimit - todayUsage));
        const percentage   = Math.min(100, (todayUsage / dailyLimit) * 100);
        const offset       = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;

        remainingText.textContent  = remaining;
        dailyLimitText.textContent = dailyLimit;
        ring.style.strokeDashoffset = offset;

        // Switch gradient: danger (red) when over limit, brand gradient otherwise
        ring.setAttribute('stroke', percentage >= 100 ? 'url(#ring-danger)' : 'url(#ring-gradient)');

        usageSummary.textContent = `${usedMin} min used today`;

        // Top 3 domains
        const sorted = Object.entries(domainUsage)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        domainList.innerHTML = sorted.length
            ? sorted.map(([domain, minutes]) => `
                <li class="site-row">
                    <div class="site-info">
                        <img class="favicon" src="https://www.google.com/s2/favicons?domain=${domain}&sz=16" alt="">
                        <span class="domain-name" title="${domain}">${domain}</span>
                    </div>
                    <span class="site-time">${Math.round(minutes)} min</span>
                </li>`).join('')
            : '<li class="site-row"><span class="domain-name">No data yet</span></li>';

        // Disable extra time if grants exhausted
        if (extraGrants >= 2) {
            addTimeBtn.textContent = 'Extra time added';
            addTimeBtn.disabled = true;
        }
    });
}

// ── Extra Time ─────────────────────────────────────────────────────────────
addTimeBtn.addEventListener('click', () => {
    if (!addTimeBtn.disabled) {
        extraOptions.classList.remove('hidden');
        addTimeBtn.classList.add('hidden');
    }
});

extraOptions.addEventListener('click', (e) => {
    const mins = parseInt(e.target.dataset.mins);
    if (!mins) return;

    chrome.storage.local.get(['dailyLimit', 'extraGrants'], (data) => {
        chrome.storage.local.set({
            dailyLimit:   (data.dailyLimit  || 120) + mins,
            extraGrants:  (data.extraGrants || 0)   + 1,
        }, () => {
            extraOptions.classList.add('hidden');
            addTimeBtn.classList.remove('hidden');
            updateUI();
        });
    });
});

// ── Bootstrap ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', updateUI);
chrome.storage.onChanged.addListener((_, area) => { if (area === 'local') updateUI(); });
