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

function init() {
    initLevel();
    canvas = document.getElementById('canvas');
    worldObj = new World(canvas, keyboard);
    loadSoundSetting();
    prepareSounds();
    updateSoundButton();
}

function prepareSounds() {
    gameSounds.bgMusic.loop = true;
    gameSounds.bgMusic.volume = 0.12;

    gameSounds.bossMusic.loop = true;
    gameSounds.bossMusic.volume = 0.18;

    gameSounds.running.loop = true;
    gameSounds.running.volume = 0.3;

    gameSounds.chicken.volume = 0.35;
    gameSounds.coin.volume = 0.4;
    gameSounds.bottleCollect.volume = 0.4;
    gameSounds.bottleHit.volume = 0.45;
    gameSounds.win.volume = 0.45;
    gameSounds.lose.volume = 0.45;
}

function startGame() {
    hideAllScreens();
    showGameContainer();
    resetKeyboard();
    bossMusicStarted = false;
    init();
    playBackgroundMusic();
}

function restartGame() {
    hideEndScreens();
    hidePauseScreen();
    showGameContainer();
    resetKeyboard();
    bossMusicStarted = false;
    init();
    playBackgroundMusic();
}

function goToHome() {
    hideAllScreens();
    hidePauseScreen();
    stopAllSounds();
    showLegalLinks();
    document.getElementById('startscreen').classList.remove('d-none');
    updateSoundButton();
}

function hideAllScreens() {
    document.getElementById('startscreen').classList.add('d-none');
    document.getElementById('game-container').classList.add('d-none');
    document.getElementById('game-over-screen').classList.add('d-none');
    document.getElementById('you-win-screen').classList.add('d-none');
}

function hideEndScreens() {
    document.getElementById('game-over-screen').classList.add('d-none');
    document.getElementById('you-win-screen').classList.add('d-none');
}

function showGameContainer() {
    document.getElementById('game-container').classList.remove('d-none');
    hideLegalLinks();
    updateSoundButton();
}

function showGameOverScreen() {
    document.getElementById('game-container').classList.add('d-none');
    hidePauseScreen();
    stopGameplaySounds();
    showLegalLinks();
    document.getElementById('game-over-screen').classList.remove('d-none');
    updateSoundButton();
    playLoseSound();
}

function showYouWinScreen() {
    document.getElementById('game-container').classList.add('d-none');
    hidePauseScreen();
    stopGameplaySounds();
    showLegalLinks();
    document.getElementById('you-win-screen').classList.remove('d-none');
    updateSoundButton();
    playWinSound();
}

function hideLegalLinks() {
    const legal = document.querySelector('.legal-links');

    if (!legal) {
        return;
    }

    legal.style.display = 'none';
}

function showLegalLinks() {
    const legal = document.querySelector('.legal-links');

    if (!legal) {
        return;
    }

    legal.style.display = 'flex';
}

function resetKeyboard() {
    keyboard = new Keyboard();
}

function openInfo() {
    document.getElementById('info-overlay').classList.remove('d-none');
}

function closeInfo(event) {
    if (!event) {
        hideInfo();
        return;
    }

    if (event.target.id === 'info-overlay') {
        hideInfo();
    }

    if (event.target.id === 'close-info-btn') {
        hideInfo();
    }
}

function hideInfo() {
    document.getElementById('info-overlay').classList.add('d-none');
}

function handleAudioError(error, soundName) {
    if (!error) {
        return;
    }

    if (error.name === 'AbortError') {
        return;
    }

    console.warn('Audio error:', soundName, error);
}

function tryPlayAudio(audio, soundName) {
    if (!audio) {
        return;
    }

    const playPromise = audio.play();

    if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(error => handleAudioError(error, soundName));
    }
}

function playBackgroundMusic() {
    if (soundMuted) {
        return;
    }

    gameSounds.bgMusic.pause();
    gameSounds.bossMusic.pause();
    gameSounds.bgMusic.currentTime = 0;
    tryPlayAudio(gameSounds.bgMusic, 'background music');
}

function stopBackgroundMusic() {
    gameSounds.bgMusic.pause();
    gameSounds.bgMusic.currentTime = 0;
}

function playBossMusic() {
    if (soundMuted || bossMusicStarted) {
        return;
    }

    stopBackgroundMusic();
    stopRunningSound();
    gameSounds.bossMusic.currentTime = 0;
    tryPlayAudio(gameSounds.bossMusic, 'boss music');
    bossMusicStarted = true;
}

function playChickenSound() {
    playSound(gameSounds.chicken, 'chicken sound');
}

function playCoinSound() {
    playSound(gameSounds.coin, 'coin sound');
}

function playBottleCollectSound() {
    playSound(gameSounds.bottleCollect, 'bottle collect sound');
}

function playBottleHitSound() {
    playSound(gameSounds.bottleHit, 'bottle hit sound');
}

function playWinSound() {
    playSound(gameSounds.win, 'win sound');
}

function playLoseSound() {
    playSound(gameSounds.lose, 'lose sound');
}

function playRunningSound() {
    if (soundMuted) {
        return;
    }

    if (!gameSounds.running.paused) {
        return;
    }

    gameSounds.running.currentTime = 0;
    tryPlayAudio(gameSounds.running, 'running sound');
}

