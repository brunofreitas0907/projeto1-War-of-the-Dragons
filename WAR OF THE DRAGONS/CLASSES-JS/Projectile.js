import { PATH_FIRE_BALL } from "../CONSTANTS-JS/constants.js";

class Projectile {
    constructor(positionX, positionY, speed) {
        this.positionX = positionX - 15;
        this.positionY = positionY - 30;
        this.width = 20;
        this.height = 15;
        this.speed = speed;
        
        this.fire = new Image();
        this.fire.src = PATH_FIRE_BALL;
    }

    draw(ctx){
        ctx.drawImage(
            this.fire,
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

export default Projectile;