import ChunkGenerator from './chunk-generator';

let TILE_TYPES = [
    'B03', 'F22'
];

export default class Chunk {
    constructor(id) {
        this.id = id;
        let bounds = {
            upperLeft: {
                x: (32 * -50),
                y: (32 * 50)
            },
            lowerRight: {
                x: (32 * 50),
                y: (32 * -50)
            }
        };
        let generator = new ChunkGenerator(TILE_TYPES, bounds);
        this.tiles = generator.generate();
        this.players = new Set();
        this.updates = [];
    }

    serialize() {
        return {
            id: this.id,
            tiles: this.tiles
        };
    }
}
