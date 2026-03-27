/**
 * Represents a thrown bottle.
 * Controls trajectory, rotation, impact, and splash animation.
 */
class ThrowableObject extends MovableObject {

    IMAGES_BOTTLE_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_BOTTLE_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    hasHit = false;
    removeFromWorld = false;
    throwInterval = null;
    splashInterval = null;
    throwStartX = 0;

    /**
     * Creates a new throwable bottle.
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {boolean} otherdirection - Throw direction
     */
    constructor(x, y, otherdirection = false) {
        super();
        this.loadBottleImages();
        this.setBottleValues(x, y, otherdirection);
        this.throw();
    }

    /**
     * Loads all bottle images.
     */
    loadBottleImages() {
        this.loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_BOTTLE_ROTATION);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
    }

    /**
     * Sets position and direction of the bottle.
     * @param {number} x
     * @param {number} y
     * @param {boolean} otherdirection
     */
    setBottleValues(x, y, otherdirection) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 70;
        this.otherdirection = otherdirection;
        this.throwStartX = x;
    }

    /**
     * Returns the ground position for the bottle.
     * @returns {number}
     */
    getGroundY() {
        return 360;
    }

    /**
     * Starts the throw.
     */
    throw() {
        this.speedY = 20;
        this.applyGravity();
        this.startThrowLoop();
    }

    /**
     * Starts the throw movement loop.
     */
    startThrowLoop() {
        this.throwInterval = setInterval(() => {
            if (worldObj && worldObj.isPaused) {
                return;
            }

            if (this.hasHit) {
                return;
            }

            this.moveBottle();
            this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
            this.checkBottleImpact();
        }, 25);
    }

    /**
     * Moves the bottle horizontally.
     */
    moveBottle() {
        if (this.otherdirection) {
            this.x -= 7;
            return;
        }

        this.x += 7;
    }

    /**
     * Checks if the bottle should impact.
     */
    checkBottleImpact() {
        if (this.hasReachedMaxDistance()) {
            this.splash();
            return;
        }

        if (this.hasTouchedGround()) {
            this.splash();
        }
    }

    /**
     * Checks if max throw distance is reached.
     * @returns {boolean}
     */
    hasReachedMaxDistance() {
        return Math.abs(this.x - this.throwStartX) > 320;
    }

    /**
     * Checks if the bottle touched the ground.
     * @returns {boolean}
     */
    hasTouchedGround() {
        return this.y >= this.getGroundY();
    }

    /**
     * Starts the splash animation.
     */
    splash() {
        if (this.hasHit) {
            return;
        }

        this.hasHit = true;
        this.stopGravity();
        this.stopThrowLoop();
        this.playSplashSound();
        this.prepareSplashAnimation();
        this.startSplashLoop();
    }

    /**
     * Stops the throw loop.
     */
    stopThrowLoop() {
        if (!this.throwInterval) {
            return;
        }

        clearInterval(this.throwInterval);
        this.throwInterval = null;
    }

    /**
     * Plays the hit sound.
     */
    playSplashSound() {
        if (typeof playBottleHitSound === 'function') {
            playBottleHitSound();
        }
    }

    /**
     * Prepares the splash animation.
     */
    prepareSplashAnimation() {
        this.speedY = 0;
        this.currentImage = 0;
    }

    /**
     * Starts the splash animation loop.
     */
    startSplashLoop() {
        let splashFrame = 0;

        this.splashInterval = setInterval(() => {
            if (worldObj && worldObj.isPaused) {
                return;
            }

            if (this.hasMoreSplashFrames(splashFrame)) {
                this.showSplashFrame(splashFrame);
                splashFrame++;
                return;
            }

            this.finishSplashAnimation();
        }, 50);
    }

    /**
     * Checks if there are remaining splash frames.
     * @param {number} splashFrame
     * @returns {boolean}
     */
    hasMoreSplashFrames(splashFrame) {
        return splashFrame < this.IMAGES_BOTTLE_SPLASH.length;
    }

    /**
     * Displays a splash frame.
     * @param {number} splashFrame
     */
    showSplashFrame(splashFrame) {
        let path = this.IMAGES_BOTTLE_SPLASH[splashFrame];
        this.img = this.imageCache[path];
    }

    /**
     * Finishes the splash animation.
     */
    finishSplashAnimation() {
        clearInterval(this.splashInterval);
        this.splashInterval = null;
        this.removeFromWorld = true;
    }
}