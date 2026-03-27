/**
 * Controls the playable character.
 * Includes movement, animations, sounds, and collectible items.
 */
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
    sleepSoundPlayed = false;
    sleep_sound = new Audio('audio/sleep.mp3');
    offset = {
        top: 110,
        right: 30,
        bottom: 15,
        left: 30
    };
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
    /**
     * Creates the character and starts animation and gravity.
     */
    constructor() {
        super();
        this.loadCharacterImages();
        this.prepareSleepSound();
        this.applyGravity();
        this.animate();
    }
    /**
     * Loads all character images.
     */
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
    /**
     * Prepares the sleep sound.
     */
    prepareSleepSound() {
        this.sleep_sound.volume = 0.35;
        this.sleep_sound.loop = false;
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
            this.handleMovement();
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
        }, 120);
    }
    /**
     * Handles movement, camera, and running sound.
     */
    handleMovement() {
        if (!this.world || this.isDead()) {
            stopRunningSound();
            return;
        }
        this.stopSleepIfActive();
        this.updateLastAction();
        this.handleWalkRight();
        this.handleWalkLeft();
        this.handleJump();
        this.updateCamera();
        this.handleRunningSound();
    }
    /**
     * Stops the sleep sound when the player is active.
     */
    stopSleepIfActive() {
        if (!this.isDoingSomething()) {
            return;
        }
        this.stopSleepSound();
        this.sleepSoundPlayed = false;
    }
    /**
     * Updates the last action time on input.
     */
    updateLastAction() {
        if (!this.isDoingSomething()) {
            return;
        }
        this.lastAction = Date.now();
    }
    /**
     * Moves the character to the right.
     */
    handleWalkRight() {
        let maxX = this.world.level.level_end_x - this.width;
        if (this.world.keyboard.right && this.x < maxX) {
            this.moveRight();
        }
    }
    /**
     * Moves the character to the left.
     */
    handleWalkLeft() {
        if (this.world.keyboard.left && this.x > 0) {
            this.moveLeft();
        }
    }
    /**
     * Makes the character jump.
     */
    handleJump() {
        let jumpPressed = this.world.keyboard.up || this.world.keyboard.space;
        if (jumpPressed && !this.isAboveGround()) {
            this.jump();
        }
    }
    /**
     * Controls the running sound.
     */
    handleRunningSound() {
        if (this.isAboveGround()) {
            stopRunningSound();
            return;
        }
        if (this.isWalking()) {
            playRunningSound();
            return;
        }
        stopRunningSound();
    }
    /**
     * Updates the camera position.
     */
    updateCamera() {
        let cameraX = -this.x + 120;
        let maxCameraX = this.getMaxCameraX();
        this.world.camera_x = this.limitCameraX(cameraX, maxCameraX);
    }
    /**
     * Returns the maximum camera boundary.
     * @returns {number}
     */
    getMaxCameraX() {
        return -(this.world.level.level_end_x - this.world.canvas.width);
    }
    /**
     * Limits the camera to the level boundaries.
     * @param {number} cameraX - Current camera position
     * @param {number} maxCameraX - Maximum allowed camera position
     * @returns {number}
     */
    limitCameraX(cameraX, maxCameraX) {
        if (cameraX > 0) {
            return 0;
        }
        if (cameraX < maxCameraX) {
            return maxCameraX;
        }
        return cameraX;
    }
    /**
     * Selects the correct animation.
     */
    handleAnimation() {
        if (!this.world) {
            return;
        }
        if (this.isDead()) {
            this.showDeadAnimation();
            return;
        }
        if (this.isHurt()) {
            this.showHurtAnimation();
            return;
        }
        if (this.isAboveGround()) {
            this.showJumpAnimation();
            return;
        }
        if (this.isWalking()) {
            this.showWalkAnimation();
            return;
        }
        if (this.isSleeping()) {
            this.showSleepAnimation();
            return;
        }
        this.showIdleAnimation();
    }
    /**
     * Shows the dead animation.
     */
    showDeadAnimation() {
        stopRunningSound();
        this.stopSleepSound();
        this.playAnimation(this.IMAGES_DEAD);
    }
    /**
     * Shows the hurt animation.
     */
    showHurtAnimation() {
        this.resetSleepState();
        this.playAnimation(this.IMAGES_HURT);
    }
    /**
     * Shows the jump animation.
     */
    showJumpAnimation() {
        this.resetSleepState();
        this.playAnimation(this.images_jumping);
    }
    /**
     * Shows the walking animation.
     */
    showWalkAnimation() {
        this.resetSleepState();
        this.playAnimation(this.images_walking);
    }
 /**
     * Shows the sleeping animation.
     */
    showSleepAnimation() {
        this.playAnimation(this.IMAGES_LONG_IDLE);
        this.playSleepSoundOnce();
    }
    /**
     * Shows the idle animation.
     */
    showIdleAnimation() {
        this.resetSleepState();
        this.playAnimation(this.IMAGES_IDLE);
    }
    /**
     * Resets the sleep state.
     */
    resetSleepState() {
        this.stopSleepSound();
        this.sleepSoundPlayed = false;
    }
    /**
     * Handles errors of the sleep sound.
     * @param {Error} error - Audio error
     */
    handleSleepSoundError(error) {
        if (!error || error.name === 'AbortError') {
            return;
        }
        console.warn('Sleep sound error:', error);
    }
    /**
     * Plays the sleep sound once.
     */
    playSleepSoundOnce() {
        if (soundMuted || this.sleepSoundPlayed) {
            return;
        }
        this.sleep_sound.currentTime = 0;
        const playPromise = this.sleep_sound.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(error => this.handleSleepSoundError(error));
        }
        this.sleepSoundPlayed = true;
    }
    /**
     * Stops the sleep sound.
     */
    stopSleepSound() {
        this.sleep_sound.pause();
        this.sleep_sound.currentTime = 0;
    }
    /**
     * Checks whether the character is walking.
     * @returns {boolean}
     */
    isWalking() {
        return this.world.keyboard.right || this.world.keyboard.left;
    }
    /**
     * Checks whether the player is actively doing something.
     * @returns {boolean}
     */
    isDoingSomething() {
        return this.world.keyboard.right ||
            this.world.keyboard.left ||
            this.world.keyboard.up ||
            this.world.keyboard.space ||
            this.world.keyboard.throw;
    }
    /**
     * Checks whether the character should sleep.
     * @returns {boolean}
     */
    isSleeping() {
        let timePassed = Date.now() - this.lastAction;
        let idleLongEnough = timePassed > 5000;
        let standingStill = !this.isWalking();
        let notJumping = !this.isAboveGround();
        return idleLongEnough && standingStill && notJumping;
    }
    /**
     * Makes the character jump.
     */
    jump() {
        this.speedY = 22;
        this.lastAction = Date.now();
        stopRunningSound();
        this.resetSleepState();
    }
    /**
     * Deals damage to the character.
     */
    hit() {
        if (this.isHurt()) {
            return;
        }
        this.reduceEnergy(5);
        this.lastHit = Date.now();
        this.lastAction = Date.now();
        stopRunningSound();
        this.resetSleepState();
    }
    /**
     * Reduces the character's energy.
     * @param {number} amount - Energy amount
     */
    reduceEnergy(amount) {
        this.energy -= amount;
        if (this.energy < 0) {
            this.energy = 0;
        }
    }
    /**
     * Checks whether the character is currently hurt.
     * @returns {boolean}
     */
    isHurt() {
        let timePassed = Date.now() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 1;
    }
    /**
     * Returns the ground position of the character.
     * @returns {number}
     */
    getGroundY() {
        return 150;
    }
    /**
     * Collects a bottle.
     */
    collectBottle() {
        this.bottles += 1;
        this.registerAction();
    }
    /**
     * Collects a coin.
     */
    collectCoin() {
        if (this.coins < 5) {
            this.coins += 1;
        }
        this.registerAction();
    }
    /**
     * Checks whether a bottle can be thrown.
     * @returns {boolean}
     */
    canThrowBottle() {
        return this.bottles > 0;
    }
    /**
     * Uses one bottle.
     */
    useBottle() {
        if (this.bottles > 0) {
            this.bottles -= 1;
        }
        this.registerAction();
    }
    /**
     * Registers a new player action.
     */
    registerAction() {
        this.lastAction = Date.now();
        this.resetSleepState();
    }
}