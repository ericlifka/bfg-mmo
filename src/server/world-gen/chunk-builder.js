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
//          .generateChunk();
//
class ChunkBuilder {
    // Static Initializers
    static newEmpty() {
        return new ChunkBuilder();
    }

    // Modifier API
    fillSquare(tileType, {top = 0, left = 0, width = 1, height = 1} = {}) { // jshint ignore:line
        const minWidth = left + width;
        const minHeight = top + height;

        while (this.height < minHeight) {
            this.addEmptyRow();
        }

        while (this.width < minWidth) {
            this.addEmptyColumn();
        }
    }

    addCoast() {

    }

    padWithWater(paddingDepth = 1) {

    }

    generateChunk() {

    }

    // Private helpers
    constructor() {
        this.width = 0;
        this.height = 0;
        this.grid = [[]];   // initialize to a 0x0 matrix
    }

    addEmptyRow() {

    }

    addEmptyColumn() {

    }
}

class Cell {
    constructor() {

    }
}

export default ChunkBuilder;