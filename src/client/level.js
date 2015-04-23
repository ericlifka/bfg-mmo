class Tile {
    constructor(position, type) {
        this.position = position;
        // We would want to have an option for tile frames in order to create
        // an animated tile
        this.sprite = PIXI.Sprite.fromFrame(type);
        this.height = 32;
        this.width = 32;
    }
}

let TILE_TYPES = ['B03', 'F22'];

export default class Level {
    constructor(level_data) {
        // Yeah, level data from the server ideally but for now we're just
        // going to fake a bunch of tiles.
        this.tiles = [];
        this.generateTiles();
    }

    generateTiles() {
        // Dumb tile generation just to get something on screen.
        for (let i = -100; i <= 100; i++) {
            for (let j = -100; j <= 100; j++) {
                let position = {
                    "x": (i * 32),
                    "y": (j * 32)
                };
                let selected = _.random(1);
                let tile = new Tile(position, TILE_TYPES[selected]);
                this.tiles.push(tile);
            }
        }
    }
}
