import ChunkGenerator from './chunk-generator';
import spawn from './fixed-chunks/spawn';

const TILE_TYPES = [
    'B03', 'F22'
];

const FIXED_CHUNKS = { spawn };

export default class Chunk {
    constructor(id) {
        this.id = id;
        this.players = new Set();
        this.updates = [];

        if (FIXED_CHUNKS.hasOwnProperty(id)) {

            this.generator = FIXED_CHUNKS[id];

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
            this.generator = new ChunkGenerator(TILE_TYPES, bounds);

        }

        this.tiles = this.generator.getTileData();
    }

    playerEntered(player) {
        player.chunk = this.id;
        this.players.add(player.name);
        if (!player.position) {
            player.position = this.generator.playerStartPosition();
        }
    }

    serialize() {
        return {
            id: this.id,
            tiles: this.tiles
        };
    }
}
