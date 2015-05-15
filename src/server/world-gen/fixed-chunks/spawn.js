import ChunkBuilder from '../chunk-builder';

const Spawn = {
    getTileData() {
        return ChunkBuilder
            .newEmpty()
            .fillSquare('B03', {
                width: 4,
                height: 5
            })
            .addCoast()
            .padWithWater(10)
            .generateChunk();
    },

    playerStartPosition() {
        return {x: 100, y: 100};
    }
};

export default Spawn;
