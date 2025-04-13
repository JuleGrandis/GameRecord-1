export default class Game {
    constructor(
        id,
        title,
        designer,
        artist,
        publisher,
        year,
        players,
        time,
        difficulty,
        url,
        playCount,
        personalRating
    ) {
        this.id = id;
        this.title = title;
        this.designer = designer;
        this.artist = artist;
        this.publisher = publisher;
        this.year = year;
        this.players = players;
        this.time = time;
        this.difficulty = difficulty;
        this.url = url;
        this.playCount = playCount;
        this.personalRating = personalRating;
    }
}