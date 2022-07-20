class GUI {
    constructor() {
        this.xhr = new XMLHttpRequest();
        this.ctx = null;
        this.c = document.getElementById("hang");
        this.select = document.querySelector("#lang");
        this.keys = document.querySelectorAll("button");
        this.type = "REST";
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
        document.onkeyup = this.sendLetter.bind(this);
        this.keys.forEach(k => k.className = "");
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
        this.xhr.onload = () => {
            let obj = JSON.parse(this.xhr.responseText);
            this.printBoxes(obj.word);
        };
        let formData = new FormData();
        formData.append("value", this.select.value);
        if (this.type == "Servlet") {
            this.xhr.open("post", "ServletForca");
            this.xhr.send(formData);
        } else {
            this.xhr.open("post", "webresources/hangman");
            this.xhr.setRequestHeader("Content-Type", "application/json");
            this.xhr.send(JSON.stringify(Object.fromEntries(formData)));
        }
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
                divs[i].dataset.animation = "flip";
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
    printHangman(errors) {
        switch (errors) {
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
        if (letter < 'a' || letter > 'z') {
            return;
        }
        this.xhr.onload = () => {
            let obj = JSON.parse(this.xhr.responseText);
            this.printLetter(obj.word);
            let button = document.querySelector(`button[data-value='${letter}']`);
            switch (obj.winner) {
                case "WIN":
                    this.setMessage("message", "You win!");
                    button.className = "present";
                    break;
                case "LOSE":
                    this.setMessage("message", "You lose!");
                    button.className = "absent";
                    this.printHangman(obj.wrongChars.length);
                    break;
                case "WRONG_LETTER":
                    this.setMessage("message", "");
                    button.className = "absent";
                    this.printHangman(obj.wrongChars.length);
                    break;
                case "CORRECT_LETTER":
                    this.setMessage("message", "");
                    button.className = "present";
                    break;
            }
        };
        let formData = new FormData();
        formData.append("value", letter);
        if (this.type == "Servlet") {
            this.xhr.open("put", "ServletForca");
            this.xhr.send(formData);
        } else {
            this.xhr.open("put", "webresources/hangman");
            this.xhr.setRequestHeader("Content-Type", "application/json");
            this.xhr.send(JSON.stringify(Object.fromEntries(formData)));
        }
    }
}
let gui = new GUI();
gui.init();
