class VisualMemoryGame {
    constructor() {
        this.ui = new UIManager(this);
        this.event = new EventManager(this);
        this.round = 0;
        this.hearts = 0;
        this.ui.upgradeHeartsCounter();
        this.ui.upgradeRoundCounter();
        this.numberOfColumns = 5;
        this.numberOfRows = 5;
    }
    startGame() {
        this.ui.changePage("game");
        this.ui.lockButton(this.ui.buttons.next);
        this.ui.lockButton(this.ui.buttons.openSettings);
        this.ui.generateBoard(this.numberOfColumns, this.numberOfRows);
        this.ui.lockBoard();
    }
    nextRound() {
        this.round++;
    }
    resetGame() {
        this.ui.changePage("start");
        this.ui.unlockButton(this.ui.buttons.next);
        this.ui.unlockButton(this.ui.buttons.openSettings);
        this.round = 0;
    }

}
class UIManager {
    constructor(app) {
        this.app = app;
        this.pages = {
            game: document.querySelector(`[page="game"]`),
            gameOver: document.querySelector(`[page="game-over"]`),
            settings: document.querySelector(`[page="settings"]`),
            start: document.querySelector(`[page="start"]`)
        }
        this.buttons = {
            start: document.querySelector(".btn--start"),
            next: document.querySelector(".btn--next"),
            reset: document.querySelector(".btn--reset"),
            openSettings: document.querySelector(".btn--settings")
        }
        this.board = this.pages.game.querySelector(".game_board");
        this.roundCounter = document.getElementById("roundCounter");
        this.hearts = document.getElementById("hearts");
    }
    changePage(newPage) {
        for (const page in this.pages) {
            if (this.pages[page].getAttribute("page") === newPage) {
                this.showPage(this.pages[page]);
            }
            else {
                this.hidePage(this.pages[page]);
            }
        }
    }
    upgradeRoundCounter() {
        this.roundCounter.innerHTML = `Round: ${this.app.round}`;
    }
    upgradeHeartsCounter() {
        this.hearts.innerHTML = `Hearts: ${this.app.hearts}`;
    }
    selectField(field) {
        field.classList.add("field--selected");
    }
    hidePage(page) {
        page.classList.add("page--invisible");
    }
    showPage(page) {
        page.classList.remove("page--invisible");
    }
    openSettings() {
        this.ui.changePage("settings");
    }
    lockButton(button) {
        button.classList.add("btn--locked")
    }
    unlockButton(button) {
        button.classList.remove("btn--locked")
    }
    lockBoard() {
        this.board.classList.add("game_board--locked");
    }
    unlockBoard() {
        this.board.classList.remove("game_board--locked");
    }
    generateBoard(columns, rows) {
        this.board.innerHTML = "";
        this.board.style.gridTemplateColumns = `repeat(${columns},1fr)`;
        this.board.style.gridTemplatRows = `repeat(${rows},1fr)`;
        const area = columns * rows;
        for (let i = 0; i < area; i++) {
            const field = document.createElement("div");
            field.setAttribute("field-number", i);
            field.classList.add("field");
            this.board.appendChild(field);
        }
    }
}
class EventManager {
    constructor(app) {
        this.app = app;
        this.app.ui.buttons.start.addEventListener("click", this.app.startGame.bind(this.app));
        this.app.ui.buttons.next.addEventListener("click", this.app.nextRound.bind(this.app));
        this.app.ui.buttons.reset.addEventListener("click", this.app.resetGame.bind(this.app));
        this.app.ui.buttons.openSettings.addEventListener("click", this.app.ui.openSettings.bind(this.app));
        this.app.ui.board.addEventListener("click", this.boardHandler)
    }
    boardHandler(e) {
        const field = e.target.closest(".field");
        if (field) {
            this.fieldHandler(field);
        }
    }
    fieldHandler(field) {
        this.app.ui.selectField(field);
    }
}
const visual = new VisualMemoryGame();