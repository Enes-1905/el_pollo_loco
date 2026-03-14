class ThrowableObject extends MovableObject {

    width = 60;
    height = 80;
    hasHit = false;
    removeFromWorld = false;
    throwInterval = null;
    rotationInterval = null;

    IMAGES_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    constructor(x, y, throwToLeft = false) {
        super();
        this.x = x;
        this.y = y;
        this.otherdirection = throwToLeft;

        this.loadImage(this.IMAGES_ROTATION[0]);
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);

        this.throw(throwToLeft);
    }

    throw(throwToLeft) {
        this.speedY = 22;
        this.applyGravity();

        this.throwInterval = setInterval(() => {
            if (this.hasHit) {
                clearInterval(this.throwInterval);
                return;
            }

            if (throwToLeft) {
                this.x -= 10;
            } else {
                this.x += 10;
            }
        }, 1000 / 60);

        this.rotationInterval = setInterval(() => {
            if (this.hasHit) {
                clearInterval(this.rotationInterval);
                return;
            }

            this.playAnimation(this.IMAGES_ROTATION);
        }, 100);
    }

    splash() {
        if (this.hasHit) {
            return;
        }

        this.hasHit = true;

        if (this.throwInterval) {
            clearInterval(this.throwInterval);
        }

        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
        }

        let splashIndex = 0;

        const splashInterval = setInterval(() => {
            if (splashIndex < this.IMAGES_SPLASH.length) {
                this.img = this.imageCache[this.IMAGES_SPLASH[splashIndex]];
                splashIndex++;
            } else {
                clearInterval(splashInterval);
                this.removeFromWorld = true;
            }
        }, 80);
    }

    isAboveGround() {
        return this.y < 360 && !this.hasHit;
    }
}