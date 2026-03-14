class Cloud extends MovableObject {

    y = 20;
    width = 400;
    height = 250;
    speed = 0.16;

    constructor() {
        super();
        this.loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 720;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }
}