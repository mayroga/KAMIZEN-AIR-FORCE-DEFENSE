const KamizenEngine = {
    currentMissionIndex: 0,
    currentStepIndex: 0,
    missionData: null,
    currentStepStart: 0,
    isTrainingActive: false,

    // 🔥 NEURO-ADAPTIVE STATE (Simulates VR input learning)
    adaptiveState: {
        stressLevel: 1.0,
        baselineJitter: 0.15,
        cognitiveFatigue: 0,
        excellenceThreshold: 95, // Required for "Excellence"
    },

    // 📡 BIO-TELEMETRY (Pre-VR Simulated Sensors)
    telemetry: {
        preSessionBalance: 65,
        liveFocus: 0,
        postSessionReadiness: 0,
        decisionAccuracy: [],
        averageLatency: 0
    },

    async init() {
        try {
            const res = await fetch('/api/missions');
            this.missionData = await res.json();
            this.renderModuleSelector();
            this.startTelemetryLoop();
        } catch (e) {
            console.error("CRITICAL: SYSTEM OFFLINE", e);
        }
    },

    // =========================
    // 🎛️ SUPERVISOR CONTROL PANEL
    // =========================
    renderModuleSelector() {
        const container = document.getElementById("app");
        let html = `
            <div class="card" style="max-width:800px">
                <h2 style="color:var(--primary)">TACTICAL MODULE SELECTOR</h2>
                <p style="font-size:11px; margin-bottom:20px;">SUPERVISOR ACCESS: SELECT TARGET COGNITIVE DOMAIN</p>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
        `;

        this.missionData.missions.forEach((m, index) => {
            html += `
                <button class="btn-tactical" style="font-size:12px; text-align:left;" onclick="KamizenEngine.startMissionByIndex(${index})">
                    MOD ${String(index + 1).padStart(2, '0')}: ${m.id} 
                    <span style="display:block; font-size:9px; color:var(--success)">FOCUS: ${this.getScientificFocus(index)}</span>
                </button>
            `;
        });

        html += `</div></div>`;
        container.innerHTML = html;
    },

    getScientificFocus(index) {
        const focuses = [
            "VAGAL TONE & RESPIRATORY CONTROL",
            "PREFRONTAL CORTEX ACTIVATION",
            "ROE AMBIGUITY RESOLUTION",
            "STRESS-INDUCED JITTER MITIGATION",
            "SITUATIONAL AWARENESS LATENCY",
            "COGNITIVE LOAD SHIFTING",
            "MOTOR-NEURON STABILIZATION",
            "HEMISPHERIC SYNCHRONIZATION",
            "PERIPHERAL VISION RETENTION",
            "EXECUTIVE DECISION EXCELLENCE"
        ];
        return focuses[index] || "GENERAL TACTICAL PREP";
    },

    // =========================
    // 🚀 TRAINING EXECUTION
    // =========================
    startMissionByIndex(index) {
        this.currentMissionIndex = index;
        this.currentStepIndex = 0;
        this.isTrainingActive = true;
        this.telemetry.preSessionBalance = 60 + Math.random() * 10;
        this.executeStep();
    },

    executeStep() {
        const mission = this.missionData.missions[this.currentMissionIndex];
        const step = mission.b[this.currentStepIndex];

        if (!step) {
            this.autoAdvanceOrComplete();
            return;
        }

        switch (step.t) {
            case 'v': this.renderPhaseInfo(step.tx.en); break;
            case 'breath_auto': this.runBreathing(step); break;
            case 'd': this.renderAssessment(step); break;
            case 'r': this.showPhaseResult(step); break;
            default: this.nextStep();
        }
    },

    renderPhaseInfo(text) {
        const container = document.getElementById("app");
        container.innerHTML = `
            <div class="card">
                <h3 style="color:var(--primary)">PHASE ${this.currentStepIndex + 1}</h3>
                <p style="font-size:1.4em;">${text}</p>
                <p style="font-size:0.8em; color:var(--success)">WORKING ON: ${this.getScientificFocus(this.currentMissionIndex)}</p>
                <button class="btn-tactical" onclick="KamizenEngine.nextStep()">ENGAGE</button>
            </div>
        `;
    },

    renderAssessment(step) {
        const container = document.getElementById("app");
        this.currentStepStart = performance.now();
        container.innerHTML = `
            <div class="card">
                <p style="color:var(--danger); font-size:10px;">LIVE DECISION ASSESSMENT</p>
                <p style="font-size:1.2em;">${step.q.en}</p>
                <div id="options-grid">
                    ${step.op.map((opt, i) => `
                        <button class="btn-tactical" onclick="KamizenEngine.processDecision(${i}, ${step.c})">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    },

    processDecision(choice, correct) {
        const latency = (performance.now() - this.currentStepStart) / 1000;
        const isCorrect = choice === correct;
        
        this.telemetry.decisionAccuracy.push(isCorrect);
        this.telemetry.averageLatency = (this.telemetry.averageLatency + latency) / 2;

        const container = document.getElementById("app");
        container.innerHTML = `
            <div class="card">
                <h2 style="color:${isCorrect ? 'var(--success)' : 'var(--danger)'}">
                    ${isCorrect ? 'TARGET NEUTRALIZED' : 'PROTOCOL VIOLATION'}
                </h2>
                <p>LATENCY: ${latency.toFixed(2)}s</p>
            </div>
        `;
        setTimeout(() => this.nextStep(), 1200);
    },

    runBreathing(step) {
        let t = step.d;
        const el = document.getElementById("app");
        const interval = setInterval(() => {
            el.innerHTML = `
                <div class="card">
                    <h3 style="color:var(--primary)">COHERECE TRAINING</h3>
                    <div class="breath-circle pulse" style="border-width:${4 + (Math.random()*2)}px">
                        <h2>${t}s</h2>
                    </div>
                    <p>STABILIZING VAGAL TONE...</p>
                </div>
            `;
            if (t-- <= 0) { clearInterval(interval); this.nextStep(); }
        }, 1000);
    },

    nextStep() {
        this.currentStepIndex++;
        this.executeStep();
    },

    autoAdvanceOrComplete() {
        // Logica de progresión automática (1 -> 10 -> 1)
        this.currentMissionIndex++;
        if (this.currentMissionIndex >= this.missionData.missions.length) {
            this.currentMissionIndex = 0;
            this.renderFinalReport();
        } else {
            this.currentStepIndex = 0;
            this.executeStep();
        }
    },

    renderFinalReport() {
        const acc = (this.telemetry.decisionAccuracy.filter(x => x).length / this.telemetry.decisionAccuracy.length) * 100;
        this.telemetry.postSessionReadiness = acc - (this.telemetry.averageLatency * 5);

        document.getElementById("app").innerHTML = `
            <div class="card" style="text-align:left">
                <h2 style="color:var(--primary); text-align:center;">TACTICAL READINESS REPORT</h2>
                <hr style="border:0; border-top:1px solid #333">
                <p><b>PRE-SESSION BALANCE:</b> ${this.telemetry.preSessionBalance.toFixed(1)}%</p>
                <p><b>DECISION ACCURACY:</b> ${acc.toFixed(1)}%</p>
                <p><b>AVG RESPONSE TIME:</b> ${this.telemetry.averageLatency.toFixed(2)}s</p>
                <p><b>POST-SESSION READINESS:</b> <span style="color:var(--success)">${this.telemetry.postSessionReadiness.toFixed(1)}%</span></p>
                <hr style="border:0; border-top:1px solid #333">
                <p style="font-size:12px;"><b>SPECIALIST ANALYSIS:</b> Client has achieved 
                ${acc > 90 ? 'OPTIMAL EXCELLENCE. Ready for High-Stress VR Combat.' : 'MARGINAL STABILITY. Recommend Module 04 re-training.'}</p>
                <button class="btn-tactical" style="width:100%" onclick="KamizenEngine.renderModuleSelector()">RETURN TO HUD</button>
            </div>
        `;
    },

    startTelemetryLoop() {
        setInterval(() => {
            if (window.updateHUD) {
                window.updateHUD({
                    pulseSim: 65 + (Math.random() * 15),
                    microTremor: this.telemetry.averageLatency * 10,
                    roeCompliance: this.telemetry.decisionAccuracy.length > 0 ? 
                        (this.telemetry.decisionAccuracy.filter(x => x).length / this.telemetry.decisionAccuracy.length) * 100 : 100,
                    cognitiveLoad: 40 + (Math.random() * 20)
                });
            }
        }, 2000);
    }
};

document.addEventListener("DOMContentLoaded", () => KamizenEngine.init());
