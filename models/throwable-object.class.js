class ThrowableObject extends MovableObject {
    IMAGES_BOTTLE_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_BOTTLE_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    hasHit = false;
    removeFromWorld = false;
    throwInterval = null;
    splashInterval = null;
    throwStartX = 0;

    constructor(x, y, otherdirection = false) {
        super();
        this.loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_BOTTLE_ROTATION);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);

        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 70;
        this.otherdirection = otherdirection;
        this.throwStartX = x;

        this.throw();
    }

    getGroundY() {
        return 360;
    }

    throw() {
        this.speedY = 20;
        this.applyGravity();

        this.throwInterval = setInterval(() => {
            if (worldObj && worldObj.isPaused) return;

            if (this.hasHit) {
                return;
            }

            if (this.otherdirection) {
                this.x -= 7;
            } else {
                this.x += 7;
            }

            this.playAnimation(this.IMAGES_BOTTLE_ROTATION);

            if (Math.abs(this.x - this.throwStartX) > 320) {
                this.splash();
            }

            if (this.y >= this.getGroundY()) {
                this.splash();
            }
        }, 25);
    }

    splash() {
        if (this.hasHit) {
            return;
        }

        this.hasHit = true;
        this.stopGravity();

        if (this.throwInterval) {
            clearInterval(this.throwInterval);
            this.throwInterval = null;
        }

        this.speedY = 0;
        this.currentImage = 0;

        let splashFrame = 0;

        this.splashInterval = setInterval(() => {
            if (worldObj && worldObj.isPaused) return;

            if (splashFrame < this.IMAGES_BOTTLE_SPLASH.length) {
                let path = this.IMAGES_BOTTLE_SPLASH[splashFrame];
                this.img = this.imageCache[path];
                splashFrame++;
            } else {
                clearInterval(this.splashInterval);
                this.splashInterval = null;
                this.removeFromWorld = true;
            }
        }, 50);
    }
}