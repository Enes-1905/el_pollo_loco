class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 55;
    energy = 60;
    lastHit = 0;
    deadTime = 0;
    speed = 2.5;
    activated = false;
    attackRange = 220;
    lastAttack = 0;
    attackCooldown = 1500;
    attacking = false;

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

        this.loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.isDead()) {
                return;
            }

            if (this.activated && this.world) {
                let characterX = this.world.character.x;
                let distance = this.x - characterX;

                if (Math.abs(distance) > this.attackRange && !this.attacking) {
                    if (characterX < this.x) {
                        this.moveLeft();
                        this.otherdirection = false;
                    } else {
                        this.moveRight();
                        this.otherdirection = true;
                    }
                } else if (Math.abs(distance) <= this.attackRange && this.canAttack()) {
                    this.startAttack();
                }
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.attacking) {
                this.playAnimation(this.IMAGES_ATTACK);
            } else if (this.isWalking()) {
                this.playAnimation(this.IMAGES_WALK);
            } else {
                this.playAnimation(this.IMAGES_ALERT);
            }
        }, 140);
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

        let distance = this.x - this.world.character.x;
        return Math.abs(distance) > this.attackRange;
    }

    canAttack() {
        return Date.now() - this.lastAttack > this.attackCooldown;
    }

    startAttack() {
        this.attacking = true;
        this.lastAttack = Date.now();

        setTimeout(() => {
            this.attacking = false;
        }, 700);
    }

    getAttackHitbox() {
        let hitboxWidth = 120;
        let hitboxHeight = 140;
        let hitboxY = this.y + 170;

        if (this.otherdirection) {
            return {
                x: this.x + this.width - 40,
                y: hitboxY,
                width: hitboxWidth,
                height: hitboxHeight
            };
        } else {
            return {
                x: this.x - 30,
                y: hitboxY,
                width: hitboxWidth,
                height: hitboxHeight
            };
        }
    }

    characterInAttackRange(character) {
        let hitbox = this.getAttackHitbox();

        return character.x + character.width > hitbox.x &&
               character.y + character.height > hitbox.y &&
               character.x < hitbox.x + hitbox.width &&
               character.y < hitbox.y + hitbox.height;
    }

    hit() {
        if (this.isDead()) return;

        this.energy -= 20;

        if (this.energy < 0) {
            this.energy = 0;
        }

        this.lastHit = new Date().getTime();

        if (this.isDead()) {
            this.deadTime = new Date().getTime();
        }
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 0.5 && !this.isDead();
    }

    isDead() {
        return this.energy == 0;
    }
}