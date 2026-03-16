let canvas;
let worldObj;
let keyboard = new Keyboard();
let soundMuted = false;
let bossMusicStarted = false;

let gameSounds = {
    bgMusic: new Audio('audio/background.mp3'),
    bossMusic: new Audio('audio/boss.mp3'),
    chicken: new Audio('audio/chicken.mp3')
};

function init() {
    initLevel();
    canvas = document.getElementById('canvas');
    worldObj = new World(canvas, keyboard);
    prepareSounds();
    updateSoundButton();
}

function prepareSounds() {
    gameSounds.bgMusic.loop = true;
    gameSounds.bgMusic.volume = 0.2;
    gameSounds.bossMusic.loop = true;
    gameSounds.bossMusic.volume = 0.25;
    gameSounds.chicken.volume = 0.4;
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
}

function showGameOverScreen() {
    document.getElementById('game-container').classList.add('d-none');
    hidePauseScreen();
    document.getElementById('game-over-screen').classList.remove('d-none');
    stopAllSounds();
}

function showYouWinScreen() {
    document.getElementById('game-container').classList.add('d-none');
    hidePauseScreen();
    document.getElementById('you-win-screen').classList.remove('d-none');
    stopAllSounds();
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

function playBackgroundMusic() {
    if (soundMuted) {
        return;
    }

    gameSounds.bgMusic.pause();
    gameSounds.bossMusic.pause();
    gameSounds.bgMusic.currentTime = 0;
    gameSounds.bgMusic.play().catch(() => {});
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
    gameSounds.bossMusic.currentTime = 0;
    gameSounds.bossMusic.play().catch(() => {});
    bossMusicStarted = true;
}

function playChickenSound() {
    playSound(gameSounds.chicken);
}

function stopAllSounds() {
    Object.values(gameSounds).forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });
}

function playSound(sound) {
    if (soundMuted || !sound) {
        return;
    }

    sound.currentTime = 0;
    sound.play().catch(() => {});
}

function toggleSound() {
    soundMuted = !soundMuted;
    updateSoundButton();

    if (soundMuted) {
        stopAllSounds();
        return;
    }

    if (bossMusicStarted) {
        gameSounds.bossMusic.play().catch(() => {});
        return;
    }

    playBackgroundMusic();
}

function updateSoundButton() {
    let button = document.querySelector('.sound-btn');

    if (!button) {
        return;
    }

    if (soundMuted) {
        button.textContent = 'Sound Off';
    } else {
        button.textContent = 'Sound On';
    }
}

function showPauseScreen() {
    const pauseScreen = document.getElementById('pauseScreen');

    if (!pauseScreen) {
        return;
    }

    pauseScreen.classList.remove('d-none');
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
    });

    button.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
}

addTouchControls();