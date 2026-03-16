class Charackter extends MovableObject {

    height = 280;
    width = 120;
    y = 150;
    speed = 10;
    energy = 100;
    lastHit = 0;
    bottles = 0;
    coins = 0;
    lastAction = Date.now();

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    images_walking = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
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
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
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
        this.loadCharacterImages();
        this.applyGravity();
        this.animate();
    }

    loadCharacterImages() {
        this.loadImage(this.images_walking[0]);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.images_walking);
        this.loadImages(this.images_jumping);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.BOTTLE_IMAGES);
    }

    animate() {
        setInterval(() => {
            if (worldObj && worldObj.isPaused) return;
            this.handleMovement();
        }, 1000 / 60);

        setInterval(() => {
            if (worldObj && worldObj.isPaused) return;
            this.handleAnimation();
        }, 120);
    }

    handleMovement() {
        if (!this.world || this.isDead()) {
            return;
        }

        this.updateLastAction();
        this.handleWalkRight();
        this.handleWalkLeft();
        this.handleJump();
        this.updateCamera();
    }

    updateLastAction() {
        if (this.isDoingSomething()) {
            this.lastAction = Date.now();
        }
    }

    handleWalkRight() {
        let maxX = this.world.level.level_end_x - this.width;

        if (this.world.keyboard.right && this.x < maxX) {
            this.moveRight();
        }
    }

    handleWalkLeft() {
        if (this.world.keyboard.left && this.x > 0) {
            this.moveLeft();
        }
    }

    handleJump() {
        let jumpPressed = this.world.keyboard.up || this.world.keyboard.space;

        if (jumpPressed && !this.isAboveGround()) {
            this.jump();
        }
    }

    updateCamera() {
        let cameraX = -this.x + 120;
        let maxCameraX = this.getMaxCameraX();
        this.world.camera_x = this.limitCameraX(cameraX, maxCameraX);
    }

    getMaxCameraX() {
        return -(this.world.level.level_end_x - this.world.canvas.width);
    }

    limitCameraX(cameraX, maxCameraX) {
        if (cameraX > 0) {
            return 0;
        }

        if (cameraX < maxCameraX) {
            return maxCameraX;
        }

        return cameraX;
    }

    handleAnimation() {
        if (!this.world) {
            return;
        }

        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
            return;
        }

        if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
            return;
        }

        if (this.isAboveGround()) {
            this.playAnimation(this.images_jumping);
            return;
        }

        if (this.isWalking()) {
            this.playAnimation(this.images_walking);
            return;
        }

        if (this.isSleeping()) {
            this.playAnimation(this.IMAGES_LONG_IDLE);
            return;
        }

        this.playAnimation(this.IMAGES_IDLE);
    }

    isWalking() {
        return this.world.keyboard.right || this.world.keyboard.left;
    }

    isDoingSomething() {
        return this.world.keyboard.right ||
            this.world.keyboard.left ||
            this.world.keyboard.up ||
            this.world.keyboard.space ||
            this.world.keyboard.throw;
    }

    isSleeping() {
        let timePassed = Date.now() - this.lastAction;
        return timePassed > 5000;
    }

    jump() {
        this.speedY = 22;
        this.lastAction = Date.now();
    }

    hit() {
        if (this.isHurt()) {
            return;
        }

        this.energy -= 5;

        if (this.energy < 0) {
            this.energy = 0;
        }

        this.lastHit = Date.now();
        this.lastAction = Date.now();
    }

    isHurt() {
        let timePassed = Date.now() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 1;
    }

    getGroundY() {
        return 150;
    }

    collectBottle() {
        this.bottles += 1;
        this.lastAction = Date.now();
    }

    collectCoin() {
        if (this.coins < 5) {
            this.coins += 1;
        }

        this.lastAction = Date.now();
    }

    canThrowBottle() {
        return this.bottles > 0;
    }

    useBottle() {
        if (this.bottles > 0) {
            this.bottles -= 1;
        }

        this.lastAction = Date.now();
    }
}