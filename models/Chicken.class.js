class Chicken extends MovableObject {

    y = 360;
    height = 60;
    width = 80;
    energy = 20;

    images_walking = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    constructor(x) {
        super();
        this.loadImage(this.images_walking[0]);
        this.loadImages(this.images_walking);

        this.x = x;
        this.speed = 0.2 + Math.random() * 0.25;
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
            if (!this.isDead()) {
                this.playAnimation(this.images_walking);
            }
        }, 200);
    }

    hit() {
        this.energy = 0;
    }

    isDead() {
        return this.energy == 0;
    }
}