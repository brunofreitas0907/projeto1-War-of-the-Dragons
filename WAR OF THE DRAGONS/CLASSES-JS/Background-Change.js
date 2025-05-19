import { PATH_FINISH_BACKGROUND } from "../CONSTANTS-JS/constants.js";

class BackgroundChange {
    constructor(positionX, positionY, width, height) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = width;
        this.height = height;

        this.backgroundImage = new Image();
        this.backgroundImage.src = PATH_FINISH_BACKGROUND;

        this.frames = 1;
        this.lastFrameSwitchTime = performance.now();
    }

    backgroundCanvas(ctx) {
        ctx.drawImage(this.backgroundImage, 0, 0, this.width, this.height);
    }
}

export default BackgroundChange;