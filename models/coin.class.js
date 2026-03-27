/**
 * Collectible coin object.
 * Displays a small animation while waiting to be collected.
 */
class Coin extends DrawableObject {

    width = 120;
    height = 120;
    y = 120;
    currentImage = 0;

    offset = {
        top: 35,
        right: 35,
        bottom: 35,
        left: 35
    };

    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    /**
     * Creates a new coin at a given position.
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    constructor(x, y = 120) {
        super();
        this.loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
        this.animate();
    }

    /**
     * Starts the coin animation.
     */
    animate() {
        setInterval(() => {
            this.switchImage();
        }, 200);
    }

    /**
     * Switches the current coin image.
     */
    switchImage() {
        this.currentImage++;

        if (this.currentImage >= this.IMAGES.length) {
            this.currentImage = 0;
        }

        let path = this.IMAGES[this.currentImage];
        this.img = this.imageCache[path];
    }
}