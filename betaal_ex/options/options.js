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
            userIdInput.value   = data.userId     || '';
            limitInput.value    = data.dailyLimit || 120;
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
        const dailyLimit  = parseInt(limitInput.value, 10);
        const whitelist   = whitelistText.value;

        if (isNaN(dailyLimit) || dailyLimit < 2) {
            showStatus('Limit must be at least 2 min', '#ff2d55');
            return;
        }

        chrome.storage.local.set({
            userId,
            dailyLimit,
            whitelist,
            enabledInterruptions: {
                blur:  toggleBlur.checked,
                flash: toggleFlash.checked,
                black: toggleBlack.checked,
                drift: toggleDrift.checked,
            },
        }, () => {
            updateAccountUI(userId);
            showStatus('Saved ✓', '#1C1C1C');
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
