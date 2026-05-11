import os
import json
import time
from flask import Flask, render_template, jsonify, request, send_file
from flask_cors import CORS

# Intentar importar el motor de reportes, si falla, el servidor seguirá vivo
try:
    from reports import KamizenReport
except ImportError:
    KamizenReport = None

app = Flask(__name__, 
            static_folder='static',
            template_folder='static') # Ajustado para buscar HTML en static si es necesario

CORS(app)

# Configuración de Rutas
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'data', 'missions_tactical.json')
# Carpeta temporal con permisos de escritura en Render
REPORTS_DIR = "/tmp/reports"

if not os.path.exists(REPORTS_DIR):
    os.makedirs(REPORTS_DIR)

@app.route('/')
def index():
    # Intenta cargar index.html desde la raíz o desde static
    return render_template('index.html')

@app.route('/session')
def session_page():
    return render_template('session.html')

@app.route('/api/missions', methods=['GET'])
def get_missions():
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return jsonify(data)
        else:
            # Datos de emergencia si el archivo no existe
            return jsonify({"missions": [{"id": 1, "b": [{"t":"v","tx":{"en":"SYSTEM READY"}}]}]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/state', methods=['POST'])
def save_state():
    if KamizenReport is None:
        return jsonify({"status": "error", "message": "Módulo de reportes no instalado"}), 500
    
    try:
        session_data = request.json
        report_filename = f"Report_{int(time.time())}.pdf"
        report_path = os.path.join(REPORTS_DIR, report_filename)

        report_engine = KamizenReport(operator_id="UNIT-736-SFS")
        report_engine.generate_pdf(session_data, report_path)

        return jsonify({
            "status": "success", 
            "report_id": report_filename
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/download-report/<report_id>')
def download(report_id):
    path = os.path.join(REPORTS_DIR, report_id)
    return send_file(path, as_attachment=True)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
