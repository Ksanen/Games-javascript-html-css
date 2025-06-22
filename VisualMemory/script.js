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
        this.defaultSettings = {
            hearts: 3,
            numberOfFieldsToSelect: 3,
            numberOfRows: 3,
            numberOfColumns: 3,
            increaseDifficultyBoolean: true
        };
        this.settings = {
            hearts: this.defaultSettings.hearts,
            numberOfFieldsToSelect: this.defaultSettings.numberOfFieldsToSelect,
            numberOfRows: this.defaultSettings.numberOfRows,
            numberOfColumns: this.defaultSettings.numberOfColumns,
            increaseDifficultyBoolean: this.defaultSettings.increaseDifficultyBoolean
        };
        this.round = 1;
    }
    prepareBoard() {
        this.ui.generateBoard(this.settings.numberOfColumns, this.settings.numberOfRows);
        this.selectRandomFields();
        this.ui.showingFieldAnimation();
        this.ui.lockBoard();
    }
    startGame() {
        this.ui.upgradeHeartsCounter();
        this.ui.upgradeRoundCounter();
        this.prepareBoard();
        this.ui.changePage("game");
        this.ui.unlockButton(this.ui.buttons.stop);
        this.ui.lockButton(this.ui.buttons.next);
        this.ui.lockButton(this.ui.buttons.openSettings);
    }
    nextRound() {
        this.ui.lockButton(this.ui.buttons.next);
        this.round++;
        if (this.settings.increaseDifficultyBoolean) {
            this.increaseDifficulty();
        }
        this.unlockAllFields();
        this.ui.upgradeRoundCounter();
        this.prepareBoard();
    }
    increaseDifficulty() {
        if (this.round % 3 == 0) {
            this.settings.numberOfColumns++
            this.settings.numberOfRows++;
        }
        if (this.round % 2 == 0) {
            this.numberOfFieldsToSelect += 2;
        }
    }
    resetGame = () => {
        this.ui.changePage("start");
        this.ui.unlockButton(this.ui.buttons.openSettings);
        this.ui.lockButton(this.ui.buttons.next);
        this.ui.lockButton(this.ui.buttons.stop);
        this.round = 1;
        this.resetSettings();
        this.resetBoard();
    }
    resetBoard = () => {
        this.ui.clearTimeouts();
        this.ui.upgradeHeartsCounter();
        this.ui.upgradeRoundCounter();
        this.unlockAllFields();
        document.querySelector(`[page="game"]`).classList.remove("game--lose")
    }
    unlockAllFields() {
        this.fieldsThatAreBlocked.clear();
    }
    selectRandomFields() {
        const area = this.settings.numberOfColumns * this.settings.numberOfRows;
        while (this.fieldsToShow.size < this.settings.numberOfFieldsToSelect) {
            let randomNumber = Math.floor(Math.random() * area);
            this.fieldsToShow.add(randomNumber);
        }
    }
    decreaseHearts() {
        this.settings.hearts--;
        this.ui.upgradeHeartsCounter();
        if (this.settings.hearts === 0) {
            this.ui.lockBoard();
            document.querySelector(`[page="game"]`).classList.add("game--lose")
        }
    }
    resetSettings() {
        this.settings.hearts = this.defaultSettings.hearts;
        this.settings.numberOfFieldsToSelect = this.defaultSettings.numberOfFieldsToSelect;
        this.settings.numberOfRows = this.defaultSettings.numberOfRows;
        this.settings.numberOfColumns = this.defaultSettings.numberOfColumns;
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
        this.board = this.pages.game.querySelector(".game__board");
        this.roundCounter = document.getElementById("roundCounter");
        this.hearts = document.getElementById("hearts");
        this.timeouts = new Set();
        this.adjustSizeOfBoard();
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
        this.hearts.innerHTML = `Hearts: ${this.app.settings.hearts}`;
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
    adjustSizeOfBoard = () => {
        let width = document.querySelector(".game").getBoundingClientRect().width;
        width -= 50;
        document.querySelectorAll(".page").forEach((page) => {
            page.style.height = `${width}px`;
        })
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
        this.app.ui.pages.settings.addEventListener("change", this.optionHandler.bind(this));
        window.addEventListener('resize', this.app.ui.adjustSizeOfBoard);
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
                    this.app.defaultSettings.numberOfColumns = parseInt(value);
                    this.app.defaultSettings.numberOfRows = parseInt(value);
                    break;
                case "hearts":
                    this.app.defaultSettings.hearts = parseInt(value);
                    break;
                case "numberOfFields":
                    this.app.defaultSettings.numberOfFieldsToSelect = parseInt(value);
                    break;
                case "increaseDifficulty":
                    this.app.defaultSettings.increaseDifficultyBoolean = value === "1" ? true : false;
                    break;
            }
            this.app.resetSettings();
        }
    }

}
const visual = new VisualMemoryGame();