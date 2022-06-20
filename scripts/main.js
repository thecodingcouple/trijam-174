const ROUND_TIME_IN_SECONDS = 30;
let _gameState = {};

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

    document.addEventListener("click", (event) => {
        if(event.target.classList.contains("antibiotic")) {
            onAntibioticClicked(event);
        }
    });
}

function startGame() {
    _gameState = {
        bacterialMaxHp: 15,
        bacterialHp: 15,
        round: 0,
        timeRemaining: 0,
        attempts: 0,
        maxAttempts: 4,
        isGameOver: false,
        antibiotics: [
            {
                name: 'antibiotic-a',
                damage: 1,
            },
            {
                name: 'antibiotic-b',
                damage: 2,
            },
            {
                name: 'antibiotic-c',
                damage: 5
            }
        ]
    };

    const playScene = document.getElementById('play-scene');
    playScene.classList.remove('hidden');

    updateRound();
}

function endGame() {
    _gameState.isGameOver = true;

    const playScene = document.getElementById('play-scene');
    playScene.classList.add('hidden');

    const endScene = document.getElementById('end-scene');
    endScene.classList.remove('hidden');
}

function updateRound() {
    _gameState.round++;
    _gameState.attempts = 0;

    if(_gameState.round > 1) {
        _gameState.bacterialMaxHp += Math.floor(_gameState.bacterialMaxHp * .25);
        for(const anti of _gameState.antibiotics) {
            anti.damage += Math.ceil(anti.damage * 0.1);
        }
    }

    // Gain HP
    _gameState.bacterialHp = _gameState.bacterialMaxHp;
    const healthCounter = document.getElementById("health-counter");
    healthCounter.innerText = _gameState.bacterialHp;
    healthCounter.parentElement.classList.remove("flashing-red");

    // Update round labels
    const elements = document.getElementsByClassName("round-counter");
    for(const element of elements) {
        element.innerText = _gameState.round.toString().padStart(3, '0');
    }

    // Generate legend
    generateLegendItems();

    // Generate attempt tracker
    generateAttemptTracker();

    showRoundOverlay();
}

function generateLegendItems() {
    const legend = document.getElementById('legend');
    legend.innerHTML = '';

    for(const antibiotic of _gameState.antibiotics) {
        const legendItem = document.createElement('div');
        legendItem.classList.add("legend-item");

        const antibioticSection = document.createElement('section');
        antibioticSection.classList.add("antibiotic", antibiotic.name);

        const label = document.createElement("label");
        label.innerText = `-${antibiotic.damage}`;

        legendItem.append(antibioticSection, label);
        legend.appendChild(legendItem);
    }
}

function generateAttemptTracker() {
    const container = document.querySelector(".antibiotic-markers-container");
    container.innerHTML = '';

    for(let x = 0; x < _gameState.maxAttempts; x++) {
        const tracker = document.createElement("section");
        tracker.classList.add("antibiotic-marker", "antibiotic-marker--empty");
        tracker.id = x + 1;

        container.appendChild(tracker);
    }
}

function showRoundOverlay() {
    const overlay = document.getElementById("round-overlay");
    overlay.classList.remove('hidden');

    setTimeout(() => {
        overlay.classList.add('hidden');
        startRound();
    }, 3000);
}

function startRound() {
    _gameState.timeRemaining = ROUND_TIME_IN_SECONDS;
    const timeCounter = document.getElementById('time-counter');
    timeCounter.innerText = _gameState.timeRemaining;
    timeCounter.parentElement.classList.remove("flashing-red");

    const round = _gameState.round;

    const interval = setInterval(() => {
        // new round started before timer ran up
        if(round != _gameState.round || _gameState.isGameOver) {
            clearInterval(interval);
        }

        if (_gameState.timeRemaining <= 0) {
            clearInterval(interval);
            endGame();
        } else {
            _gameState.timeRemaining--;
            timeCounter.innerText = _gameState.timeRemaining.toString().padStart(2, '0');

            if(_gameState.timeRemaining == 10) {
                timeCounter.parentElement.classList.add('flashing-red');
            }
        }
    }, 1000);
}

function onAntibioticClicked(event) {
    for(let className of event.target.classList) {
        let antibiotic = _gameState.antibiotics.find(a => a.name === className);
        if(antibiotic) {
            _gameState.bacterialHp -= antibiotic.damage;
            _gameState.attempts++;

            const healthCounter = document.getElementById('health-counter');
            healthCounter.innerText = _gameState.bacterialHp;

            const attemptTracker = document.getElementById(_gameState.attempts);
            if (attemptTracker) {
                attemptTracker.classList.remove('antibiotic-marker--empty');
            }

            if(_gameState.bacterialHp < 0) {
                endGame();
            } else if(_gameState.attempts == _gameState.maxAttempts) {
                updateRound();
            } 

            if(_gameState.bacterialHp <= _gameState.bacterialMaxHp * 0.5) {
                healthCounter.parentElement.classList.add("flashing-red");
            }
        }
    }
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