class MovableObject extends DrawableObject {

    x = 120;
    y = 280;
    img;
    height = 150;
    width = 100;
    imageCache = {};
    currentImage = 0;
    speed = 0.15;
    otherdirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    gravityInterval = null;

    applyGravity() {
        if (this.gravityInterval) {
            return;
        }

        this.gravityInterval = setInterval(() => {
            this.updateGravity();
        }, 1000 / 25);
    }

    stopGravity() {
        if (this.gravityInterval) {
            clearInterval(this.gravityInterval);
            this.gravityInterval = null;
        }
    }

    updateGravity() {
        if (!this.isAboveGround() && this.speedY <= 0) {
            this.stopFalling();
            return;
        }

        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        this.limitToGround();
    }

    stopFalling() {
        this.speedY = 0;
    }

    limitToGround() {
        let groundY = this.getGroundY();

        if (this.y > groundY) {
            this.y = groundY;
            this.speedY = 0;
        }
    }

    getGroundY() {
        return 180;
    }

    isAboveGround() {
        return this.y < this.getGroundY();
    }

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    draw(ctx) {
        if (!this.img) {
            return;
        }

        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;
        this.otherdirection = false;
        this.playWalkingSound();
    }

    moveLeft() {
        this.x -= this.speed;
        this.otherdirection = true;
        this.playWalkingSound();
    }

    playWalkingSound() {
        if (this.walking_sound) {
            this.walking_sound.play();
        }
    }

    isColliding(mo) {
        return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x + mo.width &&
            this.y < mo.y + mo.height;
    }

    hit() {
        this.energy -= 5;

        if (this.energy < 0) {
            this.energy = 0;
        }
    }

    isDead() {
        return this.energy === 0;
    }
}