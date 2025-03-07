const gameContainer = document.getElementById('game-container');
const line = document.getElementById('line');
const elements = [];
let score = 0;
let currentLevel = 1;
let intervalId;

function loadLevel(level) {
    fetch(`/src/levels/level${level}.txt`)
        .then(response => response.text())
        .then(text => {
            const rows = text.trim().split('\n');
            rows.forEach((row, rowIndex) => {
                const columns = row.split(' ');
                columns.forEach((col, colIndex) => {
                    if (col === '1') {
                        createElement(colIndex, rowIndex);
                    }
                });
            });
        });
}

function createElement(colIndex, rowIndex) {
    const element = document.createElement('div');
    element.classList.add('element');
    element.style.left = `${colIndex * 25}%`;
    element.style.top = `${rowIndex * 25}px`;
    element.speed = 2;
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

loadLevel(currentLevel);
requestAnimationFrame(gameLoop);