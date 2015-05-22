import ChunkBuilder from '../chunk-builder';

const Spawn = {
    getTileData() {
        return ChunkBuilder
            .newEmpty()
            .fillSquare('B03', {
                width: 40,
                height: 20
            })
            .addCoast()
            .addSimpleHouse(0, 5)
            .addSimpleHouse(0, 10)
            .addSimpleHouse(0, 15)
            .addSimpleHouse(0, 20)
            .addSimpleHouse(0, 25)
            .padWithWater(10)
            .generateChunk();
    },

    playerStartPosition() {
        return {x: 410, y: 965};
    }
};

export default Spawn;
