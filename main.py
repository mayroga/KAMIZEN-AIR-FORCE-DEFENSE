from flask import Flask, jsonify, request, send_from_directory
import os
import uuid
import datetime
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors

app = Flask(__name__, static_url_path='/static')

# --- CONFIGURACIÓN DE RUTAS ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
REPORTS_DIR = os.path.join(BASE_DIR, 'reports')
os.makedirs(REPORTS_DIR, exist_ok=True)

# --- BASE DE DATOS TÁCTICA (DOMINIOS 01-10) ---
# Aquí se integran los escenarios generados anteriormente
TACTICAL_MISSIONS = [
    {
        "id": "DOM-01",
        "focus": "VAGAL TONE & EMOTIONAL ANCHORING",
        "scenarios": [
            {"q": "Critical equipment failure mid-mission. Stress levels spiking. Action?", 
             "options": [
                 {"text": "Execute 11s breath cycle; assess primary backup", "pts": 3},
                 {"text": "Immediate verbal report to command while troubleshooting", "pts": 2},
                 {"text": "Manual reset of all systems simultaneously", "pts": 1},
                 {"text": "Abandon station to secure physical perimeter", "pts": 0}
             ]}
        ]
    },
    # ... (Se incluyen el resto de los 10 dominios aquí)
]

# Nota: En producción, TACTICAL_MISSIONS se carga desde missions_tactical.json
# Por brevedad en este archivo, se asume la estructura completa.

@app.route('/')
def index():
    return send_from_directory('static', 'session.html')

@app.route('/api/missions', methods=['GET'])
def get_missions():
    """Entrega los dominios para que el Engine los procese aleatoriamente."""
    return jsonify({"missions": TACTICAL_MISSIONS})

@app.route('/api/state', methods=['POST'])
def save_state():
    """Procesa los resultados y genera el reporte PDF de Asesoría."""
    data = request.json
    scores = data.get('scores', [])
    avg = sum(scores) / len(scores) if scores else 0
    
    report_id = f"REP-{uuid.uuid4().hex[:8].upper()}"
    filename = f"{report_id}.pdf"
    filepath = os.path.join(REPORTS_DIR, filename)
    
    # Generación de PDF Profesional
    generate_tactical_pdf(filepath, report_id, scores, avg)
    
    return jsonify({
        "status": "success",
        "report_id": report_id,
        "download_url": f"/reports/{filename}"
    })

@app.route('/reports/<filename>')
def download_report(filename):
    return send_from_directory(REPORTS_DIR, filename)

def generate_tactical_pdf(path, rid, scores, avg):
    """Crea un reporte de Asesoría con estética de ingeniería."""
    c = canvas.Canvas(path, pagesize=letter)
    width, height = letter
    
    # Encabezado
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, "AL CIELO - NEURO-TACTICAL ASSESSMENT")
    
    c.setFont("Helvetica", 10)
    c.drawString(50, height - 65, f"REPORT ID: {rid}")
    c.drawString(50, height - 77, f"DATE: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    c.line(50, height - 85, width - 50, height - 85)
    
    # Resultados
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 120, "NEURAL SYNC PERFORMANCE")
    
    performance = "ELITE" if avg >= 2.5 else "OPERATIONAL" if avg >= 1.5 else "RE-TRAINING"
    c.setFont("Helvetica", 11)
    c.drawString(50, height - 140, f"Average Score: {avg:.2f} / 3.00")
    c.drawString(50, height - 155, f"Readiness Status: {performance}")
    
    # Tabla de Dominios
    c.drawString(50, height - 190, "DOMAIN BREAKDOWN:")
    y = height - 210
    for i, score in enumerate(scores):
        color = colors.green if score == 3 else colors.orange if score >= 1 else colors.red
        c.setFillColor(color)
        c.drawString(60, y, f"Domain {i+1:02d}: {score} pts")
        y -= 15
        c.setFillColor(colors.black)

    # Nota de Asesoría
    c.setFont("Helvetica-Oblique", 9)
    footer_text = "This document is an advisory assessment of neural stability and decision-making patterns."
    c.drawString(50, 50, footer_text)
    
    c.save()

if __name__ == '__main__':
    # Configurado para Render o entorno local
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
