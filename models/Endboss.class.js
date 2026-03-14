class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 55;
    energy = 60;
    lastHit = 0;
    deadTime = 0;

    images_alert = [
        'img/4_enemie_boss_chicken/2_alert/g5.png',
        'img/4_enemie_boss_chicken/2_alert/g6.png',
        'img/4_enemie_boss_chicken/2_alert/g7.png',
        'img/4_enemie_boss_chicken/2_alert/g8.png',
        'img/4_enemie_boss_chicken/2_alert/g9.png',
        'img/4_enemie_boss_chicken/2_alert/g10.png',
        'img/4_enemie_boss_chicken/2_alert/g11.png',
        'img/4_enemie_boss_chicken/2_alert/g12.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/g13.png',
        'img/4_enemie_boss_chicken/3_attack/g14.png',
        'img/4_enemie_boss_chicken/3_attack/g15.png',
        'img/4_enemie_boss_chicken/3_attack/g16.png',
        'img/4_enemie_boss_chicken/3_attack/g17.png',
        'img/4_enemie_boss_chicken/3_attack/g18.png',
        'img/4_enemie_boss_chicken/3_attack/g19.png',
        'img/4_enemie_boss_chicken/3_attack/g20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/g21.png',
        'img/4_enemie_boss_chicken/4_hurt/g22.png',
        'img/4_enemie_boss_chicken/4_hurt/g23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/g24.png',
        'img/4_enemie_boss_chicken/5_dead/g25.png',
        'img/4_enemie_boss_chicken/5_dead/g26.png'
    ];

    constructor(x = 1700) {
        super();
        this.x = x;
        this.loadImage(this.images_alert[0]);
        this.loadImages(this.images_alert);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.shouldAttack()) {
                this.playAnimation(this.IMAGES_ATTACK);
            } else {
                this.playAnimation(this.images_alert);
            }
        }, 200);
    }

    shouldAttack() {
        return this.x < 1500;
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