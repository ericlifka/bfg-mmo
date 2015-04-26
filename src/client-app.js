import Game from './client/game';
import Auth from './client/auth';

const game = new Game(document.body);
Auth.authenticate(() => game.start());

export default game;
