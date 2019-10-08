const lives = 5;
const maxEnemies = 10;
const totalEnemyTypes = 5;

var enemy;
var time;
var punchR;
var punchL;
var cursors;
var punchL_CD = 0;
var punchR_CD = 0;
var pressL = false;
var pressR = false;
var animR;
var animL;
var life = lives;
var score = 0;
var baseEnemiesPerWave = 20;
var enemiesPerWave = baseEnemiesPerWave;
var MaxSpawnTime;
var BaseSpawnTime;
var spawnTime;
var punchSound;
var combo = 0;
var maxCombo = 0;
var livesLeft;
var currentcombo;
var currentScore;

//Un Array por cada tipo de enemigo
var enemiesType1 = new Array(maxEnemies);
var enemiesType2 = new Array(maxEnemies);
var enemiesType3 = new Array(maxEnemies);
var enemiesType4 = new Array(maxEnemies);
var enemiesType5 = new Array(maxEnemies);

function enemy(type, id) {
    switch (type) {
        case 'type1':
            this.id = id;
            this.hits;
            this.bounces = Math.floor(Math.random() * 4);
            this.direction = Math.floor(Math.random() * 2) + 1;
            if (this.direction == 1) {//1 si el enemigo va hacia la der; 2 si va hacia la izq
                this.initPos = -100;
                this.initDir = 1;
                this.sprite = game.add.sprite(this.initPos, 300, 'skeleton');
            } else {
                this.initPos = 900;
                this.initDir = 2;
                this.sprite = game.add.sprite(this.initPos, 300, 'skeleton');
            }
            this.speed = 100;
            this.sprite.animations.add('walkRightSkeleton', [27, 28, 29, 30, 31, 32, 33, 34, 35]);
            this.sprite.animations.add('walkLeftSkeleton', [17, 16, 15, 14, 13, 12, 11, 10, 9]);
            this.isAlive = false;
            break;

        case 'type2':
            this.id = id;
            this.hits;
            this.bounces = Math.floor(Math.random() * 4);
            this.direction = Math.floor(Math.random() * 2) + 1;
            if (this.direction == 1) {
                this.initPos = -100;
                this.initDir = 1;
                this.sprite = game.add.sprite(this.initPos, 300, 'link');
            } else {
                this.initPos = 900;
                this.initDir = 2;
                this.sprite = game.add.sprite(this.initPos, 300, 'link');
            }
            this.speed = 80;
            this.sprite.scale.setTo(0.67, 0.62);
            this.sprite.animations.add('walkRightLink', [70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80]);
            this.sprite.animations.add('walkLeftLink', [59, 58, 57, 56, 55, 54, 53, 52, 51]);
            this.isAlive = false;
            break;

        case 'type3':
            this.id = id;
            this.hits;
            this.initPos = -100;
            this.sprite = game.add.sprite(this.initPos, 300, 'spritesheet');
            this.speed = 90;
            this.sprite.scale.setTo(0.8, 0.62);
            this.sprite.animations.add('walkRightPrueba');
            this.isAlive = false;
            break;
        case 'type4':
            this.id = id;
            this.bounces = Math.floor(Math.random() * 4);
            this.hits;
            this.direction = Math.floor(Math.random() * 2) + 1;
            if (this.direction == 1) {
                this.initPos = -100;
                this.initDir = 1;
                this.sprite = game.add.sprite(this.initPos, 260, 'link');
            } else {
                this.initPos = 900;
                this.initDir = 2;
                this.sprite = game.add.sprite(this.initPos, 260, 'link');
            }
            this.speed = 70;
            this.sprite.animations.add('walkRightLink', [70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80]);
            this.sprite.animations.add('walkLeftLink', [59, 58, 57, 56, 55, 54, 53, 52, 51]);
            this.isAlive = false;
            break;
        case 'type5':
            this.id = id;
            this.hits;
            this.initPos = -100;
            this.sprite = game.add.sprite(this.initPos, 300, 'link');
            this.sprite.tint = 0x960585;
            this.speed = 80;
            this.sprite.scale.setTo(0.67, 0.62);
            this.sprite.animations.add('walkRightLink', [70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80]);
            this.isAlive = false;
            break;
        default:
            console.log("Error");
            break;
    }

    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
}

