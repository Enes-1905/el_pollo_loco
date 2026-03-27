/**
 * Represents a small chicken enemy.
 * Faster than normal chickens, same logic.
 */
class SmallChicken extends MovableObject {

    y = 380;
    height = 50;
    width = 60;
    energy = 20;
    deadTime = 0;

    offset = {
        top: 6,
        right: 8,
        bottom: 6,
        left: 8
    };

    images_walking = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    /**
     * Creates a small chicken.
     * @param {number} x - X position
     */
    constructor(x) {
        super();
        this.loadChickenImages();
        this.x = x;
        this.speed = this.getRandomSpeed();
        this.otherdirection = false;
        this.animate();
    }

    /**
     * Loads all images of the small chicken.
     */
    loadChickenImages() {
        this.loadImage(this.images_walking[0]);
        this.loadImages(this.images_walking);
        this.loadImages(this.IMAGES_DEAD);
    }

    /**
     * Returns a random movement speed.
     * @returns {number}
     */
    getRandomSpeed() {
        return 0.35 + Math.random() * 0.3;
    }

    /**
     * Starts movement and animation.
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
        }, 200);
    }

    /**
     * Handles movement of the small chicken.
     */
    handleMovement() {
        if (this.isDead()) {
            return;
        }

        this.moveChickenLeft();
    }

    /**
     * Moves the chicken to the left.
     */
    moveChickenLeft() {
        this.x -= this.speed;
        this.otherdirection = false;
    }

    /**
     * Plays the correct animation.
     */
    handleAnimation() {
        if (this.isDead()) {
            this.showDeadImage();
            return;
        }

        this.playAnimation(this.images_walking);
    }

    /**
     * Displays the dead chicken image.
     */
    showDeadImage() {
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
    }

    /**
     * Kills the small chicken.
     */
    hit() {
        if (this.isDead()) {
            return;
        }

        this.energy = 0;
        this.deadTime = Date.now();
    }

    /**
     * Checks whether the chicken is dead.
     * @returns {boolean}
     */
    isDead() {
        return this.energy === 0;
    }
}