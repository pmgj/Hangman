class GUI {
    constructor() {
        this.xhr = new XMLHttpRequest();
        this.ctx = null;
        this.c = null;
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
            let str = "";
            for (const letter of obj.word) {
                str += " " + letter;
            }
            this.setMessage("word", str);
        };
        let select = document.querySelector("#lang");
        this.xhr.open("post", "ServletForca");
        let formData = new FormData();
        formData.append("lang", select.value);
        this.xhr.send(formData);
    }
    sendLetter(ev) {
        if (ev.key >= 'a' && ev.key <= 'z') {
            this.xhr.onload = () => {
                let obj = JSON.parse(this.xhr.responseText);
                let str = "";
                for (const letter of obj.word) {
                    str += " " + letter;
                }
                this.setMessage("word", str);
                str = "Letters: ";
                for (let i = 0; i < obj.wrongChars.length; i++) {
                    str += " " + obj.wrongChars[i] + " ";
                }
                this.setMessage("letters", str);
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
            this.xhr.open("put", "ServletForca");
            let formData = new FormData();
            formData.append("letter", ev.key);
            this.xhr.send(formData);
        }
    }
}
let gui = new GUI();
gui.init();