function stopRunningSound() {
    gameSounds.running.pause();
    gameSounds.running.currentTime = 0;
}

function stopCharacterSounds() {
    if (!worldObj || !worldObj.character) {
        return;
    }

    if (typeof worldObj.character.stopSleepSound === 'function') {
        worldObj.character.stopSleepSound();
    }
}

function stopGameplaySounds() {
    stopCharacterSounds();

    gameSounds.bgMusic.pause();
    gameSounds.bgMusic.currentTime = 0;
    gameSounds.bossMusic.pause();
    gameSounds.bossMusic.currentTime = 0;
    gameSounds.chicken.pause();
    gameSounds.chicken.currentTime = 0;
    gameSounds.coin.pause();
    gameSounds.coin.currentTime = 0;
    gameSounds.bottleCollect.pause();
    gameSounds.bottleCollect.currentTime = 0;
    gameSounds.bottleHit.pause();
    gameSounds.bottleHit.currentTime = 0;
    gameSounds.running.pause();
    gameSounds.running.currentTime = 0;
}

function stopAllSounds() {
    stopCharacterSounds();

    Object.values(gameSounds).forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });
}

function playSound(sound, soundName) {
    if (soundMuted || !sound) {
        return;
    }

    sound.currentTime = 0;
    tryPlayAudio(sound, soundName);
}

function toggleSound() {
    soundMuted = !soundMuted;
    saveSoundSetting();
    updateSoundButton();

    if (soundMuted) {
        stopAllSounds();
        return;
    }

    if (bossMusicStarted) {
        tryPlayAudio(gameSounds.bossMusic, 'boss music');
        return;
    }

    playBackgroundMusic();
}

function updateSoundButton() {
    const textButtons = document.querySelectorAll('.sound-btn, #pauseScreen button[onclick="toggleSound()"]');
    const muteBtn = document.getElementById('mute-btn');

    textButtons.forEach(button => {
        button.textContent = soundMuted ? 'Sound Off' : 'Sound On';
    });

    if (muteBtn) {
        muteBtn.textContent = soundMuted ? '🔇' : '🔊';
        muteBtn.setAttribute('aria-label', soundMuted ? 'Sound einschalten' : 'Sound ausschalten');
        muteBtn.title = soundMuted ? 'Sound einschalten' : 'Sound ausschalten';
    }
}

function saveSoundSetting() {
    localStorage.setItem('soundMuted', JSON.stringify(soundMuted));
}

function loadSoundSetting() {
    const savedValue = localStorage.getItem('soundMuted');

    if (savedValue === null) {
        soundMuted = false;
        return;
    }

    soundMuted = JSON.parse(savedValue);
}

function showPauseScreen() {
    const pauseScreen = document.getElementById('pauseScreen');

    if (!pauseScreen) {
        return;
    }

    stopRunningSound();
    pauseScreen.classList.remove('d-none');
    updateSoundButton();
}

function hidePauseScreen() {
    const pauseScreen = document.getElementById('pauseScreen');

    if (!pauseScreen) {
        return;
    }

    pauseScreen.classList.add('d-none');
}

function resumeGame() {
    if (!worldObj) {
        return;
    }

    worldObj.isPaused = false;
    hidePauseScreen();
}

function togglePauseFromGame() {
    if (!worldObj || worldObj.gameOver || worldObj.gameWon) {
        return;
    }

    worldObj.isPaused = !worldObj.isPaused;

    if (worldObj.isPaused) {
        showPauseScreen();
    } else {
        hidePauseScreen();
    }
}

function setKeyState(code, isPressed) {
    if (code === 'ArrowRight') keyboard.right = isPressed;
    if (code === 'ArrowLeft') keyboard.left = isPressed;
    if (code === 'ArrowUp') keyboard.up = isPressed;
    if (code === 'ArrowDown') keyboard.down = isPressed;
    if (code === 'Space') keyboard.space = isPressed;
    if (code === 'KeyD') keyboard.throw = isPressed;
    if (code === 'Escape') keyboard.esc = isPressed;
    if (code === 'KeyM') keyboard.mute = isPressed;
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
        e.preventDefault();
    }

    setKeyState(e.code, true);

    if (e.code === 'Escape' && !e.repeat) {
        togglePauseFromGame();
    }

    if (e.code === 'KeyM' && !e.repeat) {
        toggleSound();
    }
});

window.addEventListener('keyup', (e) => {
    setKeyState(e.code, false);
});

function addTouchControls() {
    addTouchButton('btn-left', 'left');
    addTouchButton('btn-right', 'right');
    addTouchButton('btn-jump', 'space');
    addTouchButton('btn-throw', 'throw');
}

function addTouchButton(buttonId, keyName) {
    let button = document.getElementById(buttonId);

    if (!button) {
        return;
    }

    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard[keyName] = true;
    });

    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard[keyName] = false;
        stopRunningSound();
    });

    button.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
}

window.addEventListener('DOMContentLoaded', () => {
    loadSoundSetting();
    updateSoundButton();
    showLegalLinks();
    addTouchControls();
});