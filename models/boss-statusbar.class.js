/**
 * Statusanzeige für den Endboss.
 * Zeigt die verbleibende Energie des Bosses visuell an.
 */
class BossStatusBar extends DrawableObject {

    IMAGES = [
        'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
    ];

    percentage = 100;

    /**
     * Erstellt die Boss-Statusleiste.
     * Lädt die Bilder und setzt Startwerte.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 470;
        this.y = 10;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Setzt den aktuellen Prozentwert der Boss-Energie
     * und aktualisiert das angezeigte Bild.
     * @param {number} percentage - Aktuelle Energie (0–100)
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Bestimmt das passende Bild basierend auf dem Prozentwert.
     * @returns {number} Index des Bildes
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}