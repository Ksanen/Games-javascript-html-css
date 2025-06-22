class VisualMemoryGame {
    constructor() {
        this.fieldsThatAreBlocked = new Set();
        this.fieldsToShow = new Set();
        this.animation = {
            showFieldDelay: 1000,
            showFieldAnimationTime: 500,
            showFieldTime: 2000
        }
        this.ui = new UIManager(this);
        this.event = new EventManager(this);
        this.round = 1;
        this.hearts = 3;
        this.numberOfFieldsToSelect = 3;
        this.numberOfColumns = 3;
        this.numberOfRows = 3;
        this.increaseDifficultyBoolean = true;
    }
    prepareBoard() {
        this.ui.generateBoard(this.numberOfColumns, this.numberOfRows);
        this.selectRandomFields();
        this.ui.showingFieldAnimation();
        this.ui.lockBoard();
    }
    startGame() {
        this.ui.upgradeHeartsCounter();
        this.ui.upgradeRoundCounter();
        this.prepareBoard();
        this.ui.changePage("game");
        this.ui.lockButton(this.ui.buttons.next);
        this.ui.lockButton(this.ui.buttons.openSettings);
    }
    nextRound() {
        this.ui.lockButton(this.ui.buttons.next);
        this.round++;
        if (this.increaseDifficultyBoolean) {
            this.increaseDifficulty();
        }
        this.unlockAllFields();
        this.ui.upgradeRoundCounter();
        this.prepareBoard();
    }
    increaseDifficulty() {
        if (this.round % 3 == 0) {
            this.numberOfColumns++
            this.numberOfRows++;
        }
        if (this.round % 2 == 0) {
            this.numberOfFieldsToSelect += 2;
        }
    }
    resetGame = () => {
        this.ui.changePage("start");
        this.ui.unlockButton(this.ui.buttons.openSettings);
        this.ui.lockButton(this.ui.buttons.next);
        this.round = 0;
        this.hearts = 3;
        this.resetBoard();
    }
    resetBoard = () => {
        this.ui.upgradeHeartsCounter();
        this.ui.upgradeRoundCounter();
        this.unlockAllFields();
        this.ui.clearTimeouts();
        document.querySelector(`[page="game"]`).classList.remove("game--lose")
    }
    unlockAllFields() {
        this.fieldsThatAreBlocked.clear();
    }
    selectRandomFields() {
        const area = this.numberOfColumns * this.numberOfRows;
        while (this.fieldsToShow.size < this.numberOfFieldsToSelect) {
            let randomNumber = Math.floor(Math.random() * area);
            this.fieldsToShow.add(randomNumber);
        }
    }
    decreaseHearts() {
        this.hearts--;
        this.ui.upgradeHeartsCounter();
        if (this.hearts === 0) {
            this.ui.lockBoard();
            document.querySelector(`[page="game"]`).classList.add("game--lose")
        }
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
            stop: document.querySelector(".btn--stop"),
            openSettings: document.querySelector(".btn--settings"),
            closeSettings: document.querySelector(".btn--close-settings")
        }
        this.board = this.pages.game.querySelector(".game_board");
        this.roundCounter = document.getElementById("roundCounter");
        this.hearts = document.getElementById("hearts");
        this.timeouts = new Set();
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
    lockButton = (button) => {
        button.classList.add("btn--locked")
    }
    unlockButton = (button) => {
        button.classList.remove("btn--locked")
    }
    lockBoard = () => {
        this.board.classList.add("game_board--locked");
    }
    unlockBoard = () => {
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
            field.style.transition = `all ${this.app.animation.showFieldAnimationTime}ms ease`;
            this.board.appendChild(field);
        }
    }
    showingFieldAnimation = () => {
        this.showFields();
        const delayTimeToHide = this.app.animation.showFieldTime + this.app.animation.showFieldAnimationTime;
        const hideFieldsTimeout = setTimeout(this.hideFields, delayTimeToHide);
        const unlockBoardTimeout = setTimeout(this.unlockBoard, delayTimeToHide);
        this.timeouts.add(hideFieldsTimeout);
        this.timeouts.add(unlockBoardTimeout);
    }
    showFields = () => {
        const showFieldTimeout = setTimeout(() => {
            this.app.fieldsToShow.forEach((fieldToShow) => {
                this.board.querySelector(`[field-number="${fieldToShow}"]`).classList.add("field--show")
            })
        }, this.app.animation.showFieldDelay)
        this.timeouts.add(showFieldTimeout);
    }
    hideFields = () => {
        this.app.fieldsToShow.forEach((fieldToShow) => {
            this.board.querySelector(`[field-number="${fieldToShow}"]`).classList.remove("field--show")
        })
    }
    clearTimeouts = () => {
        this.timeouts.forEach(timeout => clearTimeout(timeout));
        this.timeouts.clear();
    }
}
class EventManager {
    constructor(app) {
        this.app = app;
        this.app.ui.buttons.start.addEventListener("click", this.app.startGame.bind(this.app));
        this.app.ui.buttons.next.addEventListener("click", this.app.nextRound.bind(this.app));
        this.app.ui.buttons.stop.addEventListener("click", this.app.resetGame.bind(this.app));
        this.app.ui.buttons.closeSettings.addEventListener("click", () => this.app.ui.changePage("start"))
        this.app.ui.buttons.openSettings.addEventListener("click", () => this.app.ui.changePage("settings"));
        this.app.ui.board.addEventListener("click", this.boardHandler.bind(this));
        this.app.ui.pages.settings.addEventListener("change", this.optionHandler.bind(this))
    }
    boardHandler = (e) => {
        const field = e.target.closest(".field");
        if (field) {
            this.fieldHandler(field);
        }
    }
    fieldHandler = (field) => {
        const fieldNumber = field.getAttribute("field-number");
        if (!this.app.fieldsThatAreBlocked.has(fieldNumber)) {
            this.app.fieldsThatAreBlocked.add(fieldNumber);
            const numberOfField = parseInt(field.getAttribute("field-number"));
            if (!this.app.fieldsToShow.has(numberOfField)) {
                field.classList.add("field--wrong");
                this.app.decreaseHearts();
            }
            else {
                this.app.ui.selectField(field);
                this.app.fieldsToShow.delete(numberOfField);
            }
            if (this.app.fieldsToShow.size === 0) {
                this.app.ui.unlockButton(this.app.ui.buttons.next);
                this.app.ui.lockBoard();
            }
        }
    }
    optionHandler = (e) => {
        const option = e.target.closest("[option]");
        if (option) {
            const value = option.value;
            switch (option.getAttribute("option")) {
                case "sizeOfBoard":
                    this.app.numberOfColumns = parseInt(value);
                    this.app.numberOfRows = parseInt(value);
                    break;
                case "hearts":
                    this.app.hearts = parseInt(value);
                    break;
                case "numberOfFields":
                    this.app.numberOfFieldsToSelect = parseInt(value);
                    break;
                case "increaseDifficulty":
                    this.app.increaseDifficultyBoolean = value === "1" ? true : false;
                    break;
            }
        }
    }
}
const visual = new VisualMemoryGame();