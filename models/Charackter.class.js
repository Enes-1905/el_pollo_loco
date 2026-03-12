class Charackter extends MovableObject {

    height = 280;
    width = 120;
    y = 150;
    speed = 10;
    energy = 100;
    lastHit = 0;
    bottles = 0;
    coins = 0;

    images_walking = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png',
    ];

    images_jumping = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png',
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png',
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png',
    ];

    BOTTLE_IMAGES = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    constructor() {
        super();
        this.loadImage(this.images_walking[0]);
        this.loadImages(this.images_walking);
        this.loadImages(this.images_jumping);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.BOTTLE_IMAGES);
        this.applyGravity();
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.world) return;

            if (this.world.keyboard.right && this.x < this.world.level.level_end_x - this.width) {
                this.moveRight();
            }

            if (this.world.keyboard.left && this.x > 0) {
                this.moveLeft();
            }

            if ((this.world.keyboard.up || this.world.keyboard.space) && !this.isAboveGround()) {
                this.jump();
            }

            let cameraX = -this.x + 120;
            let maxCameraX = -(this.world.level.level_end_x - this.world.canvas.width);

            if (cameraX > 0) {
                cameraX = 0;
            }

            if (cameraX < maxCameraX) {
                cameraX = maxCameraX;
            }

            this.world.camera_x = cameraX;

        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.images_jumping);
            } else if (this.world && (this.world.keyboard.right || this.world.keyboard.left)) {
                this.playAnimation(this.images_walking);
            }
        }, 120);
    }

    jump() {
        this.speedY = 30;
    }

    hit() {
        if (this.isHurt()) return;

        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        }

        this.lastHit = new Date().getTime();
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 1;
    }

    isAboveGround() {
        return this.y < 150;
    }

    collectBottle() {
        this.bottles += 1;
    }

    collectCoin() {
        if (this.coins < 5) {
            this.coins += 1;
        }
    }

    canThrowBottle() {
        return this.bottles > 0;
    }

    useBottle() {
        if (this.bottles > 0) {
            this.bottles -= 1;
        }
    }
}