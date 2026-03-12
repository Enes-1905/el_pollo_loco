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

    animate() {
        setInterval(() => {
            if (!this.isDead()) {
                this.x -= this.speed;
                this.otherdirection = false;
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.img = this.imageCache[this.IMAGES_DEAD[0]];
            } else {
                this.playAnimation(this.images_walking);
            }
        }, 200);
    }

    hit() {
        if (this.isDead()) return;

        this.energy = 0;
        this.deadTime = new Date().getTime();
    }

    isDead() {
        return this.energy == 0;
    }
}