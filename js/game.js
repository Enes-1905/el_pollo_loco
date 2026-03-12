let canvas;
let worldObj;
let keyboard = new Keyboard();

/**
 * Initialisiert das Spiel und erstellt die Spielwelt.
 */
function init() {
    initLevel();
    canvas = document.getElementById('canvas');
    worldObj = new World(canvas, keyboard);
}

/**
 * Startet das Spiel.
 */
function startGame() {
    document.getElementById('startscreen').classList.add('d-none');
    document.getElementById('game-over-screen').classList.add('d-none');
    document.getElementById('you-win-screen').classList.add('d-none');
    document.getElementById('game-container').classList.remove('d-none');
    keyboard = new Keyboard();
    init();
}

/**
 * Zeigt den Game Over Screen an.
 */
function showGameOverScreen() {
    document.getElementById('game-container').classList.add('d-none');
    document.getElementById('game-over-screen').classList.remove('d-none');
}

/**
 * Zeigt den You Win Screen an.
 */
function showYouWinScreen() {
    document.getElementById('game-container').classList.add('d-none');
    document.getElementById('you-win-screen').classList.remove('d-none');
}

/**
 * Startet das Spiel neu.
 */
function restartGame() {
    document.getElementById('game-over-screen').classList.add('d-none');
    document.getElementById('you-win-screen').classList.add('d-none');
    document.getElementById('game-container').classList.remove('d-none');
    keyboard = new Keyboard();
    init();
}

/**
 * Geht zurück zum Startscreen.
 */
function goToHome() {
    document.getElementById('game-container').classList.add('d-none');
    document.getElementById('game-over-screen').classList.add('d-none');
    document.getElementById('you-win-screen').classList.add('d-none');
    document.getElementById('startscreen').classList.remove('d-none');
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowRight') keyboard.right = true;
    if (e.code === 'ArrowLeft') keyboard.left = true;
    if (e.code === 'ArrowUp') keyboard.up = true;
    if (e.code === 'ArrowDown') keyboard.down = true;
    if (e.code === 'Space') keyboard.space = true;
    if (e.code === 'KeyD') keyboard.throw = true;
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowRight') keyboard.right = false;
    if (e.code === 'ArrowLeft') keyboard.left = false;
    if (e.code === 'ArrowUp') keyboard.up = false;
    if (e.code === 'ArrowDown') keyboard.down = false;
    if (e.code === 'Space') keyboard.space = false;
    if (e.code === 'KeyD') keyboard.throw = false;
});

function addTouchControls() {
    let btnLeft = document.getElementById('btn-left');
    let btnRight = document.getElementById('btn-right');
    let btnJump = document.getElementById('btn-jump');
    let btnThrow = document.getElementById('btn-throw');

    btnLeft.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.left = true;
    });

    btnLeft.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.left = false;
    });

    btnRight.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.right = true;
    });

    btnRight.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.right = false;
    });

    btnJump.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.space = true;
    });

    btnJump.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.space = false;
    });

    btnThrow.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.throw = true;
    });

    btnThrow.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.throw = false;
    });

    btnLeft.addEventListener('contextmenu', (e) => e.preventDefault());
    btnRight.addEventListener('contextmenu', (e) => e.preventDefault());
    btnJump.addEventListener('contextmenu', (e) => e.preventDefault());
    btnThrow.addEventListener('contextmenu', (e) => e.preventDefault());
}

addTouchControls();