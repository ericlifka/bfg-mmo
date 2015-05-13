export default class Billboard {
    constructor(initialText, style) {
        this.container = new PIXI.Container();
        this.back = new PIXI.Graphics();
        this.text = new PIXI.Text(initialText, style);
        this.container.addChild(this.back);
        this.container.addChild(this.text);
    }

    addSprite(container) {
        container.addChild(this.container);
    }

    removeSprite(container) {
        container.removeChild(this.container);
    }

    setText(text) {
        this.text.text = text;
        this.back.clear();
        this.back.beginFill(0x000000, 0.3);
        this.back.drawRoundedRect(-3, -3, this.text.width + 3, this.text.height + 3, 3);
        this.back.endFill();
    }

    setSpritePosition(screenCoords) {
        this.text.x = screenCoords.x;
        this.text.y = screenCoords.y;
        this.back.x = screenCoords.x;
        this.back.y = screenCoords.y;
    }
}
