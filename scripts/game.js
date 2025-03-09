// ================================================================================== //
// File: game.js                                                                     //
//                                                                                    //
// Description: Contains the main game logic.                                         //
// ================================================================================== //

// ------ VARIABLES ------ //

const gameContainer = document.getElementById('game-container');
const elements = [];
const backgroundMusic = new Audio();
const stopButton = document.createElement("button");
const audioContainer = document.createElement("div");
const playPauseButton = document.createElement("button");
const nextButton = document.createElement("button");
const prevButton = document.createElement("button");
const timeDisplay = document.createElement("div");
const hitboxRange = 50;
const border = new Audio('/src/audio/Borders.mp3');
const homeButtonDiv = document.createElement("div");
const homeLink = document.createElement("a");
const controlsContainer = document.getElementById('controls');
const instruction = document.createElement('p');
const scoreDisplay = document.getElementById('score-display');

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

let audioFiles = [];
let currentFileIndex = 0;
let score = 0;
let intervalId;
let totalRows = 0;
let speed = 2;
let intervalTime = 500;
let keyPressed = false;
let missCount = 0;
let consecutiveMisses = 0;

// ------ AUDIO ------ //

sounds['hit'].volume = 0.3;
sounds['miss'].volume = 0.1;
border.volume = 0.2;

function playSound(sound) {
    if (sounds[sound]) {
        sounds[sound].currentTime = 0;
        sounds[sound].play();
    }
}

function playBorders(){
    border.currentTime = 0;
    border.play();
}

backgroundMusic.volume = 0.05;

audioContainer.id = "audio-container";
document.body.appendChild(audioContainer);

playPauseButton.innerHTML = "⏸️";
playPauseButton.onclick = function() {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        playPauseButton.innerHTML = "⏸️";
    } else {
        backgroundMusic.pause();
        playPauseButton.innerHTML = "▶️";
    }
};
audioContainer.appendChild(playPauseButton);

stopButton.innerHTML = "⏹️";
stopButton.onclick = function() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    playPauseButton.innerHTML = "▶️";
};
audioContainer.appendChild(stopButton);


async function loadAudioFiles() {
    try {
        const response = await fetch('/src/songs/songsList.txt');
        const text = await response.text();
        audioFiles = text.split('\n').map(file => file.trim()).filter(file => file !== '');

        if (audioFiles.length > 0) {
            backgroundMusic.src = audioFiles[currentFileIndex];
        } else {
            console.error("No audio files found in the text file.");
        }

        backgroundMusic.addEventListener('ended', function() {
            currentFileIndex = (currentFileIndex + 1) % audioFiles.length;
            if (currentFileIndex === 0) {
                console.log("Fin de la playlist, on recommence !");
            }
            backgroundMusic.src = audioFiles[currentFileIndex];
            backgroundMusic.play();
        });

    } catch (error) {
        console.error("Error loading audio file: ", error);
    }
}

nextButton.innerHTML = "Next ⏭️";
nextButton.onclick = function() {
    currentFileIndex = (currentFileIndex + 1) % audioFiles.length;
    backgroundMusic.src = audioFiles[currentFileIndex];
    backgroundMusic.play();
    playPauseButton.innerHTML = "⏸️";
};
audioContainer.appendChild(nextButton);

prevButton.innerHTML = "Previous ⏮️";
prevButton.onclick = function() {
    currentFileIndex = (currentFileIndex - 1 + audioFiles.length) % audioFiles.length;
    backgroundMusic.src = audioFiles[currentFileIndex];
    backgroundMusic.play();
    playPauseButton.innerHTML = "⏸️";
};
audioContainer.appendChild(prevButton);

timeDisplay.id = "time-display";
audioContainer.appendChild(timeDisplay);

backgroundMusic.addEventListener('timeupdate', () => {
    const currentTime = formatTime(backgroundMusic.currentTime);
    const duration = formatTime(backgroundMusic.duration);
    timeDisplay.textContent = `${currentTime} / ${duration}`;
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// ------ FONCTIONS ------ //

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
            consecutiveMisses++;
            playBorders();
            if (consecutiveMisses >= 5) {
                localStorage.setItem("currentScore", score);
                window.location.replace("gameOver.html");
            }
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

function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// ------ LISTENERS ------ //

homeButtonDiv.id = "title";
homeLink.href = "index.html";
homeLink.textContent = "Rythm Heresy";
homeButtonDiv.appendChild(homeLink);
document.body.appendChild(homeButtonDiv);

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

    const screamSounds = [
        new Audio('/src/audio/Scream1.mp3'),
        new Audio('/src/audio/Scream2.mp3'),
        new Audio('/src/audio/Scream3.mp3'),
        new Audio('/src/audio/Scream4.mp3')
    ];

    screamSounds.forEach(sound => {
        sound.volume = 0.05;
    });

    const colIndex = keyMap[event.key.toLowerCase()];
    if (colIndex !== undefined) {
        screamSounds[colIndex].currentTime = 0;
        screamSounds[colIndex].play();

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
                localStorage.setItem("currentScore", score);
                window.location.replace("gameOver.html")
            }
            playSound('miss');
        } else {
            missCount = 0;
            consecutiveMisses = 0;
            playSound('hit');
        }
    }
});


instruction.textContent = 'Press the keys when the elements touch the character!';
controlsContainer.appendChild(instruction);

document.getElementById("favicon").href = "/src/img/WhiteLogo.png";
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);

setInterval(updateScoreDisplay, 100);

// ------ CODE PRINCIPAL ------ //

loadAudioFiles();
backgroundMusic.play();
updateFavicon();
intervalId = setInterval(createRandomElement, intervalTime);
requestAnimationFrame(gameLoop);