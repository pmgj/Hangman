export default class MoveResult {
    constructor(word, winner) {
        this.word = word;
        this.winner = winner;
    }
    getWord() {
        return this.word;
    }
    setWinner(win) {
        this.winner = win;
    }
    getWinner() {
        return this.winner;
    }
}