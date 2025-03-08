// ================================================================================== //
// File: index.js                                                                     //
//                                                                                    //
// Description: 
// ================================================================================== //

// ------ VARIABLES ------ //

const playButtonDiv = document.createElement("div");
const playLink = document.createElement("a");

// ------ FONCTIONS ------ //

function updateFavicon() {
    const favicon = document.getElementById("favicon");
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    favicon.href = isDarkMode ? "/src/img/WhiteLogo.png" : "/src/img/BlackLogo.png";
}

// ------ LISTENERS ------ //

document.getElementById("favicon").href = "/src/img/WhiteLogo.png";
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);

playButtonDiv.id = "play-button";
playLink.href = "game.html";
playLink.textContent = "Play";
playButtonDiv.appendChild(playLink);
document.body.appendChild(playButtonDiv);


document.getElementById('title').textContent = 'Rythm Heresy';