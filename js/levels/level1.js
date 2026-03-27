let level1;

/**
 * Creates the complete level.
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
 * Creates all enemies for the level.
 * @returns {Array}
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
 * Creates all clouds for the level.
 * @returns {Array}
 */
function createClouds() {
    return [
        new Cloud()
    ];
}

/**
 * Creates all collectible bottles for the level.
 * @returns {Array}
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
 * Creates all collectible coins for the level.
 * @returns {Array}
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
 * Creates all background objects for the level.
 * @returns {Array}
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