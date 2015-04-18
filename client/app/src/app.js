import Test from './test';
import Game from './game';

class App {
    constructor() {
        Test.test();
        var game = new Game.Game();
    }
}

export default new App();
