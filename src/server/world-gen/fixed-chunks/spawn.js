import ChunkBuilder from '../chunk-builder';

const Spawn = {
    getTileData() {
        return ChunkBuilder
            .newEmpty()
            .fillSquare('B03', {
                width: 40,
                height: 20
            })
            .addSimpleHouse(5, 5)
            .addCoast()
            .padWithWater(10)
            .generateChunk();
    },

    playerStartPosition() {
        return {x: 410, y: 965};
    }
};

export default Spawn;
