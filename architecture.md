# Pomodoro Timer Web App Architecture

## Overview

This project is a simple Pomodoro timer web application built to learn the aspects of GitHub Copilot. The timer UI and functionality are inspired by the provided mockup. The app uses Flask for the backend and HTML/CSS/JavaScript for the frontend.

---

## 1. Frontend (HTML/CSS/JavaScript)
- **HTML/CSS**: Renders the UI (timer, buttons, progress) as shown in the mockup.
- **JavaScript**: Handles all timer logic (countdown, start, reset, progress display, etc.) and updates the UI in real time.
- **AJAX/Fetch**: Sends session completion data to the backend (e.g., when a Pomodoro finishes).

## 2. Backend (Flask)
- **Routes**:
  - `/`: Serves the main HTML page.
  - `/static/`: Serves static assets (CSS, JS, images).
  - `/log`: API endpoint (POST) to receive and store session data (e.g., when a Pomodoro is completed).
  - `/progress`: API endpoint (GET) to fetch today’s progress (number of completed sessions, total focus time).
- **Session Log**: Stores session data in a simple log file (e.g., JSON or CSV).

## 3. Data Flow
- User interacts with the timer (start, reset) on the frontend.
- When a session completes, JavaScript sends a POST request to `/log` with session info.
- On page load or refresh, JavaScript fetches progress data from `/progress` to update the UI.

---

## Suggested File Structure

```
/project-root
│
├── app.py                # Flask backend
├── session_log.json      # Log file for sessions
├── /templates
│   └── index.html        # Main HTML page
├── /static
│   ├── style.css         # CSS styles
│   └── script.js         # JavaScript for timer logic
└── README.md
```

---

## Key Points

- **Frontend handles all timer logic** for responsiveness and smooth UI.
- **Backend is stateless for timer**, only responsible for serving files and logging session data.
- **Session log** can be a simple JSON file, with each entry containing timestamp, duration, and status.
- **Progress calculation** is done by the backend when `/progress` is requested.
