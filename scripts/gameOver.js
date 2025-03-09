function Score(bestScore) {
    let bestScore = pareInt(localSStorage.getItem("bestScore")) || 0;
    let pseudo = prompt("Quel est ton nom de Space Marine ?")
    if (pseudo && pseudo.trim() !== "") {
        localStorage.setItem("bestScore", currentScore);
        localStorage.setItem("bestPlayer", pseudo.trim());
    } else {
        alert("QUEL EST TON NOM !?")
    }
}