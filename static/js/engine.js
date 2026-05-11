const KamizenEngine = {
    currentMissionIndex: 0,
    currentStepIndex: 0,
    missionData: null,
    currentStepStart: 0,

    // 🔥 ADAPTIVE CORE STATE
    adaptiveState: {
        stressLevel: 1,
        difficultyMultiplier: 1,
        reactionBaseline: [],
        failureCount: 0,
        successStreak: 0
    },

    // 📡 LIVE TELEMETRY BUFFER
    telemetry: {
        reactionTime: 0,
        decisionLatency: 0,
        stressIndex: 0,
        cognitiveLoad: 0,
        roeCompliance: 100,
        hesitationIndex: 0,
        focusStability: 100
    },

    sessionLog: [],

    async init() {
        console.log("ENGINE: INICIALIZANDO...");
        try {
            // Corregido: El archivo está en la raíz, se accede vía API
            const res = await fetch('/api/missions');
            this.missionData = await res.json();
            
            console.log("ENGINE: DATOS CARGADOS", this.missionData);
            this.updateHUD();
            this.startTelemetryLoop();
        } catch (e) {
            console.error("ENGINE INIT FAILED", e);
            document.getElementById("app").innerHTML = `<div class="card" style="color:red">ERROR DE CARGA: JSON NO ENCONTRADO</div>`;
        }
    },

    // =========================
    // 🚀 MISSION CONTROL
    // =========================
    startMission(id) {
        console.log(`ENGINE: INICIANDO MISIÓN ${id}`);
        if (!this.missionData) {
            console.error("NO HAY DATOS DE MISIÓN");
            return;
        }

        this.currentMissionIndex = this.missionData.missions.findIndex(m => m.id === id);
        this.currentStepIndex = 0;
        this.logEvent("MISSION_START", { id });
        this.executeStep();
    },

    executeStep() {
        const mission = this.missionData.missions[this.currentMissionIndex];
        if (!mission) return;

        const step = mission.b[this.currentStepIndex];
        console.log("ENGINE: EJECUTANDO PASO", step);

        if (!step) {
            this.completeMission();
            return;
        }

        switch (step.t) {
            case 'v': // Título / Texto
                this.renderText(step.tx.en);
                break;
            case 'breath_auto':
                this.runBreathing(step);
                break;
            case 'd': // Decisión
                this.renderDecision(step);
                break;
            case 'sil': // Silencio / Pausa
                this.runSilence(step);
                break;
            case 'r': // Resultado
                this.showResult(step);
                break;
            default:
                this.nextStep();
        }
    },

    nextStep() {
        this.currentStepIndex++;
        this.executeStep();
    },

    // =========================
    // 🎯 VISUAL RENDERING
    // =========================
    renderText(text) {
        const container = document.getElementById("app");
        container.innerHTML = `
            <div class="card">
                <h2 class="blink" style="color:var(--primary)">SISTEMA ACTIVO</h2>
                <p style="font-size:1.5em; letter-spacing:2px;">${text}</p>
                <button class="btn-tactical" onclick="KamizenEngine.nextStep()">CONTINUAR</button>
            </div>
        `;
    },

    renderDecision(step) {
        const container = document.getElementById("app");
        this.currentStepStart = performance.now();

        container.innerHTML = `
            <div class="card">
                <h3 style="color:var(--primary)">TACTICAL ASSESSMENT</h3>
                <p style="font-size:1.2em; margin-bottom:30px;">${step.q.en}</p>
                <div id="options-grid">
                    ${step.op.map((opt, i) => `
                        <button class="btn-tactical" style="width:100%; margin:5px 0; text-align:left;" 
                                onclick="KamizenEngine.processDecision(${i}, ${step.c}, '${step.ex ? step.ex[0] : ''}')">
                            > ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    },

    processDecision(choice, correct, explanation) {
        const latency = performance.now() - this.currentStepStart;
        const success = choice === correct;

        // 🔥 ADAPTIVE STRESS LOGIC
        if (success) {
            this.adaptiveState.successStreak++;
            this.telemetry.roeCompliance = Math.min(100, this.telemetry.roeCompliance + 2);
        } else {
            this.adaptiveState.failureCount++;
            this.adaptiveState.stressLevel += 0.5;
            this.telemetry.roeCompliance = Math.max(0, this.telemetry.roeCompliance - 10);
            this.telemetry.hesitationIndex += 5;
        }

        this.telemetry.reactionTime = latency;
        this.telemetry.cognitiveLoad = Math.min(100, (latency / 100) * this.adaptiveState.stressLevel);

        this.logEvent("DECISION", { success, latency });

        // Feedback rápido y siguiente
        const container = document.getElementById("app");
        container.innerHTML = `
            <div class="card">
                <h2 style="color:${success ? 'var(--success)' : 'var(--danger)'}">
                    ${success ? 'ACEPTABLE' : 'CRÍTICO'}
                </h2>
                <p>${explanation || ''}</p>
            </div>
        `;

        setTimeout(() => this.nextStep(), 1500);
    },

    runBreathing(step) {
        let t = step.d;
        const el = document.getElementById("app");
        
        const interval = setInterval(() => {
            el.innerHTML = `
                <div class="card">
                    <h3 style="color:var(--primary)">${step.tx.en}</h3>
                    <div class="breath-circle pulse">
                        <h2 style="font-size:3em; margin:0;">${t}s</h2>
                    </div>
                    <p style="font-size:0.8em; opacity:0.7;">MANTÉN EL ENFOQUE TÁCTICO</p>
                </div>
            `;
            
            if (t-- <= 0) {
                clearInterval(interval);
                this.nextStep();
            }
        }, 1000);
    },

    runSilence(step) {
        document.getElementById("app").innerHTML = `<div class="card"><p class="blink">PROCESANDO...</p></div>`;
        setTimeout(() => this.nextStep(), step.d * 1000);
    },

    showResult(step) {
        document.getElementById("app").innerHTML = `
            <div class="card">
                <h2 style="color:var(--success)">MISIÓN COMPLETADA</h2>
                <p>PUNTUACIÓN DE ASESORÍA: +${step.p}</p>
                <button class="btn-tactical" onclick="location.reload()">REINICIAR TERMINAL</button>
            </div>
        `;
        this.logEvent("RESULT", step);
    },

    completeMission() {
        this.showResult({ p: this.telemetry.roeCompliance, tx: "FINALIZADO" });
    },

    // =========================
    // 📡 TELEMETRY LOOP
    // =========================
    updateHUD() {
        if (window.updateHUD) {
            window.updateHUD({
                pulseSim: 60 + (this.adaptiveState.stressLevel * 10),
                microTremor: this.telemetry.hesitationIndex,
                roeCompliance: this.telemetry.roeCompliance,
                cognitiveLoad: this.telemetry.cognitiveLoad
            });
        }
    },

    startTelemetryLoop() {
        setInterval(() => {
            this.updateHUD();
            // Simular jitter de sistema
            this.telemetry.focusStability = Math.max(0, 100 - (Math.random() * 5));
        }, 1000);
    },

    logEvent(type, data) {
        this.sessionLog.push({ t: Date.now(), type, data });
    }
};

document.addEventListener("DOMContentLoaded", () => KamizenEngine.init());
