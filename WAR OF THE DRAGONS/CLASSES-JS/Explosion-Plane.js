class Explosion {
    constructor(positionX, positionY, explosionGif) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = 50;
        this.height = 50;

        this.explosionGif = explosionGif;
        this.explosionSound = new Audio('SOUNDS/explosion-plane.mp3');
        this.soundExplosion();
    };

    draw(ctx) {
        ctx.drawImage(
            this.explosionGif,
            this.positionX,
            this.positionY,
            this.width,
            this.height
        );
    };

    soundExplosion() {
        this.explosionSound.currentTime = 0;
        this.explosionSound.play();
    };

};

export default Explosion;