PunchemOut.gameState = function () {

}

PunchemOut.gameState.prototype = {

    init: function () {

        if (game.global.DEBUG_MODE) {
            console.log("[DEBUG] Entering **GAME** state. LEVEL " + level);
        }
    },

    preload: function () {

    },

    create: function () {
        //Different levels
        switch (level) {
            case 1:
                MaxSpawnTime = 1500;
                BaseSpawnTime = 1000;
                break;
            case 2:
                MaxSpawnTime = 1400;
                BaseSpawnTime = 900;
                break;
            case 3:
                MaxSpawnTime = 1300;
                BaseSpawnTime = 800;
                break;
        }

        spawnTime = Math.floor(Math.random() * MaxSpawnTime) + BaseSpawnTime;

        //Draw background
        var fondo = this.add.image(0, 0, 'fondo');
        fondo.scale.setTo(0.3, 0.3);

        game.add.text(20, 20, "LEVEL " + level);

        livesLeft = game.add.text(300, 100, "Lives left: " + life);
        currentScore = game.add.text(300, 50, "Score: " + score);
        currentcombo = game.add.text(100, 500, 'x' + combo);

        //Controls
        cursors = this.input.keyboard.createCursorKeys();

        //Create punches and their animations
        punchL = game.add.sprite(150, 250, 'punch');
        punchR = game.add.sprite(500, 250, 'punch');

        animL = punchL.animations.add('punching');
        animR = punchR.animations.add('punching');

        animL.onComplete.add(stopAnimL, this);
        animR.onComplete.add(stopAnimR, this);

        for (var i = 0; i < maxEnemies; i++) {
            if (level >= 1) {
                enemiesType1[i] = new enemy("type1", i);
                enemiesType2[i] = new enemy("type2", i);
                enemiesType3[i] = new enemy("type3", i);
            }
            if (level >= 2) {
                enemiesType4[i] = new enemy("type4", i);
            }
            if (level >= 3) {
                enemiesType5[i] = new enemy("type5", i);
            }
        }

        if (level < 2) {
            enemiesType4 = [];
        }
        if (level < 3) {
            enemiesType5 = [];
        }

        punchSound = game.add.audio('punch');

        //Timer to spawn enemies
        timer = game.time.create(false);

        loopTimer = timer.loop(spawnTime, moveEnemy, this);

        timer.start();

        waveTimer = game.time.create(false);
    },

    update: function () {

        loopTimer.delay = spawnTime;

        turnLeft();
        turnRight();
        activePunch();
        collidePunchL();
        collidePunchR();
        if (Array.isArray(enemiesType5) && enemiesType5.length) {
            checkTPposition();
        }
        backToOrigin();
        checkEndgame();
        if (timer.paused && !checkEnemiesAlive()) {
            waveTimer.start();
            console.log("...");
            if (waveTimer.ms >= 2000) {
                newWaveText = game.add.text(300, 150, "NUEVA OLEADA");
                newWaveText.lifespan = 2000;
                game.time.events.add(0, function () { game.add.tween(newWaveText).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true); }, this);
                console.log("NUEVA OLEADA");
                timer.resume();
                waveTimer.stop();
            }
        }
    }
}

