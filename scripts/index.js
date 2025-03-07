const gameContainer = document.getElementById('game-container');
const line = document.getElementById('line');
const elements = [];
let score = 0;
let levelData = [];
let currentLevel = 0;
let intervalId;

function loadLevels() {
    fetch('/src/levels/levels.txt')
        .then(response => response.text())
        .then(text => {
            const levels = text.split('\n\n');
            levels.forEach(level => {
                const lines = level.split('\n');
                const levelInfo = {};
                lines.forEach(line => {
                    if (line && !line.startsWith('#')) {
                        const [key, value] = line.split(': ');
                        levelInfo[key] = parseInt(value);
                    }
                });
                levelData.push(levelInfo);
            });
            startLevel(currentLevel);
        });
}

function startLevel(level) {
    const { interval, speed } = levelData[level];
    clearInterval(intervalId);
    intervalId = setInterval(createRandomElement, interval);
    elements.forEach(element => element.speed = speed);
}

function createRandomElement() {
    const element = document.createElement('div');
    element.classList.add('element');
    element.style.left = `${Math.random() * (gameContainer.clientWidth - 50)}px`;
    element.style.top = '0px';
    element.speed = levelData[currentLevel].speed;
    gameContainer.appendChild(element);
    elements.push(element);
}

function moveElements() {
    elements.forEach((element, index) => {
        const top = parseFloat(element.style.top);
        element.style.top = `${top + element.speed}px`;

        if (top + 50 >= gameContainer.clientHeight * 0.9) {
            element.style.backgroundColor = 'green';
        }

        if (top + 50 >= gameContainer.clientHeight) {
            gameContainer.removeChild(element);
            elements.splice(index, 1);
        }
    });
}

function gameLoop() {
    moveElements();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (event) => {
    elements.forEach((element, index) => {
        const top = parseFloat(element.style.top);
        if (top + 50 >= gameContainer.clientHeight * 0.9 && top + 50 <= gameContainer.clientHeight) {
            element.style.backgroundColor = 'green';
            score++;
            gameContainer.removeChild(element);
            elements.splice(index, 1);
        } else {
            element.style.backgroundColor = 'red';
        }
    });
});

loadLevels();
requestAnimationFrame(gameLoop);