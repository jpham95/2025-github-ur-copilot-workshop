// Timer state variables
let timerState = {
    time: 25 * 60, // 25 minutes in seconds
    isRunning: false,
    isPaused: false,
    sessionType: 'work', // 'work', 'shortBreak', 'longBreak'
    completedSessions: 0,
    interval: null
};

// DOM elements
let timerDisplay, startBtn, resetBtn, completedSessionsEl, focusTimeEl, progressRing;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    updateTimerDisplay();
    updateProgressDisplay();
    fetchProgress();
});

// Initialize DOM elements
function initializeElements() {
    timerDisplay = document.getElementById('timerDisplay');
    startBtn = document.getElementById('startBtn');
    resetBtn = document.getElementById('resetBtn');
    completedSessionsEl = document.getElementById('completedSessions');
    focusTimeEl = document.getElementById('focusTime');
    progressRing = document.querySelector('.progress-ring-fill');
    
    // Add event listeners
    startBtn.addEventListener('click', handleStartClick);
    resetBtn.addEventListener('click', resetTimer);
    
    // Add keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            e.preventDefault();
            handleStartClick();
        }
    });
}

// Update timer display (MM:SS format)
function updateTimerDisplay() {
    const minutes = Math.floor(timerState.time / 60);
    const seconds = timerState.time % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerDisplay.textContent = formattedTime;
    
    updateProgressRing();
}

// Update circular progress ring
function updateProgressRing() {
    const totalTime = timerState.sessionType === 'work' ? 25 * 60 : 5 * 60;
    const progress = (totalTime - timerState.time) / totalTime;
    const circumference = 2 * Math.PI * 80; // radius = 80
    const strokeDashoffset = circumference * (1 - progress);
    progressRing.style.strokeDashoffset = strokeDashoffset;
}

// Handle start/pause button click
function handleStartClick() {
    if (timerState.isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
    updateSessionStatus();
}

// Start timer
function startTimer() {
    if (timerState.time <= 0) return;
    
    timerState.isRunning = true;
    timerState.isPaused = false;
    updateButtons();
    
    timerState.interval = setInterval(countdown, 1000);
}

// Pause timer
function pauseTimer() {
    timerState.isRunning = false;
    timerState.isPaused = true;
    updateButtons();
    
    if (timerState.interval) {
        clearInterval(timerState.interval);
        timerState.interval = null;
    }
}

// Reset timer to initial state
function resetTimer() {
    pauseTimer();
    
    if (timerState.sessionType === 'work') {
        timerState.time = 25 * 60;
    } else {
        timerState.time = 5 * 60;
    }
    
    timerState.isRunning = false;
    timerState.isPaused = false;
    
    updateTimerDisplay();
    updateButtons();
}

// Countdown function (decrements time every second)
function countdown() {
    if (timerState.time > 0) {
        timerState.time--;
        updateTimerDisplay();
    } else {
        completeSession();
    }
}

// Handle session completion
function completeSession() {
    pauseTimer();
    
    // Play notification (placeholder for now)
    showNotification();
    
    // Prepare session data
    const sessionData = {
        type: timerState.sessionType,
        completedAt: new Date().toISOString(),
        duration: timerState.sessionType === 'work' ? 25 : 5
    };
    
    // Send to backend
    sendSessionData(sessionData);
    
    // Update local counts
    if (timerState.sessionType === 'work') {
        timerState.completedSessions++;
    }
    
    // Determine next session type
    if (timerState.sessionType === 'work') {
        if (timerState.completedSessions % 4 === 0) {
            startBreak('longBreak', 15); // 15 minute long break
        } else {
            startBreak('shortBreak', 5); // 5 minute short break
        }
    } else {
        startWork();
    }
}

// Start work session
function startWork() {
    timerState.sessionType = 'work';
    timerState.time = 25 * 60;
    updateTimerDisplay();
    updateSessionStatus();
}

// Start break session
function startBreak(type, minutes) {
    timerState.sessionType = type;
    timerState.time = minutes * 60;
    updateTimerDisplay();
    updateSessionStatus();
}

// Update session status text
function updateSessionStatus() {
    const statusEl = document.querySelector('.status');
    const statusText = {
        'work': 'Work Session',
        'shortBreak': 'Short Break',
        'longBreak': 'Long Break'
    };
    
    // Remove all session classes
    statusEl.classList.remove('work-session', 'break-session', 'long-break-session');
    
    if (timerState.isRunning) {
        statusEl.textContent = 'In Progress';
        // Add appropriate class based on session type
        if (timerState.sessionType === 'work') {
            statusEl.classList.add('work-session');
        } else if (timerState.sessionType === 'longBreak') {
            statusEl.classList.add('long-break-session');
        } else {
            statusEl.classList.add('break-session');
        }
    } else {
        statusEl.textContent = statusText[timerState.sessionType] || 'Ready to Start';
        if (timerState.sessionType === 'work') {
            statusEl.classList.add('work-session');
        }
    }
}

// Update button states
function updateButtons() {
    if (timerState.isRunning) {
        startBtn.textContent = 'Pause';
        startBtn.className = 'btn btn-pause';
    } else {
        startBtn.textContent = 'Start';
        startBtn.className = 'btn btn-start';
    }
}

// Show completion notification
function showNotification() {
    const message = timerState.sessionType === 'work' 
        ? 'Work session completed! Take a break.' 
        : 'Break time is over! Ready for the next session?';
    
    // Simple alert for now (can be enhanced with custom notifications)
    alert(message);
}

// Send session data to backend
async function sendSessionData(sessionData) {
    try {
        const response = await fetch('/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sessionData)
        });
        
        if (response.ok) {
            console.log('Session logged successfully');
            fetchProgress(); // Refresh progress display
        } else {
            console.error('Failed to log session');
        }
    } catch (error) {
        console.error('Error sending session data:', error);
        // Store in localStorage as fallback
        storeSessionLocally(sessionData);
    }
}

// Store session in localStorage as fallback
function storeSessionLocally(sessionData) {
    const stored = JSON.parse(localStorage.getItem('pendingSessions') || '[]');
    stored.push(sessionData);
    localStorage.setItem('pendingSessions', JSON.stringify(stored));
}

// Fetch progress from backend
async function fetchProgress() {
    try {
        const response = await fetch('/progress');
        if (response.ok) {
            const progress = await response.json();
            updateProgressDisplay(progress);
        }
    } catch (error) {
        console.error('Error fetching progress:', error);
        // Use local data as fallback
        updateProgressDisplay();
    }
}

// Update progress display
function updateProgressDisplay(data) {
    if (data) {
        completedSessionsEl.textContent = data.completedSessions || 0;
        focusTimeEl.textContent = `${data.focusTime || 0} min`;
    } else {
        // Use local session count as fallback
        completedSessionsEl.textContent = timerState.completedSessions;
        focusTimeEl.textContent = `${timerState.completedSessions * 25} min`;
    }
}