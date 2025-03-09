const gameOver = new Audio("/src/audio/GameOver.mp3");

const gameOverContainer = document.getElementById("game-over-container");
const restartButton = document.getElementById("restartButton");
const homeButton = document.getElementById("homeButton");
const playerNameInput = document.getElementById("playerNameInput");

restartButton.onclick = function () {
    saveScore(currentScore);
    if (playerNameInput.value.trim() === "") {
        alert("Please, tell me your name brother");
    } else {
        window.location.href = "game.html";
    }
};

homeButton.onclick = function () {
    saveScore(currentScore);
    if (playerNameInput.value.trim() === "") {
        alert("Your NAME soldier, I need it");
    } else {
        window.location.href = "index.html";
    }
};

function playGameOver() {
    gameOver.volume = 0.1;
    gameOver.play();

    gameOverContainer.style.display = "block";

    const scoreDisplay = document.getElementById("score-display");
    let currentScore = localStorage.getItem("currentScore") || 0;
    scoreDisplay.textContent = `Last score : ${currentScore}`;

    const gameOverText = document.getElementById("game-over-text");
    gameOverText.addEventListener('animationend', function() {
        gameOverContainer.style.backgroundSize = "100%";
    });
}

function saveScore(currentScore) {
    let bestScore = parseInt(localStorage.getItem("bestScore")) || 0;
    let pseudo = playerNameInput.value.trim();

    if (pseudo !== "") {
        localStorage.setItem("bestScore", Math.max(currentScore, bestScore));
        localStorage.setItem("bestPlayer", pseudo);
        localStorage.setItem("currentScore", currentScore);
    } 

    displayBestScore();
}

function displayBestScore() {
    const bestScoreDisplay = document.getElementById("best-score-display");
    let bestScore = localStorage.getItem("bestScore") || 0;
    let bestPlayer = localStorage.getItem("bestPlayer") || "Personne";
    bestScoreDisplay.textContent = `Meilleur score : ${bestScore} par ${bestPlayer}`;
}

function updateFavicon() {
    const favicon = document.getElementById("favicon");
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    favicon.href = isDarkMode ? "/src/img/WhiteLogo.png" : "/src/img/BlackLogo.png";
}

let currentScore = localStorage.getItem("currentScore") || 0;

displayBestScore();

playGameOver();

document.getElementById("favicon").href = "/src/img/WhiteLogo.png";
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);