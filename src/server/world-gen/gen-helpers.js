const TILE_SIZE = 32;

export default {
    rowsToPositions(rows) {
        rows.reverse();
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
