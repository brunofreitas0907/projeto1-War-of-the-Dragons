import Plane from "./CLASSES-JS/Plane.js";
import Dragon from "./CLASSES-JS/Dragon.js";
import Obstacle from "./CLASSES-JS/Obstacle.js";
import Explosion from "./CLASSES-JS/Explosion-Plane.js";
import BackgroundChange from "./CLASSES-JS/Background-Change.js";

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let score = parseInt(document.querySelector('#score').textContent);
let time = parseInt(document.querySelector('#time').textContent);
let level = parseInt(document.querySelector('#level').textContent);
let butonComoJogar = document.querySelector('#como-jogar');

let isPaused = false;
let isGameover = false;
let animationFrameId = null;
let isAudioStarted = false;
const janela = document.getElementById('janela-levels');
const janelaTitle = document.getElementById('janela-title');
const janelaMessage = document.getElementById('janela-message');
const janelaButton = document.getElementById('janela-button');
const gifFiredragon = document.querySelector('#gif-fire-dragon');

canvas.width = innerWidth;
canvas.height = innerHeight;

ctx.imageSmoothingEnabled = false;

const backgroundBlack = () => {
    ctx.fillStyle = 'rgba(0,0,0)';
    ctx.fillRect(0,0,canvas.width, canvas.height);
};

let levelPlanes = 4;
const planers = [];
const plannersHard = [];

function addMorePlanes() {
    let maxColumns = Math.ceil(Math.sqrt(levelPlanes));
    let spacingX = 100;
    let spacingY = 50;
    
    for(let i = 0; i < levelPlanes; i++) {
        let x = (i % maxColumns) * spacingX;
        let y = Math.floor(i / maxColumns) * spacingY + 50;
        planers.push(new Plane(x, y, 5, canvas));
    }
};

function addPlanesLevelHard() {
    let maxColumns = Math.ceil(Math.sqrt(levelPlanes));
    let spacingX = 100;
    let spacingY = 50;
    
    for(let i = 0; i < levelPlanes; i++) {
        let x = canvas.width - 100 - (i % maxColumns) * spacingX;
        let y = Math.floor(i / maxColumns) * spacingY + 50;
        let plane = new Plane(x, y, 5, canvas);
        plane.direction = 'left';
        plane.rotation = Math.PI;
        plannersHard.push(plane);
    }
};

addMorePlanes();

const planersDrawMoviment = () => {
    
    planers.forEach((plane) => {
        plane.draw(ctx);
        plane.movimentationPlane();
    });

    plannersHard.forEach((plane) => {
        plane.draw(ctx);
        plane.movimentationPlane();
    });
};

const planersBombs = [];
let intervalBombs = 1000;

let bombIntervalId = setInterval(() => {
    const allPlanes = [...planers , ...plannersHard];
    
    if(allPlanes.length > 0) {
        let sortPlane = allPlanes[Math.floor(Math.random() * allPlanes.length)];
        sortPlane.shot(planersBombs);
    };

}, intervalBombs);

const dragao = new Dragon(canvas.width, canvas.height);
const dragonFireBalls = [];
const explosionPlane = [];
const explosionImage = new Image();
explosionImage.src = 'IMAGES/gif-explosion.gif';

const drawProjectiles = () => {
    
    dragonFireBalls.forEach((projectile) => {
        projectile.draw(ctx);
        projectile.update();
    });
    
    planersBombs.forEach((bomb) => {
        bomb.draw(ctx);
        bomb.update();
    })
};

const drawExplosions = () => {
    explosionPlane.forEach((explo, index) => {
        explo.explosion.draw(ctx);
        if (Date.now() - explo.time > 500) {
            explosionPlane.splice(index, 1);
        }
    });
};

const clearProjectiles = () => {
    dragonFireBalls.forEach((projectile, i) => {
        if(projectile.positionY <= 0) {
            dragonFireBalls.splice(i, 1);
        }
    });
    
    planersBombs.forEach((bomb, i) => {
        if(bomb.positionY >= canvas.height) {
            planersBombs.splice(i, 1);
        }
    });
};

