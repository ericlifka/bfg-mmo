export default {
    generate() {
        return rowsToPositions([
            ['B03', 'B03'],
            ['F22', 'F22'],
        ]);

        //return [
        //    {position: {x: 0, y: 0}, type: 'F22'},
        //    {position: {x: 32, y: 0}, type: 'F22'},
        //    {position: {x: 0, y: 32}, type: 'F22'},
        //    {position: {x: 32, y: 32}, type: 'F22'},
        //];
    }
};

const TILE_SIZE = 32;

function rowsToPositions(rows) {
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