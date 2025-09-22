document.addEventListener("DOMContentLoaded", () => {

    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    function validateUsername(username) {
        if(username.trim() === "") {
            statsContainer.innerHTML = `<p>Username should not be empty.</p>`;
            statsContainer.style.color = "#f59e0b";
            statsContainer.classList.remove("hidden");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isValid = regex.test(username);
        if(!isValid) {
            statsContainer.innerHTML = `<p>Invalid Username.</p>`;
            statsContainer.style.color = "#f59e0b";
            statsContainer.classList.remove("hidden");
        }
        return isValid;
    }

    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try{
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            statsContainer.classList.add("hidden");

            const response = await fetch(url);
            if(!response.ok) throw new Error('Unable to fetch the user details.');

            const data = await response.json();
            displayUserData(data);
        } catch(error) {
            statsContainer.innerHTML = `<p>No Data Found</p>`;
            statsContainer.style.color = "#f59e0b";
            statsContainer.classList.remove("hidden");
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle) {
        const progressPercent = (solved/total) * 100;
        circle.style.setProperty("--progress-degree", `${progressPercent}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(data) {
        statsContainer.classList.remove("hidden");

        updateProgress(data.easySolved, data.totalEasy, easyLabel, easyProgressCircle);
        updateProgress(data.mediumSolved, data.totalMedium, mediumLabel, mediumProgressCircle);
        updateProgress(data.hardSolved, data.totalHard, hardLabel, hardProgressCircle);

        const cardsData = [
            {label: "Total Solved", value: data.totalSolved},
            {label: "Ranking", value: data.ranking},
            {label: "Contribution Points", value: data.contributionPoints},
        ];

        cardStatsContainer.innerHTML = cardsData.map(item => `
            <div class="card">
                <h3>${item.label}</h3>
                <p>${item.value}</p>
            </div>
        `).join("");
    }

    searchButton.addEventListener('click', () => {
        const username = usernameInput.value;
        if(validateUsername(username)) fetchUserDetails(username);
    });

});
