import ChunkBuilder from '../chunk-builder';

const Spawn = {
    getTileData: () =>
        ChunkBuilder
            .newEmpty()
            .fillSquare('B03', {
                width: 4,
                height: 5
            })
            .addCoast()
            .padWithWater(10)
            .generateChunk()
};

export default Spawn;
