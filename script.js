class VisualMemoryGame {
    constructor() {
        this.ui = new UIManager(this);
        this.event = new EventManager(this);
    }
}
class UIManager {
    constructor(app) {
        this.app = app;
    }
}
class EventManager {
    constructor(app) {
        this.app = app;
    }
}