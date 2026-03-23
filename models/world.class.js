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

    /**
     * Verknüpft Welt mit Charakter und Gegnern.
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => enemy.world = this);
    }

    /**
     * Startet den Update-Loop der Welt.
     */
    run() {
        setInterval(() => {
            if (this.shouldStopUpdate()) {
                return;
            }

            this.updateWorld();
        }, 1000 / 60);
    }

    /**
     * Prüft, ob die Welt gerade nicht aktualisiert werden soll.
     * @returns {boolean}
     */
    shouldStopUpdate() {
        return this.gameOver || this.gameWon || this.isPaused;
    }

    /**
     * Aktualisiert die komplette Spielwelt.
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
     * Aktualisiert alle Statusleisten.
     */
    updateStatusBars() {
        this.statusBar.setPercentage(this.character.energy);
        this.coinStatusBar.setPercentage(this.character.coins * 20);
        this.bottleStatusBar.setPercentage(this.character.bottles * 20);
    }

    /**
     * Prüft, ob die Boss-Leiste angezeigt werden soll.
     */
    checkBossBar() {
        const boss = this.findBoss();

        if (!boss) {
            return;
        }

        this.activateBossIfNear(boss);
        this.updateBossBar(boss);
    }

    /**
     * Sucht den Endboss in der Gegnerliste.
     * @returns {Endboss|undefined}
     */
    findBoss() {
        return this.level.enemies.find(enemy => enemy instanceof Endboss);
    }

    /**
     * Aktiviert den Boss, wenn der Charakter nah genug ist.
     * @param {Endboss} boss
     */
    activateBossIfNear(boss) {
        if (this.character.x <= 1500) {
            return;
        }

        this.bossBarVisible = true;
        boss.activated = true;
        playBossMusic();
    }

    /**
     * Aktualisiert die Boss-Leiste.
     * @param {Endboss} boss
     */
    updateBossBar(boss) {
        if (!this.bossBarVisible) {
            return;
        }

        this.bossStatusBar.setPercentage(boss.energy);
    }

    /**
     * Prüft Kollisionen zwischen Charakter und Gegnern.
     */
    checkCharacterEnemyCollisions() {
        this.level.enemies.forEach(enemy => {
            if (this.isEnemyDead(enemy)) {
                return;
            }

            this.handleEnemyCollision(enemy);
        });
    }

    /**
     * Prüft, ob ein Gegner tot ist.
     * @param {Object} enemy
     * @returns {boolean}
     */
    isEnemyDead(enemy) {
        return typeof enemy.isDead === 'function' && enemy.isDead();
    }

    /**
     * Behandelt eine Kollision mit einem Gegner.
     * @param {Object} enemy
     */
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

    /**
     * Prüft, ob der Charakter auf einen Gegner springt.
     * @param {Object} enemy
     * @returns {boolean}
     */
    characterIsJumpingOnEnemy(enemy) {
        const characterBottom = this.character.y + this.character.height;
        const enemyTop = enemy.y + 20;
        const isFalling = this.character.speedY < 0;

        return isFalling && characterBottom <= enemyTop + 25;
    }

    /**
     * Tötet einen Gegner durch Sprung von oben.
     * @param {Object} enemy
     */
    killEnemyFromTop(enemy) {
        this.hitEnemy(enemy);
        this.bounceCharacterAfterHit(enemy);
    }

    /**
     * Fügt einem Gegner Schaden zu.
     * @param {Object} enemy
     */
    hitEnemy(enemy) {
        if (typeof enemy.hit !== 'function') {
            return;
        }

        enemy.hit();
        playChickenSound();
    }

    /**
     * Lässt den Charakter nach oben abprallen.
     * @param {Object} enemy
     */
    bounceCharacterAfterHit(enemy) {
        this.character.y = enemy.y - this.character.height + 20;
        this.character.jump();
    }

    /**
     * Fügt dem Charakter Schaden zu.
     */
    damageCharacter() {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
    }

    /**
     * Behandelt Kollisionen mit dem Boss.
     * @param {Endboss} boss
     */
    handleBossCollision(boss) {
        if (!this.canBossDamageCharacter(boss)) {
            return;
        }

        this.damageCharacter();
        this.pushCharacterBack(boss);
    }

    /**
     * Prüft, ob der Boss den Charakter treffen darf.
     * @param {Endboss} boss
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
     * Schiebt den Charakter nach einem Boss-Treffer zurück.
     * @param {Endboss} boss
     */
    pushCharacterBack(boss) {
        if (this.character.x < boss.x) {
            this.character.x -= 45;
            return;
        }

        this.character.x += 45;
    }

    /**
     * Prüft, ob Flaschen eingesammelt werden.
     */
    checkBottleCollection() {
        if (!this.level.bottles) {
            return;
        }

        this.level.bottles = this.level.bottles.filter(bottle => {
            return !this.collectBottleIfColliding(bottle);
        });
    }

    /**
     * Sammelt eine Flasche ein, wenn der Charakter sie berührt.
     * @param {Object} bottle
     * @returns {boolean}
     */
    collectBottleIfColliding(bottle) {
        if (!this.character.isColliding(bottle)) {
            return false;
        }

        this.character.collectBottle();
        playBottleCollectSound();
        return true;
    }

    /**
     * Prüft, ob Münzen eingesammelt werden.
     */
    checkCoinCollection() {
        if (!this.level.coins) {
            return;
        }

        this.level.coins = this.level.coins.filter(coin => {
            return !this.collectCoinIfColliding(coin);
        });
    }

    /**
     * Sammelt eine Münze ein, wenn der Charakter sie berührt.
     * @param {Object} coin
     * @returns {boolean}
     */
    collectCoinIfColliding(coin) {
        if (!this.character.isColliding(coin)) {
            return false;
        }

        this.character.collectCoin();
        playCoinSound();
        return true;
    }

    /**
     * Prüft, ob eine Flasche geworfen werden soll.
     */
    checkThrowObjects() {
        const now = Date.now();

        if (!this.canThrowBottle(now)) {
            return;
        }

        this.throwBottle();
        this.lastThrowTime = now;
    }

    /**
     * Prüft, ob eine Flasche geworfen werden darf.
     * @param {number} now
     * @returns {boolean}
     */
    canThrowBottle(now) {
        if (!this.keyboard.throw) {
            return false;
        }

        if (!this.character.canThrowBottle()) {
            return false;
        }

        return now - this.lastThrowTime > 500;
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

    /**
     * Prüft Kollisionen von geworfenen Flaschen.
     */
    checkThrowableObjectCollisions() {
        this.throwableObjects.forEach(bottle => {
            this.handleThrowableBottleCollision(bottle);
        });

        this.removeUsedBottles();
    }

    /**
     * Behandelt die Kollision einer Flasche mit Gegnern.
     * @param {ThrowableObject} bottle
     */
    handleThrowableBottleCollision(bottle) {
        if (bottle.hasHit) {
            return;
        }

        for (let i = 0; i < this.level.enemies.length; i++) {
            const enemy = this.level.enemies[i];

            if (this.isEnemyDead(enemy)) {
                continue;
            }

            if (!bottle.isColliding(enemy) || bottle.hasHit) {
                continue;
            }

            this.hitEnemyWithBottle(bottle, enemy);
            break;
        }
    }

    /**
     * Behandelt einen Flaschen-Treffer auf einen Gegner.
     * @param {ThrowableObject} bottle
     * @param {Object} enemy
     */
    hitEnemyWithBottle(bottle, enemy) {
        bottle.splash();
        playBottleHitSound();

        if (typeof enemy.hit === 'function') {
            enemy.hit();
        }
    }

    /**
     * Entfernt verbrauchte Flaschen aus der Welt.
     */
    removeUsedBottles() {
        this.throwableObjects = this.throwableObjects.filter(bottle => {
            return !bottle.removeFromWorld;
        });
    }

    /**
     * Prüft, ob das Spiel verloren ist.
     */
    checkGameOver() {
        if (!this.character.isDead()) {
            return;
        }

        this.gameOver = true;
        this.stopGame();
        setTimeout(() => showGameOverScreen(), 1000);
    }

    /**
     * Prüft, ob das Spiel gewonnen ist.
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
     * Stoppt die Spieler-Eingaben.
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
     * Entfernt tote Gegner nach kurzer Zeit.
     */
    removeDeadEnemies() {
        this.level.enemies = this.level.enemies.filter(enemy => {
            return this.shouldKeepEnemy(enemy);
        });
    }

    /**
     * Prüft, ob ein Gegner noch in der Welt bleiben soll.
     * @param {Object} enemy
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
     * Zeichnet alle Spielobjekte auf das Canvas.
     */
    draw() {
        this.clearCanvas();
        this.drawWorldObjects();
        this.drawFixedStatusBars();
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Leert das Canvas.
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Zeichnet alle beweglichen Objekte der Welt.
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
     * Zeichnet feste Statusleisten.
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
     * Fügt mehrere Objekte zur Karte hinzu.
     * @param {Array} objects
     */
    addObjectsToMap(objects) {
        if (!objects) {
            return;
        }

        objects.forEach(obj => this.addToMap(obj));
    }

    /**
     * Zeichnet ein Objekt auf die Karte.
     * @param {Object} mo
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
     * Spiegelt ein Bild horizontal.
     * @param {Object} mo
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Setzt die Spiegelung wieder zurück.
     * @param {Object} mo
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}