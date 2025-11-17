# Pomodoro Timer Web App Development Plan

## Overview

This document outlines a step-by-step development plan for building the Pomodoro timer web application. Each step is designed to be granular, testable, and incrementally buildable.

---

## Phase 1: Project Setup and Basic Structure

### Step 1.1: Environment Setup
- [ ] Set up Python virtual environment using `uv venv`
- [ ] Create requirements.txt with Flask dependency
- [ ] Initialize basic project structure (folders: templates/, static/)
- [ ] Test: Verify virtual environment activation and folder structure

### Step 1.2: Basic Flask App
- [ ] Create minimal Flask app in `app.py` with single route "/"
- [ ] Create basic HTML template (`templates/index.html`) with "Hello World"
- [ ] Test: Run Flask app and verify it serves the HTML page

---

## Phase 2: Frontend Development

### Step 2.1: HTML Structure
- [ ] Create HTML layout matching the UI mockup structure
- [ ] Add timer display area (25:00 format)
- [ ] Add Start and Reset buttons
- [ ] Add progress section (completed sessions, focus time)
- [ ] Test: Verify HTML renders correctly in browser

### Step 2.2: Basic CSS Styling
- [ ] Create `static/style.css` with purple gradient background
- [ ] Style the timer card (white background, rounded corners)
- [ ] Style the circular progress indicator (placeholder)
- [ ] Style buttons (Start: blue filled, Reset: blue outline)
- [ ] Test: Verify visual appearance matches mockup

### Step 2.3: Timer JavaScript Foundation
- [ ] Create `static/script.js` with timer object structure
- [ ] Implement timer state variables (time, isRunning, isPaused)
- [ ] Add DOM manipulation functions (updateDisplay, updateButtons)
- [ ] Test: Verify JavaScript loads and basic DOM updates work

### Step 2.4: Core Timer Logic
- [ ] Implement countdown function (decrements time every second)
- [ ] Add start timer functionality
- [ ] Add pause/resume functionality
- [ ] Add reset timer functionality
- [ ] Test: Verify timer counts down correctly and buttons work

### Step 2.5: Circular Progress Indicator
- [ ] Implement SVG or CSS-based circular progress
- [ ] Update progress based on remaining time
- [ ] Animate progress smoothly
- [ ] Test: Verify progress circle updates during countdown

---

## Phase 3: Session Management

### Step 3.1: Session Completion Handling
- [ ] Detect when timer reaches 00:00
- [ ] Show completion notification/alert
- [ ] Auto-start break timer (5 minutes)
- [ ] Handle long breaks after 4 sessions
- [ ] Test: Verify session completion flow works

### Step 3.2: Session Data Collection
- [ ] Create session data object (start time, end time, type, completed)
- [ ] Store session data in browser localStorage temporarily
- [ ] Add function to prepare session data for backend
- [ ] Test: Verify session data is collected correctly

---

## Phase 4: Backend Development

### Step 4.1: Session Logging API
- [ ] Create `/log` POST endpoint in Flask app
- [ ] Accept JSON session data from frontend
- [ ] Validate incoming session data
- [ ] Write session data to `session_log.json` file
- [ ] Test: Verify API accepts and stores session data

### Step 4.2: Progress Calculation API
- [ ] Create `/progress` GET endpoint
- [ ] Read session data from log file
- [ ] Calculate today's completed sessions and total focus time
- [ ] Return JSON response with progress data
- [ ] Test: Verify API returns correct progress calculations

### Step 4.3: Error Handling and Logging
- [ ] Add error handling for file operations
- [ ] Add request validation and error responses
- [ ] Add basic logging for debugging
- [ ] Test: Verify error scenarios are handled gracefully

---

## Phase 5: Frontend-Backend Integration

### Step 5.1: Session Logging Integration
- [ ] Add fetch() call to send session data to `/log` endpoint
- [ ] Handle success/error responses from backend
- [ ] Remove data from localStorage after successful logging
- [ ] Test: Verify completed sessions are logged to backend

### Step 5.2: Progress Display Integration
- [ ] Add fetch() call to get progress data from `/progress` endpoint
- [ ] Update UI with fetched progress data on page load
- [ ] Refresh progress data after each completed session
- [ ] Test: Verify progress displays correctly and updates

---

## Phase 6: Polish and Enhancement

### Step 6.1: UI Improvements
- [ ] Add loading states for API calls
- [ ] Improve responsive design for mobile devices
- [ ] Add smooth transitions and animations
- [ ] Test: Verify UI works well on different screen sizes

### Step 6.2: Additional Features
- [ ] Add session type indicators (work/short break/long break)
- [ ] Add sound notifications for session completion
- [ ] Add keyboard shortcuts (spacebar to start/pause)
- [ ] Test: Verify additional features work correctly

### Step 6.3: Data Persistence Improvements
- [ ] Add date-based organization to session log
- [ ] Implement log file rotation for large datasets
- [ ] Add basic analytics (weekly/monthly progress)
- [ ] Test: Verify data persistence works reliably

---

## Testing Strategy

### Unit Testing
- Test individual JavaScript functions (timer logic, DOM updates)
- Test Flask endpoints with different input scenarios
- Test session data validation and calculations

### Integration Testing
- Test complete timer workflow (start → complete → log)
- Test frontend-backend API communication
- Test progress data accuracy across multiple sessions

### Manual Testing
- Test UI interactions and visual appearance
- Test timer accuracy over extended periods
- Test browser compatibility and responsive design

---

## Function Granularity Guidelines

### JavaScript Functions (Small, Single-Purpose)
- `updateTimerDisplay()` - Updates timer text
- `startTimer()` - Initiates countdown
- `pauseTimer()` - Pauses current session
- `resetTimer()` - Resets to 25:00
- `completeSession()` - Handles session completion
- `sendSessionData()` - Posts to backend
- `fetchProgress()` - Gets progress from backend
- `updateProgressDisplay()` - Updates progress UI

### Python Functions (Focused, Testable)
- `log_session()` - Writes session to file
- `read_session_log()` - Reads sessions from file
- `calculate_daily_progress()` - Computes today's stats
- `validate_session_data()` - Validates input data
- `get_todays_sessions()` - Filters sessions by date

This granular approach ensures each function has a single responsibility and can be tested independently.