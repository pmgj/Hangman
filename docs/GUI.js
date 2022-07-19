import Hangman from "./Hangman.js";
import Winner from "./Winner.js";

class GUI {
    constructor() {
        this.game = null;
        this.ctx = null;
        this.c = document.querySelector("#hang");
        this.select = document.querySelector("#lang");
    }
    init() {
        let button = document.querySelector("input[type='button']");
        button.onclick = this.start.bind(this);
        let keys = document.querySelectorAll("button");
        keys.forEach(k => k.onclick = this.buttonClicked.bind(this));
        this.start();
    }
    buttonClicked(evt) {
        this.check(evt.currentTarget.dataset.value);
    }
    setMessage(id, msg) {
        let f = document.getElementById(id);
        f.innerHTML = msg;
    }
    start() {
        import(`./words_${this.select.value}.js`).then(module => {
            this.game = new Hangman(module.words);
            this.setMessage("letters", "");
            this.setMessage("message", "");
            this.setMessage("word", "");
            this.ctx = this.c.getContext("2d");
            this.ctx.beginPath();
            this.ctx.clearRect(0, 0, this.c.width, this.c.height);
            this.ctx.moveTo(0, 120);
            this.ctx.lineTo(40, 120);
            this.ctx.moveTo(20, 120);
            this.ctx.lineTo(20, 20);
            this.ctx.lineTo(70, 20);
            this.ctx.lineTo(70, 30);
            this.ctx.stroke();
            this.print("word", this.game.getWord());
            document.onkeyup = this.sendLetter.bind(this);
        });
    }
    print(id, vector) {
        let str = "";
        for (const letter of vector) {
            str += " " + letter;
        }
        this.setMessage(id, str);
    }
    sendLetter(ev) {
        if (ev.key < 'a' || ev.key > 'z') {
            return;
        }
        this.check(ev.key);
    }
    check(letter) {
        try {
            this.game.check(letter);
            this.print("word", this.game.getWord());
            this.print("letters", this.game.getWrongChars());
            switch (this.game.getWinner()) {
                case Winner.WIN:
                    this.setMessage("message", "You win!");
                    break;
                case Winner.LOSE:
                    document.onkeyup = undefined;
                    this.setMessage("message", "You lose!");
                case Winner.WRONG_LETTER:
                    switch (this.game.getWrongChars().length) {
                        case 1:
                            this.ctx.beginPath();
                            this.ctx.arc(70, 40, 10, 0, 2 * Math.PI);
                            this.ctx.stroke();
                            break;
                        case 2:
                            this.ctx.moveTo(70, 50);
                            this.ctx.lineTo(70, 80);
                            this.ctx.stroke();
                            break;
                        case 3:
                            this.ctx.moveTo(70, 60);
                            this.ctx.lineTo(50, 60);
                            this.ctx.stroke();
                            break;
                        case 4:
                            this.ctx.moveTo(70, 60);
                            this.ctx.lineTo(90, 60);
                            this.ctx.stroke();
                            break;
                        case 5:
                            this.ctx.moveTo(70, 80);
                            this.ctx.lineTo(50, 100);
                            this.ctx.stroke();
                            break;
                        case 6:
                            this.ctx.moveTo(70, 80);
                            this.ctx.lineTo(90, 100);
                            this.ctx.stroke();
                            break;
                    }
                    break;
                case Winner.CORRECT_LETTER:
                    this.setMessage("message", "");
                    break;
            }
        } catch (ex) {
            this.setMessage("message", ex.message);
        }
    }
}
let gui = new GUI();
gui.init();