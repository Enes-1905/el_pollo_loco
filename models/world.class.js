/**
 * Manages the complete game world.
 * Handles collisions, enemies, objects, and rendering.
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
     * Creates a new game world.
     * @param {HTMLCanvasElement} canvas - The game canvas
     * @param {Keyboard} keyboard - The keyboard object
     */
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
        this.run();
    }
    /**
     * Connects the world with the character and enemies.
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => enemy.world = this);
    }
    /**
     * Starts the update loop of the world.
     */
    run() {
        setInterval(() => {
            if (this.shouldStopUpdate()) {
                return;     }
            this.updateWorld();
        }, 1000 / 60);
    }
    /**
     * Checks whether the world should currently stop updating.
     * @returns {boolean}
     */
    shouldStopUpdate() {
        return this.gameOver || this.gameWon || this.isPaused;
    }
    /**
     * Updates the complete game world.
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
    /**
     * Updates all status bars.
     */
    updateStatusBars() {
        this.statusBar.setPercentage(this.character.energy);
        this.coinStatusBar.setPercentage(this.character.coins * 20);
        this.bottleStatusBar.setPercentage(this.character.bottles * 20);
    }
    /**
     * Checks whether the boss bar should be visible.
     */
    checkBossBar() {
        const boss = this.findBoss();
        if (!boss) {
            return;   }
        this.activateBossIfNear(boss);
        this.updateBossBar(boss);
    }
    /**
     * Finds the endboss in the enemy list.
     * @returns {Endboss|undefined}
     */
    findBoss() {
        return this.level.enemies.find(enemy => enemy instanceof Endboss);
    }
    /**
     * Activates the boss if the character is close enough.
     * @param {Endboss} boss - The endboss
     */
    activateBossIfNear(boss) {
        if (this.character.x <= 1500) {
            return; }
        this.bossBarVisible = true;
        boss.activated = true;
        playBossMusic();
    }
    /**
     * Updates the boss status bar.
     * @param {Endboss} boss - The endboss
     */
    updateBossBar(boss) {
        if (!this.bossBarVisible) {
            return;     }
        this.bossStatusBar.setPercentage(boss.energy);
    }
    /**
     * Checks collisions between the character and enemies.
     */
    checkCharacterEnemyCollisions() {
        this.level.enemies.forEach(enemy => {
            if (this.isEnemyDead(enemy)) {
                return;    }
            this.handleEnemyCollision(enemy);
        });
    }
    /**
     * Checks whether an enemy is dead.
     * @param {Object} enemy - Enemy object
     * @returns {boolean}
     */
    isEnemyDead(enemy) {
        return typeof enemy.isDead === 'function' && enemy.isDead();
    }
    /**
     * Handles a collision with an enemy.
     * @param {Object} enemy - Enemy object
     */
    handleEnemyCollision(enemy) {
        if (enemy instanceof Endboss) {
            this.handleBossCollision(enemy);
            return; }
        if (!this.character.isColliding(enemy)) {
            return; }
        if (this.characterIsJumpingOnEnemy(enemy)) {
            this.killEnemyFromTop(enemy);
            return;  }
        this.damageCharacter();
    }
    /**
     * Checks whether the character is jumping on an enemy.
     * @param {Object} enemy - Enemy object
     * @returns {boolean}
     */
    characterIsJumpingOnEnemy(enemy) {
        const characterBottom = this.character.y + this.character.height;
        const enemyTop = enemy.y + 20;
        const isFalling = this.character.speedY < 0;
        return isFalling && characterBottom <= enemyTop + 25;
    }
    /**
     * Kills an enemy by jumping on top of it.
     * @param {Object} enemy - Enemy object
     */
    killEnemyFromTop(enemy) {
        this.hitEnemy(enemy);
        this.bounceCharacterAfterHit(enemy);
    }
    /**
     * Deals damage to an enemy.
     * @param {Object} enemy - Enemy object
     */
    hitEnemy(enemy) {
        if (typeof enemy.hit !== 'function') {
            return;  }
        enemy.hit();
        playChickenSound();
    }
    /**
     * Makes the character bounce upward after a hit.
     * @param {Object} enemy - Enemy object
     */
    bounceCharacterAfterHit(enemy) {
        this.character.y = enemy.y - this.character.height + 20;
        this.character.jump();
    }
    /**
     * Deals damage to the character.
     */
    damageCharacter() {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
    }
    /**
     * Handles collisions with the boss.
     * @param {Endboss} boss - The endboss
     */
    handleBossCollision(boss) {
        if (!this.canBossDamageCharacter(boss)) {
            return;
        }
        this.damageCharacter();
        this.pushCharacterBack(boss);
    }
    /**
     * Checks whether the boss can damage the character.
     * @param {Endboss} boss - The endboss
     * @returns {boolean}
     */
    canBossDamageCharacter(boss) {
        if (!boss.attacking) {
            return false;
        }
        if (!boss.characterInAttackRange(this.character)) {
            return false;
        }
        return !this.character.isHurt();
    }
    /**
     * Pushes the character back after a boss hit.
     * @param {Endboss} boss - The endboss
     */
    pushCharacterBack(boss) {
        if (this.character.x < boss.x) {
            this.character.x -= 45;
            return;
        }
        this.character.x += 45;
    }
    /**
     * Checks whether bottles are collected.
     */
    checkBottleCollection() {
        if (!this.level.bottles) {
            return;   }
        this.level.bottles = this.level.bottles.filter(bottle => {
            return !this.collectBottleIfColliding(bottle);
        });
    }
    /**
     * Collects a bottle if the character touches it.
     * @param {Object} bottle - Bottle object
     * @returns {boolean}
     */
    collectBottleIfColliding(bottle) {
        if (!this.character.isColliding(bottle)) {
            return false;   }
        this.character.collectBottle();
        playBottleCollectSound();
        return true;
    }
    /**
     * Checks whether coins are collected.
     */
    checkCoinCollection() {
        if (!this.level.coins) {
            return;  }
        this.level.coins = this.level.coins.filter(coin => {
            return !this.collectCoinIfColliding(coin);
        });
    }
    /**
     * Collects a coin if the character touches it.
     * @param {Object} coin - Coin object
     * @returns {boolean}
     */
    collectCoinIfColliding(coin) {
        if (!this.character.isColliding(coin)) {
            return false;  }
        this.character.collectCoin();
        playCoinSound();
        return true;
    }
    /**
     * Checks whether a bottle should be thrown.
     */
    checkThrowObjects() {
        const now = Date.now();
        if (!this.canThrowBottle(now)) {
            return;  }
        this.throwBottle();
        this.lastThrowTime = now;
    }
    /**
     * Checks whether a bottle can be thrown.
     * @param {number} now - Current timestamp
     * @returns {boolean}
     */
    canThrowBottle(now) {
        if (!this.keyboard.throw) {
            return false; }
        if (!this.character.canThrowBottle()) {
            return false; }
        return now - this.lastThrowTime > 500;
    }
    /**
     * Creates a thrown bottle from the player.
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
    /**
     * Checks collisions of thrown bottles.
     */
    checkThrowableObjectCollisions() {
        this.throwableObjects.forEach(bottle => {
            this.handleThrowableBottleCollision(bottle);
        });
        this.removeUsedBottles();
    }
    /**
     * Handles the collision of one bottle with enemies.
     * @param {ThrowableObject} bottle - Thrown bottle object
     */
    handleThrowableBottleCollision(bottle) {
        if (bottle.hasHit) {
            return;   }
        for (let i = 0; i < this.level.enemies.length; i++) {
            const enemy = this.level.enemies[i];
            if (this.isEnemyDead(enemy)) {
                continue;
            }
            if (!bottle.isColliding(enemy) || bottle.hasHit) {
                continue;
            }
            this.hitEnemyWithBottle(bottle, enemy);
            break; }
    }
    /**
     * Handles a bottle hit on an enemy.
     * @param {ThrowableObject} bottle - Thrown bottle object
     * @param {Object} enemy - Enemy object
     */
    hitEnemyWithBottle(bottle, enemy) {
        bottle.splash();
        playBottleHitSound();
        if (typeof enemy.hit === 'function') {
            enemy.hit();
        }
    }
    /**
     * Removes used bottles from the world.
     */
    removeUsedBottles() {
        this.throwableObjects = this.throwableObjects.filter(bottle => {
            return !bottle.removeFromWorld;
        });
    }
    /**
     * Checks whether the game is lost.
     */
    checkGameOver() {
        if (!this.character.isDead()) {
            return; }
        this.gameOver = true;
        this.stopGame();
        setTimeout(() => showGameOverScreen(), 1000);
    }
    /**
     * Checks whether the game is won.
     */
    checkGameWon() {
        const boss = this.findBoss();
        if (!boss || !boss.isDead()) {
            return;
        }
        if (Date.now() - boss.deadTime <= 1000) {
            return;
        }
        this.gameWon = true;
        this.stopGame();
        showYouWinScreen();
    }
    /**
     * Stops all player inputs.
     */
    stopGame() {
        this.keyboard.right = false;
        this.keyboard.left = false;
        this.keyboard.up = false;
        this.keyboard.down = false;
        this.keyboard.space = false;
        this.keyboard.throw = false;
    }
    /**
     * Removes dead enemies after a short delay.
     */
    removeDeadEnemies() {
        this.level.enemies = this.level.enemies.filter(enemy => {
            return this.shouldKeepEnemy(enemy);
        });
    }
    /**
     * Checks whether an enemy should remain in the world.
     * @param {Object} enemy - Enemy object
     * @returns {boolean}
     */
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
     * Draws all game objects onto the canvas.
     */
    draw() {
        this.clearCanvas();
        this.drawWorldObjects();
        this.drawFixedStatusBars();
        requestAnimationFrame(() => this.draw());
    }
    /**
     * Clears the canvas.
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    /**
     * Draws all moving world objects.
     */
    drawWorldObjects() {
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
    }
    /**
     * Draws fixed status bars.
     */
    drawFixedStatusBars() {
        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.bottleStatusBar);
        if (this.bossBarVisible) {
            this.addToMap(this.bossStatusBar);
        }
    }
    /**
     * Adds multiple objects to the map.
     * @param {Array} objects - Object list
     */
    addObjectsToMap(objects) {
        if (!objects) {
            return;
        }
        objects.forEach(obj => this.addToMap(obj));
    }
    /**
     * Draws one object on the map.
     * @param {Object} mo - Movable object
     */
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
    /**
     * Flips an image horizontally.
     * @param {Object} mo - Movable object
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }
    /**
     * Resets the image flip.
     * @param {Object} mo - Movable object
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}