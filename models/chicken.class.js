/**
 * Represents a normal chicken enemy.
 * Handles movement, death, and animation.
 */
class Chicken extends MovableObject {

    y = 360;
    height = 60;
    width = 80;
    energy = 20;
    isDeadChicken = false;
    deadTime = 0;

    offset = {
        top: 8,
        right: 10,
        bottom: 8,
        left: 10
    };

    images_walking = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    /**
     * Creates a normal chicken.
     * @param {number} x - X position in the level
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
     * Loads all chicken images.
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
        return 0.2 + Math.random() * 0.25;
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
        }, 200);
    }

    /**
     * Handles chicken movement.
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
     * Kills the chicken.
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