function moveEnemy() {
    if (enemiesPerWave > 0) {
        let type = Math.floor(Math.random() * totalEnemyTypes) + 1;
        switch (type) {
            case 1:
                for (var i = 0; i < maxEnemies; i++) {
                    if (enemiesType1[i].sprite.body.position.x == -100) {
                        enemiesType1[i].isAlive = true;
                        enemiesType1[i].hits = 1;
                        enemiesType1[i].sprite.body.velocity.x = enemiesType1[i].speed;
                        enemiesType1[i].sprite.animations.play('walkRightSkeleton', 10, true);
                        enemiesPerWave--;
                        spawnTime = Math.floor(Math.random() * MaxSpawnTime) + BaseSpawnTime;
                        console.log(enemiesPerWave);
                        break;
                    } else if (enemiesType1[i].sprite.body.position.x == 900) {
                        enemiesType1[i].isAlive = true;
                        enemiesType1[i].hits = 1;
                        enemiesType1[i].sprite.body.velocity.x = -enemiesType1[i].speed;
                        enemiesType1[i].sprite.animations.play('walkLeftSkeleton', 10, true);
                        enemiesPerWave--;
                        spawnTime = Math.floor(Math.random() * MaxSpawnTime) + BaseSpawnTime;
                        console.log(enemiesPerWave);
                        break;
                    }
                }
                break;

            case 2:
                for (var i = 0; i < maxEnemies; i++) {
                    if (enemiesType2[i].sprite.body.position.x == -100) {
                        enemiesType2[i].isAlive = true;
                        enemiesType2[i].hits = 1;
                        enemiesType2[i].sprite.body.velocity.x = enemiesType2[i].speed;
                        enemiesType2[i].sprite.animations.play('walkRightLink', 10, true);
                        enemiesPerWave--;
                        spawnTime = Math.floor(Math.random() * MaxSpawnTime) + BaseSpawnTime;
                        console.log(enemiesPerWave);
                        break;
                    } else if (enemiesType2[i].sprite.body.position.x == 900) {
                        enemiesType2[i].isAlive = true;
                        enemiesType2[i].hits = 1;
                        enemiesType2[i].sprite.body.velocity.x = -enemiesType2[i].speed;
                        enemiesType2[i].sprite.animations.play('walkLeftLink', 10, true);
                        enemiesPerWave--;
                        spawnTime = Math.floor(Math.random() * MaxSpawnTime) + BaseSpawnTime;
                        console.log(enemiesPerWave);
                        break;
                    }
                }
                break;

            case 3:
                for (var i = 0; i < maxEnemies; i++) {
                    if (enemiesType3[i].sprite.body.position.x == -100) {
                        enemiesType3[i].isAlive = true;
                        enemiesType3[i].hits = 1;
                        enemiesType3[i].sprite.body.velocity.x = enemiesType3[i].speed;
                        enemiesType3[i].sprite.animations.play('walkRightPrueba', 10, true);
                        enemiesPerWave--;
                        spawnTime = Math.floor(Math.random() * MaxSpawnTime) + BaseSpawnTime;
                        console.log(enemiesPerWave);
                        break;
                    }
                }
                break;
            case 4:
                if (Array.isArray(enemiesType4) && enemiesType4.length) {
                    for (var i = 0; i < maxEnemies; i++) {
                        if (enemiesType4[i].sprite.body.position.x == -100) {
                            enemiesType4[i].isAlive = true;
                            enemiesType4[i].hits = 2;
                            enemiesType4[i].sprite.body.velocity.x = enemiesType4[i].speed;
                            enemiesType4[i].sprite.animations.play('walkRightLink', 10, true);
                            enemiesPerWave--;
                            spawnTime = Math.floor(Math.random() * MaxSpawnTime) + BaseSpawnTime;
                            console.log(enemiesPerWave);
                            break;
                        } else if (enemiesType4[i].sprite.body.position.x == 900) {
                            enemiesType4[i].isAlive = true;
                            enemiesType4[i].hits = 2;
                            enemiesType4[i].sprite.body.velocity.x = -enemiesType4[i].speed;
                            enemiesType4[i].sprite.animations.play('walkLeftLink', 10, true);
                            enemiesPerWave--;
                            spawnTime = Math.floor(Math.random() * MaxSpawnTime) + BaseSpawnTime;
                            console.log(enemiesPerWave);
                            break;
                        }
                    }
                }
                break;
            case 5:
                if (Array.isArray(enemiesType5) && enemiesType5.length) {
                    for (var i = 0; i < maxEnemies; i++) {
                        if (enemiesType5[i].sprite.body.position.x == -100) {
                            enemiesType5[i].isAlive = true;
                            enemiesType5[i].hits = 1;
                            enemiesType5[i].sprite.body.velocity.x = enemiesType5[i].speed;
                            enemiesType5[i].sprite.animations.play('walkRightLink', 10, true);
                            enemiesPerWave--;
                            spawnTime = Math.floor(Math.random() * MaxSpawnTime) + BaseSpawnTime;
                            console.log(enemiesPerWave);
                            break;
                        }
                    }
                }
                break;
            default:
                console.log("Error");
                break;
        }
    } else {
        timer.pause();

        switch (level) {
            case 1:
                xSpeed(1.1);
                decSpawnTime(0.9);
                break;
            case 2:
                xSpeed(1.2);
                decSpawnTime(0.8);
                break;
            case 3:
                xSpeed(1.3);
                decSpawnTime(0.7);
                break;
        }

        baseEnemiesPerWave += 10;
        enemiesPerWave = baseEnemiesPerWave;
    }

}

