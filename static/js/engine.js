/**
 * ABRS - ADAPTIVE BREATHING REGULATION SYSTEM
 * MaykaMi Neuro-Engine Framework
 * Focus: Neurophysiological Stabilization & Executive Function Restoration
 */

const MaykaMiEngine = {
    missionData: null,
    currentStepIndex: 0,
    sessionScores: [],
    totalSteps: 10,
    
    voice: {
        synth: window.speechSynthesis,
        rate: 0.85, // Tono serio y pausado
        pitch: 0.9,
        lang: 'en-US'
    },

    async init() {
        try {
            const res = await fetch('/api/missions');
            const data = await res.json();
            this.missionData = this.shuffle([...data.missions]);
            this.startSession();
        } catch (e) {
            console.error("LINK FAILURE:", e);
        }
    },

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    startSession() {
        this.currentStepIndex = 0;
        this.sessionScores = [];
        
        const introText = "Initializing Adaptive Breathing Regulation System. Counteracting cortisol escalation and amygdala overactivation. Target: Restoration of executive function.";
        this.speak(introText);
        
        // Explicación técnica inicial antes del primer ciclo
        this.renderTechnicalOverlay("NEURO-STABILIZATION", introText);
        
        setTimeout(() => this.runABRS(22), 4000); // 4 segundos de lectura técnica antes de iniciar
    },

    renderTechnicalOverlay(title, description) {
        const container = document.getElementById("app");
        container.innerHTML = `
            <div class="card" style="border-color: var(--primary); background: rgba(0, 212, 255, 0.05);">
                <h2 style="color: var(--primary); font-family: monospace;">[ ${title} ]</h2>
                <p style="font-size: 14px; line-height: 1.6; text-align: justify; color: #aaa;">${description}</p>
                <div class="loading-bar-container"><div class="loading-bar"></div></div>
            </div>
        `;
    },

    /**
     * ABRS CORE: Sincronía matemática 11s (Inhale 5.5s / Exhale 5.5s)
     */
    runABRS(durationSeconds) {
        let timeLeft = durationSeconds;
        const container = document.getElementById("app");
        
        container.innerHTML = `
            <div class="card" style="background:transparent; border:none; box-shadow:none;">
                <div class="breath-container">
                    <div id="visual-circle" class="breath-circle"></div>
                    <div class="breath-instruction">
                        <div id="neuro-stat" style="font-size: 10px; color: var(--success); font-family: monospace; margin-bottom: 10px;">AUTONOMIC REGULATION: ACTIVE</div>
                        <h1 id="breath-label" style="font-size: 3rem; margin: 0; font-weight: 800;">PREPARING</h1>
                        <p id="breath-timer" style="color: var(--primary); font-family: monospace; font-size: 1.8rem; margin: 5px 0;"></p>
                        <div id="phase-desc" style="font-size: 11px; opacity: 0.6; max-width: 200px; margin: 0 auto;">Stabilizing Executive Processing...</div>
                    </div>
                </div>
            </div>
        `;

        const circle = document.getElementById("visual-circle");
        const label = document.getElementById("breath-label");
        const timerDisplay = document.getElementById("breath-timer");
        const phaseDesc = document.getElementById("phase-desc");

        const updateCycle = () => {
            // El ciclo es de 11 segundos: 0-5.5 IN, 5.5-11 OUT
            const cyclePos = (durationSeconds - timeLeft) % 11;

            if (cyclePos < 5.5) {
                // FASE INHALACIÓN
                label.innerText = "INHALE";
                label.style.color = "var(--success)";
                phaseDesc.innerText = "Counteracting Cognitive Fragmentation";
                circle.style.transition = "transform 5.5s linear, border-color 0.5s";
                circle.style.transform = "scale(1.5)";
                circle.style.borderColor = "var(--success)";
                circle.style.boxShadow = "0 0 60px rgba(0, 255, 136, 0.4)";
                if (cyclePos === 0) this.speak("Inhale. Stabilize core rhythm.");
            } else {
                // FASE EXHALACIÓN
                label.innerText = "EXHALE";
                label.style.color = "var(--primary)";
                phaseDesc.innerText = "Reducing Sympathetic Overactivation";
                circle.style.transition = "transform 5.5s linear, border-color 0.5s";
                circle.style.transform = "scale(0.5)";
                circle.style.borderColor = "var(--primary)";
                circle.style.boxShadow = "0 0 30px rgba(0, 212, 255, 0.2)";
                if (cyclePos === 5.5 || (cyclePos > 5.4 && cyclePos < 5.6)) this.speak("Exhale. Purge cortisol.");
            }

            timerDisplay.innerText = `${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(breathingInterval);
                this.renderAssessment();
            }
            timeLeft--;
        };

        const breathingInterval = setInterval(updateCycle, 1000);
        updateCycle();
    },

    renderAssessment() {
        const domain = this.missionData[this.currentStepIndex];
        const scenario = domain.scenarios[Math.floor(Math.random() * domain.scenarios.length)];
        const shuffledOptions = this.shuffle([...scenario.options]);

        const container = document.getElementById("app");
        container.innerHTML = `
            <div class="card" style="animation: scanline 0.1s infinite;">
                <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--primary); margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 5px;">
                    <span>DOMAIN 0${this.currentStepIndex + 1}: ${domain.focus}</span>
                    <span>OP-READY: CALIBRATED</span>
                </div>
                <h2 style="margin-bottom: 30px; line-height: 1.3; font-weight: 500; text-align: left;">${scenario.q}</h2>
                <div id="options-grid">
                    ${shuffledOptions.map((opt, i) => `
                        <button class="btn-tactical" onclick="MaykaMiEngine.processDecision(${opt.pts})">
                            <span style="opacity: 0.5; margin-right: 10px;">[OP-${i+1}]</span> ${opt.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        this.speak(scenario.q);
        
        if (window.updateHUD) {
            window.updateHUD({
                pulseSim: Math.floor(Math.random() * (75 - 62) + 62),
                cognitiveLoad: (this.currentStepIndex + 1) * 10,
                roeCompliance: 100,
                microTremor: "0.001"
            });
        }
    },

    processDecision(points) {
        this.sessionScores.push(points);
        
        if (points === 3) this.speak("Integrity maintained.");
        else if (points === 0) this.speak("Neural degradation detected.");
        else this.speak("Decision validated.");

        this.currentStepIndex++;

        if (this.currentStepIndex < this.totalSteps) {
            // Breve reporte de por qué hacemos el siguiente ciclo
            this.renderTechnicalOverlay("RECOVERY PHASE", "Restoring situational awareness and tactical judgment for the next domain exposure.");
            setTimeout(() => this.runABRS(11), 3000); 
        } else {
            this.finishSession();
        }
    },

    async finishSession() {
        this.speak("Protocol complete. Generating post-event decompression report.");
        
        const finalData = {
            scores: this.sessionScores,
            average: this.sessionScores.reduce((a, b) => a + b, 0) / this.totalSteps
        };

        try {
            const res = await fetch('/api/state', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(finalData)
            });
            const result = await res.json();
            this.renderFinalUI(result.download_url, finalData.average);
        } catch (e) {
            console.error("REPORT ERROR");
        }
    },

    renderFinalUI(downloadUrl, avg) {
        const container = document.getElementById("app");
        const performance = avg >= 2.5 ? "ELITE / OPERATIONAL" : avg >= 1.5 ? "RELIABLE" : "UNSTABLE / RE-TRAIN";
        
        container.innerHTML = `
            <div class="card">
                <h1 style="color: var(--success); font-family: monospace;">READINESS: ${performance}</h1>
                <p style="opacity: 0.7;">NEURAL DEGRADATION MINIMIZED: ${(avg * 33.3).toFixed(2)}%</p>
                <div style="margin: 30px 0;">
                    <button class="btn-tactical" style="text-align:center; background: var(--primary); color: #000;" onclick="window.location.href='${downloadUrl}'">
                        DOWNLOAD READINESS REPORT (PDF)
                    </button>
                </div>
                <button class="btn-tactical" style="text-align:center;" onclick="location.reload()">RE-INITIALIZE ABRS</button>
            </div>
        `;
    },

    speak(txt) {
        this.voice.synth.cancel();
        const u = new SpeechSynthesisUtterance(txt);
        u.lang = this.voice.lang;
        u.rate = this.voice.rate;
        u.pitch = this.voice.pitch;
        this.voice.synth.speak(u);
    }
};
