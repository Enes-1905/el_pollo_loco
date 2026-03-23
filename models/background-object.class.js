/**
 * Hintergrund-Objekt für das Spiel.
 * Wird für statische Hintergründe im Level verwendet.
 * Erbt Bewegung und Zeichnen von MovableObject.
 */
class BackgroundObject extends MovableObject {

  width = 720;
  height = 480;

  /**
   * Erstellt ein neues Hintergrund-Element.
   * @param {string} imagePath - Pfad zum Bild.
   * @param {number} x - X-Position im Level.
   * @param {number} y - Y-Position im Level.
   */
  constructor(imagePath, x, y) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = y;
  }

}