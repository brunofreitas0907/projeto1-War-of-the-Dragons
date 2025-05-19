import { PATH_BOMB_IMAGE } from "../CONSTANTS-JS/constants.js";

class Bomb {
    constructor(positionX, positionY, speed) {
        this.positionX = positionX - 15;
        this.positionY = positionY - 30;
        this.width = 30;
        this.height = 30 ;
        this.speed = speed;
        
        this.bomb = new Image();
        this.bomb.src = PATH_BOMB_IMAGE;
    }

    draw(ctx){
        ctx.drawImage(
            this.bomb,
            this.positionX,
            this.positionY,
            this.width,
            this.height
        );
    }

    update(){
        this.positionY -= this.speed;
    }
}

export default Bomb;