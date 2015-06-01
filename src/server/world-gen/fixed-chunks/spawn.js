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
            .grassSandPathHorizontal(10, 3, 40)
            .addSimpleHouse(0, 4)
            .addSimpleHouse(0, 9)
            .addSimpleHouse(0, 14)
            .addSimpleHouse(0, 26)
            .addSimpleHouse(0, 31)
            .addSimpleHouse(0, 36)
            .addSimpleHouse(12, 4)
            .addSimpleHouse(12, 9)
            .addSimpleHouse(12, 14)
            .addSimpleHouse(12, 26)
            .addSimpleHouse(12, 31)
            .addSimpleHouse(12, 36)
            .padWithWater(10)
            .generateChunk();
    },

    playerStartPosition() {
        return {x: 410, y: 965};
    }
};

export default Spawn;
