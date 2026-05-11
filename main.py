import os
import json
import time
from flask import Flask, jsonify, request, send_file, send_from_directory
from flask_cors import CORS

# Intentar importar el motor de reportes
try:
    from reports import KamizenReport
except ImportError:
    KamizenReport = None

app = Flask(__name__)
CORS(app)

# Rutas absolutas basadas en tu estructura actual
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# El JSON está en la raíz según tu lista
DATA_FILE = os.path.join(BASE_DIR, 'missions_tactical.json')
# La carpeta para los PDFs generados
REPORTS_DIR = "/tmp/reports"

if not os.path.exists(REPORTS_DIR):
    os.makedirs(REPORTS_DIR)

# --- RUTAS DE NAVEGACIÓN ---

@app.route('/')
def index():
    """Sirve session.html como la página de inicio desde static."""
    return send_from_directory(os.path.join(BASE_DIR, 'static'), 'session.html')

@app.route('/static/js/<path:filename>')
def serve_js(filename):
    """Sirve el motor JS desde su ubicación actual."""
    return send_from_directory(os.path.join(BASE_DIR, 'static', 'js'), filename)

# --- API DE DATOS ---

@app.route('/api/missions', methods=['GET'])
def get_missions():
    try:
        # Buscamos el JSON en la raíz
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return jsonify(data)
        else:
            # Fallback si el archivo no está en la raíz
            return jsonify({"missions": [{"id": 1, "b": [{"t":"v","tx":{"en":"SISTEMA ONLINE - JSON NO DETECTADO"}}]}]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/state', methods=['POST'])
def save_state():
    try:
        session_data = request.json
        report_filename = f"Asesoria_Tactical_{int(time.time())}.pdf"
        report_path = os.path.join(REPORTS_DIR, report_filename)
        
        if KamizenReport:
            report_engine = KamizenReport(operator_id="736-SFS-OPERATOR")
            report_engine.generate_pdf(session_data, report_path)
            return jsonify({"status": "success", "report_id": report_filename})
        return jsonify({"status": "error", "message": "Motor de Reportes No Encontrado"}), 500
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/download-report/<report_id>')
def download(report_id):
    return send_file(os.path.join(REPORTS_DIR, report_id), as_attachment=True)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
