let seconds = 0;
let intervalId = null;

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');

function updateDisplay() {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const display = mins > 0 ? `${mins}min ${secs}s` : `${secs}s`;
    timerDisplay.textContent = display;
}

function startTimer() {
    if (!intervalId) {
        intervalId = setInterval(() => {
            seconds++;
            updateDisplay();
        }, 1000);
    }
}

function stopTimer() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

function resetTimer() {
    stopTimer();
    seconds = 0;
    updateDisplay();
}

startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);
