/**
 * Repräsentiert ein normales Huhn als Gegner.
 * Steuert Bewegung, Tod und Animation.
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
     * Erstellt ein normales Huhn.
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
     * Lädt alle Bilder des Huhns.
     */
    loadChickenImages() {
        this.loadImage(this.images_walking[0]);
        this.loadImages(this.images_walking);
        this.loadImages(this.IMAGES_DEAD);
    }

    /**
     * Gibt eine zufällige Laufgeschwindigkeit zurück.
     * @returns {number}
     */
    getRandomSpeed() {
        return 0.2 + Math.random() * 0.25;
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
     * Bewegt das Huhn nach links.
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
     * Zeigt das tote Huhn an.
     */
    showDeadImage() {
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
    }

    /**
     * Tötet das Huhn.
     */
    hit() {
        if (this.isDead()) {
            return;
        }

        this.energy = 0;
        this.deadTime = Date.now();
    }

    /**
     * Prüft, ob das Huhn tot ist.
     * @returns {boolean}
     */
    isDead() {
        return this.energy === 0;
    }
}