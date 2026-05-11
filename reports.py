import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.units import inch
from datetime import datetime

class KamizenReport:
    def __init__(self, operator_id="UNIT-736-SFS"):
        self.operator_id = operator_id
        self.timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()

    def _setup_custom_styles(self):
        # Estilo Táctico para el Título
        self.styles.add(ParagraphStyle(
            name='TacticalHeader',
            fontSize=18,
            leading=22,
            textColor=colors.hexColor("#00d4ff"),
            alignment=1,
            spaceAfter=20,
            fontName='Helvetica-Bold'
        ))
        # Estilo para etiquetas de datos
        self.styles.add(ParagraphStyle(
            name='DataLabel',
            fontSize=10,
            textColor=colors.black,
            fontName='Helvetica-Bold'
        ))

    def generate_pdf(self, session_data, filename="report_tactical.pdf"):
        """
        Genera un reporte PDF basado en la telemetría y logs de la sesión.
        """
        doc = SimpleDocTemplate(filename, pagesize=letter)
        elements = []

        # --- ENCABEZADO ---
        elements.append(Paragraph("KAMIZEN TACTICAL - NEURO-COGNITIVE REPORT", self.styles['TacticalHeader']))
        elements.append(Paragraph(f"OPERATOR: {self.operator_id} | DATE: {self.timestamp}", self.styles['Normal']))
        elements.append(Spacer(1, 0.3 * inch))

        # --- SECCIÓN 1: BIOMETRÍA Y TELEMETRÍA ---
        elements.append(Paragraph("1. BIOMETRIC & PERFORMANCE TELEMETRY", self.styles['Heading2']))
        
        telemetry = session_data.get('telemetry', {})
        biometrics = session_data.get('biometrics', {})

        bio_table_data = [
            ["METRIC", "VALUE", "STATUS"],
            ["Heart Rate (Avg Sim)", f"{biometrics.get('pulseSim', 0)} BPM", "CALIBRATED"],
            ["Jitter / Micro-Tremor", f"{biometrics.get('microTremor', 0):.2f}%", "STABLE" if biometrics.get('microTremor', 0) < 15 else "STRESS DETECTED"],
            ["ROE Compliance", f"{telemetry.get('roeCompliance', 0)}%", "HIGH" if telemetry.get('roeCompliance', 0) > 85 else "REVIEW REQ."],
            ["Focus Stability", f"{telemetry.get('focusStability', 0):.2f}%", "OPTIMAL"],
            ["Cognitive Load", f"{telemetry.get('cognitiveLoad', 0):.2f}%", "ADAPTIVE"]
        ]

        t = Table(bio_table_data, colWidths=[2.5 * inch, 1.5 * inch, 2.0 * inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.hexColor("#0d1117")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ]))
        elements.append(t)
        elements.append(Spacer(1, 0.4 * inch))

        # --- SECCIÓN 2: LOG DE DECISIONES TÁCTICAS ---
        elements.append(Paragraph("2. TACTICAL DECISION LOG", self.styles['Heading2']))
        
        log_data = [["TYPE", "LATENCY", "RESULT", "LOAD"]]
        logs = session_data.get('logs', [])
        
        for entry in logs:
            if entry['type'] == 'DECISION':
                d = entry['data']
                log_data.append([
                    "DECISION", 
                    f"{d.get('latency', 0):.0f}ms", 
                    "SUCCESS" if d.get('success') else "FAILURE",
                    f"{d.get('bpm', 0)} BPM"
                ])

        if len(log_data) > 1:
            lt = Table(log_data, colWidths=[1.5 * inch, 1.5 * inch, 1.5 * inch, 1.5 * inch])
            lt.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.whitesmoke, colors.white]),
            ]))
            elements.append(lt)
        else:
            elements.append(Paragraph("No direct tactical decisions recorded in this module.", self.styles['Italic']))

        elements.append(Spacer(1, 0.4 * inch))

        # --- SECCIÓN 3: ASESORÍA Y RECOMENDACIONES ---
        elements.append(Paragraph("3. ADVISORY & CORRECTIVE MEASURES", self.styles['Heading2']))
        
        # Lógica de asesoría basada en datos
        advice = "Continue standard calibration protocols."
        if telemetry.get('roeCompliance', 100) < 90:
            advice = "PRIORITY: Review Rules of Engagement (ROE) logic. Decision-making is deviating from command intent under pressure."
        elif biometrics.get('microTremor', 0) > 20:
            advice = "RECOVERY: High tremor detected. Increase respiratory control phases (Breath Auto) to lower physiological baseline."
        
        elements.append(Paragraph(f"<b>OFFICIAL ADVISORY:</b> {advice}", self.styles['Normal']))
        elements.append(Spacer(1, 0.5 * inch))

        # Pie de página / Aviso Legal
        elements.append(Paragraph("-" * 100, self.styles['Normal']))
        elements.append(Paragraph("CLASSIFICATION: UNCLASSIFIED // FOR OPERATIONAL TRAINING USE ONLY", self.styles['Normal']))
        elements.append(Paragraph("Generated by KAMIZEN NEURO-COGNITIVE SYSTEM v2.0", self.styles['Normal']))

        # Construir el PDF
        doc.build(elements)
        return filename

# --- EJEMPLO DE USO (Para pruebas locales) ---
if __name__ == "__main__":
    test_data = {
        'telemetry': {'roeCompliance': 85, 'focusStability': 98.2, 'cognitiveLoad': 45.5},
        'biometrics': {'pulseSim': 82, 'microTremor': 12.5},
        'logs': [
            {'type': 'DECISION', 'data': {'latency': 1200, 'success': True, 'bpm': 78}},
            {'type': 'DECISION', 'data': {'latency': 2500, 'success': False, 'bpm': 92}}
        ]
    }
    report = KamizenReport()
    report.generate_pdf(test_data, "test_report.pdf")
    print("Reporte de prueba generado: test_report.pdf")
