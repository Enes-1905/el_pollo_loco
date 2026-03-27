/**
 * Shows the start screen.
 */
function showStartscreen() {
    document.getElementById('startscreen').classList.remove('d-none');
}

/**
 * Hides all main screens.
 */
function hideAllScreens() {
    hideElement('startscreen');
    hideElement('game-container');
    hideElement('game-over-screen');
    hideElement('you-win-screen');
}

/**
 * Hides all end screens.
 */
function hideEndScreens() {
    hideElement('game-over-screen');
    hideElement('you-win-screen');
}

/**
 * Shows the game container.
 */
function showGameContainer() {
    showElement('game-container');
    hideLegalLinks();
    updateSoundButton();
}

/**
 * Shows the game over screen.
 */
function showGameOverScreen() {
    hideElement('game-container');
    hidePauseScreen();
    stopGameplaySounds();
    showLegalLinks();
    showElement('game-over-screen');
    updateSoundButton();
    playLoseSound();
}

/**
 * Shows the win screen.
 */
function showYouWinScreen() {
    hideElement('game-container');
    hidePauseScreen();
    stopGameplaySounds();
    showLegalLinks();
    showElement('you-win-screen');
    updateSoundButton();
    playWinSound();
}

/**
 * Hides one element.
 * @param {string} id - Element id
 */
function hideElement(id) {
    document.getElementById(id).classList.add('d-none');
}

/**
 * Shows one element.
 * @param {string} id - Element id
 */
function showElement(id) {
    document.getElementById(id).classList.remove('d-none');
}

/**
 * Hides the legal links.
 */
function hideLegalLinks() {
    toggleLegalLinks('none');
}

/**
 * Shows the legal links.
 */
function showLegalLinks() {
    toggleLegalLinks('flex');
}

/**
 * Changes legal links display.
 * @param {string} displayValue - CSS display value
 */
function toggleLegalLinks(displayValue) {
    const legal = document.querySelector('.legal-links');

    if (!legal) {
        return;
    }

    legal.style.display = displayValue;
}

/**
 * Opens the info overlay.
 */
function openInfo() {
    showElement('info-overlay');
}

/**
 * Closes the info overlay.
 * @param {Event} event - Click event
 */
function closeInfo(event) {
    if (!event) {
        hideInfo();
        return;
    }

    if (clickedInfoBackground(event) || clickedInfoCloseButton(event)) {
        hideInfo();
    }
}

/**
 * Checks if the overlay background was clicked.
 * @param {Event} event - Click event
 * @returns {boolean}
 */
function clickedInfoBackground(event) {
    return event.target.id === 'info-overlay';
}

/**
 * Checks if the close button was clicked.
 * @param {Event} event - Click event
 * @returns {boolean}
 */
function clickedInfoCloseButton(event) {
    return event.target.id === 'close-info-btn';
}

/**
 * Hides the info overlay.
 */
function hideInfo() {
    hideElement('info-overlay');
}

/**
 * Shows the pause screen.
 */
function showPauseScreen() {
    const pauseScreen = document.getElementById('pauseScreen');

    if (!pauseScreen) {
        return;
    }

    stopRunningSound();
    pauseScreen.classList.remove('d-none');
    updateSoundButton();
}

/**
 * Hides the pause screen.
 */
function hidePauseScreen() {
    const pauseScreen = document.getElementById('pauseScreen');

    if (!pauseScreen) {
        return;
    }

    pauseScreen.classList.add('d-none');
}

/**
 * Updates all sound buttons.
 */
function updateSoundButton() {
    const textButtons = getSoundTextButtons();
    const muteBtn = document.getElementById('mute-btn');

    updateTextButtons(textButtons);
    updateMuteIconButton(muteBtn);
}

/**
 * Returns all sound text buttons.
 * @returns {NodeListOf<Element>}
 */
function getSoundTextButtons() {
    return document.querySelectorAll(
        '.sound-btn, #pauseScreen button[onclick="toggleSound()"]'
    );
}

/**
 * Updates the text of sound buttons.
 * @param {NodeListOf<Element>} buttons - Button list
 */
function updateTextButtons(buttons) {
    buttons.forEach(button => {
        button.textContent = soundMuted ? 'Sound Off' : 'Sound On';
    });
}

/**
 * Updates the mute button inside the game.
 * @param {HTMLElement} muteBtn - Mute button element
 */
function updateMuteIconButton(muteBtn) {
    if (!muteBtn) {
        return;
    }

    muteBtn.textContent = soundMuted ? '🔇' : '🔊';
    muteBtn.setAttribute('aria-label', getMuteLabel());
    muteBtn.title = getMuteLabel();
}

/**
 * Returns the mute button label.
 * @returns {string}
 */
function getMuteLabel() {
    return soundMuted ? 'Turn sound on' : 'Turn sound off';
}