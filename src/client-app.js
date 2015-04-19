import Test from './client/test';
import Game from './client/game';

class ClientApp {
    constructor() {
        Test.test();
        var game = new Game.Game();
    }
}

export default new ClientApp();
