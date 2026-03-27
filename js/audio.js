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
 * Prepares all sounds for the game.
 */
function prepareSounds() {
    setLoopAndVolume(gameSounds.bgMusic, true, 0.12);
    setLoopAndVolume(gameSounds.bossMusic, true, 0.18);
    setLoopAndVolume(gameSounds.running, true, 0.3);
    setVolumeValues();
}

/**
 * Sets the volume for one-time sounds.
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
 * Sets loop and volume for one sound.
 * @param {HTMLAudioElement} sound - Audio element
 * @param {boolean} shouldLoop - Loop state
 * @param {number} volume - Volume value
 */
function setLoopAndVolume(sound, shouldLoop, volume) {
    sound.loop = shouldLoop;
    sound.volume = volume;
}

/**
 * Handles audio playback errors.
 * @param {Error} error - Audio error
 * @param {string} soundName - Sound name
 */
function handleAudioError(error, soundName) {
    if (!error || error.name === 'AbortError') {
        return;
    }

    console.warn('Audio error:', soundName, error);
}

/**
 * Plays an audio element safely.
 * @param {HTMLAudioElement} audio - Audio element
 * @param {string} soundName - Sound name
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
 * Starts the background music.
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
 * Stops the background music.
 */
function stopBackgroundMusic() {
    stopMusic(gameSounds.bgMusic);
}

/**
 * Starts the boss music.
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
 * Resets and starts the boss music.
 */
function resetAndPlayBossMusic() {
    gameSounds.bossMusic.currentTime = 0;
    tryPlayAudio(gameSounds.bossMusic, 'boss music');
    bossMusicStarted = true;
}

/**
 * Plays the chicken sound.
 */
function playChickenSound() {
    playSound(gameSounds.chicken, 'chicken sound');
}

/**
 * Plays the coin sound.
 */
function playCoinSound() {
    playSound(gameSounds.coin, 'coin sound');
}

/**
 * Plays the bottle collect sound.
 */
function playBottleCollectSound() {
    playSound(gameSounds.bottleCollect, 'bottle collect sound');
}

/**
 * Plays the bottle hit sound.
 */
function playBottleHitSound() {
    playSound(gameSounds.bottleHit, 'bottle hit sound');
}

/**
 * Plays the win sound.
 */
function playWinSound() {
    playSound(gameSounds.win, 'win sound');
}

/**
 * Plays the lose sound.
 */
function playLoseSound() {
    playSound(gameSounds.lose, 'lose sound');
}

/**
 * Plays the running sound.
 */
function playRunningSound() {
    if (soundMuted || !gameSounds.running.paused) {
        return;
    }

    gameSounds.running.currentTime = 0;
    tryPlayAudio(gameSounds.running, 'running sound');
}

/**
 * Stops the running sound.
 */
function stopRunningSound() {
    stopMusic(gameSounds.running);
}

/**
 * Stops character-related sounds.
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
 * Stops gameplay sounds except screen flow.
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
 * Stops all game sounds.
 */
function stopAllSounds() {
    stopCharacterSounds();
    Object.values(gameSounds).forEach(sound => stopMusic(sound));
}

/**
 * Stops and resets one sound.
 * @param {HTMLAudioElement} sound - Audio element
 */
function stopMusic(sound) {
    sound.pause();
    sound.currentTime = 0;
}

/**
 * Plays a normal sound.
 * @param {HTMLAudioElement} sound - Audio element
 * @param {string} soundName - Sound name
 */
function playSound(sound, soundName) {
    if (soundMuted || !sound) {
        return;
    }

    sound.currentTime = 0;
    tryPlayAudio(sound, soundName);
}

/**
 * Toggles sound on or off.
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
 * Resumes the currently active music.
 */
function resumeActiveMusic() {
    if (bossMusicStarted) {
        tryPlayAudio(gameSounds.bossMusic, 'boss music');
        return;
    }

    playBackgroundMusic();
}

/**
 * Saves the sound setting.
 */
function saveSoundSetting() {
    localStorage.setItem('soundMuted', JSON.stringify(soundMuted));
}

/**
 * Loads the sound setting.
 */
function loadSoundSetting() {
    const savedValue = localStorage.getItem('soundMuted');

    if (savedValue === null) {
        soundMuted = false;
        return;
    }

    soundMuted = JSON.parse(savedValue);
}