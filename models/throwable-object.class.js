/**
 * Repräsentiert eine geworfene Flasche.
 * Steuert Flugbahn, Rotation, Aufprall und Splash-Animation.
 */
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

    /**
     * Erstellt eine neue geworfene Flasche.
     * @param {number} x
     * @param {number} y
     * @param {boolean} otherdirection
     */
    constructor(x, y, otherdirection = false) {
        super();
        this.loadBottleImages();
        this.setBottleValues(x, y, otherdirection);
        this.throw();
    }

    /**
     * Lädt alle Bilder der Flasche.
     */
    loadBottleImages() {
        this.loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_BOTTLE_ROTATION);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
    }

    /**
     * Setzt Position und Richtung der Flasche.
     * @param {number} x
     * @param {number} y
     * @param {boolean} otherdirection
     */
    setBottleValues(x, y, otherdirection) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 70;
        this.otherdirection = otherdirection;
        this.throwStartX = x;
    }

    /**
     * Gibt die Bodenhöhe der Flasche zurück.
     * @returns {number}
     */
    getGroundY() {
        return 360;
    }

    /**
     * Startet den Wurf der Flasche.
     */
    throw() {
        this.speedY = 20;
        this.applyGravity();
        this.startThrowLoop();
    }

    /**
     * Startet den Flug-Loop der Flasche.
     */
    startThrowLoop() {
        this.throwInterval = setInterval(() => {
            if (worldObj && worldObj.isPaused) {
                return;
            }

            if (this.hasHit) {
                return;
            }

            this.moveBottle();
            this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
            this.checkBottleImpact();
        }, 25);
    }

    /**
     * Bewegt die Flasche horizontal.
     */
    moveBottle() {
        if (this.otherdirection) {
            this.x -= 7;
            return;
        }

        this.x += 7;
    }

    /**
     * Prüft, ob die Flasche aufprallen soll.
     */
    checkBottleImpact() {
        if (this.hasReachedMaxDistance()) {
            this.splash();
            return;
        }

        if (this.hasTouchedGround()) {
            this.splash();
        }
    }

    /**
     * Prüft, ob die maximale Wurfweite erreicht ist.
     * @returns {boolean}
     */
    hasReachedMaxDistance() {
        return Math.abs(this.x - this.throwStartX) > 320;
    }

    /**
     * Prüft, ob die Flasche den Boden berührt hat.
     * @returns {boolean}
     */
    hasTouchedGround() {
        return this.y >= this.getGroundY();
    }

    /**
     * Startet die Splash-Animation.
     */
    splash() {
        if (this.hasHit) {
            return;
        }

        this.hasHit = true;
        this.stopGravity();
        this.stopThrowLoop();
        this.playSplashSound();
        this.prepareSplashAnimation();
        this.startSplashLoop();
    }

    /**
     * Stoppt den Flug-Loop.
     */
    stopThrowLoop() {
        if (!this.throwInterval) {
            return;
        }

        clearInterval(this.throwInterval);
        this.throwInterval = null;
    }

    /**
     * Spielt den Treffer-Sound.
     */
    playSplashSound() {
        if (typeof playBottleHitSound === 'function') {
            playBottleHitSound();
        }
    }

    /**
     * Bereitet die Splash-Animation vor.
     */
    prepareSplashAnimation() {
        this.speedY = 0;
        this.currentImage = 0;
    }

    /**
     * Startet die Splash-Bildfolge.
     */
    startSplashLoop() {
        let splashFrame = 0;

        this.splashInterval = setInterval(() => {
            if (worldObj && worldObj.isPaused) {
                return;
            }

            if (this.hasMoreSplashFrames(splashFrame)) {
                this.showSplashFrame(splashFrame);
                splashFrame++;
                return;
            }

            this.finishSplashAnimation();
        }, 50);
    }

    /**
     * Prüft, ob noch Splash-Bilder übrig sind.
     * @param {number} splashFrame
     * @returns {boolean}
     */
    hasMoreSplashFrames(splashFrame) {
        return splashFrame < this.IMAGES_BOTTLE_SPLASH.length;
    }

    /**
     * Zeigt ein Splash-Bild an.
     * @param {number} splashFrame
     */
    showSplashFrame(splashFrame) {
        let path = this.IMAGES_BOTTLE_SPLASH[splashFrame];
        this.img = this.imageCache[path];
    }

    /**
     * Beendet die Splash-Animation.
     */
    finishSplashAnimation() {
        clearInterval(this.splashInterval);
        this.splashInterval = null;
        this.removeFromWorld = true;
    }
}