const hitPlane = () => {
    dragonFireBalls.forEach((fireBall, fireBallIndex) => {
        planers.forEach((plane, planeIndex) => {
            if(fireBall.positionX <= plane.positionX + plane.width &&
                fireBall.positionX + fireBall.width >= plane.positionX &&
                fireBall.positionY <= plane.positionY + plane.height &&
                fireBall.positionY + fireBall.height >= plane.positionY
            ) {
                explosionPlane.push({
                    explosion: new Explosion(plane.positionX, plane.positionY, explosionImage),
                    time: Date.now()
                });
                
                planers.splice(planeIndex, 1);
                dragonFireBalls.splice(fireBallIndex, 1);
                score += 10;
                document.querySelector('#score').textContent = score;
            }
        });
    });

    dragonFireBalls.forEach((fireBall, fireBallIndex) => {
        plannersHard.forEach((plane, planeIndex) => {
            if(fireBall.positionX <= plane.positionX + plane.width &&
                fireBall.positionX + fireBall.width >= plane.positionX &&
                fireBall.positionY <= plane.positionY + plane.height &&
                fireBall.positionY + fireBall.height >= plane.positionY
            ) {
                explosionPlane.push({
                    explosion: new Explosion(plane.positionX, plane.positionY, explosionImage),
                    time: Date.now()
                });
                
                plannersHard.splice(planeIndex, 1);
                dragonFireBalls.splice(fireBallIndex, 1);
                score += 10;
                document.querySelector('#score').textContent = score;
            }
        });
    });
}

const rugidoGameover = new Audio('SOUNDS/rugido-game-over.mp3');

const hitDragon = () => {
    planersBombs.forEach((bomb, bombIndex) => {
        if(bomb.positionX <= dragao.positionX + dragao.width &&
            bomb.positionX + bomb.width >= dragao.positionX &&
            bomb.positionY <= dragao.positionY + dragao.height &&
            bomb.positionY + bomb.height >= dragao.positionY
        ) {
            planersBombs.splice(bombIndex,1);
            clearInterval(timeIntervalId);
            clearInterval(bombIntervalId);
            document.querySelector('#time').textContent = 'Game Over';
            isGameover = true;
            dragao.positionY = 1000;
            audioBackgroundContinuo.currentTime = 0;
            audioBackgroundContinuo.pause();
            isPaused = true;
            cancelAnimationFrame(animationFrameId);

            janela.style.display = 'flex';
            gifFiredragon.style.display = 'none';
            janelaTitle.textContent = 'GAME OVER';
            janelaTitle.style.color = 'red';
            janelaMessage.textContent = `VOCÊ CHEGOU AO LEVEL ${level}!`
            janelaButton.textContent = 'TENTAR NOVAMENTE';
            rugidoGameover.play();

            janelaButton.onclick = () => {
                janela.style.display = 'none';
                janelaTitle.style.color = 'white';
                gifFiredragon.style.display  = 'block';
                isPaused = false;
                isGameover = false;
                isAudioStarted = false;
                level = 1;
                score = 0;
                contTime = 60;
                levelPlanes = 4;
                intervalBombs = 1000;
                rugidoGameover.pause();
                rugidoGameover.currentTime = 0;
                document.querySelector('#level').textContent = level;
                document.querySelector('#score').textContent = score;
                document.querySelector('#time').textContent = contTime;
                planers.length = 0;
                plannersHard.length = 0;
                dragonFireBalls.length = 0;
                planersBombs.length = 0;
                dragao.positionX = canvas.width / 2 - dragao.width / 2;
                dragao.positionY = canvas.height - 100; 
                addMorePlanes(); 
                timeForLevel(); 
                bombIntervalId = setInterval(() => {
                    const allPlanes = [...planers, ...plannersHard];
                    if (allPlanes.length > 0) {
                        let sortPlane = allPlanes[Math.floor(Math.random() * allPlanes.length)];
                        sortPlane.shot(planersBombs);
                    }
                }, intervalBombs);
                animationFrameId = requestAnimationFrame(gameLoop);
            };
        }
    }) 
};

