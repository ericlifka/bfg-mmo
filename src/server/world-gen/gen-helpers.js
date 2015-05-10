const TILE_SIZE = 32;

export default {
    stringsToRows(strings) {
        return strings.map(str => str.split(' '));
    },

    rowsToPositions(rows) {
        rows.reverse(); // flip the order to match bottom up world coords

        const tilePositions = [];

        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            const row = rows[rowIndex];

            for (let tileIndex = 0; tileIndex < row.length; tileIndex++) {
                const tile = row[tileIndex];

                tilePositions.push({
                    type: tile,
                    position: {
                        x: tileIndex * TILE_SIZE,
                        y: rowIndex * TILE_SIZE
                    }
                });
            }
        }

        return tilePositions;
    },

    padWithWater(rows = [], padNumber = 10) {
        if (rows.length === 0) {
            rows.push([]);
        }

        // Insert rows of water at the top and bottom
        const width = rows[0].length;
        const gen = () => (new Array(width)).fill('F22');
        for (let rowPad = 0; rowPad < padNumber; rowPad++) {
            rows.push(gen());
            rows.unshift(gen());
        }

        // Add columns of water to both sides of all the rows
        rows.forEach(row => {
            for (let colPad = 0; colPad < padNumber; colPad++) {
                row.push('F22');
                row.unshift('F22');
            }
        });

        return rows;
    }
};
