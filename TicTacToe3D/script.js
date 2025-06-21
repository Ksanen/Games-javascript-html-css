class EventManager {
    constructor(app) {
        this.app = app;
        this.addRotation();
        this.addEventsToButtons();
    }
    addRotation() {
        this.isRotating = false;
        this.startClientX = 37;
        this.endRotateValue = 37;
        const container = document.querySelector(".container");
        container.addEventListener("mousedown", this.startRotating);
        container.addEventListener("mousemove", this.rotating);
        container.addEventListener("mouseup", this.stopRotating);

        document.querySelector(".box").addEventListener("mousedown", (e) => e.stopPropagation())
        document.querySelector(".buttons").addEventListener("mousedown", (e) => e.stopPropagation())
    }
    addEventsToButtons() {
        document.querySelector(".next-btn").addEventListener("click", () => this.app.nextRound());
        document.querySelector(".reset-btn").addEventListener("click", () => this.app.reset());
    }
    rotating = (e) => {
        if (this.isRotating) {
            document.querySelector(".box").style.transform = `rotateX(70deg) rotateZ(${this.endRotateValue + this.startClientX - e.clientX}deg)`;
        }
    }
    startRotating = (e) => {
        this.isRotating = true;
        this.startClientX = e.clientX;
    }
    stopRotating = (e) => {
        this.isRotating = false;
        this.endRotateValue = this.startClientX - e.clientX + this.endRotateValue;
    }
}
class UIManager {
    constructor(app) {
        this.app = app;
        this.turnHTML = document.getElementsByClassName("turn")[0];
    }
    showResult(resultText) {
        document.querySelector(".result").innerHTML = resultText;
    }
    updateWinner(winner) {
        document.getElementById("winner").innerHTML = winner === "" ? "" : `Wygrywa <span class=${winner}>${winner}</span>`;
    }
    clearTurn(turn) {
        this.turnHTML.classList.remove(turn);
    }
    updateTurn(turn) {
        this.turnHTML.classList.add(turn);
        this.turnHTML.innerHTML = turn;
    }
    clearFields() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 8; j++) {
                this.app.layers[i][j].blockade = false;
                this.app.layers[i][j].elementHTML.classList.remove("X", "O", "field--victory");
                this.app.layers[i][j].elementHTML.innerHTML = "";
            }
        }
    }
    highlightWinnerFields() {
        [...arguments].forEach((arg) => {
            this.app.layers[arg[0]][arg[1]].elementHTML.classList.add("field--victory");
        })
        /* 
        arg[0] - index layera
        arg[1] - index pola w tym layerze
        przykład :
         this.app.layers[arg[0]][arg[1]]
         this.app.layers[0][0] - uchwyci pierwsze pole z pierwszej warstwy
        */
    }
    lockBtn(btn) {
        document.querySelector(`.${btn}`).classList.add("btn--disactive")

    }
    unlockBtn(btn) {
        document.querySelector(`.${btn}`).classList.remove("btn--disactive")
    }
}
class Game {
    constructor() {
        this.layers = []
        this.points = {
            X: 0,
            O: 0
        }
        this.ui = new UIManager(this);
        this.event = new EventManager(this);
        this.layerBoxes = Array.from(document.getElementsByClassName("layer-box"));
        for (let i = 0; i < 3; i++) {
            this.layers[i] = [];
            let fields = Array.from(this.layerBoxes[i].getElementsByClassName("field"));
            for (let j = 0; j < 8; j++) {
                this.layers[i].push(
                    {
                        elementHTML: fields[j],
                        blockade: false
                    }
                )
                fields[j].addEventListener("click", () => this.move(this.layers[i][j]));
            }
        }
        this.startGame();
    }
    changeTurn() {
        this.ui.clearTurn();
        this.turn = this.turn === "X" ? "O" : "X";
        this.ui.updateTurn(this.turn);
    }
    move(element) {
        if (element.blockade === false) {
            element.elementHTML.innerHTML = this.turn;
            element.blockade = true;
            element.elementHTML.classList.add(this.turn);
            if (this.checkVictoryConditions(this.turn)) {
                this.addABlockadeToAllFields();
                this.updateResult();
                this.ui.updateWinner(this.turn);
                this.ui.unlockBtn("next-btn");
            }
            this.changeTurn();
        }
    }
    reset() {
        this.ui.clearFields();
        this.resetPoints();
        this.ui.lockBtn("next-btn");
        this.startGame();
    }
    resetPoints() {
        this.points.X = 0;
        this.points.O = 0;
    }
    startGame() {
        this.turn = this.randomTurn();
        this.turnPrevious = this.turn;
        this.updateResult();
    }
    nextRound() {
        this.ui.clearFields();
        this.turnPrevious = this.turnPrevious === "X" ? "O" : "X";
        this.updateResult();
        this.ui.lockBtn("next-btn");
    }
    updateResult() {
        this.ui.showResult(` : ${this.points.O} - ${this.points.X} : `);
        this.turn = this.turnPrevious;
        this.ui.updateTurn(this.turn);
        this.ui.updateWinner("");
    }
    randomTurn() {
        let number = Math.round(Math.random() * (2 - 1) + 1);
        switch (number) {
            case 1: return ("X");
            case 2: return ("O");
        }
    }
    addABlockadeToAllFields() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 8; j++) {
                this.layers[i][j].blockade = true;
            }
        }
    }
    checkVictoryConditions(turn) {
        for (let i = 0; i < 3; i++) {
            let elementsHTML = this.layers[i].map((element) => element.elementHTML.innerHTML);
            if (elementsHTML[0] === turn && elementsHTML[1] === turn && elementsHTML[2] === turn) {
                this.points[turn]++;
                this.ui.highlightWinnerFields([i, 0], [i, 1], [i, 2])
                return true;
            }
            if (elementsHTML[5] === turn && elementsHTML[6] === turn && elementsHTML[7] === turn) {
                this.points[turn]++;
                this.ui.highlightWinnerFields([i, 5], [i, 6], [i, 7])
                return true;
            }
            if (elementsHTML[0] === turn && elementsHTML[3] === turn && elementsHTML[5] === turn) {
                this.points[turn]++;
                this.ui.highlightWinnerFields([i, 0], [i, 3], [i, 5])
                return true;
            }
            if (elementsHTML[2] === turn && elementsHTML[4] === turn && elementsHTML[7] === turn) {
                this.points[turn]++;
                this.ui.highlightWinnerFields([i, 2], [i, 4], [i, 7])
                return true;
            }
        }
        for (let i = 0; i < 8; i++) {
            let elementsHTML = [];
            elementsHTML[0] = this.layers[0][i].elementHTML.innerHTML;
            elementsHTML[1] = this.layers[1][i].elementHTML.innerHTML;
            elementsHTML[2] = this.layers[2][i].elementHTML.innerHTML;
            if (elementsHTML[0] === turn && elementsHTML[1] === turn && elementsHTML[2] === turn) {
                this.points[turn]++;
                this.ui.highlightWinnerFields([0, i], [1, i], [2, i])
                return true;
            }
        }

        return false;
    }

}
let game = new Game();