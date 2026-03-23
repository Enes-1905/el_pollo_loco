/**
 * Basis-Klasse für alle zeichnbaren Objekte im Spiel.
 * Kümmert sich um Bilder, Position und Hitbox.
 */
class DrawableObject {

    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;

    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    /**
     * Lädt ein einzelnes Bild.
     * @param {string} path
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Lädt mehrere Bilder und speichert sie im Cache.
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
        const img = new Image();
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
     * Zeichnet eine Debug-Hitbox (optional).
     * @param {CanvasRenderingContext2D} ctx
     */
    drawFrame(ctx) {
        if (!this.img) {
            return;
        }

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'blue';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    /**
     * Linke Hitbox-Kante.
     * @returns {number}
     */
    getHitboxLeft() {
        return this.x + this.offset.left;
    }

    /**
     * Rechte Hitbox-Kante.
     * @returns {number}
     */
    getHitboxRight() {
        return this.x + this.width - this.offset.right;
    }

    /**
     * Obere Hitbox-Kante.
     * @returns {number}
     */
    getHitboxTop() {
        return this.y + this.offset.top;
    }

    /**
     * Untere Hitbox-Kante.
     * @returns {number}
     */
    getHitboxBottom() {
        return this.y + this.height - this.offset.bottom;
    }
}