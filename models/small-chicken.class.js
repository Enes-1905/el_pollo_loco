/**
 * Repräsentiert ein kleines Huhn als Gegner.
 * Schneller als normale Hühner, gleiche Logik.
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
     * Erstellt ein kleines Huhn.
     * @param {number} x
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
     * Lädt alle Bilder des kleinen Huhns.
     */
    loadChickenImages() {
        this.loadImage(this.images_walking[0]);
        this.loadImages(this.images_walking);
        this.loadImages(this.IMAGES_DEAD);
    }

    /**
     * Gibt eine zufällige Geschwindigkeit zurück.
     * @returns {number}
     */
    getRandomSpeed() {
        return 0.35 + Math.random() * 0.3;
    }

    /**
     * Startet Bewegung und Animation.
     */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    /**
     * Startet den Bewegungs-Loop.
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
     * Startet den Animations-Loop.
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
     * Bewegt das kleine Huhn nach links.
     */
    handleMovement() {
        if (this.isDead()) {
            return;
        }

        this.moveChickenLeft();
    }

    /**
     * Bewegt das Huhn nach links.
     */
    moveChickenLeft() {
        this.x -= this.speed;
        this.otherdirection = false;
    }

    /**
     * Spielt die passende Animation ab.
     */
    handleAnimation() {
        if (this.isDead()) {
            this.showDeadImage();
            return;
        }

        this.playAnimation(this.images_walking);
    }

    /**
     * Zeigt das tote kleine Huhn an.
     */
    showDeadImage() {
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
    }

    /**
     * Tötet das kleine Huhn.
     */
    hit() {
        if (this.isDead()) {
            return;
        }

        this.energy = 0;
        this.deadTime = Date.now();
    }

    /**
     * Prüft, ob das kleine Huhn tot ist.
     * @returns {boolean}
     */
    isDead() {
        return this.energy === 0;
    }
}