function turnLeft() {
    for (var i = 0; i < maxEnemies; i++) {
        if (enemiesType1[i].sprite.body.position.x >= 725 && enemiesType1[i].bounces > 0 && enemiesType1[i].direction == 1) {
            enemiesType1[i].sprite.body.velocity.x = - enemiesType1[i].speed;
            enemiesType1[i].sprite.animations.play('walkLeftSkeleton', 10, true);
            enemiesType1[i].bounces--;
            enemiesType1[i].direction = 2;
        }
        if (enemiesType2[i].sprite.body.position.x >= 725 && enemiesType2[i].bounces > 0 && enemiesType2[i].direction == 1) {
            enemiesType2[i].sprite.body.velocity.x = -enemiesType2[i].speed;
            enemiesType2[i].sprite.animations.play('walkLeftLink', 10, true);
            enemiesType2[i].bounces--;
            enemiesType2[i].direction = 2;
        }
        if (Array.isArray(enemiesType4) && enemiesType4.length) {
            if (enemiesType4[i].sprite.body.position.x >= 725 && enemiesType4[i].bounces > 0 && enemiesType4[i].direction == 1) {
                enemiesType4[i].sprite.body.velocity.x = -enemiesType4[i].speed;
                enemiesType4[i].sprite.animations.play('walkLeftLink', 10, true);
                enemiesType4[i].bounces--;
                enemiesType4[i].direction = 2;
            }
        }
    }
}

function turnRight() {
    for (var i = 0; i < maxEnemies; i++) {
        if (enemiesType1[i].sprite.body.position.x <= 25 && enemiesType1[i].bounces > 0 && enemiesType1[i].direction == 2) {
            enemiesType1[i].sprite.body.velocity.x = enemiesType1[i].speed;
            enemiesType1[i].sprite.animations.play('walkRightSkeleton', 10, true);
            enemiesType1[i].bounces--;
            enemiesType1[i].direction = 1;
        }
        if (enemiesType2[i].sprite.body.position.x <= 25 && enemiesType2[i].bounces > 0 && enemiesType2[i].direction == 2) {
            enemiesType2[i].sprite.body.velocity.x = enemiesType2[i].speed;
            enemiesType2[i].sprite.animations.play('walkRightLink', 10, true);
            enemiesType2[i].bounces--;
            enemiesType2[i].direction = 1;
        }
        if (Array.isArray(enemiesType4) && enemiesType4.length) {
            if (enemiesType4[i].sprite.body.position.x <= 25 && enemiesType4[i].bounces > 0 && enemiesType4[i].direction == 2) {
                enemiesType4[i].sprite.body.velocity.x = enemiesType4[i].speed;
                enemiesType4[i].sprite.animations.play('walkRightLink', 10, true);
                enemiesType4[i].bounces--;
                enemiesType4[i].direction = 1;
            }
        }
    }
}

function activePunch() {
    if (cursors.left.isDown && punchL_CD == 0) {
        animL.play('punching', 8);
        pressL = true;
        punchL_CD = 30;
    }
    if (cursors.right.isDown && punchR_CD == 0) {
        animR.play('punching', 8);
        pressR = true;
        punchR_CD = 30;
    }
    if (pressL) {
        punchL_CD--;
        if (punchL_CD == 0) {
            pressL = false;
        }

    }
    if (pressR) {
        punchR_CD--;
        if (punchR_CD == 0) {
            pressR = false;
        }
    }

}

