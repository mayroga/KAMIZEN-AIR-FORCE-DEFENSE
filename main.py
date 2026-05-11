import os
import json
import time
from flask import Flask, jsonify, request, send_file, send_from_directory
from flask_cors import CORS

# --- INTEGRATION: MAYKAMI REPORT ENGINE ---
try:
    # Changed from KamizenReport to reflect the new naming convention
    from reports import MaykaMiReport
except ImportError:
    MaykaMiReport = None

app = Flask(__name__)
CORS(app)

# Absolute path configurations
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Data file located in the root directory
DATA_FILE = os.path.join(BASE_DIR, 'missions_tactical.json')
# Temporary directory for generated tactical reports
REPORTS_DIR = os.path.join(BASE_DIR, "tmp_reports")

if not os.path.exists(REPORTS_DIR):
    os.makedirs(REPORTS_DIR)

# --- NAVIGATION ROUTES ---

@app.route('/')
def index():
    """Serves session.html as the primary tactical interface."""
    return send_from_directory(os.path.join(BASE_DIR, 'static'), 'session.html')

@app.route('/static/<path:path>')
def serve_static(path):
    """Serves all static assets (JS, CSS, Images)."""
    return send_from_directory(os.path.join(BASE_DIR, 'static'), path)

# --- TACTICAL DATA API ---

@app.route('/api/missions', methods=['GET'])
def get_missions():
    """Retrieves tactical mission data for the Neuro-Engine."""
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return jsonify(data)
        else:
            # Emergency Fallback Mission if JSON is missing
            return jsonify({
                "missions": [{
                    "id": "EMERGENCY_LINK",
                    "cat": "SYSTEM_RESTORE",
                    "b": [{"t": "v", "tx": {"en": "TACTICAL DATA LINK OFFLINE. CHECK MISSIONS_TACTICAL.JSON"}}]
                }]
            })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/state', methods=['POST'])
def save_state():
    """Processes session telemetry and generates a PDF report."""
    try:
        session_data = request.json
        # Filename based on timestamp for uniqueness
        report_filename = f"MaykaMi_Readiness_{int(time.time())}.pdf"
        report_path = os.path.join(REPORTS_DIR, report_filename)
        
        if MaykaMiReport:
            # Specialized Advisor logic: Direct, professional, non-authoritative
            report_engine = MaykaMiReport(operator_id="736-SFS-OPERATOR")
            report_engine.generate_pdf(session_data, report_path)
            return jsonify({
                "status": "success", 
                "report_id": report_filename,
                "download_url": f"/api/download-report/{report_filename}"
            })
        
        return jsonify({
            "status": "error", 
            "message": "Report Engine (reports.py) not detected."
        }), 501
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/download-report/<report_id>')
def download(report_id):
    """Securely serves generated PDF reports."""
    file_path = os.path.join(REPORTS_DIR, report_id)
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    return jsonify({"error": "File not found"}), 404

# --- SYSTEM INITIALIZATION ---

if __name__ == '__main__':
    # Deployment configuration for environments like Render
    port = int(os.environ.get('PORT', 5000))
    print(f"--- MAYKAMI NEURO-ENGINE [AL CIELO] ---")
    print(f"STATUS: Operational")
    print(f"PORT: {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
