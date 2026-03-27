/**
 * Background object used in the game.
 * Represents static background elements within the level.
 * Inherits movement and drawing from MovableObject.
 */
class BackgroundObject extends MovableObject {

  width = 720;
  height = 480;

  /**
   * Creates a new background element.
   * @param {string} imagePath 
   * @param {number} x 
   * @param {number} y 
   */
  constructor(imagePath, x, y) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = y;
  }

}