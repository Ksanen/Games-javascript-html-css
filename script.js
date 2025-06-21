class VisualMemoryGame {
    constructor() {
        this.ui = new UIManager(this);
        this.event = new EventManager(this);
        this.round = 0;
        this.numberOfColumns = 5;
        this.numberOfRows = 5;
    }
    startGame() {
        this.ui.changePage("game");
        this.ui.lockButton(this.ui.buttons.next);
        this.ui.lockButton(this.ui.buttons.openSettings);
        this.ui.generateBoard(this.numberOfColumns, this.numberOfRows);
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
    generateBoard(columns, rows) {
        this.board.innerHTML = "";
        this.board.style.gridTemplateColumns = `repeat(${columns},1fr)`;
        this.board.style.gridTemplatRows = `repeat(${rows},1fr)`;
        const area = columns * rows;
        for (let i = 0; i < area; i++) {
            const field = document.createElement("div");
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
    }
}
const visual = new VisualMemoryGame();