from flask import Flask, render_template, request, jsonify
import json
import os
from datetime import datetime

app = Flask(__name__)

# Session log file path
SESSION_LOG_FILE = 'session_log.json'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/log', methods=['POST'])
def log_session():
    """Log a completed Pomodoro session"""
    try:
        session_data = request.get_json()
        
        # Validate session data
        if not validate_session_data(session_data):
            return jsonify({'error': 'Invalid session data'}), 400
        
        # Add timestamp
        session_data['logged_at'] = datetime.now().isoformat()
        
        # Read existing sessions
        sessions = read_session_log()
        sessions.append(session_data)
        
        # Write updated sessions
        write_session_log(sessions)
        
        return jsonify({'status': 'success', 'message': 'Session logged successfully'})
    
    except Exception as e:
        print(f"Error logging session: {e}")
        return jsonify({'error': 'Failed to log session'}), 500

@app.route('/progress')
def get_progress():
    """Get today's progress data"""
    try:
        sessions = read_session_log()
        progress = calculate_daily_progress(sessions)
        return jsonify(progress)
    
    except Exception as e:
        print(f"Error fetching progress: {e}")
        return jsonify({'error': 'Failed to fetch progress'}), 500

def validate_session_data(data):
    """Validate incoming session data"""
    required_fields = ['type', 'completedAt', 'duration']
    if not data or not isinstance(data, dict):
        return False
    
    for field in required_fields:
        if field not in data:
            return False
    
    valid_types = ['work', 'shortBreak', 'longBreak']
    if data['type'] not in valid_types:
        return False
    
    return True

def read_session_log():
    """Read sessions from the log file"""
    if not os.path.exists(SESSION_LOG_FILE):
        return []
    
    try:
        with open(SESSION_LOG_FILE, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return []

def write_session_log(sessions):
    """Write sessions to the log file"""
    try:
        with open(SESSION_LOG_FILE, 'w') as f:
            json.dump(sessions, f, indent=2)
    except IOError as e:
        print(f"Error writing session log: {e}")
        raise

def calculate_daily_progress(sessions):
    """Calculate today's completed sessions and focus time"""
    today = datetime.now().date()
    today_sessions = get_todays_sessions(sessions, today)
    
    completed_sessions = len([s for s in today_sessions if s['type'] == 'work'])
    total_focus_time = sum(s['duration'] for s in today_sessions if s['type'] == 'work')
    
    return {
        'completedSessions': completed_sessions,
        'focusTime': total_focus_time,
        'date': today.isoformat()
    }

def get_todays_sessions(sessions, target_date):
    """Filter sessions by date"""
    today_sessions = []
    
    for session in sessions:
        try:
            # Parse the completedAt timestamp
            session_date = datetime.fromisoformat(session['completedAt'].replace('Z', '+00:00')).date()
            if session_date == target_date:
                today_sessions.append(session)
        except (ValueError, KeyError):
            continue
    
    return today_sessions

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)