import ChunkGenerator from './chunk-generator';

const TILE_TYPES = [
    'B03', 'F22'
];

const FIXED_CHUNKS = {
    spawn: {
        generate() {
            return [];
        }
    }
};

export default class Chunk {
    constructor(id) {
        this.id = id;
        this.players = new Set();
        this.updates = [];

        let generator;
        if (FIXED_CHUNKS.hasOwnProperty(id)) {

            generator = FIXED_CHUNKS[id];
            this.tiles = generator.generate();

        } else {

            const bounds = {
                upperLeft: {
                    x: (32 * -50),
                    y: (32 * 50)
                },
                lowerRight: {
                    x: (32 * 50),
                    y: (32 * -50)
                }
            };
            generator = new ChunkGenerator(TILE_TYPES, bounds);

        }

        this.tiles = generator.generate();
    }

    serialize() {
        return {
            id: this.id,
            tiles: this.tiles
        };
    }
}
