const ROUND_TIME_IN_SECONDS = 30;
let _gameState = {};

main();

/**
 * Main method
 */
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


    const retryButton = document.getElementById('retry-button');
    retryButton.addEventListener('click', () => {
        const restartScene = document.getElementById('end-scene');
        restartScene.classList.add('hidden');
        
        replayRound();
    });

    document.addEventListener("click", (event) => {
        if(event.target.classList.contains("antibiotic")) {
            onAntibioticClicked(event);
        }
    });
}

/**
 * Start new game
 */
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
                count: 1,
            },
            {
                name: 'antibiotic-b',
                damage: 3,
                count: 2
            },
            {
                name: 'antibiotic-c',
                damage: 5,
                count: 3
            }
        ]
    };

    const playScene = document.getElementById('play-scene');
    playScene.classList.remove('hidden');

    updateRound();
}

/**
 * Restart current round
 */
function replayRound() {
    const playScene = document.getElementById('play-scene');
    playScene.classList.remove('hidden');

    _gameState.attempts = 0;
    _gameState.isGameOver = false;

    // Reset HP
    _gameState.bacterialHp = _gameState.bacterialMaxHp;
    const healthCounter = document.getElementById("health-counter");
    healthCounter.innerText = _gameState.bacterialHp;
    healthCounter.parentElement.classList.remove("flashing-red");

    // Generate attempt tracker
    generateAttemptTracker();

    // Generate antibiotics and Bacteria
    generateAntibioticsAndBacteria();

    showRoundOverlay();
}

/**
 * End game
 */
function endGame() {
    _gameState.isGameOver = true;

    const playScene = document.getElementById('play-scene');
    playScene.classList.add('hidden');

    const endScene = document.getElementById('end-scene');
    endScene.classList.remove('hidden');
}

/**
 * Increase round
 */
function updateRound() {
    _gameState.round++;
    _gameState.attempts = 0;

    if(_gameState.round > 1) {
        _gameState.bacterialMaxHp += Math.floor(_gameState.bacterialMaxHp * .25);
        for(const anti of _gameState.antibiotics) {
            anti.damage += Math.ceil(anti.damage * 0.25);
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

    // Generate antibiotics and Bacteria
    generateAntibioticsAndBacteria();

    showRoundOverlay();
}

/**
 * Create antibiotic damage legened
 */
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

/**
 * Create antibiotic attempt trackers
 */
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

/**
 * Generate antibiotics 
 */
function generateAntibioticsAndBacteria() {
    // Clear petri dish
    const petriDish = document.getElementById("petri-dish");
    petriDish.innerHTML = '';

    // Create bacteria
    const bacteria = document.createElement("section");
    bacteria.id = "bacteria";
    petriDish.appendChild(bacteria);

    // Create antibiotics
    const antibiotics = _gameState.antibiotics.flatMap(a => Array(a.count).fill(a.name));
    shuffleArray(antibiotics);

    let currentAngle = 0;
    const rotationIncrement = 360 / antibiotics.length;
    
    for(let antibioticType of antibiotics) {
        const element = document.createElement("section");
        element.classList.add("antibiotic", antibioticType);
        element.style.transform = `rotate(${currentAngle}deg)`;

        let top = getRandomInt(15, 70);
        let left = getRandomInt(15, 70);

        // avoid overlapping center where bateria is located
        if(top >= 40 && top <= 55) {
            top -= 20;
        }

        if(left >= 40 && left <= 55) {
            left -= 20;
        }

        element.style.top = `${top}%`;
        element.style.left = `${left}%`;

        currentAngle += rotationIncrement;

        petriDish.appendChild(element);
    }
}

/**
 * Display round information
 */
function showRoundOverlay() {
    const overlay = document.getElementById("round-overlay");
    overlay.classList.remove('hidden');

    setTimeout(() => {
        overlay.classList.add('hidden');
        startRound();
    }, 3000);
}

/**
 * Start new round of game
 */
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

/**
 * Add damage to bacteria based on which antibiotic was clicked
 * @param {*} event 
 */
function onAntibioticClicked(event) {
    for(let className of event.target.classList) {
        let antibiotic = _gameState.antibiotics.find(a => a.name === className);
        if(antibiotic) {
            // Destroy antibiotic
            event.target.remove();

            _gameState.bacterialHp -= antibiotic.damage;
            _gameState.attempts++;

            const healthCounter = document.getElementById('health-counter');
            healthCounter.innerText = _gameState.bacterialHp;

            const attemptTracker = document.getElementById(_gameState.attempts);
            if (attemptTracker) {
                attemptTracker.classList.remove('antibiotic-marker--empty');
            }

            if(_gameState.bacterialHp <= 0) {
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

/**
 * Shuffle the contents of an array
 * https://stackoverflow.com/a/12646864/263158
 * @param {*} array 
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}