/**
 * MAYKAMI NEURO-ENGINE 
 * Sistema Especializado en Acondicionamiento Mental y Sincronización Neuro-Táctica.
 * Protocolo de Entrenamiento Científico de 10 Minutos (Pre-VR).
 * 
 * NOTA: Este sistema actúa como asesor táctico para operadores de alto rendimiento.
 */

const MaykaMiEngine = {
    currentMissionIndex: 0,
    currentStepIndex: 0,
    missionData: null,
    currentStepStart: 0,
    isTrainingActive: false,

    // 🧠 ESCALABILIDAD NEURAL (Estado adaptativo del operador)
    adaptiveState: {
        vagalTone: 60,
        excellenceScore: 0,
        stressResistance: 1.0,
        totalSuccesses: 0,
        totalFailures: 0
    },

    // 📡 TELEMETRÍA SIMULADA (Para monitoreo de rendimiento)
    telemetry: {
        preSessionBalance: 0,
        postSessionReadiness: 0,
        averageLatency: 0,
        decisionAccuracy: [],
    },

    // 🗣️ CONFIGURACIÓN DE VOZ MAESTRA (Sintetizador Profesional)
    voice: {
        synth: window.speechSynthesis,
        isSpeaking: false,
        pitch: 0.85, // Tono profesional y profundo
        rate: 0.90   // Ritmo calmado y directivo
    },

    async init() {
        console.log("MAYKAMI TERMINAL: READY.");
        try {
            // Carga de datos de misiones (Protocolos tácticos)
            const res = await fetch('/api/missions');
            this.missionData = await res.json();
            
            // Balance inicial previo al entrenamiento
            this.telemetry.preSessionBalance = 55 + Math.random() * 15;
            this.renderModuleSelector();
            this.startTelemetryLoop();
            
            this.speak("Sistema Mayka Mi inicializado. Bienvenido al protocolo de sincronización neuro-táctica. Seleccione un dominio de entrenamiento.");
        } catch (e) {
            console.error("ERROR DE CARGA:", e);
        }
    },

    // ==========================================
    // 🗣️ SÍNTESIS DE VOZ (Asesoría Directa)
    // ==========================================
    speak(text) {
        if (this.voice.synth.speaking) this.voice.synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES'; // Configurado en español por directiva del asesor
        utterance.pitch = this.voice.pitch;
        utterance.rate = this.voice.rate;
        this.voice.synth.speak(utterance);
    },

    // ==========================================
    // 🎛️ SELECTOR DE MÓDULOS TÁCTICOS
    // ==========================================
    renderModuleSelector() {
        const container = document.getElementById("app");
        let html = `
            <div class="card" style="max-width:850px;">
                <h2 style="color:var(--primary); margin-bottom:5px;">SELECTOR DE DOMINIOS NEURALES</h2>
                <p style="font-size:10px; margin-bottom:20px; opacity:0.8;">ACCESO DE OPERADOR - 10 ÁREAS DE ACONDICIONAMIENTO</p>
                <div id="options-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
        `;

        this.missionData.missions.forEach((m, index) => {
            html += `
                <button class="btn-tactical" style="text-align:left; font-size:11px;" onclick="MaykaMiEngine.startMissionByIndex(${index})">
                    <span style="color:var(--primary)">[DOMINIO ${index + 1}]</span> ${m.id}
                    <span style="display:block; font-size:9px; color:var(--success); margin-top:4px;">ENFOQUE: ${this.getScientificFocus(index)}</span>
                </button>
            `;
        });

        html += `</div></div>`;
        container.innerHTML = html;
    },

    getScientificFocus(index) {
        const focuses = [
            "COHERENCIA Y TONO VAGAL", "ESTIMULACIÓN CORTEX PREFRONTAL", "PRECISIÓN DE JUICIO TÁCTICO",
            "SUPRESIÓN DE MICRO-TREMOR", "LATENCIA SITUACIONAL", "GESTIÓN DE CARGA COGNITIVA",
            "ESTABILIDAD MOTOR-NEURONAL", "SINCRONIZACIÓN SINÁPTICA", "RETENCIÓN DE CAMPO VISUAL",
            "EXCELENCIA EN DECISIÓN EJECUTIVA"
        ];
        return focuses[index] || "ACONDICIONAMIENTO NEURAL";
    },

    // ==========================================
    // 🚀 LÓGICA DE MISIÓN (1 -> 10 -> 1)
    // ==========================================
    startMissionByIndex(index) {
        this.currentMissionIndex = index;
        this.currentStepIndex = 0;
        this.isTrainingActive = true;
        this.executeStep();
    },

    executeStep() {
        const mission = this.missionData.missions[this.currentMissionIndex];
        const step = mission.b[this.currentStepIndex];

        if (!step) {
            this.handleProgression();
            return;
        }

        switch (step.t) {
            case 'v': this.renderPhaseText(step.tx.es || step.tx.en); break;
            case 'breath_auto': this.runScientificBreathing(step); break;
            case 'd': this.renderAssessment(step); break;
            case 'r': this.showPhaseResult(step); break;
            default: this.nextStep();
        }
    },

    renderPhaseText(text) {
        const container = document.getElementById("app");
        container.innerHTML = `
            <div class="card">
                <h3 style="color:var(--primary)">PROTOCOLO ${this.currentMissionIndex + 1}</h3>
                <p style="font-size:1.5em; line-height:1.4;">${text}</p>
                <button class="btn-tactical" onclick="MaykaMiEngine.nextStep()">CONTINUAR</button>
            </div>
        `;
        this.speak(text);
    },

    // ==========================================
    // 🌬️ RESPIRACIÓN REGULADA (Ciclo de 11s)
    // ==========================================
    runScientificBreathing(step) {
        let timeLeft = step.d; 
        const container = document.getElementById("app");
        this.speak("Sincronice su respiración con el indicador. Inhale al expandir, exhale al contraer. Estabilice su ritmo cardíaco.");

        const interval = setInterval(() => {
            const cyclePos = timeLeft % 11;
            const isExhaling = cyclePos < 5.5;
            const instruction = isExhaling ? "EXHALE" : "INHALE";
            
            container.innerHTML = `
                <div class="card">
                    <h3>SINCRO-NEURAL: ${this.getScientificFocus(this.currentMissionIndex)}</h3>
                    <div class="breath-container">
                        <div class="breath-circle breath-active"></div>
                        <div class="breath-instruction">
                            <h2 style="margin:0;">${instruction}</h2>
                            <p>${timeLeft}s</p>
                        </div>
                    </div>
                </div>
            `;
            if (timeLeft-- <= 0) {
                clearInterval(interval);
                this.nextStep();
            }
        }, 1000);
    },

    renderAssessment(step) {
        const container = document.getElementById("app");
        this.currentStepStart = performance.now();
        const question = step.q.es || step.q.en;
        this.speak(question);

        container.innerHTML = `
            <div class="card">
                <p style="color:var(--danger); font-size:10px;">ANALIZANDO PATRÓN DE DECISIÓN...</p>
                <p style="font-size:1.3em; margin:20px 0;">${question}</p>
                <div id="options-grid">
                    ${step.op.map((opt, i) => `
                        <button class="btn-tactical" style="width:100%; text-align:left;" onclick="MaykaMiEngine.processDecision(${i}, ${step.c})">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    },

    processDecision(choice, correct) {
        const latency = (performance.now() - this.currentStepStart) / 1000;
        const success = choice === correct;

        this.telemetry.decisionAccuracy.push(success);
        this.telemetry.averageLatency = (this.telemetry.averageLatency + latency) / 2;
        
        if (success) {
            this.adaptiveState.vagalTone += 2;
            this.speak("Protocolo cumplido. Eficiencia táctica incrementada.");
        } else {
            this.adaptiveState.vagalTone -= 5;
            this.speak("Desviación detectada. Analice su índice de vacilación.");
        }

        const container = document.getElementById("app");
        container.innerHTML = `
            <div class="card">
                <h2 style="color:${success ? 'var(--success)' : 'var(--danger)'}">
                    ${success ? 'PROTOCOL MET' : 'PROTOCOL BREACH'}
                </h2>
                <p>LATENCIA NEURAL: ${latency.toFixed(3)}s</p>
            </div>
        `;
        setTimeout(() => this.nextStep(), 1500);
    },

    showPhaseResult(step) {
        this.speak("Fase completada. Datos almacenados para análisis de rendimiento.");
        document.getElementById("app").innerHTML = `
            <div class="card">
                <h2 style="color:var(--success)">DATOS ADQUIRIDOS</h2>
                <p>GANANCIA COGNITIVA: +${step.p} PUNTOS</p>
                <button class="btn-tactical" onclick="MaykaMiEngine.nextStep()">SIGUIENTE FASE</button>
            </div>
        `;
    },

    nextStep() {
        this.currentStepIndex++;
        this.executeStep();
    },

    handleProgression() {
        this.currentMissionIndex++;
        if (this.currentMissionIndex >= this.missionData.missions.length) {
            this.currentMissionIndex = 0;
            this.renderFinalReport();
        } else {
            this.currentStepIndex = 0;
            this.executeStep();
        }
    },

    // ==========================================
    // 📊 REPORTE DEL ASESOR ESPECIALISTA
    // ==========================================
    renderFinalReport() {
        const acc = (this.telemetry.decisionAccuracy.filter(x => x).length / this.telemetry.decisionAccuracy.length) * 100;
        this.telemetry.postSessionReadiness = Math.min(100, acc - (this.telemetry.averageLatency * 2));
        
        this.speak("Ciclo completo. Su estado de preparación táctica ha sido analizado con éxito.");

        document.getElementById("app").innerHTML = `
            <div class="card" style="text-align:left">
                <h2 style="color:var(--primary); text-align:center;">ANÁLISIS DE PREPARACIÓN</h2>
                <hr style="border-color:#333">
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                    <div>
                        <p style="font-size:10px;">PRE-SESIÓN</p>
                        <h3>BALANCE: ${this.telemetry.preSessionBalance.toFixed(1)}%</h3>
                    </div>
                    <div>
                        <p style="font-size:10px;">POST-SESIÓN</p>
                        <h3 style="color:var(--success)">PREPARADO: ${this.telemetry.postSessionReadiness.toFixed(1)}%</h3>
                    </div>
                </div>
                <hr style="border-color:#333">
                <p><b>PRECISIÓN DE DECISIÓN:</b> ${acc.toFixed(1)}%</p>
                <p><b>LATENCIA NEURAL MEDIA:</b> ${this.telemetry.averageLatency.toFixed(3)}s</p>
                <p style="font-size:11px; margin-top:15px;">
                    <b>NOTA DEL ASESOR:</b> El operador ha completado los 10 minutos de acondicionamiento. 
                    Nivel de excelencia alcanzado. Apto para despliegue operacional.
                </p>
                <button class="btn-tactical" style="width:100%" onclick="MaykaMiEngine.renderModuleSelector()">REINICIAR SISTEMA</button>
            </div>
        `;
    },

    startTelemetryLoop() {
        setInterval(() => {
            if (window.updateHUD) {
                window.updateHUD({
                    pulseSim: (60 + Math.random() * 10).toFixed(0),
                    cognitiveLoad: this.adaptiveState.vagalTone,
                    roeCompliance: this.telemetry.decisionAccuracy.length > 0 ? 
                        ((this.telemetry.decisionAccuracy.filter(x => x).length / this.telemetry.decisionAccuracy.length) * 100).toFixed(0) : 100,
                    microTremor: this.telemetry.averageLatency * 0.08
                });
            }
        }, 2000);
    }
};

document.addEventListener("DOMContentLoaded", () => MaykaMiEngine.init());
