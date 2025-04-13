import Game from "./models/structure.mjs";

let games = [];
games = retrieveAllGames();

document.getElementById('importSource').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            importGames(e.target.result);
            games = retrieveAllGames();
            readerGames();
        };
        reader.readAsText(file);
    }
});

function saveGame(game) {
    localStorage.setItem(`game-${game.id}`, JSON.stringify(game));
}

function retrieveAllGames() {
    const games = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('game-')) {
            const gameData = JSON.parse(localStorage.getItem(key))
            games.push(new Game(
                gameData.id,
                gameData.title,
                gameData.designer,
                gameData.artist,
                gameData.publisher,
                gameData.year,
                gameData.players,
                gameData.time,
                gameData.difficulty,
                gameData.url,
                gameData.playCount,
                gameData.personalRating
            ));
        }
    }
    return games;
}

function exportGames() {
    return JSON.stringify(retrieveAllGames());
}

function importGames(jsonData) {
    const gamesData = JSON.parse(jsonData);
    gamesData.forEach(gameData => {
        const game = new Game(
            Date.now().toString(),
            gameData.id,
            gameData.title,
            gameData.designer,
            gameData.artist,
            gameData.publisher,
            gameData.year,
            gameData.players,
            gameData.time,
            gameData.difficulty,
            gameData.url,
            gameData.playCount || 0,
            gameData.personalRating || 0
        );
        saveGame(game);
    });
}