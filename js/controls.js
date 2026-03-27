let keyboard = new Keyboard();

/**
 * Resets the keyboard object.
 */
function resetKeyboard() {
    keyboard = new Keyboard();
}

/**
 * Resumes the game.
 */
function resumeGame() {
    if (!worldObj) {
        return;
    }

    worldObj.isPaused = false;
    hidePauseScreen();
}

/**
 * Toggles pause while playing.
 */
function togglePauseFromGame() {
    if (!canTogglePause()) {
        return;
    }

    worldObj.isPaused = !worldObj.isPaused;
    worldObj.isPaused ? showPauseScreen() : hidePauseScreen();
}

/**
 * Checks if pause can be toggled.
 * @returns {boolean}
 */
function canTogglePause() {
    return !!worldObj && !worldObj.gameOver && !worldObj.gameWon;
}

/**
 * Sets one keyboard state.
 * @param {string} code - Keyboard code
 * @param {boolean} isPressed - Pressed state
 */
function setKeyState(code, isPressed) {
    switch (code) {
        case 'ArrowRight':
            keyboard.right = isPressed;
            break;
        case 'ArrowLeft':
            keyboard.left = isPressed;
            break;
        case 'ArrowUp':
            keyboard.up = isPressed;
            break;
        case 'ArrowDown':
            keyboard.down = isPressed;
            break;
        case 'Space':
            keyboard.space = isPressed;
            break;
        case 'KeyD':
            keyboard.throw = isPressed;
            break;
        case 'Escape':
            keyboard.esc = isPressed;
            break;
        case 'KeyM':
            keyboard.mute = isPressed;
            break;
    }
}

/**
 * Handles keydown events.
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyDown(e) {
    if (e.code === 'Escape') {
        e.preventDefault();
    }

    setKeyState(e.code, true);
    handleSpecialKeys(e);
}

/**
 * Handles special key actions.
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleSpecialKeys(e) {
    if (e.code === 'Escape' && !e.repeat) {
        togglePauseFromGame();
    }

    if (e.code === 'KeyM' && !e.repeat) {
        toggleSound();
    }
}

/**
 * Handles keyup events.
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyUp(e) {
    setKeyState(e.code, false);
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

/**
 * Adds all touch controls.
 */
function addTouchControls() {
    addTouchButton('btn-left', 'left');
    addTouchButton('btn-right', 'right');
    addTouchButton('btn-jump', 'space');
    addTouchButton('btn-throw', 'throw');
}

/**
 * Connects one touch button with one key.
 * @param {string} buttonId - Button id
 * @param {string} keyName - Keyboard property
 */
function addTouchButton(buttonId, keyName) {
    let button = document.getElementById(buttonId);

    if (!button) {
        return;
    }

    button.addEventListener('touchstart', e => handleTouchStart(e, keyName));
    button.addEventListener('touchend', e => handleTouchEnd(e, keyName));
    button.addEventListener('contextmenu', preventContextMenu);
}

/**
 * Handles touchstart.
 * @param {Event} e - Touch event
 * @param {string} keyName - Keyboard property
 */
function handleTouchStart(e, keyName) {
    e.preventDefault();
    keyboard[keyName] = true;
}

/**
 * Handles touchend.
 * @param {Event} e - Touch event
 * @param {string} keyName - Keyboard property
 */
function handleTouchEnd(e, keyName) {
    e.preventDefault();
    keyboard[keyName] = false;
    stopRunningSound();
}

/**
 * Prevents the context menu.
 * @param {Event} e - Context menu event
 */
function preventContextMenu(e) {
    e.preventDefault();
}