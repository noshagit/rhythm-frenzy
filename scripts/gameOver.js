const gameOver = new Audio("/src/audio/GameOver.mp3");

const gameOverContainer = document.getElementById("game-over-container");
const bestScoreDisplay = document.getElementById("best-score-display");

restartButton.onclick = function () {
    window.location.href = "index.html";
    };

    gameOverContainer.appendChild(restartButton);

    function playGameOver() {

        gameOver.volume = 0.5;
        gameOver.play()
    
        gameOverContainer.style.display = "block";

        const scoreDisplay = document.getElementById("score-display");
        let currentScore = localStorage.getItem("currentScore") || 0;
        scoreDisplay.textContent = `Score : ${currentScore}`;

        saveScore(currentScore);
    }

function saveScore(currentScore) {
    let bestScore = parseInt(localStorage.getItem("bestScore")) || 0;
    let pseudo = prompt("Quel est ton nom de Space Marine ?");

    if (pseudo && pseudo.trim() !== "") {
        localStorage.setItem("bestScore", Math.max(currentScore, bestScore));
        localStorage.setItem("bestPlayer", pseudo.trim());
        localStorage.setItem("currentScore", currentScore);
    } else {
        alert("QUEL EST TON NOM !?")
    }

    displayBestScore();
}

function displayBestScore() {
    const bestScoreDisplay = document.getElementById("best-score-display");
    let bestScore = localStorage.getItem("bestScore") || 0;
    let bestPlayer = localStorage.getItem("bestPlayer") || "Personne";
    bestScoreDisplay.textContent = `Meilleur score : ${bestScore} par ${bestPlayer}`; 
}

let currentScore = localStorage.getItem("currentScore") || 0;
displayBestScore();

playGameOver();