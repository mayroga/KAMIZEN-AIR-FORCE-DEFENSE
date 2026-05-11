/**
 * KAMIZEN NEURO-COGNITIVE ENGINE v2.0
 * Protocolo de Calibración Pre/Post Simulación VR
 * Autor: May Roga LLC
 */

const KamizenEngine = {
    currentMissionIndex: 0,
    currentStepIndex: 0,
    missionData: null,
    userStats: {
        accuracy: 0,
        stability: 0,
        discipline: 0,
        focus: 0,
        total_sessions: 0
    },
    timer: null,

    async init() {
        console.log("Iniciando Protocolo KaMiZen - Modo Offline Seguro");
        try {
            // Carga local del JSON que diseñamos
            const response = await fetch('data/missions_tactical.json');
            this.missionData = await response.json();
            this.renderMissionSelector();
        } catch (error) {
            console.error("CRITICAL ERROR: No se encontró la base de datos táctica.");
        }
    },

    // Lógica de Ejecución de Misiones
    startMission(id) {
        this.currentMissionIndex = this.missionData.missions.findIndex(m => m.id === id);
        this.currentStepIndex = 0;
        this.executeStep();
    },

    executeStep() {
        const mission = this.missionData.missions[this.currentMissionIndex];
        const step = mission.b[this.currentStepIndex];

        if (!step) {
            this.completeMission();
            return;
        }

        switch (step.t) {
            case 'v': // Video/Visual Call
                this.ui_renderTitle(step.tx.en);
                break;
            case 'breath_auto': // Calibración Vagal (La parte médica)
                this.ui_startBreathing(step.d, step.tx.en, step.inf.en);
                break;
            case 'd': // Toma de Decisión Táctica (Juicio)
                this.ui_renderDecision(step.q.en, step.op, step.c, step.ex);
                break;
            case 'sil': // Silencio Operacional (Enfoque)
                this.ui_startSilence(step.d, step.tx.en);
                break;
            case 'r': // Resultado/Feedback
                this.ui_showResult(step.tx, step.p);
                break;
        }
    },

    // Gestión de la Respuesta Fisiológica (Simulada para validación del instructor)
    processDecision(choiceIndex, correctIndex, explanation) {
        if (choiceIndex === correctIndex) {
            this.userStats.discipline += 10;
            this.ui_notify("SUCCESS", "Correcto. Adherencia al protocolo confirmada.", "success");
        } else {
            this.userStats.discipline -= 5;
            this.ui_notify("WARNING", `DESVIACIÓN TÁCTICA: ${explanation[choiceIndex]}`, "error");
        }
        
        // Avanzar después de procesar
        setTimeout(() => {
            this.currentStepIndex++;
            this.executeStep();
        }, 3000);
    },

    // --- INTERFAZ DE USUARIO (Abstracción para UI.js) ---
    ui_renderDecision(question, options, correct, explanations) {
        // Esta función inyecta en el DOM de la tablet las opciones tácticas
        const container = document.getElementById('mission-content');
        container.innerHTML = `
            <div class="tactical-card">
                <h3>SITUATIONAL ASSESSMENT</h3>
                <p class="question">${question}</p>
                <div class="options-grid">
                    ${options.map((opt, i) => `
                        <button class="btn-tactical" onclick="KamizenEngine.processDecision(${i}, ${correct}, ${JSON.stringify(explanations)})">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    },

    ui_startBreathing(duration, title, info) {
        let timeLeft = duration;
        const container = document.getElementById('mission-content');
        
        this.timer = setInterval(() => {
            container.innerHTML = `
                <div class="breathing-circle-container">
                    <div class="breathing-circle"></div>
                    <h2>${title}</h2>
                    <p>${info}</p>
                    <div class="timer-display">${timeLeft}s</div>
                </div>
            `;
            if (timeLeft <= 0) {
                clearInterval(this.timer);
                this.currentStepIndex++;
                this.executeStep();
            }
            timeLeft--;
        }, 1000);
    },

    completeMission() {
        this.ui_notify("MISSION COMPLETE", "Datos consolidados para el reporte de la misión.", "success");
        // Aquí se activaría el generador de PDF para el instructor
        this.generateTacticalReport();
    },

    generateTacticalReport() {
        console.log("Generando Reporte PDF para el Instructor del 736 SFS...");
        // Lógica para exportar stats a PDF
    }
};

// Inicializar el cerebro al cargar la página
document.addEventListener('DOMContentLoaded', () => KamizenEngine.init());
