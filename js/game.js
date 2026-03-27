let canvas;
let worldObj;

/**
 * Initializes the game and creates the world.
 */
function init() {
    initLevel();
    canvas = document.getElementById('canvas');
    worldObj = new World(canvas, keyboard);
    loadSoundSetting();
    prepareSounds();
    updateSoundButton();
}

/**
 * Starts a new game.
 */
function startGame() {
    prepareGameStart();
    init();
    playBackgroundMusic();
}

/**
 * Restarts the game after game over or win.
 */
function restartGame() {
    hideEndScreens();
    hidePauseScreen();
    prepareGameStart();
    init();
    playBackgroundMusic();
}

/**
 * Prepares a fresh game start.
 */
function prepareGameStart() {
    hideAllScreens();
    showGameContainer();
    resetKeyboard();
    bossMusicStarted = false;
}

/**
 * Returns to the start screen.
 */
function goToHome() {
    hideAllScreens();
    hidePauseScreen();
    stopAllSounds();
    showLegalLinks();
    showStartscreen();
    updateSoundButton();
}

/**
 * Runs startup logic after the DOM is loaded.
 */
function handleDomLoaded() {
    loadSoundSetting();
    updateSoundButton();
    showLegalLinks();
    addTouchControls();
}

window.addEventListener('DOMContentLoaded', handleDomLoaded);