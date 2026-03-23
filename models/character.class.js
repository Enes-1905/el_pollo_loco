/**
 * Steuert den spielbaren Charakter.
 * Beinhaltet Bewegung, Animationen, Sounds und Sammelobjekte.
 */
class Charackter extends MovableObject {

    height = 280;
    width = 120;
    y = 150;
    speed = 10;
    energy = 100;
    lastHit = 0;
    bottles = 0;
    coins = 0;
    lastAction = Date.now();
    sleepSoundPlayed = false;

    sleep_sound = new Audio('audio/sleep.mp3');

    offset = {
        top: 110,
        right: 30,
        bottom: 15,
        left: 30
    };

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    images_walking = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    images_jumping = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    BOTTLE_IMAGES = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    /**
     * Erstellt den Charakter und startet Animation sowie Gravitation.
     */
    constructor() {
        super();
        this.loadCharacterImages();
        this.prepareSleepSound();
        this.applyGravity();
        this.animate();
    }

    /**
     * Lädt alle Bilder des Charakters.
     */
    loadCharacterImages() {
        this.loadImage(this.images_walking[0]);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.images_walking);
        this.loadImages(this.images_jumping);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.BOTTLE_IMAGES);
    }

    /**
     * Bereitet den Schlaf-Sound vor.
     */
    prepareSleepSound() {
        this.sleep_sound.volume = 0.35;
        this.sleep_sound.loop = false;
    }

    /**
     * Startet Bewegungs- und Animations-Loop.
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
        }, 120);
    }

    /**
     * Steuert Bewegung, Kamera und Lauf-Sound.
     */
    handleMovement() {
        if (!this.world || this.isDead()) {
            stopRunningSound();
            return;
        }

        this.stopSleepIfActive();
        this.updateLastAction();
        this.handleWalkRight();
        this.handleWalkLeft();
        this.handleJump();
        this.updateCamera();
        this.handleRunningSound();
    }

    /**
     * Stoppt Schlaf-Sound bei Aktivität.
     */
    stopSleepIfActive() {
        if (!this.isDoingSomething()) {
            return;
        }

        this.stopSleepSound();
        this.sleepSoundPlayed = false;
    }

    /**
     * Aktualisiert die letzte Aktion bei Eingabe.
     */
    updateLastAction() {
        if (!this.isDoingSomething()) {
            return;
        }

        this.lastAction = Date.now();
    }

    /**
     * Bewegt den Charakter nach rechts.
     */
    handleWalkRight() {
        let maxX = this.world.level.level_end_x - this.width;

        if (this.world.keyboard.right && this.x < maxX) {
            this.moveRight();
        }
    }

    /**
     * Bewegt den Charakter nach links.
     */
    handleWalkLeft() {
        if (this.world.keyboard.left && this.x > 0) {
            this.moveLeft();
        }
    }

    /**
     * Führt einen Sprung aus.
     */
    handleJump() {
        let jumpPressed = this.world.keyboard.up || this.world.keyboard.space;

        if (jumpPressed && !this.isAboveGround()) {
            this.jump();
        }
    }

    /**
     * Steuert den Lauf-Sound.
     */
    handleRunningSound() {
        if (this.isAboveGround()) {
            stopRunningSound();
            return;
        }

        if (this.isWalking()) {
            playRunningSound();
            return;
        }

        stopRunningSound();
    }

    /**
     * Aktualisiert die Kameraposition.
     */
    updateCamera() {
        let cameraX = -this.x + 120;
        let maxCameraX = this.getMaxCameraX();
        this.world.camera_x = this.limitCameraX(cameraX, maxCameraX);
    }

    /**
     * Gibt die maximale Kameragrenze zurück.
     * @returns {number}
     */
    getMaxCameraX() {
        return -(this.world.level.level_end_x - this.world.canvas.width);
    }

    /**
     * Begrenzt die Kamera auf den Levelbereich.
     * @param {number} cameraX
     * @param {number} maxCameraX
     * @returns {number}
     */
    limitCameraX(cameraX, maxCameraX) {
        if (cameraX > 0) {
            return 0;
        }

        if (cameraX < maxCameraX) {
            return maxCameraX;
        }

        return cameraX;
    }

    /**
     * Wählt die passende Animation aus.
     */
    handleAnimation() {
        if (!this.world) {
            return;
        }

        if (this.isDead()) {
            this.showDeadAnimation();
            return;
        }

        if (this.isHurt()) {
            this.showHurtAnimation();
            return;
        }

        if (this.isAboveGround()) {
            this.showJumpAnimation();
            return;
        }

        if (this.isWalking()) {
            this.showWalkAnimation();
            return;
        }

        if (this.isSleeping()) {
            this.showSleepAnimation();
            return;
        }

        this.showIdleAnimation();
    }

    /**
     * Zeigt die Todesanimation.
     */
    showDeadAnimation() {
        stopRunningSound();
        this.stopSleepSound();
        this.playAnimation(this.IMAGES_DEAD);
    }

    /**
     * Zeigt die Hurt-Animation.
     */
    showHurtAnimation() {
        this.resetSleepState();
        this.playAnimation(this.IMAGES_HURT);
    }

    /**
     * Zeigt die Sprung-Animation.
     */
    showJumpAnimation() {
        this.resetSleepState();
        this.playAnimation(this.images_jumping);
    }

    /**
     * Zeigt die Lauf-Animation.
     */
    showWalkAnimation() {
        this.resetSleepState();
        this.playAnimation(this.images_walking);
    }

    /**
     * Zeigt die Schlaf-Animation.
     */
    showSleepAnimation() {
        this.playAnimation(this.IMAGES_LONG_IDLE);
        this.playSleepSoundOnce();
    }

    /**
     * Zeigt die Idle-Animation.
     */
    showIdleAnimation() {
        this.resetSleepState();
        this.playAnimation(this.IMAGES_IDLE);
    }

    /**
     * Setzt den Schlafzustand zurück.
     */
    resetSleepState() {
        this.stopSleepSound();
        this.sleepSoundPlayed = false;
    }

    /**
     * Behandelt Fehler beim Schlaf-Sound.
     * @param {Error} error
     */
    handleSleepSoundError(error) {
        if (!error || error.name === 'AbortError') {
            return;
        }

        console.warn('Sleep sound error:', error);
    }

    /**
     * Spielt den Schlaf-Sound einmal ab.
     */
    playSleepSoundOnce() {
        if (soundMuted || this.sleepSoundPlayed) {
            return;
        }

        this.sleep_sound.currentTime = 0;
        const playPromise = this.sleep_sound.play();

        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(error => this.handleSleepSoundError(error));
        }

        this.sleepSoundPlayed = true;
    }

    /**
     * Stoppt den Schlaf-Sound.
     */
    stopSleepSound() {
        this.sleep_sound.pause();
        this.sleep_sound.currentTime = 0;
    }

    /**
     * Prüft, ob der Charakter läuft.
     * @returns {boolean}
     */
    isWalking() {
        return this.world.keyboard.right || this.world.keyboard.left;
    }

    /**
     * Prüft, ob der Spieler etwas aktiv macht.
     * @returns {boolean}
     */
    isDoingSomething() {
        return this.world.keyboard.right ||
            this.world.keyboard.left ||
            this.world.keyboard.up ||
            this.world.keyboard.space ||
            this.world.keyboard.throw;
    }

    /**
     * Prüft, ob der Charakter schlafen soll.
     * @returns {boolean}
     */
    isSleeping() {
        let timePassed = Date.now() - this.lastAction;
        let idleLongEnough = timePassed > 5000;
        let standingStill = !this.isWalking();
        let notJumping = !this.isAboveGround();
        return idleLongEnough && standingStill && notJumping;
    }

    /**
     * Führt einen Sprung aus.
     */
    jump() {
        this.speedY = 22;
        this.lastAction = Date.now();
        stopRunningSound();
        this.resetSleepState();
    }

    /**
     * Fügt dem Charakter Schaden zu.
     */
    hit() {
        if (this.isHurt()) {
            return;
        }

        this.reduceEnergy(5);
        this.lastHit = Date.now();
        this.lastAction = Date.now();
        stopRunningSound();
        this.resetSleepState();
    }

    /**
     * Verringert die Energie des Charakters.
     * @param {number} amount
     */
    reduceEnergy(amount) {
        this.energy -= amount;

        if (this.energy < 0) {
            this.energy = 0;
        }
    }

    /**
     * Prüft, ob der Charakter gerade verletzt ist.
     * @returns {boolean}
     */
    isHurt() {
        let timePassed = Date.now() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 1;
    }

    /**
     * Gibt die Bodenhöhe des Charakters zurück.
     * @returns {number}
     */
    getGroundY() {
        return 150;
    }

    /**
     * Sammelt eine Flasche ein.
     */
    collectBottle() {
        this.bottles += 1;
        this.registerAction();
    }

    /**
     * Sammelt eine Münze ein.
     */
    collectCoin() {
        if (this.coins < 5) {
            this.coins += 1;
        }

        this.registerAction();
    }

    /**
     * Prüft, ob eine Flasche geworfen werden kann.
     * @returns {boolean}
     */
    canThrowBottle() {
        return this.bottles > 0;
    }

    /**
     * Verbraucht eine Flasche.
     */
    useBottle() {
        if (this.bottles > 0) {
            this.bottles -= 1;
        }

        this.registerAction();
    }

    /**
     * Registriert eine neue Aktion des Spielers.
     */
    registerAction() {
        this.lastAction = Date.now();
        this.resetSleepState();
    }
}