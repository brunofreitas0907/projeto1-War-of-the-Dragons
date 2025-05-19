import { PATH_ROCK_IMAGE } from "../CONSTANTS-JS/constants.js";

class Obstacle {
    constructor(positionX, positionY) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = 70;
        this.height = 60;

        this.rock = new Image();
        this.rock.src = PATH_ROCK_IMAGE;
    }

    barrier(ctx) {
        ctx.drawImage(this.rock, this.positionX, this.positionY, this.width, this.height);
    }
}

export default Obstacle;