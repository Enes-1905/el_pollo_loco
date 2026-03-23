let canvas;
let worldObj;
let keyboard = new Keyboard();
let soundMuted = false;
let bossMusicStarted = false;

let gameSounds = {
    bgMusic: new Audio('audio/background.mp3'),
    bossMusic: new Audio('audio/boss.mp3'),
    chicken: new Audio('audio/chicken.mp3'),
    coin: new Audio('audio/coinsammeln.mp3'),
    bottleCollect: new Audio('audio/flaschesammeln.mp3'),
    bottleHit: new Audio('audio/flascheaufgegner.mp3'),
    win: new Audio('audio/win.mp3'),
    lose: new Audio('audio/youlose.mp3'),
    running: new Audio('audio/running.mp3')
};

/**
 * Initialisiert das Spiel und erstellt die Welt.
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
 * Setzt die Lautstärke und Schleifen für alle Sounds.
 */
function prepareSounds() {
    setLoopAndVolume(gameSounds.bgMusic, true, 0.12);
    setLoopAndVolume(gameSounds.bossMusic, true, 0.18);
    setLoopAndVolume(gameSounds.running, true, 0.3);
    setVolumeValues();
}

/**
 * Setzt Lautstärken für einmalige Sounds.
 */
function setVolumeValues() {
    gameSounds.chicken.volume = 0.35;
    gameSounds.coin.volume = 0.4;
    gameSounds.bottleCollect.volume = 0.4;
    gameSounds.bottleHit.volume = 0.45;
    gameSounds.win.volume = 0.45;
    gameSounds.lose.volume = 0.45;
}

/**
 * Setzt Loop und Lautstärke für einen Sound.
 * @param {HTMLAudioElement} sound
 * @param {boolean} shouldLoop
 * @param {number} volume
 */
function setLoopAndVolume(sound, shouldLoop, volume) {
    sound.loop = shouldLoop;
    sound.volume = volume;
}

/**
 * Startet ein neues Spiel.
 */
function startGame() {
    prepareGameStart();
    init();
    playBackgroundMusic();
}

/**
 * Startet das Spiel nach Game Over oder Win neu.
 */
function restartGame() {
    hideEndScreens();
    hidePauseScreen();
    prepareGameStart();
    init();
    playBackgroundMusic();
}

/**
 * Bereitet den Spielstart vor.
 */
function prepareGameStart() {
    hideAllScreens();
    showGameContainer();
    resetKeyboard();
    bossMusicStarted = false;
}

/**
 * Wechselt zurück zum Startscreen.
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
 * Zeigt den Startscreen.
 */
function showStartscreen() {
    document.getElementById('startscreen').classList.remove('d-none');
}

/**
 * Blendet alle Hauptscreens aus.
 */
function hideAllScreens() {
    hideElement('startscreen');
    hideElement('game-container');
    hideElement('game-over-screen');
    hideElement('you-win-screen');
}

/**
 * Blendet die Endscreens aus.
 */
function hideEndScreens() {
    hideElement('game-over-screen');
    hideElement('you-win-screen');
}

/**
 * Zeigt den Spielcontainer an.
 */
function showGameContainer() {
    showElement('game-container');
    hideLegalLinks();
    updateSoundButton();
}

/**
 * Zeigt den Game Over Screen.
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
 * Zeigt den You Win Screen.
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
 * Blendet ein Element aus.
 * @param {string} id
 */
function hideElement(id) {
    document.getElementById(id).classList.add('d-none');
}

/**
 * Zeigt ein Element an.
 * @param {string} id
 */
function showElement(id) {
    document.getElementById(id).classList.remove('d-none');
}

/**
 * Blendet die Legal Links aus.
 */
function hideLegalLinks() {
    toggleLegalLinks('none');
}

/**
 * Zeigt die Legal Links an.
 */
function showLegalLinks() {
    toggleLegalLinks('flex');
}

/**
 * Ändert die Anzeige der Legal Links.
 * @param {string} displayValue
 */
function toggleLegalLinks(displayValue) {
    const legal = document.querySelector('.legal-links');

    if (!legal) {
        return;
    }

    legal.style.display = displayValue;
}

/**
 * Setzt die Tastatur neu zurück.
 */
function resetKeyboard() {
    keyboard = new Keyboard();
}

/**
 * Öffnet das Info Overlay.
 */
function openInfo() {
    showElement('info-overlay');
}

/**
 * Schließt das Info Overlay.
 * @param {Event} event
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
 * Prüft Klick auf Overlay-Hintergrund.
 * @param {Event} event
 * @returns {boolean}
 */
function clickedInfoBackground(event) {
    return event.target.id === 'info-overlay';
}

/**
 * Prüft Klick auf Schließen-Button.
 * @param {Event} event
 * @returns {boolean}
 */
