async function fetchDailyAchievements() {
    const response = await fetch("https://api.guildwars2.com/v2/achievements/daily");
    return response.json();
}

async function fetchTomorrowAchievements() {
    const response = await fetch("https://api.guildwars2.com/v2/achievements/daily/tomorrow");
    return response.json();
}

async function fetchAchievements(achievementIds) {
    const response = await fetch("https://api.guildwars2.com/v2/achievements?ids=" + achievementIds)
    return response.json();
}

function writeToDailyAchievements(text) {
    document.getElementById("dailyAchievements").innerText += text;
}

function appendToChild(modeId, div) {
    document.getElementById(modeId).appendChild(div);
}

function generateAchievementCardDiv(element) {
    console.log(element);
    const achievementCardDiv = document.createElement("div");
    achievementCardDiv.setAttribute("class", "achievement-card");
    // Title 
    achievementCardDiv.appendChild(generateAchievementCardDivTitle(element.name));

    // Requirement
    achievementCardDiv.appendChild(generateAchievementCardDivRequirement(element.requirement));

    // Goal
    achievementCardDiv.appendChild(generateAchievementCardDivGoal(element.tiers[0].count));
    return achievementCardDiv;
}

function generateAchievementCardDivTitle(titleText) {
    const achievementCardDivTitle = document.createElement("p");
    achievementCardDivTitle.setAttribute("class", "achievement-card-title");
    achievementCardDivTitle.innerText = titleText;
    return achievementCardDivTitle;
}

function generateAchievementCardDivRequirement(requirementText) {
    const achievementCardDivRequirement = document.createElement("p");
    achievementCardDivRequirement.setAttribute("class", "achievement-card-requirement");
    achievementCardDivRequirement.innerText = requirementText;
    return achievementCardDivRequirement;
}

function generateAchievementCardDivGoal(goalText) {
    const achievementCardDivGoal = document.createElement("p");
    achievementCardDivGoal.setAttribute("class", "achievement-card-goal");
    achievementCardDivGoal.innerText = "Target: " + goalText;
    return achievementCardDivGoal;
}

function generateSpinner() {
    const spinner = document.createElement("div");
    spinner.setAttribute("class", "spinner-border");
    spinner.setAttribute("role", "status");

    const innerSpinner = document.createElement("span");
    innerSpinner.setAttribute("class", "sr-only");
    innerSpinner.innerText = "Loading...";

    spinner.appendChild(innerSpinner);
    return spinner;
}

function setSpinnerOnAllFields() {
    // Clear
    document.getElementById("pveDailies").innerHTML = "";
    document.getElementById("pvpDailies").innerHTML = "";
    document.getElementById("wvwDailies").innerHTML = "";

    // Spinner
    document.getElementById("pveDailies").appendChild(generateSpinner());
    document.getElementById("pvpDailies").appendChild(generateSpinner());
    document.getElementById("wvwDailies").appendChild(generateSpinner());
}

async function generateCards(dailyAchievementsResponse) {
    // PVE Dailies
    const pveAchievements = dailyAchievementsResponse.pve.map(achievement => achievement.id);
    let achievements = await fetchAchievements(pveAchievements.join(','));
    document.getElementById("pveDailies").innerHTML = "";
    achievements.forEach(element => {
        appendToChild("pveDailies", generateAchievementCardDiv(element));
    });

    // PVP Dailies
    const pvpAchievements = dailyAchievementsResponse.pvp.map(achievement => achievement.id);
    achievements = await await fetchAchievements(pvpAchievements.join(','));
    document.getElementById("pvpDailies").innerHTML = "";
    achievements.forEach(element => {
        appendToChild("pvpDailies", generateAchievementCardDiv(element));
    });

    // WVW Dailies
    const wvwAchievements = dailyAchievementsResponse.wvw.map(achievement => achievement.id);
    achievements = await fetchAchievements(wvwAchievements.join(','));
    document.getElementById("wvwDailies").innerHTML = "";
    achievements.forEach(element => {
        appendToChild("wvwDailies", generateAchievementCardDiv(element)); 
    });
}

async function generateAchievementCards() {
    document.getElementById("toggleTodayBtn").setAttribute("class", "btn btn-secondary active");
    document.getElementById("toggleTomorrowBtn").setAttribute("class", "btn btn-secondary");
    setSpinnerOnAllFields();
    const dailyAchievementsResponse = await fetchDailyAchievements();
    generateCards(dailyAchievementsResponse);
}

async function generateTomorrowAchievementCards() {
    document.getElementById("toggleTodayBtn").setAttribute("class", "btn btn-secondary");
    document.getElementById("toggleTomorrowBtn").setAttribute("class", "btn btn-secondary active");
    setSpinnerOnAllFields();
    const tomorrowAchievementsResponse = await fetchTomorrowAchievements();
    generateCards(tomorrowAchievementsResponse);
}