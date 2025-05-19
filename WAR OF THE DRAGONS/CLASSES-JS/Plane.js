import { PATH_PLANE_RIGHT, PATH_RIGHT_MOVIMENT } from "../CONSTANTS-JS/constants.js";
import Bomb from "./Bomb-Planes.js";

class Plane {
    constructor(positionX, positionY, speed, canvas) {
        this.positionX = positionX;
        this.positionY = positionY + 100;
        this.width = 65;
        this.height = 65;

        this.speed = speed;
        this.canvas = canvas;

        this.direction = 'right';
        this.frame = 0;
        this.frameSpeed = 0.15;
        this.moviment = false;
        
        this.plane = new Image();
        this.plane.src = PATH_PLANE_RIGHT;
        this.planeMoviment = new Image();
        this.planeMoviment.src = PATH_RIGHT_MOVIMENT;
        this.rotation = 0;

        this.bombSound = new Audio('SOUNDS/bomb-sound.wav');
    } 

    moveLeft() {
        this.positionX -= this.speed;
        this.moviment = true;
    }
    
    moveRight() {
        this.positionX += this.speed;
        this.moviment = true;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.positionX + this.width / 2, this.positionY + this.height / 2);

        if(this.direction === 'left') {
            ctx.scale(-1, 1);
        }

        let currentImage = this.plane;

        if(this.moviment) {
            this.frame += this.frameSpeed;
            if(this.frame > 1) this.frame = 0;
            currentImage = this.frame < 0.5 ? this.plane : this.planeMoviment;
        }

        ctx.drawImage (
            currentImage,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );

        ctx.restore();
    }

    movimentationPlane () {
        if(this.direction === 'right' || this.direction === 'left') {
            this.frame += this.frameSpeed;
        } if(this.frame >= 1) this.frame = 0;

        // MOVE O INVADER CONFORME A DIREÇÃO
        if(this.direction === 'right') {
            this.moveRight();

        } if (this.direction === 'left') {
            this.moveLeft();
        };

        // MUDA A DIREÇÃO DO INVADER
        if(this.positionX + this.width >= this.canvas.width && this.direction === 'right') {
            this.direction = 'left';
            this.rotation = Math.PI;

        } else if (this.positionX <= 0 && this.direction === 'left') {
            this.direction = 'right';
            this.rotation = 0;
        };
    }

    stopMoving() {
        this.moviment = false;
    }

    shot(InvaderProjectiles) {
        const p = new Bomb (
            this.positionX + this.width / 2,
            this.positionY + this.height / 2,
            -15
        );

        InvaderProjectiles.push(p);
    };

};

export default Plane;