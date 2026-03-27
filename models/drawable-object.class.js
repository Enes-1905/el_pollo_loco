/**
 * Base class for all drawable objects in the game.
 * Handles images, position, and hitbox.
 */
class DrawableObject {

    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;

    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    /**
     * Loads a single image.
     * @param {string} path - Image path
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads multiple images and stores them in the cache.
     * @param {string[]} arr - Array of image paths
     */
    loadImages(arr) {
        arr.forEach(path => this.cacheImage(path));
    }

    /**
     * Stores an image in the cache.
     * @param {string} path - Image path
     */
    cacheImage(path) {
        const img = new Image();
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
     * Draws a debug hitbox (optional).
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawFrame(ctx) {
        if (!this.img) {
            return;
        }

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'blue';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
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
}