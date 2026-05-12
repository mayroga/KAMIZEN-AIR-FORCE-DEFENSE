/**
 * ABRS - ADAPTIVE BREATHING REGULATION SYSTEM
 * STATUS: OPERATIONAL / NEURO-STABILIZATION LAYER
 */

const MaykaMiEngine = {
    missionData: null,
    currentStepIndex: 0,
    sessionScores: [],
    totalSteps: 10,
    
    voice: {
        synth: window.speechSynthesis,
        rate: 0.9,
        pitch: 0.85, // Voz más grave y autoritaria
        lang: 'en-US'
    },

    // Definición del Ciclo Operacional (11s)
    cycle: {
        inhale: 5.5,
        exhale: 5.5,
        total: 11
    },

    async init() {
        // Explicación técnica antes de iniciar (El "Para qué sirve")
        this.renderTechnicalManifesto();
    },

    renderTechnicalManifesto() {
        const container = document.getElementById("app");
        container.innerHTML = `
            <div class="card tactical-border">
                <h3 style="color:var(--primary); margin-top:0;">ABRS PROTOCOL ACTIVATION</h3>
                <p style="font-size:0.85rem; text-align:justify; line-height:1.4; color:#aaa;">
                    The <strong>Adaptive Breathing Regulation System (ABRS)</strong> functions as a neurophysiological stabilization layer. 
                    It synchronizes visual respiratory guidance with controlled parasympathetic activation to counteract 
                    <strong>cortisol escalation, amygdala overactivation, and cognitive fragmentation</strong>. 
                </p>
                <p style="font-size:0.8rem; border-left: 2px solid var(--primary); padding-left:10px; font-style:italic;">
                    Objective: Preservation of tactical judgment and ROE compliance under sensory overload.
                </p>
                <button class="btn-tactical" onclick="MaykaMiEngine.startSequence()">ENGAGE NEURAL STABILIZATION</button>
            </div>
        `;
    },

    async startSequence() {
        try {
            const res = await fetch('/api/missions');
            const data = await res.json();
            this.missionData = this.shuffle([...data.missions]);
            this.startSession();
        } catch (e) { console.error("LINK LOSS"); }
    },

    startSession() {
        this.currentStepIndex = 0;
        this.sessionScores = [];
        this.runScientificBreathing(22); // Calibración inicial: 2 ciclos completos
    },

    runScientificBreathing(durationSeconds) {
        let timeLeft = durationSeconds;
        const container = document.getElementById("app");
        
        container.innerHTML = `
            <div class="card" style="background:transparent; border:none; box-shadow:none;">
                <div class="breath-container">
                    <div id="visual-circle" class="breath-circle"></div>
                    <div class="breath-instruction">
                        <h2 id="breath-label" style="letter-spacing:5px;">INITIALIZING</h2>
                        <div id="phase-bar-container" style="width:100px; height:4px; background:#222; margin:10px auto;">
                            <div id="phase-bar" style="width:0%; height:100%; background:var(--primary); transition: width 0.1s linear;"></div>
                        </div>
                        <p id="breath-timer" style="font-family:monospace; opacity:0.6;"></p>
                    </div>
                </div>
                <p id="technical-status" style="font-size:10px; color:var(--primary); margin-top:20px;">CALIBRATING VAGAL TONE...</p>
            </div>
        `;

        const circle = document.getElementById("visual-circle");
        const label = document.getElementById("breath-label");
        const bar = document.getElementById("phase-bar");

        // SINCRONIZACIÓN MILIMÉTRICA CON REQUESTANIMATIONFRAME
        let startTime = null;
        const update = (timestamp) => {
            if (!startTime) startTime = timestamp;
            let elapsed = (timestamp - startTime) / 1000;
            let remaining = durationSeconds - elapsed;
            
            if (remaining <= 0) {
                cancelAnimationFrame(this.rafId);
                this.renderAssessment();
                return;
            }

            let cyclePos = elapsed % this.cycle.total;
            let progress;

            if (cyclePos < this.cycle.inhale) {
                // FASE INHALAR
                progress = cyclePos / this.cycle.inhale;
                label.innerText = "EXPAND / INHALE";
                circle.style.transform = `scale(${1 + (progress * 0.6)})`;
                circle.style.borderColor = "var(--success)";
                bar.style.width = `${progress * 100}%`;
                bar.style.backgroundColor = "var(--success)";
                if (Math.abs(cyclePos) < 0.05) this.speak("Inhale. Stabilize core.");
            } else {
                // FASE EXHALAR
                progress = (cyclePos - this.cycle.inhale) / this.cycle.exhale;
                label.innerText = "CONTRACT / EXHALE";
                circle.style.transform = `scale(${1.6 - (progress * 1.0)})`;
                circle.style.borderColor = "var(--primary)";
                bar.style.width = `${(1 - progress) * 100}%`;
                bar.style.backgroundColor = "var(--primary)";
                if (Math.abs(cyclePos - 5.5) < 0.05) this.speak("Exhale. Release CO2.");
            }

            document.getElementById("breath-timer").innerText = `SEC: ${remaining.toFixed(1)}`;
            this.rafId = requestAnimationFrame(update);
        };

        this.rafId = requestAnimationFrame(update);
    },

    renderAssessment() {
        const domain = this.missionData[this.currentStepIndex];
        const scenario = domain.scenarios[Math.floor(Math.random() * domain.scenarios.length)];
        const shuffledOptions = this.shuffle([...scenario.options]);

        const container = document.getElementById("app");
        container.innerHTML = `
            <div class="card tactical-border">
                <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--primary); margin-bottom:20px;">
                    <span>DOMAIN: ${domain.focus}</span>
                    <span>OP-REF: 0${this.currentStepIndex + 1}</span>
                </div>
                <h2 style="text-align:left; font-size:1.4rem; line-height:1.3; margin-bottom:30px;">${scenario.q}</h2>
                <div id="options-grid">
                    ${shuffledOptions.map(opt => `
                        <button class="btn-tactical" onclick="MaykaMiEngine.processDecision(${opt.pts})">
                            ${opt.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        this.speak(scenario.q);
    },

    processDecision(points) {
        this.sessionScores.push(points);
        this.currentStepIndex++;

        if (this.currentStepIndex < this.totalSteps) {
            this.runScientificBreathing(11); // Un ciclo de reset entre decisiones
        } else {
            this.finishSession();
        }
    },

    finishSession() {
        this.speak("Assessment concluded. Generating neural integrity report.");
        // (Lógica de envío de datos al servidor similar a la anterior)
    },

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    speak(txt) {
        this.voice.synth.cancel();
        const u = new SpeechSynthesisUtterance(txt);
        u.rate = this.voice.rate;
        u.pitch = this.voice.pitch;
        u.lang = this.voice.lang;
        this.voice.synth.speak(u);
    }
};
