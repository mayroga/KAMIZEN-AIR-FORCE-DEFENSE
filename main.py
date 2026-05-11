import os
import json
import time
from flask import Flask, render_template, jsonify, request, send_file
from flask_cors import CORS
from reports import KamizenReport # Asegúrate de que reports.py esté en la misma carpeta

app = Flask(__name__)
CORS(app)

# Configuración de Rutas
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'data', 'missions_tactical.json')
# Usamos /tmp para Render porque es la única carpeta con permisos de escritura total
REPORTS_DIR = "/tmp/kamizen_reports"

if not os.path.exists(REPORTS_DIR):
    os.makedirs(REPORTS_DIR)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/session')
def session_page():
    return render_template('session.html')

@app.route('/api/missions', methods=['GET'])
def get_missions():
    try:
        if not os.path.exists(DATA_FILE):
            # Creamos un archivo mínimo si no existe para evitar el error 500
            return jsonify({"missions": [{"id":1, "b": []}]})
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/state', methods=['POST'])
def save_state():
    try:
        session_data = request.json
        if not session_data:
            return jsonify({"status": "error", "message": "No data"}), 400

        # Nombre de archivo único usando tiempo actual
        report_filename = f"Report_{int(time.time())}.pdf"
        report_path = os.path.join(REPORTS_DIR, report_filename)

        # Generar el PDF
        report_engine = KamizenReport(operator_id="UNIT-736-SFS")
        report_engine.generate_pdf(session_data, report_path)

        return jsonify({
            "status": "success", 
            "report_id": report_filename
        })
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/download-report/<report_id>')
def download(report_id):
    return send_file(os.path.join(REPORTS_DIR, report_id), as_attachment=True)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
