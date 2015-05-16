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

    addSimpleHouse(top = 0, left = 0) {
        const X = x => x + left;
        const Y = y => y + top;
        const grid = (y, x) => this.grid[Y(y)][X(x)];
        const tile = (y, x, tile) => grid(y, x).tile = tile;
        let rowIndex = 0;
        const row = (...tiles) => {
            tiles.forEach((t, i) => {
                if (t) {
                    tile(rowIndex, i, t);
                }
            });

            rowIndex++;
        };

        row(null, 'P03', 'S03', null);
        row('P03', 'P04', 'S04', 'S03');
        row('P04', 'P04', 'S04', 'S04');
        row('P04', 'Q02', 'R02', 'S04');

        return this;
    }

    addCoast() {
        // TODO: This is very locked into the one tileset, we should generalize this sort of logic at some point

        // Grass to Shallow water transition
        this.addRow(true, 'H23');
        this.addRow(false, 'H25');
        this.addColumn(true,'G24');
        this.addColumn(false, 'I24');
        this.topLeft().tile = 'G23';
        this.bottomLeft().tile = 'G25';
        this.topRight().tile = 'I23';
        this.bottomRight().tile = 'I25';

        // Shallow water to deep water transition
        this.addRow(true, 'H19');
        this.addRow(false, 'H17');
        this.addColumn(true,'I18');
        this.addColumn(false, 'G18');
        this.topLeft().tile = 'C17';
        this.bottomLeft().tile = 'A17';
        this.topRight().tile = 'D17';
        this.bottomRight().tile = 'B17';

        return this;
    }

    padWithWater(paddingDepth = 1) {
        const water = 'F22';

        for (let i = 0; i < paddingDepth; i++) {
            this.addRow(true, water);
            this.addRow(false, water);
            this.addColumn(true, water);
            this.addColumn(false, water);
        }

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
        this.width = 1;
        this.height = 1;
        this.grid = [[new Cell()]];   // initialize to a 1x1 matrix
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