class Chat {
    constructor(connection) {
        this.connection = connection;

        this.createDocumentStructure();
        this.connection.subscribe('chat-message', (...args) => this.newMessageEvent(...args));
    }

    createDocumentStructure() {

    }

    newMessageEvent() {
        console.log(arguments);
    }
}

export default Chat;
