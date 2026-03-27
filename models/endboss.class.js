/**
 * Represents the endboss of the game.
 * Handles movement, attacks, hitboxes, and animations.
 */
class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 55;
    energy = 80;
    lastHit = 0;
    deadTime = 0;
    speed = 3.2;
    activated = false;
    attackRange = 210;
    lastAttack = 0;
    attackCooldown = 1100;
    attacking = false;

    offset = {
        top: 80,
        right: 30,
        bottom: 25,
        left: 30
    };

    IMAGES_WALK = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /**
     * Creates the endboss.
     * @param {number} x - X position in the level
     */
    constructor(x = 1700) {
        super();
        this.x = x;
        this.otherdirection = false;
        this.loadBossImages();
        this.animate();
    }

    /**
     * Loads all boss images.
     */
    loadBossImages() {
        this.loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
    }

    /**
     * Starts movement and animation loops.
     */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    /**
     * Starts the movement loop.
     */
    startMovementLoop() {
        setInterval(() => {
            if (worldObj && worldObj.isPaused) {
                return;
            }

            if (!this.isDead()) {
                this.handleMovement();
            }
        }, 1000 / 60);
    }

    /**
     * Starts the animation loop.
     */
    startAnimationLoop() {
        setInterval(() => {
            if (worldObj && worldObj.isPaused) {
                return;
            }

            this.handleAnimation();
        }, 140);
    }

    /**
     * Handles boss movement and attacks.
     */
    handleMovement() {
        if (!this.activated || !this.world) {
            return;
        }

        let characterCenter = this.getCharacterCenter();
        let distance = this.getDistanceToCharacter(characterCenter);

        this.followCharacter(characterCenter);

        if (Math.abs(distance) <= this.attackRange && this.canAttack()) {
            this.startAttack();
        }
    }

    /**
     * Selects the correct boss animation.
     */
    handleAnimation() {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
            return;
        }

        if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
            return;
        }

        if (this.attacking) {
            this.playAnimation(this.IMAGES_ATTACK);
            return;
        }

        if (this.isWalking()) {
            this.playAnimation(this.IMAGES_WALK);
            return;
        }

        this.playAnimation(this.IMAGES_ALERT);
    }

    /**
     * Returns the character center position.
     * @returns {number}
     */
    getCharacterCenter() {
        return this.world.character.x + this.world.character.width / 2;
    }

    /**
     * Returns the boss center position.
     * @returns {number}
     */
    getBossCenter() {
        return this.x + this.width / 2;
    }

    /**
     * Calculates the distance to the character.
     * @param {number} characterCenter
     * @returns {number}
     */
    getDistanceToCharacter(characterCenter) {
        return this.getBossCenter() - characterCenter;
    }

    /**
     * Makes the boss follow the character.
     * @param {number} characterCenter
     */
    followCharacter(characterCenter) {
        let distance = this.getDistanceToCharacter(characterCenter);

        if (Math.abs(distance) < 15) {
            return;
        }

        if (characterCenter < this.getBossCenter()) {
            this.moveBossLeft();
            return;
        }

        this.moveBossRight();
    }

    /**
     * Moves the boss to the left.
     */
    moveBossLeft() {
        this.x -= this.speed;
        this.otherdirection = false;
    }

    /**
     * Moves the boss to the right.
     */
    moveBossRight() {
        this.x += this.speed;
        this.otherdirection = true;
    }

    /**
     * Checks whether the boss is walking.
     * @returns {boolean}
     */
    isWalking() {
        if (!this.activated || !this.world || this.attacking) {
            return false;
        }

        let distance = this.getDistanceToCharacter(this.getCharacterCenter());
        return Math.abs(distance) > 15;
    }

    /**
     * Checks if the boss can attack again.
     * @returns {boolean}
     */
    canAttack() {
        return Date.now() - this.lastAttack > this.attackCooldown;
    }

    /**
     * Starts the boss attack.
     */
    startAttack() {
        this.attacking = true;
        this.lastAttack = Date.now();
        this.updateAttackDirection();
        this.endAttackLater();
    }

    /**
     * Adjusts direction before attacking.
     */
    updateAttackDirection() {
        if (this.world && this.world.character.x < this.x) {
            this.otherdirection = false;
            return;
        }

        this.otherdirection = true;
    }

    /**
     * Ends the attack after a short delay.
     */
    endAttackLater() {
        setTimeout(() => {
            if (worldObj && worldObj.isPaused) {
                return;
            }

            this.attacking = false;
        }, 650);
    }

    /**
     * Returns the attack hitbox.
     * @returns {{x:number, y:number, width:number, height:number}}
     */
    getAttackHitbox() {
        let hitboxWidth = 80;
        let hitboxHeight = 105;
        let hitboxY = this.y + 200;

        if (this.otherdirection) {
            return this.getRightAttackHitbox(hitboxWidth, hitboxHeight, hitboxY);
        }

        return this.getLeftAttackHitbox(hitboxWidth, hitboxHeight, hitboxY);
    }

    /**
     * Returns the right attack hitbox.
     */
    getRightAttackHitbox(width, height, y) {
        return {
            x: this.x + this.width - 5,
            y: y,
            width: width,
            height: height
        };
    }

    /**
     * Returns the left attack hitbox.
     */
    getLeftAttackHitbox(width, height, y) {
        return {
            x: this.x - 30,
            y: y,
            width: width,
            height: height
        };
    }

    /**
     * Returns the body hitbox.
     */
    getBodyHitbox() {
        return {
            x: this.x + 105,
            y: this.y + 235,
            width: this.width - 210,
            height: 80
        };
    }

    /**
     * Checks if the character is inside a hitbox.
     */
    isCharacterInsideHitbox(character, hitbox) {
        return character.getHitboxRight() > hitbox.x &&
            character.getHitboxBottom() > hitbox.y &&
            character.getHitboxLeft() < hitbox.x + hitbox.width &&
            character.getHitboxTop() < hitbox.y + hitbox.height;
    }

    /**
     * Checks if the character is in attack range.
     */
    characterInAttackRange(character) {
        let attackHitbox = this.getAttackHitbox();
        let bodyHitbox = this.getBodyHitbox();

        return this.isCharacterInsideHitbox(character, attackHitbox) ||
            this.isCharacterInsideHitbox(character, bodyHitbox);
    }

    /**
     * Damages the boss.
     */
    hit() {
        if (this.isDead()) {
            return;
        }

        this.reduceEnergy(20);
        this.lastHit = Date.now();

        if (this.isDead()) {
            this.deadTime = Date.now();
        }
    }

    /**
     * Reduces boss energy.
     * @param {number} amount
     */
    reduceEnergy(amount) {
        this.energy -= amount;

        if (this.energy < 0) {
            this.energy = 0;
        }
    }

    /**
     * Checks if the boss is hurt.
     * @returns {boolean}
     */
    isHurt() {
        let timePassed = Date.now() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 0.5 && !this.isDead();
    }

    /**
     * Checks if the boss is dead.
     * @returns {boolean}
     */
    isDead() {
        return this.energy === 0;
    }
}