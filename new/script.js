document.addEventListener("DOMContentLoaded", () => {

    // Elements
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("query");
    const statsGrid = document.getElementById("stats-grid");

    const totalSolvedEl = document.getElementById("total-solved");
    const totalQuestionsEl = document.getElementById("total-questions");
    const rankingEl = document.getElementById("ranking");

    const easyCircle = document.getElementById("easy-progress");
    const mediumCircle = document.getElementById("medium-progress");
    const hardCircle = document.getElementById("hard-progress");

    const easyValue = document.getElementById("easy-value");
    const mediumValue = document.getElementById("medium-value");
    const hardValue = document.getElementById("hard-value");

    // Modal & Theme
    // const modal = document.getElementById('modal');
    // const openModalBtn = document.getElementById('open-modal');
    // const cancelModalBtn = document.getElementById('modal-cancel');
    // const createModalBtn = document.getElementById('modal-create');
    const toggleThemeBtn = document.getElementById('toggle-theme');

    function escapeHtml(s) {
        return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" }[c]));
    }

    // Modal handling
    // function showModal(show){
    //     if(!modal) return;
    //     modal.style.display = show ? 'flex' : 'none';
    //     modal.setAttribute('aria-hidden', show ? 'false' : 'true');
    //     if(show) document.getElementById('report-name')?.focus();
    // }

    // if (openModalBtn) openModalBtn.addEventListener('click', () => showModal(true));
    // if (cancelModalBtn) cancelModalBtn.addEventListener('click', () => showModal(false));
    // if (modal) modal.addEventListener('click', e => { if (e.target === modal) showModal(false); });
    // if (createModalBtn) createModalBtn.addEventListener('click', () => { alert('Report created'); showModal(false); });

    // Theme toggle
    toggleThemeBtn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('theme-dark');
        toggleThemeBtn.setAttribute('aria-pressed', String(isDark));
    });

    // Username validation
    function validateUsername(username) {
        if (!username.trim()) {
            statsGrid.innerHTML = `<p>Username cannot be empty.</p>`;
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        if (!regex.test(username)) {
            statsGrid.innerHTML = `<p>Invalid username format.</p>`;
            return false;
        }
        return true;
    }

    // Update progress circle
    function updateProgressCircle(circle, valueEl, solved, total) {
        const pct = total ? Math.round((solved / total) * 100) : 0;
        circle.style.setProperty('--deg', `${Math.min(360, (pct / 100) * 360)}deg`);
        valueEl.textContent = `${solved}/${total}`;
    }

    // Render stats cards
    function renderStats(data) {
        const stats = [
            { label: 'Questions', value: data.totalQuestions },
            { label: 'Solved', value: data.totalSolved },
            { label: 'Easy solved', value: data.easySolved },
            { label: 'Medium solved', value: data.mediumSolved },
            { label: 'Hard solved', value: data.hardSolved },
            { label: 'Contribution', value: data.contributionPoints }
        ];

        statsGrid.innerHTML = stats.map(s => `
            <div class="card" role="listitem">
                <div class="label">${escapeHtml(s.label)}</div>
                <div class="value">${escapeHtml(String(s.value))}</div>
            </div>
        `).join('');
    }

    // Update main KPIs
    function updateKpis(data) {
        totalSolvedEl.textContent = data.totalSolved;
        totalQuestionsEl.textContent = data.totalQuestions;
        rankingEl.textContent = data.ranking || '—';

        updateProgressCircle(easyCircle, easyValue, data.easySolved, data.totalEasy);
        updateProgressCircle(mediumCircle, mediumValue, data.mediumSolved, data.totalMedium);
        updateProgressCircle(hardCircle, hardValue, data.hardSolved, data.totalHard);
    }

    // Fetch user data
    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            statsGrid.innerHTML = "";

            const response = await fetch(url);
            if (!response.ok) throw new Error('User not found');

            const data = await response.json();

            // Map API data
            const mappedData = {
                totalSolved: data.totalSolved,
                totalQuestions: data.totalEasy + data.totalMedium + data.totalHard,
                ranking: data.ranking,
                contributionPoints: data.contributionPoints,
                easySolved: data.easySolved,
                mediumSolved: data.mediumSolved,
                hardSolved: data.hardSolved,
                totalEasy: data.totalEasy,
                totalMedium: data.totalMedium,
                totalHard: data.totalHard
            };

            renderStats(mappedData);
            updateKpis(mappedData);

        } catch (error) {
            statsGrid.innerHTML = `<p>No data found</p>`;
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    searchButton.addEventListener('click', () => {
        const username = usernameInput.value;
        if (validateUsername(username)) fetchUserDetails(username);
    });

});
