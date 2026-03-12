class Coin extends DrawableObject {

    width = 120;
    height = 120;
    y = 120;
    currentImage = 0;

    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor(x, y = 120) {
        super();
        this.loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.currentImage++;

            if (this.currentImage >= this.IMAGES.length) {
                this.currentImage = 0;
            }

            let path = this.IMAGES[this.currentImage];
            this.img = this.imageCache[path];
        }, 200);
    }
}

let level1;

/**
 * Erstellt das Level neu.
 */
function initLevel() {
    level1 = new Level(
        [
            new Chicken(400),
            new Chicken(700),
            new Chicken(1000),
            new Chicken(1300),
            new Chicken(1500),
            new Endboss(1800)
        ],

        [
            new Cloud()
        ],

        [
            new Bottle(200),
            new Bottle(300),
            new Bottle(450),
            new Bottle(600),
            new Bottle(850),
            new Bottle(1000),
            new Bottle(1150),
            new Bottle(1300),
            new Bottle(1500)
        ],

        [
            new Coin(250, 120),
            new Coin(550, 100),
            new Coin(900, 120),
            new Coin(1250, 100),
            new Coin(1600, 120)
        ],

        [
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
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 2, 0)
        ]
    );
}

initLevel();