const obstacle = new Obstacle(canvas.width * 0.3, canvas.height * 0.65);
const obstacle2 = new Obstacle(canvas.width * 0.7, canvas.height * 0.65);

const verifyCollision = () => {
    dragonFireBalls.forEach((fireBall, fireBallIndex) => {
        if(fireBall.positionX <= obstacle.positionX + obstacle.width &&
            fireBall.positionX + fireBall.width > obstacle.positionX &&
            fireBall.positionY < obstacle.positionY + obstacle.height &&
            fireBall.positionY + fireBall.height > obstacle.positionY
        ) {dragonFireBalls.splice(fireBallIndex, 1)}
    })

    dragonFireBalls.forEach((fireBall, fireBallIndex) => {
        if(fireBall.positionX <= obstacle2.positionX + obstacle2.width &&
            fireBall.positionX + fireBall.width > obstacle2.positionX &&
            fireBall.positionY < obstacle2.positionY + obstacle2.height &&
            fireBall.positionY + fireBall.height > obstacle2.positionY
        ) {dragonFireBalls.splice(fireBallIndex, 1)}
    })

    for (let i = planersBombs.length - 1; i >= 0; i--) {
        let bomb = planersBombs[i];
        if (
            (bomb.positionX <= obstacle.positionX + obstacle.width &&
             bomb.positionX + bomb.width >= obstacle.positionX &&
             bomb.positionY <= obstacle.positionY + obstacle.height &&
             bomb.positionY + bomb.height > obstacle.positionY) ||
            (bomb.positionX <= obstacle2.positionX + obstacle2.width &&
             bomb.positionX + bomb.width >= obstacle2.positionX &&
             bomb.positionY <= obstacle2.positionY + obstacle2.height &&
             bomb.positionY + bomb.height > obstacle2.positionY)
        ) {
            planersBombs.splice(i, 1);
        }
    }    
}

let timeIntervalId = null;
let contTime = 60;

const timeForLevel = () => {
    
    timeIntervalId = setInterval(() => {
        contTime -= 1;
        document.querySelector('#time').textContent = contTime;

        if(contTime <= 0) {
            clearInterval(timeIntervalId);
            document.querySelector('#time').textContent = 'Game Over';
        }
            
    }, 1000);
};

timeForLevel();

const nextLevelSound = new Audio('SOUNDS/new-next-level-sound.mp3');

const nextLevel = () => {
    if(planers.length <= 0 && plannersHard.length <= 0) {
        isPaused = true;
        nextLevelSound.play();
        audioBackgroundContinuo.pause();
        audioBackgroundContinuo.currentTime = 0;
        cancelAnimationFrame(animationFrameId);
        clearInterval(timeIntervalId);
        clearInterval(bombIntervalId);
        gifFiredragon;
        janelaTitle.textContent = `LEVEL ${level} COMPLETED!`;
        janelaMessage.textContent = `SCORE: ${score}`;
        janelaButton.textContent = `NEXT LEVEL`;
        janela.style.display = 'flex';
        janelaButton.onclick = () => {
            nextLevelSound.pause();
            nextLevelSound.currentTime = 0;
            audioBackgroundContinuo.currentTime = 0;
            janela.style.display = 'none';
            isPaused = false;
            level += 1;
            document.querySelector('#level').textContent = level;
            planers.length = 0;
            plannersHard.length = 0;
            dragonFireBalls.length = 0;
            planersBombs.length = 0;
            nextDifficult();
            addMorePlanes();
            if(level === 5 || level === 6 || level === 7 || level === 8 || level === 9 || level === 10 || level === 11 || level === 12) {
                addPlanesLevelHard();
            };
            timeForLevel();
            dragao.positionX = canvas.width / 2 - dragao.width / 2;
            bombIntervalId = setInterval(() => {
                const allPlanes = [...planers, ...plannersHard];
                if (allPlanes.length > 0) {
                    let sortPlane = allPlanes[Math.floor(Math.random() * allPlanes.length)];
                    sortPlane.shot(planersBombs);
                }
            }, intervalBombs);
            animationFrameId = requestAnimationFrame(gameLoop);
        };
    };
};

