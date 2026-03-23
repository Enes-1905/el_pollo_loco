/**
 * Flaschen-Objekt, das im Level eingesammelt werden kann.
 * Wird statisch auf dem Boden platziert.
 */
class Bottle extends DrawableObject {

    width = 60;
    height = 80;
    y = 340;
    offset = {
        top: 10,
        right: 18,
        bottom: 10,
        left: 18
    };

    IMAGES_BOTTLE_ON_GROUND = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    /**
     * Erstellt eine Flasche an einer bestimmten X-Position.
     * Wählt zufällig ein Bild aus.
     * @param {number} x - X-Position im Level
     */
    constructor(x) {
        super();
        this.x = x;

        this.loadImages(this.IMAGES_BOTTLE_ON_GROUND);

        const randomImage = this.IMAGES_BOTTLE_ON_GROUND[
            Math.floor(Math.random() * this.IMAGES_BOTTLE_ON_GROUND.length)
        ];

        this.loadImage(randomImage);
    }
}