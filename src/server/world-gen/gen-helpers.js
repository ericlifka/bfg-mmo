const TILE_SIZE = 32;

export default {
    rowsToPositions(rows) {
        rows = rows.map(row => row.split(' ')); // Turn space delimited strings of tiles into arrays
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
    }
};
