_gameState = {};

main();

function main() {
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', () => {
        const backgroundAudio = getAudio('assets/soundtrack.wav', 0.25, true);
        backgroundAudio.play();

        const startScene = document.getElementById('start-scene');
        startScene.classList.add('hidden');

        startGame();
    });

    const restartButton = document.getElementById('restart-button');
    restartButton.addEventListener('click', () => {
        const restartScene = document.getElementById('end-scene');
        restartScene.classList.add('hidden');
        
        startGame();
    });
}

function startGame() {
    _gameState = {
        bacteriaMaxHp: 15,
        bacteriaHp: 15,
        round: 1,
        antibiotics: [
            {
                name: 'a',
                damage: 1
            },
            {
                name: 'b',
                damage: 2
            },
            {
                name: 'c',
                damage: 5
            }
        ]
    };

    const playScene = document.getElementById('play-scene');
    playScene.classList.remove('hidden');

    showRoundOverlay();
}

function endGame() {
}

function showRoundOverlay() {
    const overlay = document.getElementById("round-overlay");
    overlay.classList.remove('hidden');

    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 3000);
}

/**
 * Generates new audio
 * @param {*} url 
 * @param {*} volume 
 * @param {*} loop 
 * @returns 
 */
 function getAudio(url, volume = 0.5, loop = false) {
    const audio = new Audio();
    audio.src = url;
    audio.volume = volume;
    audio.loop = loop;
   
    return audio;
}

/**
 * Gets a random number between min (inclusive) and max (exclusive)
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
 * @param {*} min Minimum number
 * @param {*} max Maximum number
 * @returns A random number between min and max
 */
 function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}