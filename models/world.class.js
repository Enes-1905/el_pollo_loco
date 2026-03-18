/**
 * Verwaltet die komplette Spielwelt.
 * Hier werden Kollisionen, Gegner, Objekte und das Rendering gesteuert.
 */
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
    isPaused = false;

    /**
     * Erstellt eine neue Spielwelt.
     * @param {HTMLCanvasElement} canvas
     * @param {Keyboard} keyboard
     */
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
        this.level.enemies.forEach(enemy => enemy.world = this);
    }

    run() {
        setInterval(() => {
            if (this.gameOver || this.gameWon || this.isPaused) {
                return;
            }

            this.updateWorld();
        }, 1000 / 60);
    }

    /**
     * Aktualisiert die Spielwelt.
     */
    updateWorld() {
        this.checkBossBar();
        this.checkCharacterEnemyCollisions();
        this.checkBottleCollection();
        this.checkCoinCollection();
        this.checkThrowObjects();
        this.checkThrowableObjectCollisions();
        this.removeDeadEnemies();
        this.checkGameOver();
        this.checkGameWon();
        this.updateStatusBars();
    }

    updateStatusBars() {
        this.statusBar.setPercentage(this.character.energy);
        this.coinStatusBar.setPercentage(this.character.coins * 20);
        this.bottleStatusBar.setPercentage(this.character.bottles * 20);
    }

    checkBossBar() {
        const boss = this.level.enemies.find(enemy => enemy instanceof Endboss);

        if (!boss) {
            return;
        }

        if (this.character.x > 1500) {
            this.bossBarVisible = true;
            boss.activated = true;
            playBossMusic();
        }

        if (this.bossBarVisible) {
            this.bossStatusBar.setPercentage(boss.energy);
        }
    }

    /**
     * Prüft Kollisionen zwischen Charakter und Gegnern.
     */
    checkCharacterEnemyCollisions() {
        this.level.enemies.forEach(enemy => {
            if (typeof enemy.isDead === 'function' && enemy.isDead()) {
                return;
            }

            this.handleEnemyCollision(enemy);
        });
    }

    handleEnemyCollision(enemy) {
        if (enemy instanceof Endboss) {
            this.handleBossCollision(enemy);
            return;
        }

        if (!this.character.isColliding(enemy)) {
            return;
        }

        if (this.characterIsJumpingOnEnemy(enemy)) {
            this.killEnemyFromTop(enemy);
            return;
        }

        this.damageCharacter();
    }

    characterIsJumpingOnEnemy(enemy) {
        const characterBottom = this.character.y + this.character.height;
        const enemyTop = enemy.y + 20;
        const isFalling = this.character.speedY < 0;

        return isFalling && characterBottom <= enemyTop + 25;
    }

    killEnemyFromTop(enemy) {
        if (typeof enemy.hit === 'function') {
            enemy.hit();
            playChickenSound();
        }

        this.character.y = enemy.y - this.character.height + 20;
        this.character.jump();
    }

    damageCharacter() {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
    }

    handleBossCollision(boss) {
        if (!boss.attacking) {
            return;
        }

        if (!boss.characterInAttackRange(this.character)) {
            return;
        }

        if (this.character.isHurt()) {
            return;
        }

        this.damageCharacter();
        this.pushCharacterBack(boss);
    }

    pushCharacterBack(boss) {
        if (this.character.x < boss.x) {
            this.character.x -= 45;
        } else {
            this.character.x += 45;
        }
    }

    checkBottleCollection() {
        if (!this.level.bottles) {
            return;
        }

        this.level.bottles = this.level.bottles.filter(bottle => {
            if (this.character.isColliding(bottle)) {
                this.character.collectBottle();
                playBottleCollectSound();
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
                playCoinSound();
                return false;
            }

            return true;
        });
    }

    checkThrowObjects() {
        const now = Date.now();

        if (
            this.keyboard.throw &&
            this.character.canThrowBottle() &&
            now - this.lastThrowTime > 500
        ) {
            this.throwBottle();
            this.lastThrowTime = now;
        }
    }

    /**
     * Erstellt eine geworfene Flasche des Spielers.
     */
    throwBottle() {
        const bottle = new ThrowableObject(
            this.character.x + this.character.width / 2,
            this.character.y + 20,
            this.character.otherdirection
        );

        this.throwableObjects.push(bottle);
        this.character.useBottle();
    }

    checkThrowableObjectCollisions() {
        this.throwableObjects.forEach(bottle => {
            if (bottle.hasHit) {
                return;
            }

            for (let i = 0; i < this.level.enemies.length; i++) {
                const enemy = this.level.enemies[i];

                if (typeof enemy.isDead === 'function' && enemy.isDead()) {
                    continue;
                }

                if (bottle.isColliding(enemy) && !bottle.hasHit) {
                    bottle.splash();

                    if (typeof enemy.hit === 'function') {
                        enemy.hit();
                    }

                    break;
                }
            }
        });

        this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.removeFromWorld);
    }

    checkGameOver() {
        if (!this.character.isDead()) {
            return;
        }

        this.gameOver = true;
        this.stopGame();
        setTimeout(() => showGameOverScreen(), 1000);
    }

    checkGameWon() {
        const boss = this.level.enemies.find(enemy => enemy instanceof Endboss);

        if (!boss || !boss.isDead()) {
            return;
        }

        if (Date.now() - boss.deadTime > 1000) {
            this.gameWon = true;
            this.stopGame();
            showYouWinScreen();
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
            return this.shouldKeepEnemy(enemy);
        });
    }

    shouldKeepEnemy(enemy) {
        if (enemy instanceof Endboss) {
            return true;
        }

        if (typeof enemy.isDead !== 'function') {
            return true;
        }

        if (!enemy.isDead()) {
            return true;
        }

        return Date.now() - enemy.deadTime < 800;
    }

    /**
     * Zeichnet alle Spielobjekte auf das Canvas.
     */
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