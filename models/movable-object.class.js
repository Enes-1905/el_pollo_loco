/**
 * Erweiterung von DrawableObject für bewegliche Objekte.
 * Beinhaltet Bewegung, Gravitation, Kollision und Energie.
 */
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

    /**
     * Startet die Gravitation für das Objekt.
     */
    applyGravity() {
        if (this.gravityInterval) {
            return;
        }

        this.gravityInterval = setInterval(() => {
            this.updateGravity();
        }, 1000 / 25);
    }

    /**
     * Stoppt die Gravitation.
     */
    stopGravity() {
        if (!this.gravityInterval) {
            return;
        }

        clearInterval(this.gravityInterval);
        this.gravityInterval = null;
    }

    /**
     * Aktualisiert Fallbewegung und Bodenbegrenzung.
     */
    updateGravity() {
        if (!this.isFalling()) {
            this.stopFalling();
            return;
        }

        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        this.limitToGround();
    }

    /**
     * Prüft, ob das Objekt gerade fällt.
     * @returns {boolean}
     */
    isFalling() {
        return this.isAboveGround() || this.speedY > 0;
    }

    /**
     * Stoppt die Fallbewegung.
     */
    stopFalling() {
        this.speedY = 0;
    }

    /**
     * Begrenzt das Objekt auf die Bodenhöhe.
     */
    limitToGround() {
        let groundY = this.getGroundY();

        if (this.y > groundY) {
            this.y = groundY;
            this.speedY = 0;
        }
    }

    /**
     * Gibt die Standard-Bodenhöhe zurück.
     * @returns {number}
     */
    getGroundY() {
        return 180;
    }

    /**
     * Prüft, ob sich das Objekt über dem Boden befindet.
     * @returns {boolean}
     */
    isAboveGround() {
        return this.y < this.getGroundY();
    }

    /**
     * Lädt ein einzelnes Bild.
     * @param {string} path
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Lädt mehrere Bilder in den Cache.
     * @param {string[]} arr
     */
    loadImages(arr) {
        arr.forEach(path => this.cacheImage(path));
    }

    /**
     * Speichert ein Bild im Cache.
     * @param {string} path
     */
    cacheImage(path) {
        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;
    }

    /**
     * Zeichnet das Objekt auf das Canvas.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        if (!this.img) {
            return;
        }

        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Spielt eine Bildanimation ab.
     * @param {string[]} images
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Bewegt das Objekt nach rechts.
     */
    moveRight() {
        this.x += this.speed;
        this.otherdirection = false;
        this.playWalkingSound();
    }

    /**
     * Bewegt das Objekt nach links.
     */
    moveLeft() {
        this.x -= this.speed;
        this.otherdirection = true;
        this.playWalkingSound();
    }

    /**
     * Spielt einen Laufsound ab, falls vorhanden.
     */
    playWalkingSound() {
        if (!this.walking_sound) {
            return;
        }

        this.walking_sound.play();
    }

    /**
     * Prüft Kollision mit einem anderen Objekt.
     * @param {MovableObject} mo
     * @returns {boolean}
     */
    isColliding(mo) {
        return this.getHitboxRight() > mo.getHitboxLeft() &&
            this.getHitboxBottom() > mo.getHitboxTop() &&
            this.getHitboxLeft() < mo.getHitboxRight() &&
            this.getHitboxTop() < mo.getHitboxBottom();
    }

    /**
     * Gibt die linke Hitbox-Kante zurück.
     * @returns {number}
     */
    getHitboxLeft() {
        return this.x + this.offset.left;
    }

    /**
     * Gibt die rechte Hitbox-Kante zurück.
     * @returns {number}
     */
    getHitboxRight() {
        return this.x + this.width - this.offset.right;
    }

    /**
     * Gibt die obere Hitbox-Kante zurück.
     * @returns {number}
     */
    getHitboxTop() {
        return this.y + this.offset.top;
    }

    /**
     * Gibt die untere Hitbox-Kante zurück.
     * @returns {number}
     */
    getHitboxBottom() {
        return this.y + this.height - this.offset.bottom;
    }

    /**
     * Fügt dem Objekt Schaden zu.
     */
    hit() {
        this.energy -= 5;

        if (this.energy < 0) {
            this.energy = 0;
        }
    }

    /**
     * Prüft, ob das Objekt keine Energie mehr hat.
     * @returns {boolean}
     */
    isDead() {
        return this.energy === 0;
    }
}