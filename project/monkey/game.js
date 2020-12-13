//Adding the buttons from HTML
let startBtn = document.querySelector('#startBtn');
startBtn.addEventListener('click', startGame);

let restartBtn = document.querySelector('#restartBtn');
restartBtn.addEventListener('click', restartGame);

let gamePaused = true;

let bullets = [];
let bulletSpeed = 900;
let movementSpeed = 20;
let velocity = 10;
let value = 0;
let player;
let takingDamage;
let destroy;
let start = 0;
let timer = 0;
let spawnTimer = 0;
let coconut;
let bullet;
let defaultHealthWidth;
let healthValue = 100;
let calculatedX = 0;
let score = 0;
// !!!VERY IMPORTANT DO NOT REMOVE!!!
let deltaTime = 0;

let initialTime = 0;
let coconuts = [];
let coconutSpeed = 125;


// Canvas size
let canvasX = 1000;
let canvasY = window.innerHeight;

var config = {
    type: Phaser.AUTO,
    width: canvasX,
    height: canvasY,
    transparent: true,
    physics: {
        default: 'arcade',
        arcade: {

        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

// Loads in all objects that will be created
function preload() {
    this.load.image('player', 'images/monkey-1b.png');
    this.load.image('bar', 'images/bar.png');
    this.load.image('health', 'images/health.png');
    this.load.image('bullet', 'images/banan2.png');
    this.load.audio('takingDamage', 'audio/monkey-cry.ogg');
    this.load.audio('destroy', 'audio/destroy.wav');
    this.load.audio('donk', 'audio/donk.wav')
    this.load.audio('shoot', 'audio/shoot.wav');
    this.load.audio('explosion', 'audio/explosion.mp3');
    this.load.image('coconut', 'images/coconut3.png');
}

// Creates all new sprites, audio and more
function create() {

    start = new Date();
    restartBtn.disabled = true;
    startBtn.disabled = false;

    // Create Monkey and healthbar
    player = this.physics.add.sprite(canvasX / 2, canvasY / 1.18, 'player');
    health = this.add.sprite(player.x, player.y, 'health');
    bar = this.add.sprite(health.x, health.y, 'bar');

    scoreText = this.add.text(50, 50, 'Score: 0', {
        fontFamily: 'Orbitron',
        color: 'black',
        fontSize: '1.5rem',
        stroke: 'black',
        strokeThickness: '1'
    });

    gameOverText = this.add.text(canvasX, canvasY, '', {
        fontFamily: 'Orbitron',
        color: 'black',
        fontSize: '5rem',
        stroke: 'black',
        strokeThickness: '1',
        align: 'center'
    });

    gameOverText.setOrigin(0.5, 0.5);
    gameOverText.setDepth(9001);
    scoreText.setDepth(9001);


    //Values for healthbar
    defaultHealthWidth = health.displayWidth;


    //Creating sounds
    takingDamage = this.sound.add('takingDamage');
    destroy = this.sound.add('destroy');
    donk = this.sound.add('donk');
    shoot = this.sound.add('shoot');
    explosion = this.sound.add('explosion');

    destroy.allowMultiple = true;
    takingDamage.allowMultiple = true;
}

// Get how many seconds from 1 Jan 1970 00:00:00
function getTime() {
    let d = new Date();

    return d.getTime();
}

// Return time between frames in milliseconds
function time() {
    deltaTime = (getTime() - start) / 1000;

    start = getTime();

    return deltaTime;
}

function startGame() {
    gamePaused = false;
    startBtn.disabled = true;
}

function restartGame() {
    score = 0;
    coconutSpeed = 125;
    scoreText.setText('Score: ' + score);
    healthValue = 100;
    calculatedX = 0;
    health.x = player.x;
    health.displayWidth = defaultHealthWidth;
    gameOverText.setText('');

    for (let j = 0; j < coconuts.length; j++) {
        coconuts[j].destroy();
    }
    for (let j = 0; j < bullets.length; j++) {
        bullets[j].destroy();
    }
    bullets = [];
    coconuts = [];
    spawnTimer = 1;
    restartBtn.disabled = true;
    gamePaused = false;

}

// Updates every frame
function update() {
    deltaTime = time();
    if (gamePaused == false) {
        // Creates the bullets/bananas the monkey shoots
        if (game.input.activePointer.isDown && timer <= 0) {
            if (timer <= 0) {
                timer = 0.2;
            }
            bullet = this.add.sprite(player.x + 24, player.y - 30, 'bullet');
            bullets.push(bullet);
            shoot.play();
        }



        if (score >= 1000) {
            gameOverText.setText('YOU WIN')

            for (let j = 0; j < coconuts.length; j++) {
                coconuts[j].destroy();
            }
            for (let j = 0; j < bullets.length; j++) {
                bullets[j].destroy();
            }
            bullets = [];
            coconuts = [];
            restartBtn.disabled = false;
            gamePaused = true;
        }

        // Updates Player Moverment
        player.x = this.input.mousePointer.x;
        player.y = window.innerHeight - (player.height);

        //HealthBar position
        bar.x = player.x;
        bar.y = player.y;

        health.x = player.x - calculatedX;
        health.y = player.y;




        updateBullets();

        // Pattern spawner
        if (spawnTimer <= 0) {
            createPattern(this);
            coconutSpeed += 5;
            if (score > 500) {
                spawnTimer = 4;
            } else {
                spawnTimer = 6;
            }
        }
        updateCoconuts();

        timer -= deltaTime; // removes one second from timer
        spawnTimer -= deltaTime; // removes one second from spawnTimer

        // Checks the collision between bullet and coconut
        checkCollision();
    }
}


function checkCollision() {
    //When bullet hit coconut
    if (bullets.length > 0 && coconuts.length > 0) {
        for (let i = 0; i < bullets.length; i++) {
            for (let j = 0; j < coconuts.length; j++) {
                if (Phaser.Math.Distance.Between(bullets[i].x, bullets[i].y, coconuts[j].x, coconuts[j].y) < 26) {
                    bullets[i].destroy();
                    bullets.splice(i, 1);
                    coconuts[j].destroy();
                    explosion.play();
                    coconuts.splice(j, 1);
                    score += 10;
                    scoreText.setText('Score: ' + score);
                    return true;
                }
            }
        }


    }
    //When player hit coconut
    for (let i = 0; i < coconuts.length; i++) {
        if (Phaser.Math.Distance.Between(player.x, player.y, coconuts[i].x, coconuts[i].y) < 75) {
            coconuts[i].destroy();
            coconuts.splice(i, 1);
            takingDamage.play();
            healthValue -= 20;
            health.displayWidth = (healthValue / 100) * defaultHealthWidth;
            calculatedX = (defaultHealthWidth - (defaultHealthWidth * (healthValue / 100))) / 2;
            // GAME OVER
            if (healthValue <= 0) {
                gameOverText.setText('GAME OVER');

                for (let j = 0; j < coconuts.length; j++) {
                    coconuts[j].destroy();
                }
                for (let j = 0; j < bullets.length; j++) {
                    bullets[j].destroy();
                }
                bullets = [];
                coconuts = [];
                restartBtn.disabled = false;
                gamePaused = true;
            }
            return true;
        }
    }
}

// Updates Bullet logistics (position, isDead and more)
function updateBullets() {
    if (bullets.length > 0) {
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].y -= bulletSpeed * deltaTime;

            if (bullets[i].y < 0) {
                bullets[i].destroy();
                bullets.splice(i, 1);
            }
        }
    }
}

// Updates Coconuts logistics (position, isDead and more)
function updateCoconuts() {
    for (let i = 0; i < coconuts.length; i++) {
        coconuts[i].y += coconutSpeed * deltaTime;

        if (coconuts[i].y > window.innerHeight + 50) {
            coconuts[i].destroy();
            coconuts.splice(i, 1);
            score -= 5;
            scoreText.setText('Score: ' + score)
        }
    }
}


// Creates a random spawn pattern for the Enemies
function createPattern(create) {
    let patternNames = [
        "arrow",
        "reverseArrow",
        "smallReverseArrow",
        "smallArrow",
        "cube",
        "row",
        "column"
    ];

    let randomName = patternNames[Math.floor(Math.random() * patternNames.length)];
    let randomX = 0;

    switch (randomName) {
        case "arrow":
            coconut = create.add.sprite(canvasX / 2, 40, 'coconut');
            coconuts.push(coconut);
            for (let i = 1; i < 8; i++) {
                coconut = create.add.sprite(canvasX / 2 + 75 * i, 40 - 75 * i, 'coconut');
                coconuts.push(coconut);
                coconut = create.add.sprite(canvasX / 2 - 75 * i, 40 - 75 * i, 'coconut');
                coconuts.push(coconut);
            }
            break;

        case "reverseArrow":

            coconut = create.add.sprite(canvasX / 2, -550, 'coconut');
            coconuts.push(coconut);
            for (let i = 1; i < 8; i++) {
                coconut = create.add.sprite(canvasX / 2 + 75 * i, (-550 + 75 * i), 'coconut');
                coconuts.push(coconut);
                coconut = create.add.sprite(canvasX / 2 - 75 * i, (-550 + 75 * i), 'coconut');
                coconuts.push(coconut);
            }
            break;

        case "smallReverseArrow":
            randomX = Math.floor(200 + Math.random() * ((canvasX - 200) - 200));

            coconut = create.add.sprite(randomX, -175, 'coconut');
            coconuts.push(coconut);
            for (let i = 1; i < 3; i++) {
                coconut = create.add.sprite(randomX + 75 * i, (-175 + 75 * i), 'coconut');
                coconuts.push(coconut);
                coconut = create.add.sprite(randomX - 75 * i, (-175 + 75 * i), 'coconut');
                coconuts.push(coconut);
            }
            break;

        case "smallArrow":
            randomX = Math.floor(200 + Math.random() * ((canvasX - 200) - 200));

            coconut = create.add.sprite(randomX, 40, 'coconut');
            coconuts.push(coconut);
            for (let i = 1; i < 3; i++) {
                coconut = create.add.sprite(randomX + 75 * i, 40 - 75 * i, 'coconut');
                coconuts.push(coconut);
                coconut = create.add.sprite(randomX - 75 * i, 40 - 75 * i, 'coconut');
                coconuts.push(coconut);
            }
            break;

        case "cube":
            randomX = Math.floor(200 + Math.random() * ((canvasX - 200) - 200));

            let x = 1;

            for (let i = 0; i < 4; i++) {
                if (i == 0 || i == 4 - 1) {
                    x = 3;
                } else {
                    x = 1;
                }
                coconuts.push(create.add.sprite(randomX - (90 / x), -60 * i, 'coconut'));
                coconuts.push(create.add.sprite(randomX + (90 / x), -60 * i, 'coconut'));
            }
            break;

        case "row":
            let amount = 6;
            let offset = 50;
            for (let i = 0; i < amount; i++) {
                coconuts.push(create.add.sprite(offset + canvasX / amount * i, 0, 'coconut'));
            }
            break;

        case "column":
            randomX = Math.floor(45 + Math.random() * ((canvasX - 45) - 45));
            for (let i = 0; i < 7; i++) {
                coconuts.push(create.add.sprite(randomX, -60 * i, 'coconut'));
            }
            break;


        default:
            break;
    }


    return coconuts;
}