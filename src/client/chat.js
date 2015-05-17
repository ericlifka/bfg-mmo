class Chat {
    constructor(connection) {
        this.connection = connection;

        this.createDocumentStructure();
        this.addEventListeners();
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

        this.pane = messagesPane;
        this.input = messageInput;

        chatFrame.appendChild(messagesPane);
        chatFrame.appendChild(messageInput);
        document.querySelector('body').appendChild(chatFrame);
    }

    addEventListeners() {
        this.connection.subscribe('chat-message', (...args) => this.newMessageEvent(...args));
        this.input.addEventListener('keypress', (...args) => this.keyPress(...args));
        this.input.addEventListener('focus', (...args) => this.focus(...args));
        this.input.addEventListener('blur', (...args) => this.blur(...args));
    }

    newMessageEvent() {
        console.log(arguments);
    }

    keyPress(event) {
        console.log('keyPress', arguments);
    }

    focus(event) {
        console.log('focus', event);
    }

    blur(event) {
        console.log('blur', event);
    }
}

export default Chat;