function clickedInfoCloseButton(event) {
    return event.target.id === 'close-info-btn';
}

/**
 * Versteckt das Info Overlay.
 */
function hideInfo() {
    hideElement('info-overlay');
}

/**
 * Behandelt Audiofehler.
 * @param {Error} error
 * @param {string} soundName
 */
function handleAudioError(error, soundName) {
    if (!error || error.name === 'AbortError') {
        return;
    }

    console.warn('Audio error:', soundName, error);
}

/**
 * Spielt einen Sound sicher ab.
 * @param {HTMLAudioElement} audio
 * @param {string} soundName
 */
function tryPlayAudio(audio, soundName) {
    if (!audio) {
        return;
    }

    const playPromise = audio.play();

    if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(error => handleAudioError(error, soundName));
    }
}

/**
 * Startet die Hintergrundmusik.
 */
function playBackgroundMusic() {
    if (soundMuted) {
        return;
    }

    stopMusic(gameSounds.bgMusic);
    stopMusic(gameSounds.bossMusic);
    tryPlayAudio(gameSounds.bgMusic, 'background music');
}

/**
 * Stoppt die Hintergrundmusik.
 */
function stopBackgroundMusic() {
    stopMusic(gameSounds.bgMusic);
}

/**
 * Startet die Bossmusik.
 */
function playBossMusic() {
    if (soundMuted || bossMusicStarted) {
        return;
    }

    stopBackgroundMusic();
    stopRunningSound();
    resetAndPlayBossMusic();
}

/**
 * Startet die Bossmusik neu.
 */
function resetAndPlayBossMusic() {
    gameSounds.bossMusic.currentTime = 0;
    tryPlayAudio(gameSounds.bossMusic, 'boss music');
    bossMusicStarted = true;
}

/**
 * Spielt den Chicken Sound.
 */
function playChickenSound() {
    playSound(gameSounds.chicken, 'chicken sound');
}

/**
 * Spielt den Coin Sound.
 */
function playCoinSound() {
    playSound(gameSounds.coin, 'coin sound');
}

/**
 * Spielt den Bottle Collect Sound.
 */
function playBottleCollectSound() {
    playSound(gameSounds.bottleCollect, 'bottle collect sound');
}

/**
 * Spielt den Bottle Hit Sound.
 */
function playBottleHitSound() {
    playSound(gameSounds.bottleHit, 'bottle hit sound');
}

/**
 * Spielt den Win Sound.
 */
function playWinSound() {
    playSound(gameSounds.win, 'win sound');
}

/**
 * Spielt den Lose Sound.
 */
function playLoseSound() {
    playSound(gameSounds.lose, 'lose sound');
}

/**
 * Spielt den Lauf-Sound.
 */
function playRunningSound() {
    if (soundMuted || !gameSounds.running.paused) {
        return;
    }

    gameSounds.running.currentTime = 0;
    tryPlayAudio(gameSounds.running, 'running sound');
}

/**
 * Stoppt den Lauf-Sound.
 */
function stopRunningSound() {
    stopMusic(gameSounds.running);
}

/**
 * Stoppt den Schlafsound des Charakters.
 */
function stopCharacterSounds() {
    if (!worldObj || !worldObj.character) {
        return;
    }

    if (typeof worldObj.character.stopSleepSound === 'function') {
        worldObj.character.stopSleepSound();
    }
}

/**
 * Stoppt alle Gameplay-Sounds außer Win/Lose.
 */
function stopGameplaySounds() {
    stopCharacterSounds();
    stopMusic(gameSounds.bgMusic);
    stopMusic(gameSounds.bossMusic);
    stopMusic(gameSounds.chicken);
    stopMusic(gameSounds.coin);
    stopMusic(gameSounds.bottleCollect);
    stopMusic(gameSounds.bottleHit);
    stopMusic(gameSounds.running);
}

/**
 * Stoppt alle Sounds komplett.
 */
function stopAllSounds() {
    stopCharacterSounds();
    Object.values(gameSounds).forEach(sound => stopMusic(sound));
}

/**
 * Stoppt einen Sound und setzt ihn zurück.
 * @param {HTMLAudioElement} sound
 */
function stopMusic(sound) {
    sound.pause();
    sound.currentTime = 0;
}

/**
 * Spielt einen normalen Sound ab.
 * @param {HTMLAudioElement} sound
 * @param {string} soundName
 */
function playSound(sound, soundName) {
    if (soundMuted || !sound) {
        return;
    }

    sound.currentTime = 0;
    tryPlayAudio(sound, soundName);
}

/**
 * Schaltet den Sound an oder aus.
 */
function toggleSound() {
    soundMuted = !soundMuted;
    saveSoundSetting();
    updateSoundButton();

    if (soundMuted) {
        stopAllSounds();
        return;
    }

    resumeActiveMusic();
}

