import os
import json
from flask import Flask, render_template, jsonify, request, send_file
from flask_cors import CORS
from reports import KamizenReport  # Importamos el nuevo módulo de reportes

app = Flask(__name__)
CORS(app)

# Configuración de Rutas
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'data', 'missions_tactical.json')
REPORTS_DIR = os.path.join(BASE_DIR, 'reports_generated')

# Asegurar que la carpeta de reportes exista
if not os.path.exists(REPORTS_DIR):
    os.makedirs(REPORTS_DIR)

# --- RUTAS DE NAVEGACIÓN ---

@app.route('/')
def index():
    """Interfaz principal del sistema Kamizen."""
    return render_template('index.html')

# --- API DE MISIONES (INTERNET ABIERTO / SISTEMA CERRADO) ---

@app.route('/api/missions', methods=['GET'])
def get_missions():
    """Sirve las misiones desde el archivo JSON local."""
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- PROCESAMIENTO DE TELEMETRÍA Y GENERACIÓN DE PDF ---

@app.route('/api/state', methods=['POST'])
def save_state():
    """
    Recibe la telemetría detallada y los sensores virtuales del frontend.
    Genera el reporte PDF de Asesoría Técnica automáticamente.
    """
    try:
        session_data = request.json
        if not session_data:
            return jsonify({"status": "error", "message": "No data received"}), 400

        # 1. Preparar el nombre del archivo con timestamp
        timestamp = datetime_now_str = os.path.getmtime(DATA_FILE) # Placeholder simple
        report_filename = f"Kamizen_Report_{int(os.path.getmtime(DATA_FILE))}.pdf"
        report_path = os.path.join(REPORTS_DIR, report_filename)

        # 2. Invocar al motor de reportes (reports.py)
        # Nota: KamizenReport usa los datos de sensores virtuales enviados desde engine.js
        report_engine = KamizenReport(operator_id="UNIT-736-SFS-OP")
        report_engine.generate_pdf(session_data, report_path)

        # 3. Retornar el ID del reporte para su descarga
        return jsonify({
            "status": "success",
            "message": "Asesoría procesada y PDF generado",
            "report_id": report_filename
        })

    except Exception as e:
        print(f"Error en procesamiento de estado: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

# --- DESCARGA DE REPORTES ---

@app.route('/api/download-report/<report_id>', methods=['GET'])
def download_report(report_id):
    """Permite al usuario descargar su reporte PDF de asesoría."""
    try:
        path = os.path.join(REPORTS_DIR, report_id)
        if os.path.exists(path):
            return send_file(path, as_attachment=True)
        else:
            return "Reporte no encontrado", 404
    except Exception as e:
        return str(e), 500

# --- MODALIDADES DE EJECUCIÓN ---

if __name__ == '__main__':
    # El sistema detecta si está en Render o en local
    port = int(os.environ.get('PORT', 5000))
    
    # Para pruebas iniciales con Internet Abierto, debug está activado.
    # En sistema cerrado para el 736 SFS, se debe desactivar el debug.
    app.run(host='0.0.0.0', port=port, debug=True)
