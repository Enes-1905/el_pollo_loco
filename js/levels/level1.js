/**
 * Münz-Objekt, das eingesammelt werden kann.
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
     * @param {number} x - X-Position
     * @param {number} y - Y-Position
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
     * Startet die Animation der Münze.
     */
    animate() {
        setInterval(() => {
            this.switchImage();
        }, 200);
    }

    /**
     * Wechselt das aktuelle Bild der Münze.
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

let level1;

/**
 * Erstellt das komplette Level.
 */
function initLevel() {
    level1 = new Level(
        createEnemies(),
        createClouds(),
        createBottles(),
        createCoins(),
        createBackground()
    );
}

/**
 * Erstellt alle Gegner.
 */
function createEnemies() {
    return [
        new Chicken(700),
        new SmallChicken(900),
        new Chicken(1150),
        new SmallChicken(1350),
        new Chicken(1550),
        new Chicken(1750),
        new SmallChicken(1950),
        new Chicken(2200),
        new Endboss(2600)
    ];
}

/**
 * Erstellt Wolken.
 */
function createClouds() {
    return [new Cloud()];
}

/**
 * Erstellt Flaschen.
 */
function createBottles() {
    return [
        new Bottle(250),
        new Bottle(450),
        new Bottle(700),
        new Bottle(950),
        new Bottle(1200),
        new Bottle(1450),
        new Bottle(1700),
        new Bottle(2000),
        new Bottle(2300)
    ];
}

/**
 * Erstellt Münzen.
 */
function createCoins() {
    return [
        new Coin(350, 120),
        new Coin(800, 100),
        new Coin(1250, 120),
        new Coin(1700, 100),
        new Coin(2150, 120)
    ];
}

/**
 * Erstellt Hintergrund.
 */
function createBackground() {
    return [
        new BackgroundObject('img/5_background/layers/air.png', -719, 0),
        new BackgroundObject('img/5_background/layers/4_clouds/2.png', -719, 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719, 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719, 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719, 0),

        new BackgroundObject('img/5_background/layers/air.png', 0, 0),
        new BackgroundObject('img/5_background/layers/4_clouds/1.png', 0, 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0, 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0, 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0, 0),

        new BackgroundObject('img/5_background/layers/air.png', 719, 0),
        new BackgroundObject('img/5_background/layers/4_clouds/2.png', 719, 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719, 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719, 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719, 0),

        new BackgroundObject('img/5_background/layers/air.png', 719 * 2, 0),
        new BackgroundObject('img/5_background/layers/4_clouds/1.png', 719 * 2, 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 2, 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 2, 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 2, 0),

        new BackgroundObject('img/5_background/layers/air.png', 719 * 3, 0),
        new BackgroundObject('img/5_background/layers/4_clouds/2.png', 719 * 3, 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 3, 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 3, 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 3, 0)
    ];
}

initLevel();