/**
 * Spielt passende Musik nach dem Entmuten weiter.
 */
function resumeActiveMusic() {
    if (bossMusicStarted) {
        tryPlayAudio(gameSounds.bossMusic, 'boss music');
        return;
    }

    playBackgroundMusic();
}

/**
 * Aktualisiert alle Sound-Buttons.
 */
function updateSoundButton() {
    const textButtons = getSoundTextButtons();
    const muteBtn = document.getElementById('mute-btn');

    updateTextButtons(textButtons);
    updateMuteIconButton(muteBtn);
}

/**
 * Gibt alle Text-Soundbuttons zurück.
 * @returns {NodeListOf<Element>}
 */
function getSoundTextButtons() {
    return document.querySelectorAll(
        '.sound-btn, #pauseScreen button[onclick="toggleSound()"]'
    );
}

/**
 * Aktualisiert Text-Soundbuttons.
 * @param {NodeListOf<Element>} buttons
 */
function updateTextButtons(buttons) {
    buttons.forEach(button => {
        button.textContent = soundMuted ? 'Sound Off' : 'Sound On';
    });
}

/**
 * Aktualisiert den Mute-Button im Spiel.
 * @param {HTMLElement} muteBtn
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
 * Gibt den Mute-Button Text zurück.
 * @returns {string}
 */
function getMuteLabel() {
    return soundMuted ? 'Sound einschalten' : 'Sound ausschalten';
}

/**
 * Speichert die Sound-Einstellung.
 */
function saveSoundSetting() {
    localStorage.setItem('soundMuted', JSON.stringify(soundMuted));
}

/**
 * Lädt die Sound-Einstellung.
 */
function loadSoundSetting() {
    const savedValue = localStorage.getItem('soundMuted');

    if (savedValue === null) {
        soundMuted = false;
        return;
    }

    soundMuted = JSON.parse(savedValue);
}

/**
 * Zeigt den Pause Screen.
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
 * Versteckt den Pause Screen.
 */
function hidePauseScreen() {
    const pauseScreen = document.getElementById('pauseScreen');

    if (!pauseScreen) {
        return;
    }

    pauseScreen.classList.add('d-none');
}

/**
 * Setzt das Spiel fort.
 */
function resumeGame() {
    if (!worldObj) {
        return;
    }

    worldObj.isPaused = false;
    hidePauseScreen();
}

/**
 * Schaltet Pause aus dem Spiel heraus um.
 */
function togglePauseFromGame() {
    if (!canTogglePause()) {
        return;
    }

    worldObj.isPaused = !worldObj.isPaused;
    worldObj.isPaused ? showPauseScreen() : hidePauseScreen();
}

/**
 * Prüft, ob Pause umgeschaltet werden darf.
 * @returns {boolean}
 */
function canTogglePause() {
    return !!worldObj && !worldObj.gameOver && !worldObj.gameWon;
}

/**
 * Setzt einen Tastenzustand.
 * @param {string} code
 * @param {boolean} isPressed
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
 * Behandelt Keydown Events.
 * @param {KeyboardEvent} e
 */
function handleKeyDown(e) {
    if (e.code === 'Escape') {
        e.preventDefault();
    }

    setKeyState(e.code, true);
    handleSpecialKeys(e);
}

/**
 * Führt Sonderaktionen bei Tasten aus.
 * @param {KeyboardEvent} e
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
 * Behandelt Keyup Events.
 * @param {KeyboardEvent} e
 */
function handleKeyUp(e) {
    setKeyState(e.code, false);
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

/**
 * Fügt alle Touch Controls hinzu.
 */
function addTouchControls() {
    addTouchButton('btn-left', 'left');
    addTouchButton('btn-right', 'right');
    addTouchButton('btn-jump', 'space');
    addTouchButton('btn-throw', 'throw');
}

/**
 * Verbindet einen Touch Button mit einer Taste.
 * @param {string} buttonId
 * @param {string} keyName
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
 * Reagiert auf Touchstart.
 * @param {Event} e
 * @param {string} keyName
 */
function handleTouchStart(e, keyName) {
    e.preventDefault();
    keyboard[keyName] = true;
}

/**
 * Reagiert auf Touchend.
 * @param {Event} e
 * @param {string} keyName
 */
function handleTouchEnd(e, keyName) {
    e.preventDefault();
    keyboard[keyName] = false;
    stopRunningSound();
}

/**
 * Verhindert das Kontextmenü.
 * @param {Event} e
 */
function preventContextMenu(e) {
    e.preventDefault();
}

/**
 * Führt Startlogik nach DOM-Laden aus.
 */
function handleDomLoaded() {
    loadSoundSetting();
    updateSoundButton();
    showLegalLinks();
    addTouchControls();
}

window.addEventListener('DOMContentLoaded', handleDomLoaded);