class SmallChicken extends MovableObject {

    y = 380;
    height = 50;
    width = 60;
    energy = 20;
    deadTime = 0;

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
     * @param {number} x - Startposition auf der X-Achse.
     */
    constructor(x) {
        super();
        this.loadImage(this.images_walking[0]);
        this.loadImages(this.images_walking);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x;
        this.speed = 0.35 + Math.random() * 0.3;
        this.otherdirection = false;
        this.animate();
    }

    /**
     * Startet Bewegung und Animation.
     */
    animate() {

        setInterval(() => {
            if (worldObj && worldObj.isPaused) return;
            this.handleMovement();
        }, 1000 / 60);

        setInterval(() => {
            if (worldObj && worldObj.isPaused) return;
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