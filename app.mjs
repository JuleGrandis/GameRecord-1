import Game from "./models/structure.mjs";

let games = [];
games = retrieveAllGames();

document.getElementById('importSource').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
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
            const gameData = JSON.parse(localStorage.getItem(key));
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
            <button data-game-id="${game.id}" class="delete-btn">🗑️ Delete</button>
        `;
        container.appendChild(gameElement);
    });
}

document.addEventListener('input', (e) => {
    if (e.target.classList.contains('rating-slider')) {
        const gameId = e.target.dataset.gameId;
        const game = games.find(g => g.id === gameId);
        game.personalRating = parseInt(e.target.value);
        saveGame(game);
        e.target.previousElementSibling.textContent = `Rating: ${game.personalRating}/10`;
    }
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('play-count-btn')) {
        const gameId = e.target.dataset.gameId;
        const game = games.find(g => g.id === gameId);
        game.playCount++;
        saveGame(game);
        e.target.previousElementSibling.textContent = `Play Count: ${game.playCount}`;
    }
});

document.getElementById('addGameBtn').addEventListener('click', () => {
    const newGame = new Game(
        Date.now().toString(),
        document.getElementById('gameTitle').value,
        document.getElementById('gameDesigner').value,
        document.getElementById('gameArtist').value,
        document.getElementById('gamePublisher').value,
        parseInt(document.getElementById('gameYear').value),
        document.getElementById('gamePlayers').value,
        document.getElementById('gameTime').value,
        document.getElementById('gameDifficulty').value,
        document.getElementById('gameUrl').value,
        0,
        0
    );

    saveGame(newGame);
    games = retrieveAllGames();
    renderGames();

    document.getElementById('gameTitle').value = '';
    document.getElementById('gameDesigner').value = '';
    document.getElementById('gameArtist').value = '';
    document.getElementById('gamePublisher').value = '';
    document.getElementById('gameYear').value = '';
    document.getElementById('gamePlayers').value = '';
    document.getElementById('gameTime').value = '';
    document.getElementById('gameDifficulty').value = '';
    document.getElementById('gameUrl').value = '';
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const gameId = e.target.dataset.gameId;
        localStorage.removeItem(`game-${gameId}`);
        games = games.filter(g => g.id !== gameId);
        renderGames();
    }
});

document.getElementById('sortBtn').addEventListener('click', () => {
    const sortBy = document.getElementById('sortBy').value;

    games.sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'difficulty') {
            const difficultyOrder = ['Light', 'Light-Medium', 'Medium', 'Medium-Heavy', 'Heavy'];
            return difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty);
        }
        if (sortBy === 'year') return a.year - b.year;
        if (sortBy === 'rating') return a.rating - b.rating;
        if (sortBy === 'playCount') return a.playCount - b.playCount;
    });
    renderGames();
});

renderGames();