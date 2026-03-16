class Keyboard {
    left = false;
    right = false;
    up = false;
    down = false;
    space = false;
    throw = false;
    esc = false;
    mute = false;

    constructor() {
        window.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "ArrowLeft":
                    this.left = true;
                    break;

                case "ArrowRight":
                    this.right = true;
                    break;

                case "ArrowUp":
                    this.up = true;
                    break;

                case "ArrowDown":
                    this.down = true;
                    break;

                case " ":
                    this.space = true;
                    break;

                case "d":
                case "D":
                    this.throw = true;
                    break;

                case "Escape":
                    this.esc = true;
                    break;

                case "m":
                case "M":
                    this.mute = true;
                    break;
            }
        });

        window.addEventListener("keyup", (e) => {
            switch (e.key) {
                case "ArrowLeft":
                    this.left = false;
                    break;

                case "ArrowRight":
                    this.right = false;
                    break;

                case "ArrowUp":
                    this.up = false;
                    break;

                case "ArrowDown":
                    this.down = false;
                    break;

                case " ":
                    this.space = false;
                    break;

                case "d":
                case "D":
                    this.throw = false;
                    break;

                case "Escape":
                    this.esc = false;
                    break;

                case "m":
                case "M":
                    this.mute = false;
                    break;
            }
        });
    }
}