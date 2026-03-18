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

    constructor(x = 1700) {
        super();
        this.x = x;
        this.otherdirection = false;
        this.loadBossImages();
        this.animate();
    }

    loadBossImages() {
        this.loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
    }

    animate() {
        setInterval(() => {
            if (worldObj && worldObj.isPaused) return;

            if (!this.isDead()) {
                this.handleMovement();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (worldObj && worldObj.isPaused) return;
            this.handleAnimation();
        }, 140);
    }

    handleMovement() {
        if (!this.activated || !this.world) {
            return;
        }

        let characterCenter = this.world.character.x + this.world.character.width / 2;
        let bossCenter = this.x + this.width / 2;
        let distance = bossCenter - characterCenter;

        this.followCharacter(characterCenter);

        if (Math.abs(distance) <= this.attackRange && this.canAttack()) {
            this.startAttack();
        }
    }

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

    followCharacter(characterCenter) {
        let bossCenter = this.x + this.width / 2;
        let distance = bossCenter - characterCenter;

        if (Math.abs(distance) < 15) {
            return;
        }

        if (characterCenter < bossCenter) {
            this.moveLeft();
            this.otherdirection = false;
            return;
        }

        this.moveRight();
        this.otherdirection = true;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    moveRight() {
        this.x += this.speed;
    }

    isWalking() {
        if (!this.activated || !this.world || this.attacking) {
            return false;
        }

        let characterCenter = this.world.character.x + this.world.character.width / 2;
        let bossCenter = this.x + this.width / 2;
        let distance = bossCenter - characterCenter;

        return Math.abs(distance) > 15;
    }

    canAttack() {
        return Date.now() - this.lastAttack > this.attackCooldown;
    }

    startAttack() {
        this.attacking = true;
        this.lastAttack = Date.now();

        if (this.world && this.world.character.x < this.x) {
            this.otherdirection = false;
        } else {
            this.otherdirection = true;
        }

        setTimeout(() => {
            if (worldObj && worldObj.isPaused) return;
            this.attacking = false;
        }, 650);
    }

    getAttackHitbox() {
        let hitboxWidth = 80;
        let hitboxHeight = 105;
        let hitboxY = this.y + 200;

        if (this.otherdirection) {
            return {
                x: this.x + this.width - 5,
                y: hitboxY,
                width: hitboxWidth,
                height: hitboxHeight
            };
        }

        return {
            x: this.x - 30,
            y: hitboxY,
            width: hitboxWidth,
            height: hitboxHeight
        };
    }

    getBodyHitbox() {
        return {
            x: this.x + 105,
            y: this.y + 235,
            width: this.width - 210,
            height: 80
        };
    }

    isCharacterInsideHitbox(character, hitbox) {
        return character.getHitboxRight() > hitbox.x &&
            character.getHitboxBottom() > hitbox.y &&
            character.getHitboxLeft() < hitbox.x + hitbox.width &&
            character.getHitboxTop() < hitbox.y + hitbox.height;
    }

    characterInAttackRange(character) {
        let attackHitbox = this.getAttackHitbox();
        let bodyHitbox = this.getBodyHitbox();

        return this.isCharacterInsideHitbox(character, attackHitbox) ||
            this.isCharacterInsideHitbox(character, bodyHitbox);
    }

    hit() {
        if (this.isDead()) {
            return;
        }

        this.energy -= 20;

        if (this.energy < 0) {
            this.energy = 0;
        }

        this.lastHit = Date.now();

        if (this.isDead()) {
            this.deadTime = Date.now();
        }
    }

    isHurt() {
        let timePassed = Date.now() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 0.5 && !this.isDead();
    }

    isDead() {
        return this.energy === 0;
    }
}