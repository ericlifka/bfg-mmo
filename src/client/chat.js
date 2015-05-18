const ENTER_KEY = 13;
const ESCAPE = 27;

class Chat {
    constructor(connection, inputController) {
        this.connection = connection;
        this.inputController = inputController;

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
        this.input.addEventListener('keyup', (...args) => this.keyUp(...args));
        this.input.addEventListener('focus', (...args) => this.focus(...args));
        this.input.addEventListener('blur', (...args) => this.blur(...args));
    }

    newMessageEvent({message, from}) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.innerHTML = `<span class="user">${from}</span>${message}`;

        this.pane.appendChild(messageDiv);

        this.scrollToBottom();
    }

    scrollToBottom() {
        this.pane.scrollTop = this.pane.scrollHeight;
    }

    keyPress(event) {
        if (event.keyCode === ENTER_KEY) {
            event.preventDefault();
            event.stopPropagation();

            const message = this.input.value;
            this.input.value = "";
            this.connection.sendImmediate('chat-message', {message});
        }
    }

    keyUp(event) {
        if (event.keyCode === ESCAPE) {
            this.input.blur();
        }
    }

    focus(event) {
        this.inputController.pauseInputCapture();
    }

    blur(event) {
        this.inputController.resumeInputCapture();
    }
}

export default Chat;
