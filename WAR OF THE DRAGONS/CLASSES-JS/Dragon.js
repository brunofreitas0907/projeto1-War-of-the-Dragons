// IMPORTA ELEMENTOS DE OUTROS ARQUIVOS
import {PATH_NEW_DRAGON_ONE, PATH_NEW_DRAGON_TWO} from "../CONSTANTS-JS/constants.js";
import Projectile from "./Projectile.js";

// CLASSE P ATRIBUIR CARACTERÍSTICAS AO PLAYER
class Dragon {
    constructor(canvasWidth, canvasHeight) {
        this.height = 100;
        this.width = 100;
        this.positionX = canvasWidth / 2 - this.width / 2;
        this.positionY = canvasHeight - this.height - 30;
        this.speed = 10;
        this.frames = 1;
        this.framesCounter = 1;
        this.animationSpeed = 5;
        this.animationWings();
        
        // ADICIONA UMA IMAGEM AO PLAYER
        this.dragon = this.getImage(PATH_NEW_DRAGON_ONE);
        this.dragon2 = this.getImage(PATH_NEW_DRAGON_TWO);
        
        this.currentFrame = this.dragon;
        // CONTROLA AS IMAGENS DE FOGO PARA EFEITO DE VELOCIDADE
        this.turbo = 0 ;
        this.framesCounter = 10;

        this.shotSound = new Audio('SOUNDS/fire-sound-new.mp3');
    }

    // ADICIONA A FOTO DO PLAYER
    getImage(path) {
        const image = new Image();
        image.src = path;
        return image;
    }

    // FUNÇÃO DE MOVIMENTO PELAS SETAS
    moveLeft () {
        this.positionX -= this.speed;
    }
    
    moveRight () {
        this.positionX += this.speed;
    }

    animationWings() {
        setInterval(() => {
            if(this.frames === 1) {
                this.currentFrame = this.dragon;
                this.frames = 2;
            } else if(this.frames === 2) {
                this.currentFrame = this.dragon2;
                this.frames = 1;
            }

        }, 100000);
    }

    updateAnimation () {
        this.framesCounter++;
        if(this.framesCounter >= this.animationSpeed) {
            this.framesCounter = 0;
            this.currentFrame = (this.frames === 1) ? this.dragon : this.dragon2;
            this.frames = (this.frames === 1) ? 2 : 1;
        }
    }

    // DESENHA O PLAYER COM IMAGEM DA NAVE
    draw(ctx) {

        ctx.drawImage(
            this.currentFrame,
            this.positionX,
            this.positionY - 30,
            this.width,
            this.height
        );
    }

    // CRIA PROJECTILES NORMAIS
    shot(dragonProjectiles) {
        const p = new Projectile (
            this.positionX + this.width / 2 + 5,
            this.positionY,
            10
        );

        dragonProjectiles.push(p);
        this.soundShot();
    }

    // ADICIONA EVENTO DE SOM DA FIREBALL
    soundShot() {
        this.shotSound.currentTime = 0;
        this.shotSound.play();
    }

    update(ctx) {
        this.updateAnimation();
        this.draw(ctx);
    }

}

export default Dragon;