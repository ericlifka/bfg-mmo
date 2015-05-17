class Chat {
    constructor(connection) {
        this.connection = connection;

        this.createDocumentStructure();
        this.connection.subscribe('chat-message', (...args) => this.newMessageEvent(...args));
    }

    createDocumentStructure() {
        const chatFrame = document.createElement('div');
        chatFrame.classList.add('chat-frame');

        const messagesPane = document.createElement('div');
        messagesPane.classList.add('messages-pane');

        const messageInput = document.createElement('input');
        messageInput.classList.add('message-input');
        messageInput.setAttribute('type', 'text');
        messageInput.setAttribute('placeholder', 'Send message');

        chatFrame.appendChild(messagesPane);
        chatFrame.appendChild(messageInput);
        document.querySelector('body').appendChild(chatFrame);
    }

    newMessageEvent() {
        console.log(arguments);
    }
}

export default Chat;
