//
//   Button codes from default controller mapping:
//   Arrows:
//       up:     12
//       down:   13
//       left:   14
//       right:  15
//
//   Actions:
//       A:  0
//       B:  1
//       X:  2
//       Y:  3
//
//   Meta:
//       Select: 8
//       Start:  9
//
//   Shoulder:
//       left bumper:    4
//       right bumper:   5
//       left trigger:   6
//       left trigger:   7
//
//   Axes: (found under the axes array unlike buttons)
//       left stick x:   0
//       left stick y:   1
//       right stick x:  2
//       right stick y:  3
//

class Input {
    constructor() {
        this.keyCache = {};
        document.addEventListener('keydown', (event) => {
            this.keyCache[String.fromCharCode(event.keyCode)] = true;
        });
        document.addEventListener('keyup', (event) => {
            this.keyCache[String.fromCharCode(event.keyCode)] = false;
        });
    }

    clearCache() {
        this.keyCache = {};
    }

    getFrameState() {
        return {
            up: this.keyCache['W'],
            left: this.keyCache['A'],
            down: this.keyCache['S'],
            right: this.keyCache['D']
        }
    }
}

export default Input
