// ================================================================================== //
// Fichier : index.js                                                                 //
//                                                                                    //
// Description : Ce fichier contient le code javascript qui permet de gérer le jeu.   //
// ================================================================================== //

// ------ VARIABLES ------ //

const gameContainer = document.getElementById('game-container');
const elements = [];
let score = 0;
let currentLevel = 1;
let intervalId;

// ------ FONCTIONS ------ //

function loadLevel(level) {
    fetch(`/src/levels/level${level}.txt`) // Chargement du fichier de niveau
        .then(response => response.text()) // Conversion de la réponse en texte
        .then(text => {
            const rows = text.trim().split('\n'); // Découpage du texte en lignes
            rows.forEach((row, rowIndex) => {
                const columns = row.split(' ');
                columns.forEach((col, colIndex) => {
                    if (col === '1') {
                        createElement(colIndex, rowIndex);
                    }
                });
            });
        })
        .catch(error => console.error('Erreur lors du chargement du niveau:', error));
}

function createElement(colIndex, rowIndex) {
    const element = document.createElement('div');
    element.classList.add('element');
    element.style.left = '50%';
    element.style.top = `${rowIndex * 25}px`;
    element.speed = 2;
    element.colIndex = colIndex;
    document.getElementById(`column-${colIndex}`).appendChild(element);
    elements.push(element);
    console.log('Élément créé:', element);
}

function moveElements() {
    elements.forEach((element, index) => {
        const top = parseFloat(element.style.top); // Récupération de la position top de l'élément
        element.style.top = `${top + element.speed}px`;

        const validationZone = document.querySelector(`#column-${element.colIndex} .validation-zone`);
        const validationZoneTop = validationZone.getBoundingClientRect().top - gameContainer.getBoundingClientRect().top;

        if (top + 50 >= validationZoneTop - 15 && top + 50 <= validationZoneTop + 15) { // Si l'élément est dans la zone de validation
            element.style.backgroundColor = 'green';
        }

        if (top + 50 >= gameContainer.clientHeight) { // Si l'élément atteint le bas de la page
            element.parentElement.removeChild(element);
            elements.splice(index, 1);
        }
    });
}

function gameLoop() {
    moveElements();
    requestAnimationFrame(gameLoop);
}

// ------ LISTENERS ------ //

document.addEventListener('keydown', (event) => {
    const keyMap = {
        'a': 0,
        'z': 1,
        'e': 2,
        'r': 3
    };

    const colIndex = keyMap[event.key];
    if (colIndex !== undefined) {
        elements.forEach((element, index) => {
            const top = parseFloat(element.style.top);
            const validationZone = document.querySelector(`#column-${element.colIndex} .validation-zone`);
            const validationZoneTop = validationZone.getBoundingClientRect().top - gameContainer.getBoundingClientRect().top;

            if (element.colIndex === colIndex && top + 50 >= validationZoneTop - 15 && top + 50 <= gameContainer.clientHeight) {
                element.style.backgroundColor = 'green';
                score++;
                element.parentElement.removeChild(element);
                elements.splice(index, 1);
            } else if (element.colIndex === colIndex) {
                element.style.backgroundColor = 'red';
            }
        });
    }
});

// ------ CODE PRINCIPAL ------ //

loadLevel(currentLevel);
requestAnimationFrame(gameLoop);