export default class Camera {
    constructor(width, height) {
        // Camera needs to know about the current stage's
        // height and width in order to define translation

        // Position is the world coordinates the camara is
        // currently located.  Using the position in the world
        // offsets can be created to the appropriate screen 
        // position.
        this.width = width;
        this.height = height;
        this.thresholds = this.getThresholds(width, height);
        this.position = {x: 0, y: 0};
    }

    translateCoordinates(coords) {
        // Map world coordinates into screen coordinates
        // based on camera position
        return {
            x: coords.x - this.position.x,
            y: this.height - (coords.y - this.position.y),
        };
    }

    getThresholds() {
        // Return the four scalar thresholds for camera 
        // tracking.  Translation into screen coordinates
        // must be done for comparisons.
        return {
            left: Math.round(this.width * 0.25),
            right: Math.round(this.width * 0.75),
            bottom: Math.round(this.height * 0.75),
            top: Math.round(this.height * 0.25)
        };
    }

    trackPosition(position) {
        let screenCoords = this.translateCoordinates(position);

        // If point is in any of the tracking gutters then
        // update the camera position by the amount the point
        // is intersecting the gutter

        if (screenCoords.x < this.thresholds.left) {
            this.position.x -= (this.thresholds.left - screenCoords.x);
        } else if (screenCoords.x > this.thresholds.right) {
            this.position.x += (screenCoords.x - this.thresholds.right);
        }

        if (screenCoords.y < this.thresholds.top) {
            this.position.y += (this.thresholds.top - screenCoords.y);
        } else if (screenCoords.y > this.thresholds.bottom) {
            this.position.y -= (screenCoords.y - this.thresholds.bottom);
        }
    }
}
