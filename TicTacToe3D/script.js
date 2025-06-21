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
        const layerRowCombos = [
            [[0, 0], [0, 1], [0, 2]],
            [[0, 5], [0, 6], [0, 7]],
            [[0, 0], [0, 3], [0, 5]],
            [[0, 2], [0, 4], [0, 7]],
        ];
        for (let layer = 0; layer < 3; layer++) {
            for (const pattern of layerRowCombos) {
                const combo = pattern.map(([_, col]) => [layer, col]);
                if (combo.every(([l, c]) => this.layers[l][c].elementHTML.innerHTML === turn)) {
                    this.points[turn]++;
                    this.ui.highlightWinnerFields(...combo);
                    return true;
                }
            }
        }
        for (let col = 0; col < 8; col++) {
            const combo = [[0, col], [1, col], [2, col]];
            if (combo.every(([l, c]) => this.layers[l][c].elementHTML.innerHTML === turn)) {
                this.points[turn]++;
                this.ui.highlightWinnerFields(...combo);
                return true;
            }
        }
        const diagonalCombos = [
            [[0, 0], [1, 1], [2, 2]],
            [[2, 0], [1, 1], [0, 2]],
            [[0, 5], [1, 6], [2, 7]],
            [[0, 7], [1, 6], [2, 5]],
            [[0, 7], [1, 4], [2, 2]],
            [[0, 2], [1, 4], [2, 7]],
            [[0, 0], [1, 3], [2, 5]],
            [[0, 5], [1, 3], [2, 0]],
        ];
        for (const combo of diagonalCombos) {
            if (combo.every(([l, c]) => this.layers[l][c].elementHTML.innerHTML === turn)) {
                this.points[turn]++;
                this.ui.highlightWinnerFields(...combo);
                return true;
            }
        }
        return false;
    }

}
let game = new Game();