/**
 * Base class for all status bars.
 * Handles image loading and percentage-based image switching.
 */
class BaseStatusBar extends DrawableObject {

    percentage = 0;
    IMAGES = [];

    /**
     * Creates a new status bar.
     * @param {string[]} images - Status bar images
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} startPercentage - Initial percentage
     */
    constructor(images, x, y, startPercentage) {
        super();
        this.IMAGES = images;
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 60;
        this.setPercentage(startPercentage);
    }

    /**
     * Sets the current percentage and updates the image.
     * @param {number} percentage - Current value from 0 to 100
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let imagePath = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[imagePath];
    }

    /**
     * Returns the correct image index for the current percentage.
     * @returns {number}
     */
    resolveImageIndex() {
        if (this.percentage == 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}

/**
 * Status bar for the player's health.
 */
class StatusBar extends BaseStatusBar {

    /**
     * Creates the health status bar.
     */
    constructor() {
        super([
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
        ], 20, 20, 100);
    }
}

/**
 * Status bar for collected coins.
 */
class CoinStatusBar extends BaseStatusBar {

    /**
     * Creates the coin status bar.
     */
    constructor() {
        super([
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
        ], 20, 70, 0);
    }
}

/**
 * Status bar for collected bottles.
 */
class BottleStatusBar extends BaseStatusBar {

    /**
     * Creates the bottle status bar.
     */
    constructor() {
        super([
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
        ], 20, 120, 0);
    }
}