function checkOverlapL() {
    for (var i = 0; i < maxEnemies; i++) {
        if (enemiesType1[i].sprite.body.position.x >= 120 && enemiesType1[i].sprite.body.position.x <= 250) {
            if (enemiesType1[i].hits >= 1) {
                enemiesType1[i].hits--;
                punchSound.play();
                enemiesType1[i].sprite.body.velocity.x = 0;
                enemiesType1[i].sprite.body.velocity.y = 150;

                combo++;
                giveScore(enemiesType1[i].sprite.body.position.x);

                console.log('combo : ', combo);
            }
        }
        if (enemiesType2[i].sprite.body.position.x >= 120 && enemiesType2[i].sprite.body.position.x <= 250) {
            if (enemiesType2[i].hits >= 1) {
                enemiesType2[i].hits--;
                punchSound.play();
                enemiesType2[i].sprite.body.velocity.x = 0;
                enemiesType2[i].sprite.body.velocity.y = 150;

                combo++;
                giveScore(enemiesType2[i].sprite.body.position.x);

                console.log('combo : ', combo);
            }
        }
        if (enemiesType3[i].sprite.body.position.x >= 120 && enemiesType3[i].sprite.body.position.x <= 250) {
            if (enemiesType3[i].hits >= 1) {
                enemiesType3[i].hits--;
                punchSound.play();
                enemiesType3[i].sprite.body.velocity.x = 0;
                enemiesType3[i].sprite.body.velocity.y = 150;

                combo++;
                giveScore(enemiesType3[i].sprite.body.position.x);

                console.log('combo : ', combo);
            }
        }
        if (Array.isArray(enemiesType4) && enemiesType4.length) {
            if (enemiesType4[i].sprite.body.position.x >= 100 && enemiesType4[i].sprite.body.position.x <= 250) {
                if (enemiesType4[i].hits >= 2) {
                    enemiesType4[i].sprite.tint = 0xcc0000;
                } else if (enemiesType4[i].hits == 1) {
                    punchSound.play();
                    enemiesType4[i].sprite.body.velocity.x = 0;
                    enemiesType4[i].sprite.body.velocity.y = 150;

                    combo++;
                    giveScore(enemiesType4[i].sprite.body.position.x);

                    console.log('combo : ', combo);
                }
                enemiesType4[i].hits--;
            }
        }
        if (Array.isArray(enemiesType5) && enemiesType5.length) {
            if (enemiesType5[i].sprite.body.position.x >= 120 && enemiesType5[i].sprite.body.position.x <= 250) {
                if (enemiesType5[i].hits >= 1) {
                    enemiesType5[i].hits--;
                    punchSound.play();
                    enemiesType5[i].sprite.body.velocity.x = 0;
                    enemiesType5[i].sprite.body.velocity.y = 150;

                    combo++;
                    giveScore(enemiesType5[i].sprite.body.position.x);

                    console.log('combo : ', combo);
                }
            }
        }
    }

}
function checkOverlapR() {
    for (var i = 0; i < maxEnemies; i++) {
        if (enemiesType1[i].sprite.body.position.x >= 470 && enemiesType1[i].sprite.body.position.x <= 600) {
            if (enemiesType1[i].hits >= 1) {
                enemiesType1[i].hits--;
                punchSound.play();
                enemiesType1[i].sprite.body.velocity.x = 0;
                enemiesType1[i].sprite.body.velocity.y = 150;

                combo++;
                giveScore(enemiesType1[i].sprite.body.position.x);

                console.log('combo : ', combo);
            }
        }
        if (enemiesType2[i].sprite.body.position.x >= 470 && enemiesType2[i].sprite.body.position.x <= 600) {
            if (enemiesType2[i].hits >= 1) {
                enemiesType2[i].hits--;
                punchSound.play();
                enemiesType2[i].sprite.body.velocity.x = 0;
                enemiesType2[i].sprite.body.velocity.y = 150;

                combo++;
                giveScore(enemiesType2[i].sprite.body.position.x);

                console.log('combo : ', combo);
            }
        }
        if (enemiesType3[i].sprite.body.position.x >= 470 && enemiesType3[i].sprite.body.position.x <= 600) {
            if (enemiesType3[i].hits >= 1) {
                enemiesType3[i].hits--;
                punchSound.play();
                enemiesType3[i].sprite.body.velocity.x = 0;
                enemiesType3[i].sprite.body.velocity.y = 150;

                combo++;
                giveScore(enemiesType3[i].sprite.body.position.x);

                console.log('combo : ', combo);
            }
        }
        if (Array.isArray(enemiesType4) && enemiesType4.length) {
            if (enemiesType4[i].sprite.body.position.x >= 450 && enemiesType4[i].sprite.body.position.x <= 600) {
                if (enemiesType4[i].hits >= 2) {
                    enemiesType4[i].sprite.tint = 0xcc0000;
                } else if (enemiesType4[i].hits == 1) {
                    punchSound.play();
                    enemiesType4[i].sprite.body.velocity.x = 0;
                    enemiesType4[i].sprite.body.velocity.y = 150;

                    combo++;
                    giveScore(enemiesType4[i].sprite.body.position.x);

                    console.log('combo : ', combo);
                }
                enemiesType4[i].hits--;
            }
        }
        if (Array.isArray(enemiesType5) && enemiesType5.length) {
            if (enemiesType5[i].sprite.body.position.x >= 470 && enemiesType5[i].sprite.body.position.x <= 600) {
                if (enemiesType5[i].hits >= 1) {
                    enemiesType5[i].hits--;
                    punchSound.play();
                    enemiesType5[i].sprite.body.velocity.x = 0;
                    enemiesType5[i].sprite.body.velocity.y = 150;

                    combo++;
                    giveScore(enemiesType5[i].sprite.body.position.x);

                    console.log('combo : ', combo);
                }
            }
        }
    }
}

