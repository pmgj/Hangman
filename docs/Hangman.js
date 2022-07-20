import Winner from "./Winner.js";

export default class Hangman {
    constructor(dictionary) {
        this.triedChars = [];
        this.wrongChars = [];
        this.maskedWord = [];
        this.WRONG_TRIES = 6;
        this.winner = null;
        this.word = this.selectWord(dictionary);
    }
    selectWord(words) {
        words = words.filter(e => e.length > 2);
        let x = Math.floor(Math.random() * words.length);
        let w = words[x].split('');
        this.maskedWord = w.map(c => (c === " ") ? " " : (c === "-") ? " &ndash; " : "_");
        return w;
    }
    getWord() {
        return this.winner == Winner.LOSE ? this.word : this.maskedWord;
    }
    getWrongChars() {
        return this.wrongChars;
    }
    getWinner() {
        return this.winner;
    }
    check(v) {
        if(this.winner === Winner.LOSE || this.winner === Winner.WIN) {
            return;
        }
        let letter = v.toUpperCase();
        if (letter < 'A' || letter > 'Z') {
            throw new Error("Type a valid character.");
        }
        if (this.triedChars.some(c => c === letter)) {
            throw new Error("This character was already pressed.");
        }
        this.triedChars.push(letter);
        this.maskedWord = [];
        for (const letter of this.word) {
            this.maskedWord.push(this.triedChars.includes(letter) ? letter : letter === '-' ? ' &ndash; ' : '_');
        }
        if (this.word.some(c => c === letter)) {
            this.winner = this.maskedWord.every(c => c !== "_") ? Winner.WIN : Winner.CORRECT_LETTER;
            return;
        }
        this.wrongChars.push(letter);
        this.winner = this.wrongChars.length == this.WRONG_TRIES ? Winner.LOSE : Winner.WRONG_LETTER;
    }
}