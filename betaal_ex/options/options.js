document.addEventListener('DOMContentLoaded', () => {

    // ── DOM References ────────────────────────────────────────────────────
    const userIdInput   = document.getElementById('user-id');
    const limitInput    = document.getElementById('daily-limit');
    const toggleBlur    = document.getElementById('toggle-blur');
    const toggleFlash   = document.getElementById('toggle-flash');
    const toggleBlack   = document.getElementById('toggle-black');
    const toggleDrift   = document.getElementById('toggle-drift');
    const whitelistText = document.getElementById('whitelist');
    const saveBtn       = document.getElementById('save-btn');
    const statusMsg     = document.getElementById('save-status');
    const accountBadge  = document.getElementById('account-status');
    const logContainer  = document.getElementById('log-container');
    const clearLogsBtn  = document.getElementById('clear-logs-btn');

    // ── Account Badge ─────────────────────────────────────────────────────
    function updateAccountUI(userId) {
        const linked = userId && userId.trim();
        accountBadge.textContent = linked ? 'Linked' : 'Guest';
        accountBadge.style.color = linked ? 'var(--accent)' : 'var(--text-muted)';
        accountBadge.style.borderColor = linked ? 'var(--accent)' : 'var(--border)';
    }

    // ── Activity Log ──────────────────────────────────────────────────────
    function renderLogs(logs) {
        if (!logs || logs.length === 0) {
            logContainer.innerHTML = '<div class="empty-log">No recent activity</div>';
            return;
        }
        logContainer.innerHTML = logs.map(log => {
            const timeStr = new Date(log.timestamp)
                .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            return `
                <div class="log-entry">
                    <div class="log-info">
                        <span class="log-type-label">${log.type}</span>
                        <span class="log-time-label">${timeStr}</span>
                    </div>
                    <span class="log-site" title="${log.domain}">${log.domain}</span>
                </div>`;
        }).join('');
    }

    // ── Load Settings ─────────────────────────────────────────────────────
    chrome.storage.local.get(
        ['dailyLimit', 'whitelist', 'userId', 'interruptLogs', 'enabledInterruptions'],
        (data) => {
            const dailyLimitSec = data.dailyLimit || 7200; // default 120m
            userIdInput.value   = data.userId     || '';
            limitInput.value    = Math.round(dailyLimitSec / 60);
            whitelistText.value = data.whitelist  || '';
            updateAccountUI(data.userId);
            renderLogs(data.interruptLogs);

            const enabled = data.enabledInterruptions || {};
            toggleBlur.checked  = enabled.blur  !== false;
            toggleFlash.checked = enabled.flash !== false;
            toggleBlack.checked = enabled.black !== false;
            toggleDrift.checked = enabled.drift !== false;
        }
    );

    // ── Clear Logs ────────────────────────────────────────────────────────
    clearLogsBtn.addEventListener('click', () => {
        chrome.storage.local.set({ interruptLogs: [] }, () => renderLogs([]));
    });

    // ── Save Settings ─────────────────────────────────────────────────────
    saveBtn.addEventListener('click', () => {
        const userId      = userIdInput.value.trim();
        const limitMin    = parseInt(limitInput.value, 10);
        const whitelist   = whitelistText.value;

        if (isNaN(limitMin) || limitMin < 1) {
            showStatus('Limit must be at least 1 min', '#D93025');
            return;
        }

        const dailyLimitSec = limitMin * 60;

        chrome.storage.local.set({
            userId,
            dailyLimit: dailyLimitSec,
            whitelist,
            enabledInterruptions: {
                blur:  toggleBlur.checked,
                flash: toggleFlash.checked,
                black: toggleBlack.checked,
                drift: toggleDrift.checked,
            },
        }, () => {
            updateAccountUI(userId);
            showStatus('Saved ✓', '#1A73E8');
        });
    });

    // ── Status Toast ──────────────────────────────────────────────────────
    function showStatus(msg, color) {
        statusMsg.textContent = msg;
        statusMsg.style.color = color;
        statusMsg.style.opacity = '1';
        setTimeout(() => {
            statusMsg.style.opacity = '0';
            setTimeout(() => { statusMsg.textContent = ''; }, 400);
        }, 2000);
    }
});
