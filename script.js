class VisualMemoryGame {
    constructor() {
        this.ui = new UIManager(this);
        this.event = new EventManager(this);
    }
}
class UIManager {
    constructor(app) {
        this.app = app;
        this.pages = {
            game: document.querySelector(`[page="game"`),
            gameOver: document.querySelector(`[page="game-over"`),
            settings: document.querySelector(`[page="settings"`),
            start: document.querySelector(`[page="start"`)
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
}
class EventManager {
    constructor(app) {
        this.app = app;
    }
}
const visual = new VisualMemoryGame();