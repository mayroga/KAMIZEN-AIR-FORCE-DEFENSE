/**
 * KAMIZEN TACTICAL ENGINE - "AURA BY MAY ROGA"
 * Specialized in AIAT, DOT, CBP, and Avianca Cargo Protocol.
 * Scientific Neuro-Priming System (Pre-VR)
 */

const KamizenEngine = {
    currentMissionIndex: 0,
    currentStepIndex: 0,
    missionData: null,
    currentStepStart: 0,
    isTrainingActive: false,

    // 🧠 NEURO-SCALABILITY (Learning from the client)
    adaptiveState: {
        vagalTone: 60,
        excellenceScore: 0,
        stressResistance: 1.0,
        totalSuccesses: 0,
        totalFailures: 0
    },

    // 📡 SIMULATED SENSORS (For Scalable Learning)
    telemetry: {
        preSessionBalance: 0,
        postSessionReadiness: 0,
        averageLatency: 0,
        decisionAccuracy: [],
    },

    // 🗣️ MASTER VOICE CONFIGURATION
    voice: {
        synth: window.speechSynthesis,
        isSpeaking: false,
        pitch: 0.9, // Professional and deep
        rate: 0.85  // Calm and guiding
    },

    async init() {
        console.log("AL CIELO TERMINAL: READY.");
        try {
            const res = await fetch('/api/missions');
            this.missionData = await res.json();
            
            // Baseline before training
            this.telemetry.preSessionBalance = 55 + Math.random() * 15;
            this.renderModuleSelector();
            this.startTelemetryLoop();
            
            this.speak("System initialized. Welcome to Kamizen Tactical. Please select your training module to begin neuro-priming.");
        } catch (e) {
            console.error("DATA ERROR:", e);
        }
    },

    // ==========================================
    // 🗣️ THE MASTER VOICE (Neural Synthesis)
    // ==========================================
    speak(text) {
        if (this.voice.synth.speaking) this.voice.synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.pitch = this.voice.pitch;
        utterance.rate = this.voice.rate;
        this.voice.synth.speak(utterance);
    },

    // ==========================================
    // 🎛️ SUPERVISOR MODULE SELECTOR
    // ==========================================
    renderModuleSelector() {
        const container = document.getElementById("app");
        let html = `
            <div class="card" style="max-width:850px;">
                <h2 style="color:var(--primary); margin-bottom:5px;">TACTICAL MODULE SELECTOR</h2>
                <p style="font-size:10px; margin-bottom:20px; opacity:0.8;">SUPERVISOR ACCESS - 10 NEURAL DOMAINS AVAILABLE</p>
                <div id="options-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
        `;

        this.missionData.missions.forEach((m, index) => {
            html += `
                <button class="btn-tactical" style="text-align:left; font-size:11px;" onclick="KamizenEngine.startMissionByIndex(${index})">
                    <span style="color:var(--primary)">[MOD ${index + 1}]</span> ${m.id}
                    <span style="display:block; font-size:9px; color:var(--success); margin-top:4px;">FOCUS: ${this.getScientificFocus(index)}</span>
                </button>
            `;
        });

        html += `</div></div>`;
        container.innerHTML = html;
    },

    getScientificFocus(index) {
        const focuses = [
            "COHERENCE & VAGAL TONE", "PREFRONTAL CORTEX STIM", "ROE JUDGMENT ACCURACY",
            "MICRO-TREMOR SUPPRESSION", "SITUATIONAL LATENCY", "COGNITIVE LOAD SHIFTING",
            "MOTOR-NEURON STABILITY", "SYNAPTIC SYNCHRONIZATION", "VISUAL FIELD RETENTION",
            "EXECUTIVE DECISION EXCELLENCE"
        ];
        return focuses[index] || "NEURAL CONDITIONING";
    },

    // ==========================================
    // 🚀 MISSION LOGIC (1 -> 10 -> 1)
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
            case 'v': this.renderPhaseText(step.tx.en); break;
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
                <h3 style="color:var(--primary)">MODULE ${this.currentMissionIndex + 1}</h3>
                <p style="font-size:1.5em; line-height:1.4;">${text}</p>
                <button class="btn-tactical" onclick="KamizenEngine.nextStep()">CONTINUE</button>
            </div>
        `;
        this.speak(text);
    },

    // ==========================================
    // 🌬️ SCIENTIFIC BREATHING (11s Cycle)
    // ==========================================
    runScientificBreathing(step) {
        let timeLeft = step.d; 
        const container = document.getElementById("app");
        this.speak("Synchronize your breathing with the circle. Inhale as it expands, exhale as it contracts. Stabilize your vagal tone.");

        const interval = setInterval(() => {
            const isExhaling = (timeLeft % 11) < 5.5;
            const instruction = isExhaling ? "EXHALE" : "INHALE";
            
            container.innerHTML = `
                <div class="card">
                    <h3>NEURAL SYNC: ${this.getScientificFocus(this.currentMissionIndex)}</h3>
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
        this.speak(step.q.en);

        container.innerHTML = `
            <div class="card">
                <p style="color:var(--danger); font-size:10px;">ASSESSING CLIENT DECISION PATTERN...</p>
                <p style="font-size:1.3em; margin:20px 0;">${step.q.en}</p>
                <div id="options-grid">
                    ${step.op.map((opt, i) => `
                        <button class="btn-tactical" style="width:100%; text-align:left;" onclick="KamizenEngine.processDecision(${i}, ${step.c})">
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
        
        // System Learns and Scales
        if (success) {
            this.adaptiveState.vagalTone += 2;
            this.speak("Correct choice. Tactical efficiency improved.");
        } else {
            this.adaptiveState.vagalTone -= 5;
            this.speak("Incorrect. Analyze your hesitation index.");
        }

        const container = document.getElementById("app");
        container.innerHTML = `
            <div class="card">
                <h2 style="color:${success ? 'var(--success)' : 'var(--danger)'}">
                    ${success ? 'PROTOCOL MET' : 'PROTOCOL BREACH'}
                </h2>
                <p>LATENCY: ${latency.toFixed(3)}s</p>
            </div>
        `;
        setTimeout(() => this.nextStep(), 1500);
    },

    showPhaseResult(step) {
        this.speak("Phase complete. Storing data for VR simulation.");
        document.getElementById("app").innerHTML = `
            <div class="card">
                <h2 style="color:var(--success)">DATA ACQUIRED</h2>
                <p>COGNITIVE GAIN: +${step.p} PTS</p>
                <button class="btn-tactical" onclick="KamizenEngine.nextStep()">NEXT PHASE</button>
            </div>
        `;
    },

    nextStep() {
        this.currentStepIndex++;
        this.executeStep();
    },

    handleProgression() {
        this.currentMissionIndex++;
        // Circular Logic: After 10, back to 1
        if (this.currentMissionIndex >= this.missionData.missions.length) {
            this.currentMissionIndex = 0;
            this.renderFinalReport();
        } else {
            this.currentStepIndex = 0;
            this.executeStep();
        }
    },

    // ==========================================
    // 📊 THE SPECIALIST REPORT (Before/During/After)
    // ==========================================
    renderFinalReport() {
        const acc = (this.telemetry.decisionAccuracy.filter(x => x).length / this.telemetry.decisionAccuracy.length) * 100;
        this.telemetry.postSessionReadiness = Math.min(100, acc - (this.telemetry.averageLatency * 3));
        
        this.speak("Full cycle complete. Your tactical readiness has been analyzed. Results are ready for supervisor review.");

        document.getElementById("app").innerHTML = `
            <div class="card" style="text-align:left">
                <h2 style="color:var(--primary); text-align:center;">SPECIALIST ANALYSIS</h2>
                <hr style="border-color:#333">
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                    <div>
                        <p style="font-size:10px;">PRE-TRAINING</p>
                        <h3>BALANCE: ${this.telemetry.preSessionBalance.toFixed(1)}%</h3>
                    </div>
                    <div>
                        <p style="font-size:10px;">POST-TRAINING</p>
                        <h3 style="color:var(--success)">READY: ${this.telemetry.postSessionReadiness.toFixed(1)}%</h3>
                    </div>
                </div>
                <hr style="border-color:#333">
                <p><b>DECISION ACCURACY:</b> ${acc.toFixed(1)}%</p>
                <p><b>NEURAL LATENCY:</b> ${this.telemetry.averageLatency.toFixed(3)}s</p>
                <p style="font-size:11px; margin-top:15px;">
                    <b>SUPERVISOR NOTE:</b> The client has completed the 15-minute priming. 
                    Target achieved Excellence Level. Ready for VR deployment.
                </p>
                <button class="btn-tactical" style="width:100%" onclick="KamizenEngine.renderModuleSelector()">RESTART SYSTEM</button>
            </div>
        `;
    },

    startTelemetryLoop() {
        setInterval(() => {
            if (window.updateHUD) {
                window.updateHUD({
                    pulseSim: (60 + Math.random() * 10),
                    cognitiveLoad: this.adaptiveState.vagalTone,
                    roeCompliance: this.telemetry.decisionAccuracy.length > 0 ? 
                        ((this.telemetry.decisionAccuracy.filter(x => x).length / this.telemetry.decisionAccuracy.length) * 100).toFixed(0) : 100,
                    microTremor: this.telemetry.averageLatency * 0.1
                });
            }
        }, 2000);
    }
};

document.addEventListener("DOMContentLoaded", () => KamizenEngine.init());
