import Hangman from "./Hangman.js";
import Winner from "./Winner.js";

class GUI {
    constructor() {
        this.game = null;
        this.ctx = null;
        this.c = document.querySelector("#hang");
        this.select = document.querySelector("#lang");
        this.keys = document.querySelectorAll("button");
    }
    init() {
        let button = document.querySelector("input[type='button']");
        button.onclick = this.start.bind(this);
        this.keys.forEach(k => k.onclick = this.buttonClicked.bind(this));
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
            this.printBoxes(this.game.getWord());
            document.onkeyup = this.sendLetter.bind(this);
            this.keys.forEach(k => k.className = "btn btn-secondary");
        });
    }
    printBoxes(vector) {
        let str = "<tr>";
        for (let letter of vector) {
            str += letter === "-" ? "<td class='none'>&ndash;</td>" : "<td></td>";
        }
        str += "</tr>"
        this.setMessage("word", str);
    }
    printLetter(vector) {
        let divs = document.querySelectorAll("#word td");
        for (let i = 0; i < vector.length; i++) {
            let letter = vector[i];
            if (letter !== '_' && letter !== '-' && !divs[i].dataset.animation) {
                divs[i].classList.add("bg-success");
                divs[i].classList.add("text-white");
                divs[i].innerHTML = letter;
            }
        }
    }
    sendLetter(ev) {
        if (ev.key < 'a' || ev.key > 'z') {
            return;
        }
        this.check(ev.key);
    }
    printHangman() {
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
    }
    check(letter) {
        try {
            this.game.check(letter);
            this.printLetter(this.game.getWord());
            let button = document.querySelector(`button[data-value='${letter}']`);
            switch (this.game.getWinner()) {
                case Winner.WIN:
                    this.setMessage("message", "You win!");
                    button.classList.remove("btn-secondary");
                    button.classList.add("btn-success");
                    break;
                case Winner.LOSE:
                    this.setMessage("message", "You lose!");
                    button.classList.remove("btn-secondary");
                    button.classList.add("btn-danger");
                    this.printHangman();
                    break;
                case Winner.WRONG_LETTER:
                    this.setMessage("message", "");
                    button.classList.remove("btn-secondary");
                    button.classList.add("btn-danger");
                    this.printHangman();
                    break;
                case Winner.CORRECT_LETTER:
                    this.setMessage("message", "");
                    button.classList.remove("btn-secondary");
                    button.classList.add("btn-success");
                    break;
            }
        } catch (ex) {
            console.log(ex.message);
        }
    }
}
let gui = new GUI();
gui.init();