const nextDifficult = () => {

    if(level === 2) {
        levelPlanes = 9;
        contTime = 55;
    } 
    else if(level === 3) {
        levelPlanes = 12;
        contTime = 50;
    } 
    else if(level === 4) {
        levelPlanes = 16;
        contTime = 45;
    } 
    else if(level === 5) {
        levelPlanes = 4;
        contTime = 40;
    } 
    else if(level === 6) {
        levelPlanes = 9;
        contTime = 35;
    } 
    else if(level === 7) {
        levelPlanes = 12;
        intervalBombs = 500;
        contTime = 30;
    }
    else if(level === 8) {
        levelPlanes = 16;
        intervalBombs = 500;
        contTime = 25;
    }
    else if(level === 9) {
        levelPlanes = 16;
        intervalBombs = 400;
        contTime = 20;
    }
    else if(level === 10) {
        levelPlanes = 16;
        intervalBombs = 300;
        contTime = 20;
    }
    else if(level === 11) {
        levelPlanes = 16;
        intervalBombs = 200;
        contTime = 20;
    }
    else if(level === 12) {
        levelPlanes = 16;
        intervalBombs = 200;
        contTime = 15;
    }
};

const audioBackgroundContinuo = new Audio('SOUNDS/futuristic-space-war-.wav');
const backgroundImage = new BackgroundChange(0,0, canvas.width, canvas.height);

let lastTimeShot = 0;
const delayRajada = 200;

const gameLoop = () => {
    
    if(isPaused) return;

    ctx.clearRect(0,0,canvas.width, canvas.height);
    backgroundImage.backgroundCanvas(ctx);

    obstacle.barrier(ctx);
    obstacle2.barrier(ctx);
    verifyCollision(ctx);
    
    planersDrawMoviment(planers, plannersHard);
    hitPlane();
    hitDragon();
    drawExplosions();
    
    ctx.save();
    
    ctx.translate(
        dragao.positionX + dragao.width / 2,
        dragao.positionY + dragao.height / 2
    );
    
    if(keys.shot.pressed && keys.shot.released){
        dragao.shot(dragonFireBalls);
        keys.shot.released = false;
    };

    if(keys.rajada && Date.now() - lastTimeShot >= delayRajada ){
        dragao.shot(dragonFireBalls);
        lastTimeShot = Date.now();
    };
    
    if(keys.right && dragao.positionX <= canvas.width - dragao.width){
        dragao.moveRight();
        ctx.rotate(0.20);
    };
    
    if(keys.left && dragao.positionX >= 0){
        dragao.moveLeft();
        ctx.rotate(-0.20);
    };
    
    ctx.translate(
        - dragao.positionX - dragao.width / 2,
        - dragao.positionY - dragao.height / 2
    );
    
    dragao.update(ctx);
    ctx.restore();
    
    drawProjectiles();
    clearProjectiles();
    nextLevel();
    
    animationFrameId = requestAnimationFrame(gameLoop);
};

const keys = {
    right: false,
    left: false,
    shot: {
        pressed: false,
        released: true,
    },
    rajada: false,
};

addEventListener('keydown' , (event) => {
    
    if(event.key === 'ArrowRight'){
        keys.right = true;
    }
    
    if(event.key === 'ArrowLeft'){
        keys.left = true;
    }
    
    if(event.key === ' ') keys.shot.pressed = true;

    if(event) audioBackgroundContinuo.play();
});

addEventListener('keyup' , (event) => {
    
    if(event.key === 'ArrowRight') keys.right = false;
    if(event.key === 'ArrowLeft') keys.left = false;
    if(event.key === ' ') {
        keys.shot.pressed = false;
        keys.shot.released = true;
        keys.rajada = false;
    }
});

addEventListener('keypress' , (event) => {
    if(event.key === ' ') {
        keys.rajada = true;
    }
});

  
gameLoop();