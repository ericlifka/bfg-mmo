import Game from './client/game';

class ClientApp {
    constructor() {
        let game = new Game(document.body);
        game.start();
    }
}

export default new ClientApp();
