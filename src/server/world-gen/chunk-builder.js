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
            this.addRow();
        }

        while (this.width < totalWidth) {
            this.addColumn();
        }

        for (let x = left; x < totalWidth; x++) {
            for (let y = top; y < totalHeight; y++) {
                this.grid[y][x].tile = tileType;
            }
        }

        return this;
    }

    addCoast() {
        // TODO: This is very locked into the one tileset, we should generalize this sort of logic at some point

        this.addRow(true, 'H23');
        this.addRow(false, 'H25');
        this.addColumn(true,'G24');
        this.addColumn(false, 'I24');


        return this;
    }

    padWithWater(paddingDepth = 1) {
        return this;
    }

    generateChunk() {
        const tilePositions = [];

        // Grab a top level clone of the grid array and reverse it to match the inverted display coordinates used by the client for rendering.
        const grid = this.grid.slice(0);
        grid.reverse();

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const cell = grid[y][x];

                if (cell.tile) {
                    tilePositions.push({
                        type: cell.tile,
                        position: {
                            x: x * TILE_SIZE,
                            y: y * TILE_SIZE
                        }
                    });
                }
            }
        }

        return tilePositions;
    }

    // Private helpers
    constructor() {
        this.width = 0;
        this.height = 1;
        this.grid = [[]];   // initialize to a 1x0 matrix
    }

    addRow(atTop = false, tile = null) {
        const row = [];
        for (let i = 0; i < this.width; i++) {
            row.push(new Cell(tile));
        }

        if (atTop) {
            this.grid.unshift(row);
        } else {
            this.grid.push(row);
        }

        this.height++;
    }

    addColumn(atFront = false, tile = null) {
        this.grid.forEach(
            atFront ?
                row => row.unshift(new Cell(tile)) :
                row => row.push(new Cell(tile))
        );
        this.width++;
    }

    topLeft() {
        return this.grid[0][0];
    }

    topRight() {
        return this.grid[0][this.width - 1];
    }

    bottomLeft() {
        return this.grid[this.height - 1][0];
    }

    bottomRight() {
        return this.grid[this.height - 1][this.width - 1];
    }
}

class Cell {
    constructor(tile) {
        this.tile = tile;
        this.clutter = null;    // not implemented
        this.passable = true;   // not implemented
    }
}

export default ChunkBuilder;