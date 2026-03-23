/**
 * Repräsentiert den Endboss des Spiels.
 * Steuert Bewegung, Angriff, Hitboxen und Animationen.
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
     * Erstellt den Endboss.
     * @param {number} x
     */
    constructor(x = 1700) {
        super();
        this.x = x;
        this.otherdirection = false;
        this.loadBossImages();
        this.animate();
    }

    /**
     * Lädt alle Bilder des Endbosses.
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
     * Startet Bewegung und Animation.
     */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    /**
     * Startet den Bewegungs-Loop.
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
     * Startet den Animations-Loop.
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
     * Steuert die Bewegung und Angriffe des Bosses.
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
     * Wählt die passende Boss-Animation.
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
     * Gibt die Mitte des Charakters zurück.
     * @returns {number}
     */
    getCharacterCenter() {
        return this.world.character.x + this.world.character.width / 2;
    }

    /**
     * Gibt die Mitte des Bosses zurück.
     * @returns {number}
     */
    getBossCenter() {
        return this.x + this.width / 2;
    }

    /**
     * Berechnet den Abstand zum Charakter.
     * @param {number} characterCenter
     * @returns {number}
     */
    getDistanceToCharacter(characterCenter) {
        return this.getBossCenter() - characterCenter;
    }

    /**
     * Lässt den Boss dem Charakter folgen.
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
     * Bewegt den Boss nach links.
     */
    moveBossLeft() {
        this.x -= this.speed;
        this.otherdirection = false;
    }

    /**
     * Bewegt den Boss nach rechts.
     */
    moveBossRight() {
        this.x += this.speed;
        this.otherdirection = true;
    }

    /**
     * Prüft, ob der Boss gerade läuft.
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
     * Prüft, ob der Boss wieder angreifen darf.
     * @returns {boolean}
     */
    canAttack() {
        return Date.now() - this.lastAttack > this.attackCooldown;
    }

    /**
     * Startet den Angriff des Bosses.
     */
    startAttack() {
        this.attacking = true;
        this.lastAttack = Date.now();
        this.updateAttackDirection();
        this.endAttackLater();
    }

    /**
     * Richtet den Boss vor dem Angriff aus.
     */
    updateAttackDirection() {
        if (this.world && this.world.character.x < this.x) {
            this.otherdirection = false;
            return;
        }

        this.otherdirection = true;
    }

    /**
     * Beendet den Angriff nach kurzer Zeit.
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
     * Gibt die Angriffshitbox zurück.
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
     * Gibt die rechte Angriffshitbox zurück.
     * @param {number} width
     * @param {number} height
     * @param {number} y
     * @returns {{x:number, y:number, width:number, height:number}}
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
     * Gibt die linke Angriffshitbox zurück.
     * @param {number} width
     * @param {number} height
     * @param {number} y
     * @returns {{x:number, y:number, width:number, height:number}}
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
     * Gibt die Körper-Hitbox zurück.
     * @returns {{x:number, y:number, width:number, height:number}}
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
     * Prüft, ob der Charakter in einer Hitbox steht.
     * @param {Charackter} character
     * @param {{x:number, y:number, width:number, height:number}} hitbox
     * @returns {boolean}
     */
    isCharacterInsideHitbox(character, hitbox) {
        return character.getHitboxRight() > hitbox.x &&
            character.getHitboxBottom() > hitbox.y &&
            character.getHitboxLeft() < hitbox.x + hitbox.width &&
            character.getHitboxTop() < hitbox.y + hitbox.height;
    }

    /**
     * Prüft, ob der Charakter in Angriffsreichweite ist.
     * @param {Charackter} character
     * @returns {boolean}
     */
    characterInAttackRange(character) {
        let attackHitbox = this.getAttackHitbox();
        let bodyHitbox = this.getBodyHitbox();

        return this.isCharacterInsideHitbox(character, attackHitbox) ||
            this.isCharacterInsideHitbox(character, bodyHitbox);
    }

    /**
     * Fügt dem Boss Schaden zu.
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
     * Verringert die Energie des Bosses.
     * @param {number} amount
     */
    reduceEnergy(amount) {
        this.energy -= amount;

        if (this.energy < 0) {
            this.energy = 0;
        }
    }

    /**
     * Prüft, ob der Boss gerade verletzt ist.
     * @returns {boolean}
     */
    isHurt() {
        let timePassed = Date.now() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 0.5 && !this.isDead();
    }

    /**
     * Prüft, ob der Boss tot ist.
     * @returns {boolean}
     */
    isDead() {
        return this.energy === 0;
    }
}