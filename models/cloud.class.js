/**
 * Wolken-Objekt im Hintergrund.
 * Bewegt sich langsam von rechts nach links.
 */
class Cloud extends MovableObject {

    y = 20;
    width = 400;
    height = 250;
    speed = 0.16;

    /**
     * Erstellt eine neue Wolke mit zufälliger Startposition.
     */
    constructor() {
        super();
        this.loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 720;
        this.animate();
    }

    /**
     * Startet die Bewegung der Wolke.
     */
    animate() {
        setInterval(() => {
            this.moveCloud();
        }, 1000 / 60);
    }

    /**
     * Bewegt die Wolke nach links und setzt sie zurück,
     * wenn sie den Bildschirm verlässt.
     */
    moveCloud() {
        this.x -= this.speed;

        if (this.x + this.width < 0) {
            this.x = 720 + Math.random() * 300;
        }
    }
}