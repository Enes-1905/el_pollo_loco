/**
 * Cloud object in the background.
 * Moves slowly from right to left.
 */
class Cloud extends MovableObject {

    y = 20;
    width = 400;
    height = 250;
    speed = 0.16;

    /**
     * Creates a new cloud with a random starting position.
     */
    constructor() {
        super();
        this.loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 720;
        this.animate();
    }

    /**
     * Starts the cloud movement.
     */
    animate() {
        setInterval(() => {
            this.moveCloud();
        }, 1000 / 60);
    }

    /**
     * Moves the cloud to the left and resets it
     * when it leaves the screen.
     */
    moveCloud() {
        this.x -= this.speed;

        if (this.x + this.width < 0) {
            this.x = 720 + Math.random() * 300;
        }
    }
}