function checkTPposition() {
    for (var i = 0; i < maxEnemies; i++) {
        if (enemiesType5[i].sprite.body.position.x >= 50 && enemiesType5[i].sprite.body.position.x <= 75) {
            //sonido de teleport
            enemiesType5[i].sprite.body.position.x = 300;
        }
    }
}

function collidePunchL() {

    animL.onStart.add(checkOverlapL, this)
}

function collidePunchR() {
    animR.onStart.add(checkOverlapR, this)
}

function stopAnimL() {
    animL.stop(true);
}

function stopAnimR() {
    animR.stop(true);
}

function xSpeed(incrementInSpeed) {
    for (var i = 0; i < maxEnemies; i++) {
        enemiesType1[i].speed *= incrementInSpeed;
        enemiesType2[i].speed *= incrementInSpeed;
        enemiesType3[i].speed *= incrementInSpeed;
        if (Array.isArray(enemiesType4) && enemiesType4.length) {
            enemiesType4[i].speed *= incrementInSpeed;
        }
        if (Array.isArray(enemiesType5) && enemiesType5.length) {
            enemiesType5[i].speed *= incrementInSpeed;
        }
    }

}

function backToOrigin() {
    for (var i = 0; i < maxEnemies; i++) {
        //Para enemigos Tipo1
        if (enemiesType1[i].bounces <= 0 && enemiesType1[i].direction == 1 && enemiesType1[i].sprite.body.position.x >= 825) {
            enemiesType1[i].isAlive = false;
            enemiesType1[i].sprite.body.velocity.x = 0;
            enemiesType1[i].sprite.body.position.x = enemiesType1[i].initPos;
            enemiesType1[i].direction = enemiesType1[i].initDir;
            enemiesType1[i].bounces = Math.floor(Math.random() * 4);
            enemiesType1[i].sprite.animations.stop();
            if (combo > maxCombo)
                maxCombo = combo;
            combo = 0;
            life--;
        }
        if (enemiesType1[i].bounces <= 0 && enemiesType1[i].direction == 2 && enemiesType1[i].sprite.body.position.x <= -25) {
            enemiesType1[i].isAlive = false;
            enemiesType1[i].sprite.body.velocity.x = 0;
            enemiesType1[i].sprite.body.position.x = enemiesType1[i].initPos;
            enemiesType1[i].direction = enemiesType1[i].initDir;
            enemiesType1[i].bounces = Math.floor(Math.random() * 4);
            enemiesType1[i].sprite.animations.stop();
            if (combo > maxCombo)
                maxCombo = combo;
            combo = 0;
            life--;
        }
        if (enemiesType1[i].sprite.body.position.y >= 625) {
            enemiesType1[i].isAlive = false;
            enemiesType1[i].sprite.body.velocity.y = 0;
            enemiesType1[i].sprite.body.position.x = enemiesType1[i].initPos;
            enemiesType1[i].sprite.body.position.y = 300;
            enemiesType1[i].direction = enemiesType1[i].initDir;
            enemiesType1[i].bounces = Math.floor(Math.random() * 4);
            enemiesType1[i].sprite.animations.stop();
        }

        //Para enemigos Tipo2
        if (enemiesType2[i].bounces <= 0 && enemiesType2[i].direction == 1 && enemiesType2[i].sprite.body.position.x >= 825) {
            enemiesType2[i].isAlive = false;
            enemiesType2[i].sprite.body.velocity.x = 0;
            enemiesType2[i].sprite.body.position.x = enemiesType2[i].initPos;
            enemiesType2[i].direction = enemiesType2[i].initDir;
            enemiesType2[i].bounces = Math.floor(Math.random() * 4);
            enemiesType2[i].sprite.animations.stop();
            if (combo > maxCombo)
                maxCombo = combo;
            combo = 0;
            life--;
        }
        if (enemiesType2[i].bounces <= 0 && enemiesType2[i].direction == 2 && enemiesType2[i].sprite.body.position.x <= -25) {
            enemiesType2[i].isAlive = false;
            enemiesType2[i].sprite.body.velocity.x = 0;
            enemiesType2[i].sprite.body.position.x = enemiesType2[i].initPos;
            enemiesType2[i].direction = enemiesType2[i].initDir;
            enemiesType2[i].bounces = Math.floor(Math.random() * 4);
            enemiesType2[i].sprite.animations.stop();
            if (combo > maxCombo)
                maxCombo = combo;
            combo = 0;
            life--;
        }
        if (enemiesType2[i].sprite.body.position.y >= 625) {
            enemiesType2[i].isAlive = false;
            enemiesType2[i].sprite.body.velocity.y = 0;
            enemiesType2[i].sprite.body.position.x = enemiesType2[i].initPos;
            enemiesType2[i].sprite.body.position.y = 300;
            enemiesType2[i].direction = enemiesType2[i].initDir;
            enemiesType2[i].bounces = Math.floor(Math.random() * 4);
            enemiesType2[i].sprite.animations.stop();
        }

        //Para enemigos Tipo3
        if (enemiesType3[i].sprite.body.position.x >= 825) {
            enemiesType3[i].isAlive = false;
            enemiesType3[i].sprite.body.velocity.x = 0;
            enemiesType3[i].sprite.body.position.x = enemiesType3[i].initPos;
            enemiesType3[i].bounces = Math.floor(Math.random() * 4);
            enemiesType3[i].sprite.animations.stop();
            if (combo > maxCombo)
                maxCombo = combo;
            combo = 0;
            life--;
        }

        if (enemiesType3[i].sprite.body.position.y >= 625) {
            enemiesType3[i].isAlive = false;
            enemiesType3[i].sprite.body.velocity.y = 0;
            enemiesType3[i].sprite.body.position.x = enemiesType3[i].initPos;
            enemiesType3[i].sprite.body.position.y = 300;
            enemiesType3[i].bounces = Math.floor(Math.random() * 4);
            enemiesType3[i].sprite.animations.stop();
        }

        //Para enemigos Tipo4
        if (Array.isArray(enemiesType4) && enemiesType4.length) {
            if (enemiesType4[i].bounces <= 0 && enemiesType4[i].direction == 1 && enemiesType4[i].sprite.body.position.x >= 825) {
                enemiesType4[i].sprite.tint = 0xffffff;
                enemiesType4[i].isAlive = false;
                enemiesType4[i].hits = 2;
                enemiesType4[i].sprite.body.velocity.x = 0;
                enemiesType4[i].sprite.body.position.x = enemiesType4[i].initPos;
                enemiesType4[i].direction = enemiesType4[i].initDir;
                enemiesType4[i].bounces = Math.floor(Math.random() * 4);
                enemiesType4[i].sprite.animations.stop();
                if (combo > maxCombo)
                    maxCombo = combo;
                combo = 0;
                life--;
            }
            if (enemiesType4[i].bounces <= 0 && enemiesType4[i].direction == 2 && enemiesType4[i].sprite.body.position.x <= -25) {
                enemiesType4[i].sprite.tint = 0xffffff;
                enemiesType4[i].isAlive = false;
                enemiesType4[i].hits = 2;
                enemiesType4[i].sprite.body.velocity.x = 0;
                enemiesType4[i].sprite.body.position.x = enemiesType4[i].initPos;
                enemiesType4[i].direction = enemiesType4[i].initDir;
                enemiesType4[i].bounces = Math.floor(Math.random() * 4);
                enemiesType4[i].sprite.animations.stop();
                if (combo > maxCombo)
                    maxCombo = combo;
                combo = 0;
                life--;
            }
            if (enemiesType4[i].sprite.body.position.y >= 625) {
                enemiesType4[i].sprite.tint = 0xffffff;
                enemiesType4[i].isAlive = false;
                enemiesType4[i].hits = 2;
                enemiesType4[i].sprite.body.velocity.y = 0;
                enemiesType4[i].sprite.body.position.x = enemiesType4[i].initPos;
                enemiesType4[i].sprite.body.position.y = 260;
                enemiesType4[i].direction = enemiesType4[i].initDir;
                enemiesType4[i].bounces = Math.floor(Math.random() * 4);
                enemiesType4[i].sprite.animations.stop();
            }
        }

        //Para enemigos Tipo5
        if (Array.isArray(enemiesType5) && enemiesType5.length) {
            if (enemiesType5[i].sprite.body.position.x >= 825) {
                enemiesType5[i].isAlive = false;
                enemiesType5[i].sprite.body.velocity.x = 0;
                enemiesType5[i].sprite.body.position.x = enemiesType5[i].initPos;
                enemiesType5[i].direction = enemiesType5[i].initDir;
                enemiesType5[i].bounces = Math.floor(Math.random() * 4);
                enemiesType5[i].sprite.animations.stop();
                if (combo > maxCombo)
                    maxCombo = combo;
                combo = 0;
                life--;
            }
            if (enemiesType5[i].sprite.body.position.y >= 625) {
                enemiesType5[i].isAlive = false;
                enemiesType5[i].sprite.body.velocity.y = 0;
                enemiesType5[i].sprite.body.position.x = enemiesType5[i].initPos;
                enemiesType5[i].sprite.body.position.y = 300;
                enemiesType5[i].direction = enemiesType5[i].initDir;
                enemiesType5[i].bounces = Math.floor(Math.random() * 4);
                enemiesType5[i].sprite.animations.stop();
            }
        }
    }
    currentcombo.setText("x" + combo);
    livesLeft.setText("Lives left: " + life);
}

