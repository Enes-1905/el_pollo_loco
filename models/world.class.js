class World {

    character = new Charackter();
    level = level1;
    throwableObjects = [];
    statusBar = new StatusBar();
    coinStatusBar = new CoinStatusBar();
    bottleStatusBar = new BottleStatusBar();
    bossStatusBar = new BossStatusBar();
    bossBarVisible = false;

    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    lastThrowTime = 0;
    gameOver = false;
    gameWon = false;

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
            if (this.gameOver || this.gameWon) {
                return;
            }

            this.checkBossBar();
            this.checkCharacterEnemyCollisions();
            this.checkBottleCollection();
            this.checkCoinCollection();
            this.checkThrowObjects();
            this.checkThrowableObjectCollisions();
            this.removeDeadEnemies();
            this.checkGameOver();
            this.checkGameWon();

            this.statusBar.setPercentage(this.character.energy);
            this.coinStatusBar.setPercentage(this.character.coins * 20);
            this.bottleStatusBar.setPercentage(this.character.bottles * 20);
        }, 100);
    }

    checkBossBar() {
        const boss = this.level.enemies.find(enemy => enemy instanceof Endboss);

        if (!boss) {
            return;
        }

        if (this.character.x > 1500) {
            this.bossBarVisible = true;
        }

        if (this.bossBarVisible) {
            this.bossStatusBar.setPercentage(boss.energy);
        }
    }

    checkCharacterEnemyCollisions() {
        this.level.enemies.forEach(enemy => {
            if (typeof enemy.isDead === 'function' && enemy.isDead()) {
                return;
            }

            if (this.character.isColliding(enemy)) {
                if (!(enemy instanceof Endboss) && this.characterIsAboveEnemy(enemy)) {
                    if (typeof enemy.hit === 'function') {
                        enemy.hit();
                    }
                    this.character.jump();
                } else {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);
                }
            }
        });
    }

    characterIsAboveEnemy(enemy) {
        return this.character.speedY < 0 &&
            this.character.y + this.character.height < enemy.y + 40;
    }

    checkBottleCollection() {
        if (!this.level.bottles) {
            return;
        }

        this.level.bottles = this.level.bottles.filter(bottle => {
            if (this.character.isColliding(bottle)) {
                this.character.collectBottle();
                return false;
            }
            return true;
        });
    }

    checkCoinCollection() {
        if (!this.level.coins) {
            return;
        }

        this.level.coins = this.level.coins.filter(coin => {
            if (this.character.isColliding(coin)) {
                this.character.collectCoin();
                return false;
            }
            return true;
        });
    }

    checkThrowObjects() {
        const now = Date.now();

        if (this.keyboard.throw && this.character.canThrowBottle() && now - this.lastThrowTime > 500) {
            const bottle = new ThrowableObject(
                this.character.x + this.character.width / 2,
                this.character.y + 100,
                this.character.otherdirection
            );

            this.throwableObjects.push(bottle);
            this.character.useBottle();
            this.lastThrowTime = now;
        }
    }

    checkThrowableObjectCollisions() {
        this.throwableObjects.forEach(bottle => {
            if (bottle.hasHit) {
                return;
            }

            this.level.enemies.forEach(enemy => {
                if (typeof enemy.isDead === 'function' && enemy.isDead()) {
                    return;
                }

                if (bottle.isColliding(enemy)) {
                    bottle.splash();

                    if (typeof enemy.hit === 'function') {
                        enemy.hit();
                    } else if (enemy.energy !== undefined) {
                        enemy.energy -= 20;

                        if (enemy.energy < 0) {
                            enemy.energy = 0;
                        }
                    }
                }
            });
        });

        this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.removeFromWorld);
    }

    checkGameOver() {
        if (typeof this.character.isDead === 'function' && this.character.isDead()) {
            this.gameOver = true;
            this.stopGame();

            setTimeout(() => {
                showGameOverScreen();
            }, 1000);
        }
    }

    checkGameWon() {
        const boss = this.level.enemies.find(enemy => enemy instanceof Endboss);

        if (!boss) {
            return;
        }

        if (typeof boss.isDead === 'function' && boss.isDead()) {
            const timePassed = Date.now() - boss.deadTime;

            if (timePassed > 1000) {
                this.gameWon = true;
                this.stopGame();
                showYouWinScreen();
            }
        }
    }

    stopGame() {
        this.keyboard.right = false;
        this.keyboard.left = false;
        this.keyboard.up = false;
        this.keyboard.down = false;
        this.keyboard.space = false;
        this.keyboard.throw = false;
    }

    removeDeadEnemies() {
        this.level.enemies = this.level.enemies.filter(enemy => {
            if (enemy instanceof Endboss) {
                return true;
            }

            if (typeof enemy.isDead === 'function' && enemy.isDead()) {
                const timePassed = Date.now() - enemy.deadTime;
                return timePassed < 800;
            }

            return true;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);

        this.ctx.restore();

        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.bottleStatusBar);

        if (this.bossBarVisible) {
            this.addToMap(this.bossStatusBar);
        }

        requestAnimationFrame(() => this.draw());
    }

    addObjectsToMap(objects) {
        if (!objects) {
            return;
        }

        objects.forEach(obj => this.addToMap(obj));
    }

    addToMap(mo) {
        if (!mo) {
            return;
        }

        if (mo.otherdirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);

        if (mo.otherdirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}