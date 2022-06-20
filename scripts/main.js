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
        antibiotics: [
            {
                name: 'antibiotic-a',
                damage: 1,
                count: 4
            },
            {
                name: 'antibiotic-b',
                damage: 2,
                count: 4
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

function endGame() {
}

function updateRound() {
    _gameState.round++;

    // Gain HP
    _gameState.bacterialMaxHp += _gameState.bacterialMaxHp - _gameState.bacterialHp;
    _gameState.bacterialHp = _gameState.bacterialMaxHp;
    const healthCounter = document.getElementById("health-counter");
    healthCounter.innerText = _gameState.bacterialHp;

    // Update round labels
    const elements = document.getElementsByClassName("round-counter");
    for(const element of elements) {
        element.innerText = _gameState.round.toString().padStart(3, '0');
    }

    // Generate legend
    generateLegendItems();

    showRoundOverlay();
}

function generateLegendItems() {
    const legend = document.getElementById('legend');

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

    const interval = setInterval(() => {
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

            const healthCounter = document.getElementById('health-counter');
            healthCounter.innerText = _gameState.bacterialHp;

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