function checkEndgame() {
    //console.log("Vidas restantes: " + life);

    if (life <= 0) {
        game.camera.fade(0x000000, 500);
        game.camera.onFadeComplete.add(function () { game.state.start("endgameState"); }, this);
    }
}

function decSpawnTime(decreaseInSpawn) {
    MaxSpawnTime *= decreaseInSpawn;
    BaseSpawnTime *= decreaseInSpawn;
    console.log(MaxSpawnTime);
    console.log(BaseSpawnTime);
}

function checkEnemiesAlive() {
    for (var i = 0; i < maxEnemies; i++) {
        if (enemiesType1[i].isAlive || enemiesType2[i].isAlive || enemiesType3[i].isAlive) {
            return true;
        } else if (Array.isArray(enemiesType4) && enemiesType4.length) {
            if (enemiesType4[i].isAlive) {
                return true;
            } else if (Array.isArray(enemiesType5) && enemiesType5.length) {
                if (enemiesType5[i].isAlive) {
                    return true;
                }
            }
        }
    }

    return false;
}

function giveScore(enemyPos) {
    if ((enemyPos > 170 && enemyPos < 210) || (enemyPos > 520 && enemyPos < 560)) {
        scoreToGive = 300 * combo;

        textScore = game.add.text(enemyPos, 200, "+300", style2);
    } else {
        scoreToGive = 100 * combo;

        textScore = game.add.text(enemyPos, 200, "+100", style2);
    }

    textScore.lifespan = 1500;
    game.time.events.add(500, function () { game.add.tween(textScore).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true); }, this);
    game.time.events.add(0, function () { game.add.tween(textScore).to({ y: 100 }, 1500, Phaser.Easing.Linear.None, true); }, this);

    console.log("x" + combo + " = " + scoreToGive);
    score += scoreToGive;

    currentScore.setText("Score: " + score);
    currentcombo.setText("x" + combo);
}