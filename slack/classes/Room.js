class Room {
    constructor(id, title, namespaceId, privateRoom = false) {
        this.id = id;
        this.title = title;
        this.namespaceId = namespaceId;
        this.privateRoom = privateRoom;
        this.history = [];
    }

    addMessage(message) {
        this.history.push(message);
    }

    clearHistory() {
        this.history = [];
    }
}

module.exports = Room;