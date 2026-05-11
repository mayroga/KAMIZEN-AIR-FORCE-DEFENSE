import os
import json
import time
from flask import Flask, render_template, jsonify, request, send_file
from flask_cors import CORS

# Intentar importar el motor de reportes
try:
    from reports import KamizenReport
except ImportError:
    KamizenReport = None

# Configuración de carpetas: Forzamos a Flask a buscar en la raíz y en static
app = Flask(__name__, 
            template_folder='static', 
            static_folder='static')

CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'data', 'missions_tactical.json')
REPORTS_DIR = "/tmp/reports"

if not os.path.exists(REPORTS_DIR):
    os.makedirs(REPORTS_DIR)

@app.route('/')
def index():
    # Render busca por defecto en 'templates', pero como tus archivos 
    # están en 'static', lo forzamos así:
    return send_file(os.path.join(BASE_DIR, 'static', 'index.html'))

@app.route('/session')
def session_page():
    return send_file(os.path.join(BASE_DIR, 'static', 'session.html'))

@app.route('/api/missions', methods=['GET'])
def get_missions():
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return jsonify(json.load(f))
        return jsonify({"missions": []})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/state', methods=['POST'])
def save_state():
    try:
        session_data = request.json
        report_filename = f"Report_{int(time.time())}.pdf"
        report_path = os.path.join(REPORTS_DIR, report_filename)
        
        if KamizenReport:
            report_engine = KamizenReport(operator_id="736-SFS-OP")
            report_engine.generate_pdf(session_data, report_path)
            return jsonify({"status": "success", "report_id": report_filename})
        return jsonify({"status": "error", "message": "PDF Engine Offline"}), 500
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/download-report/<report_id>')
def download(report_id):
    return send_file(os.path.join(REPORTS_DIR, report_id), as_attachment=True)

if __name__ == '__main__':
    # Esto solo se usa localmente, en Render gunicorn toma el mando
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
