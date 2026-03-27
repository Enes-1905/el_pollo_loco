/**
 * Extension of DrawableObject for movable objects.
 * Includes movement, gravity, collision, and energy.
 */
class MovableObject extends DrawableObject {

    x = 120;
    y = 280;
    img;
    height = 150;
    width = 100;
    imageCache = {};
    currentImage = 0;
    speed = 0.15;
    otherdirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    gravityInterval = null;

    /**
     * Starts gravity for the object.
     */
    applyGravity() {
        if (this.gravityInterval) {
            return;
        }

        this.gravityInterval = setInterval(() => {
            this.updateGravity();
        }, 1000 / 25);
    }

    /**
     * Stops gravity.
     */
    stopGravity() {
        if (!this.gravityInterval) {
            return;
        }

        clearInterval(this.gravityInterval);
        this.gravityInterval = null;
    }

    /**
     * Updates falling movement and ground collision.
     */
    updateGravity() {
        if (!this.isFalling()) {
            this.stopFalling();
            return;
        }

        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        this.limitToGround();
    }

    /**
     * Checks whether the object is currently falling.
     * @returns {boolean}
     */
    isFalling() {
        return this.isAboveGround() || this.speedY > 0;
    }

    /**
     * Stops the falling movement.
     */
    stopFalling() {
        this.speedY = 0;
    }

    /**
     * Limits the object to the ground position.
     */
    limitToGround() {
        let groundY = this.getGroundY();

        if (this.y > groundY) {
            this.y = groundY;
            this.speedY = 0;
        }
    }

    /**
     * Returns the default ground position.
     * @returns {number}
     */
    getGroundY() {
        return 180;
    }

    /**
     * Checks whether the object is above the ground.
     * @returns {boolean}
     */
    isAboveGround() {
        return this.y < this.getGroundY();
    }

    /**
     * Loads a single image.
     * @param {string} path - Image path
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads multiple images into the cache.
     * @param {string[]} arr - Array of image paths
     */
    loadImages(arr) {
        arr.forEach(path => this.cacheImage(path));
    }

    /**
     * Stores one image in the cache.
     * @param {string} path - Image path
     */
    cacheImage(path) {
        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;
    }

    /**
     * Draws the object on the canvas.
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        if (!this.img) {
            return;
        }

        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Plays an image animation.
     * @param {string[]} images - Animation image paths
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Moves the object to the right.
     */
    moveRight() {
        this.x += this.speed;
        this.otherdirection = false;
        this.playWalkingSound();
    }

    /**
     * Moves the object to the left.
     */
    moveLeft() {
        this.x -= this.speed;
        this.otherdirection = true;
        this.playWalkingSound();
    }

    /**
     * Plays a walking sound if available.
     */
    playWalkingSound() {
        if (!this.walking_sound) {
            return;
        }

        this.walking_sound.play();
    }

    /**
     * Checks collision with another object.
     * @param {MovableObject} mo - Other movable object
     * @returns {boolean}
     */
    isColliding(mo) {
        return this.getHitboxRight() > mo.getHitboxLeft() &&
            this.getHitboxBottom() > mo.getHitboxTop() &&
            this.getHitboxLeft() < mo.getHitboxRight() &&
            this.getHitboxTop() < mo.getHitboxBottom();
    }

    /**
     * Returns the left hitbox boundary.
     * @returns {number}
     */
    getHitboxLeft() {
        return this.x + this.offset.left;
    }

    /**
     * Returns the right hitbox boundary.
     * @returns {number}
     */
    getHitboxRight() {
        return this.x + this.width - this.offset.right;
    }

    /**
     * Returns the top hitbox boundary.
     * @returns {number}
     */
    getHitboxTop() {
        return this.y + this.offset.top;
    }

    /**
     * Returns the bottom hitbox boundary.
     * @returns {number}
     */
    getHitboxBottom() {
        return this.y + this.height - this.offset.bottom;
    }

    /**
     * Deals damage to the object.
     */
    hit() {
        this.energy -= 5;

        if (this.energy < 0) {
            this.energy = 0;
        }
    }

    /**
     * Checks whether the object has no energy left.
     * @returns {boolean}
     */
    isDead() {
        return this.energy === 0;
    }
}