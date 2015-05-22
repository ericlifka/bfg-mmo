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
            .addSimpleHouse(10, 5)
            .addSimpleHouse(10, 10)
            .addSimpleHouse(10, 15)
            .addSimpleHouse(10, 20)
            .addSimpleHouse(10, 25)
            .padWithWater(10)
            .generateChunk();
    },

    playerStartPosition() {
        return {x: 410, y: 965};
    }
};

export default Spawn;
