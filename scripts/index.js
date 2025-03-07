// ================================================================================== //
// File: index.js                                                                     //
//                                                                                    //
// Description: This file contains the JavaScript code that manages the game.         //
// ================================================================================== //

// ------ VARIABLES ------ //

const gameContainer = document.getElementById('game-container');
const elements = [];
const hitboxRange = 50;

let score = 0;
let intervalId;
let totalRows = 0;
let speed = 2;
let intervalTime = 500;
let keyPressed = false;

// ------ FUNCTIONS ------ //

function createRandomElement() {
    const createElement = () => {
        const colIndex = Math.floor(Math.random() * 4);
        const rowIndex = 0;
        const isVisible = true;

        const element = document.createElement('div');
        element.classList.add('element');
        element.style.left = `40%`;
        element.style.top = `${rowIndex * 25 - totalRows * 20}px`;
        element.style.visibility = isVisible ? 'visible' : 'hidden';
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

// ------ LISTENERS ------ //

document.addEventListener('keydown', (event) => {
    if (keyPressed) return;
    keyPressed = true;
});

document.addEventListener('keydown', (event) => {
    const keyMap = {
        'a': 0,
        'z': 1,
        'e': 2,
        'r': 3
    };

    const colIndex = keyMap[event.key.toLowerCase()];
    if (colIndex !== undefined) {
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
            } else if (element.colIndex === colIndex) {
                element.style.backgroundColor = 'red';
            }
        });
    }
});

const controlsContainer = document.getElementById('controls');
const instruction = document.createElement('p');
instruction.textContent = 'Press the keys when the elements touch the character!';
controlsContainer.appendChild(instruction);

// ------ CODE PRINCIPAL ------ //

intervalId = setInterval(createRandomElement, intervalTime);
requestAnimationFrame(gameLoop);