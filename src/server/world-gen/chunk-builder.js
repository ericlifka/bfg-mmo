//
//  This class wraps composable pieces of logic for manipulating chunk data.
//  To use call one of the static methods to get an instance, and then apply
//  mutations as desired before calling the generate function to get the final
//  chunk description data.
//
//  Example:
//      ChunkBuilder.newEmpty()
//          .fillSquare('grass', {width: 20, height: 20})
//          .addCoast()
//          .padWithWater(10)
//          .generate();
//
class ChunkBuilder {
    // Static Initializers
    static newEmpty() {
        return new ChunkBuilder();
    }

    // Modifier API

    // Private helpers
    constructor() {

    }
}

export default ChunkBuilder;