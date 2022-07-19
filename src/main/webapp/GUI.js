class GUI {
    constructor() {
        this.xhr = new XMLHttpRequest();
        this.ctx = null;
        this.c = null;
        this.type = "REST";
    }
    init() {
        this.c = document.getElementById("hang");
        let button = document.querySelector("input[type='button']");
        button.onclick = this.start.bind(this);
        this.start();
    }
    setMessage(id, msg) {
        let f = document.getElementById(id);
        f.innerHTML = msg;
    }
    start() {
        document.onkeyup = this.sendLetter.bind(this);
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
        this.xhr.onload = () => {
            let obj = JSON.parse(this.xhr.responseText);
            this.print("word", obj.word);
        };
        let select = document.querySelector("#lang");
        let formData = new FormData();
        formData.append("value", select.value);
        if (this.type == "Servlet") {
            this.xhr.open("post", "ServletForca");
            this.xhr.send(formData);
        } else {
            this.xhr.open("post", "webresources/hangman");
            this.xhr.setRequestHeader("Content-Type", "application/json");
            this.xhr.send(JSON.stringify(Object.fromEntries(formData)));
        }
    }
    print(id, vector) {
        let str = "";
        for (const letter of vector) {
            str += " " + letter;
        }
        this.setMessage(id, str);
    }
    sendLetter(ev) {
        if (ev.key >= 'a' && ev.key <= 'z') {
            this.xhr.onload = () => {
                let obj = JSON.parse(this.xhr.responseText);
                this.print("word", obj.word);
                this.print("letters", obj.wrongChars);
                switch (obj.winner) {
                    case "WIN":
                        this.setMessage("message", "You win!");
                        break;
                    case "LOSE":
                        document.onkeyup = undefined;
                        this.setMessage("message", "You lose!");
                    case "WRONG_LETTER":
                        switch (obj.wrongChars.length) {
                            case 1:
                                /* Cabeça */
                                this.ctx.beginPath();
                                this.ctx.arc(70, 40, 10, 0, 2 * Math.PI);
                                this.ctx.stroke();
                                break;
                            case 2:
                                /* Tronco */
                                this.ctx.moveTo(70, 50);
                                this.ctx.lineTo(70, 80);
                                this.ctx.stroke();
                                break;
                            case 3:
                                /* Braço esquerdo */
                                this.ctx.moveTo(70, 60);
                                this.ctx.lineTo(50, 60);
                                this.ctx.stroke();
                                break;
                            case 4:
                                /* Braço direito */
                                this.ctx.moveTo(70, 60);
                                this.ctx.lineTo(90, 60);
                                this.ctx.stroke();
                                break;
                            case 5:
                                /* Perna esquerda */
                                this.ctx.moveTo(70, 80);
                                this.ctx.lineTo(50, 100);
                                this.ctx.stroke();
                                break;
                            case 6:
                                /* Perna direita */
                                this.ctx.moveTo(70, 80);
                                this.ctx.lineTo(90, 100);
                                this.ctx.stroke();
                                break;
                        }
                        break;
                    case "CORRECT_LETTER":
                        break;
                }
            };
            let formData = new FormData();
            formData.append("value", ev.key);
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
}
let gui = new GUI();
gui.init();
