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
            renderGames();
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
    gamesData.forEach((gameData, index) => {
        const game = new Game(
            `game-${Date.now()}-${index}`,
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

function renderGames() {
    const container = document.getElementById('gamesContainer');
    container.innerHTML = '';

    games.forEach(game => {
        const gameElement = document.createElement('div');
        gameElement.className = "game-card";
        gameElement.innerHTML = `
            <h3> ${game.title} (${game.year})</h3>
            <p>Designer: ${game.designer}</p>
            <p>Artist: ${game.artist}</p>
            <p>Publisher: ${game.publisher}</p>
            <p>Players: ${game.players}</p>
            <p>Play Time: ${game.time}</p>
            <p>Difficulty: ${game.difficulty}</p>
            <div class="rating-control">
                <label>Rating: <output>${game.personalRating}</output>/10</label>
                <input type="range" min="0" max="10" value="${game.personalRating}"
                    data-game-id="${game.id}" class="rating-slider">
            </div>
            <div class="play-count">
                <label>Play Count: ${game.playCount}</label>
                <button data-game-id="${game.id}" class="play-count-btn">+1 Play</button>
            </div>
            <a href="${game.url}" target="_blank">BoardGameGeek Page</a>
            <button data-game-id="${game.id}" class="delete-btn">Delete Game</button>
            `;
            container.appendChild(gameElement);                    
    });
}

renderGames();
