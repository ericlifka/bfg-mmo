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
const TILE_SIZE = 32;   // TODO: this should be configured with the tile set to be flexible

class ChunkBuilder {
    // Static Initializers
    static newEmpty() {
        return new ChunkBuilder();
    }

    // Modifier API
    fillSquare(tileType, {top = 0, left = 0, width = 1, height = 1} = {}) { // jshint ignore:line
        const totalWidth = left + width;
        const totalHeight = top + height;

        while (this.height < totalHeight) {
            this.addEmptyRow();
        }

        while (this.width < totalWidth) {
            this.addEmptyColumn();
        }

        for (let x = left; x < totalWidth; x++) {
            for (let y = top; y < totalHeight; y++) {
                this.grid[y][x].tile = tileType;
            }
        }
    }

    addCoast() {

    }

    padWithWater(paddingDepth = 1) {

    }

    generateChunk() {
        const tilePositions = [];

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const cell = this.grid[y][x];

                tilePositions.push({
                    type: cell.tile,
                    position: {
                        x: x * TILE_SIZE,
                        y: y * TILE_SIZE
                    }
                });
            }
        }

        return tilePositions;
    }

    // Private helpers
    constructor() {
        this.width = 0;
        this.height = 0;
        this.grid = [[]];   // initialize to a 0x0 matrix
    }

    addEmptyRow() {
        const row = [];
        for (let i = 0; i < this.width; i++) {
            row.push(new Cell());
        }
        this.grid.push(row);
        this.height++;
    }

    addEmptyColumn() {
        this.grid.forEach(row => row.push(new Cell()));
        this.width++;
    }
}

class Cell {
    constructor() {
        this.tile = null;
        this.clutter = null;    // not implemented
        this.passable = true;   // not implemented
    }
}

export default ChunkBuilder;