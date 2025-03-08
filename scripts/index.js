// ================================================================================== //
// File: index.js                                                                     //
//                                                                                    //
// Description: This file contains the JavaScript code that manages the game.         //
// ================================================================================== //

// ------ VARIABLES ------ //

const gameContainer = document.getElementById('game-container');
const elements = [];
const hitboxRange = 50;
const music = new Audio('/src/audio/background.mp3');

const sounds = {
    hit: new Audio('/src/audio/BloodSound.mp3'),
    miss: new Audio('/src/audio/Sword.mp3'),
};

const columnLogos = [
    "/src/img/Chaos.png",
    "/src/img/Orks.png",
    "/src/img/Tyrannid.png",
    "/src/img/Eldar.png"
];

let score = 0;
let intervalId;
let totalRows = 0;
let speed = 2;
let intervalTime = 500;
let keyPressed = false;
let missCount = 0;



// ------ FUNCTIONS ------ //

function playSound(sound) {
    if (sounds[sound]) {
        sounds[sound].currentTime = 0;
        if (sound === 'hit') {
            sounds[sound].volume = 0.3;
        }
        if (sound === 'miss') {
            sounds[sound].volume = 0.1;
        }
        sounds[sound].play();
    }
}

function createRandomElement() {
    const createElement = () => {
        const colIndex = Math.floor(Math.random() * 4);
        const rowIndex = 0;
        const isVisible = true;

        const element = document.createElement('div');
        element.classList.add('element');
        element.style.left = `35%`;
        element.style.top = `${rowIndex * 25 - totalRows * 20}px`;
        element.style.visibility = isVisible ? 'visible' : 'hidden';
        switch (colIndex) {
            case 0:
                element.style.backgroundColor = 'rgba(121, 103, 64, 0.5)';
            break;
            case 1:
                element.style.backgroundColor = 'rgba(73, 112, 83, 0.5)';
            break;
            case 2:
                element.style.backgroundColor = 'rgba(133, 83, 130, 0.5)';
            break;
            case 3:
                element.style.backgroundColor = 'rgba(70, 122, 122, 0.5)';
            break;
        }
        element.style.backgroundImage = `url(${columnLogos[colIndex]})`;
        element.style.backgroundSize = "cover";
        switch (colIndex) {
            case 1:
                element.style.backgroundSize = "80%";
            break;
            case 3:
                element.style.backgroundSize = "70%";
            break;
        }
        element.style.backgroundPosition = "center";
        element.speed = speed;
        element.colIndex = colIndex;
        document.getElementById(`column-${colIndex}`).appendChild(element);
        elements.push(element);
        console.log('Element created:', element);
    };

    createElement();
    if (Math.random() < 0.3) {
        createElement();
    }
}

function moveElements() {
    elements.forEach((element, index) => {
        const top = parseFloat(element.style.top);
        element.style.top = `${top + element.speed}px`;

        const validationZone = document.querySelector(`#column-${element.colIndex} .validation-zone`);
        const validationZoneTop = validationZone.getBoundingClientRect().top - gameContainer.getBoundingClientRect().top;

        if (top + 50 >= validationZoneTop - hitboxRange && top + 50 <= validationZoneTop + hitboxRange) {
            element.style.backgroundColor = 'green';
        }

        if (top + 50 >= gameContainer.clientHeight) {
            element.parentElement.removeChild(element);
            elements.splice(index, 1);
        }
        setTimeout(() => {
            keyPressed = false;
        }, 100);
    });
}

function gameLoop() {
    moveElements();
    requestAnimationFrame(gameLoop);
    console.log('score : ' + score);
    console.log('score : ' + score);
    console.log('speed : ' + speed);
    console.log('intervale : ' + intervalTime);
}

function updateInterval() {
    clearInterval(intervalId);
    intervalTime = Math.max(250, 500 - score * 2);
    intervalId = setInterval(createRandomElement, intervalTime);
}

function updateFavicon() {
    const favicon = document.getElementById("favicon");
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    favicon.href = isDarkMode ? "/src/img/WhiteLogo.png" : "/src/img/BlackLogo.png";
}

// ------ LISTENERS ------ //

document.addEventListener('keydown', (event) => {
    if (keyPressed) return;
    keyPressed = true;
})

document.addEventListener('keydown', (event) => {
    const keyMap = {
        'a': 0,
        'z': 1,
        'e': 2,
        'r': 3
    };

    const colIndex = keyMap[event.key.toLowerCase()];
    if (colIndex !== undefined) {
        let hit = false;
        let closestElement = null;
        let closestDistance = Infinity;

        elements.forEach((element, index) => {
            const top = parseFloat(element.style.top);
            const validationZone = document.querySelector(`#column-${element.colIndex} .validation-zone`);
            const validationZoneTop = validationZone.getBoundingClientRect().top - gameContainer.getBoundingClientRect().top;

            if (element.colIndex === colIndex && top + 50 >= validationZoneTop - hitboxRange && top + 50 <= gameContainer.clientHeight) {
                element.style.backgroundColor = 'green';
                score++;
                element.parentElement.removeChild(element);
                elements.splice(index, 1);
                speed += 0.05;
                elements.forEach(el => el.speed += 0.05);
                updateInterval();
                hit = true;
            } else if (element.colIndex === colIndex) {
                const distance = Math.abs(top + 50 - validationZoneTop);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestElement = element;
                }
            }
        });

        if (!hit) {
            missCount++;
            score = Math.max(0, score - 2);
            if (closestElement) {
                closestElement.parentElement.removeChild(closestElement);
                elements.splice(elements.indexOf(closestElement), 1);
            }
            if (missCount >= 5) {
                alert('You lost! Restarting the game.');
                location.reload();
            }
            playSound('miss');
        } else {
            missCount = 0;
            playSound('hit');
        }
    }
});

const controlsContainer = document.getElementById('controls');
const instruction = document.createElement('p');
instruction.textContent = 'Press the keys when the elements touch the character!';
controlsContainer.appendChild(instruction);

document.getElementById("favicon").href = "/src/img/WhiteLogo.png";
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);
document.getElementById('title').textContent = 'Rythm Heresy';

// ------ CODE PRINCIPAL ------ //

updateFavicon();
intervalId = setInterval(createRandomElement, intervalTime);
requestAnimationFrame(gameLoop);