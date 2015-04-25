export default class ChunkGenerator {
    constructor(tileTypes, bounds) {
        // Chunk generator essentially will be responsible 
        // for expanding a map area with randomly generated
        // tiles based on factors such as "biome" (tile set)
        // generation types (overworld, dungeon, caves) and
        // adjacent chunk sets.

        // The tile types available for this chunk
        this.tileTypes = tileTypes;
        this.tileDefinitions = [];
        // The area that this chunk generating
        this.bounds = bounds;
        let upperLeft = bounds.upperLeft;
        let lowerRight = bounds.lowerRight;
        this.width = lowerRight.x - upperLeft.x;
        this.height = upperLeft.y - lowerRight.y;
        this.offsetX = upperLeft.x;
        this.offsetY = lowerRight.y;
        this.areas = [];
    }

    checkBounds() {
        if (((this.offsetX % 32) !== 0) ||
            ((this.offsetY % 32) !== 0) ||
            ((this.width % 32) !== 0) ||
            ((this.height % 32) !== 0)) {

            throw "Invalid bounds for chunk generation";
        }

    }

    getDistance(point1, point2) {
        return Math.sqrt(Math.pow(point2.x - point1.x, 2) +
                Math.pow(point2.y - point1.y, 2));
    }

    // Starting of with a basic Voronoi
    generateAreas() {
        let areaCount = 20;
        for (let i = 0; i < areaCount; i++) {
            let x = Math.round(Math.random() * this.width) + this.offsetX;
            let y = Math.round(Math.random() * this.height) + this.offsetY;
            let sel = Math.floor(Math.random() * this.tileTypes.length);
            let type = this.tileTypes[sel];
            this.areas.push({x: x, y: y, type: type});
        }
    }

    generateTile(position) {
        let closest = null;
        let distance = 0;
        for (let area of this.areas) {
            if (!closest) {
                closest = area;
                distance = this.getDistance(position, area);
                continue;
            }

            let test = this.getDistance(position, area);
            if (test < distance) {
                closest = area;
                distance = test;
            }
        }

        return {position: position, type: closest.type};
    }

    generateTiles() {
        let tilesX = this.width / 32;
        let tilesY = this.height / 32;
        for (let i = 0; i < tilesY; i++) {
            for (let j = 0; j < tilesX; j++) {
                let x = j * 32 + this.offsetX;
                let y = i * 32 + this.offsetY;
                let tile = this.generateTile({x: x, y: y});
                this.tileDefinitions.push(tile);
            }
        }
    }

    generate() {
        this.checkBounds();
        this.generateAreas();
        this.generateTiles();
        return this.tileDefinitions;
    }
}

