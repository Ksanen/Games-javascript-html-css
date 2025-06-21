class VisualMemoryGame {
    constructor() {
        this.ui = new UIManager(this);
        this.event = new EventManager(this);
        this.round = 0;
    }
    startGame() {
        this.ui.changePage("game");
        this.ui.lockButton(this.ui.buttons.next);
        this.ui.lockButton(this.ui.buttons.openSettings);
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