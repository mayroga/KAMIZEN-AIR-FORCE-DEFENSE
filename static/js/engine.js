/**
 * MAYKAMI NEURO-ENGINE - "AL CIELO"
 * Versión 3.0 - Tactical Synchronization & Anti-Pattern Logic
 * Enfoque: Disciplina Científica, Psicológica y Táctica.
 */

const MaykaMiEngine = {
    missionData: null,
    currentStepIndex: 0,
    sessionScores: [],
    totalSteps: 10, // Los 10 dominios obligatorios
    
    // Configuración de Voz Táctica
    voice: {
        synth: window.speechSynthesis,
        rate: 0.88,
        pitch: 0.95,
        lang: 'en-US'
    },

    async init() {
        try {
            const res = await fetch('/api/missions');
            const data = await res.json();
            
            // ALEATORIEDAD CIENTÍFICA: Mezclar los dominios
            this.missionData = this.shuffle([...data.missions]);
            
            // Limpiar interfaz e iniciar
            this.startSession();
        } catch (e) {
            console.error("CRITICAL SYSTEM ERROR:", e);
            alert("DATA LINK FAILURE. RECHECK SERVER.");
        }
    },

    // Algoritmo de mezcla Fisher-Yates para aleatoriedad total
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
        this.speak("System online. Initializing neural synchronization. Focus on the breathing cycle.");
        this.runScientificBreathing(22); // 2 ciclos de 11s para calibrar
    },

    /**
     * CICLO RESPIRATORIO CIENTÍFICO (11 Segundos)
     * Controla Voz, Círculo y Texto en sincronía absoluta.
     */
    runScientificBreathing(durationSeconds) {
        let timeLeft = durationSeconds;
        const container = document.getElementById("app");
        
        container.innerHTML = `
            <div class="card" style="background:transparent; border:none; box-shadow:none;">
                <div class="breath-container">
                    <div id="visual-circle" class="breath-circle"></div>
                    <div class="breath-instruction">
                        <h1 id="breath-label" style="font-size:3.5rem; margin:0;">SYNC</h1>
                        <p id="breath-timer" style="color:var(--primary); font-family:monospace; font-size:1.5rem;"></p>
                    </div>
                </div>
            </div>
        `;

        const circle = document.getElementById("visual-circle");
        const label = document.getElementById("breath-label");
        const timerDisplay = document.getElementById("breath-timer");

        const updateCycle = () => {
            const cyclePos = timeLeft % 11; // Posición dentro del ciclo de 11s

            // INHALAR: de 11 a 5.6 (5.5 segundos)
            if (cyclePos > 5.5 || cyclePos === 0) {
                label.innerText = "INHALE";
                label.style.color = "var(--success)";
                circle.style.transform = "scale(1.3)";
                circle.style.borderColor = "var(--success)";
                circle.style.boxShadow = "0 0 50px var(--success)";
                if (cyclePos === 11 || (cyclePos === 0 && timeLeft > 0)) this.speak("Inhale");
            } 
            // EXHALAR: de 5.5 a 0.1 (5.5 segundos)
            else {
                label.innerText = "EXHALE";
                label.style.color = "var(--primary)";
                circle.style.transform = "scale(0.6)";
                circle.style.borderColor = "var(--primary)";
                circle.style.boxShadow = "0 0 20px var(--primary)";
                if (Math.abs(cyclePos - 5.5) < 0.1) this.speak("Exhale");
            }

            timerDisplay.innerText = `${timeLeft}s`;
            
            if (timeLeft <= 0) {
                clearInterval(breathingInterval);
                this.renderAssessment();
            }
            timeLeft--;
        };

        const breathingInterval = setInterval(updateCycle, 1000);
        updateCycle(); // Ejecución inmediata
    },

    /**
     * RENDERIZADO DE EVALUACIÓN TÁCTICA
     * Escoge una de las 4 variantes y desordena las 4 opciones.
     */
    renderAssessment() {
        const domain = this.missionData[this.currentStepIndex];
        // Escoger 1 escenario aleatorio de los 4 disponibles en el dominio
        const scenario = domain.scenarios[Math.floor(Math.random() * domain.scenarios.length)];
        // Mezclar las opciones de respuesta para que la posición no sea recordada
        const shuffledOptions = this.shuffle([...scenario.options]);

        const container = document.getElementById("app");
        container.innerHTML = `
            <div class="card">
                <div style="text-align:left; font-size:12px; color:var(--primary); margin-bottom:15px; border-bottom:1px solid #333;">
                    DOMAIN 0${this.currentStepIndex + 1}: ${domain.focus}
                </div>
                <h2 style="margin-bottom:30px; line-height:1.4;">${scenario.q}</h2>
                <div id="options-grid">
                    ${shuffledOptions.map(opt => `
                        <button class="btn-tactical" onclick="MaykaMiEngine.processDecision(${opt.pts})">
                            ${opt.text}
                        </button>
                    `).join('')}
                </div>
                <div style="margin-top:20px; font-size:10px; opacity:0.5;">
                    NEURAL PROCESSING REQUIRED - SELECT OPTIMAL RESPONSE
                </div>
            </div>
        `;

        this.speak(scenario.q);
        
        // Actualizar HUD de telemetría (Simulación de carga cognitiva)
        if (window.updateHUD) {
            window.updateHUD({
                pulseSim: Math.floor(Math.random() * (90 - 60) + 60),
                cognitiveLoad: (this.currentStepIndex + 1) * 10,
                roeCompliance: 100,
                microTremor: (Math.random() * 0.05).toFixed(3)
            });
        }
    },

    processDecision(points) {
        this.sessionScores.push(points);
        
        // Retroalimentación auditiva según desempeño
        if (points === 3) this.speak("Optimal decision.");
        else if (points === 0) this.speak("Critical error detected.");
        else this.speak("Acceptable protocol.");

        this.currentStepIndex++;

        if (this.currentStepIndex < this.totalSteps) {
            // Entre cada pregunta, 11s de respiración para resetear el sistema nervioso
            this.runScientificBreathing(11);
        } else {
            this.finishSession();
        }
    },

    async finishSession() {
        this.speak("Session complete. Calculating neural readiness report.");
        
        const finalData = {
            timestamp: new Date().toISOString(),
            scores: this.sessionScores,
            average: this.sessionScores.reduce((a, b) => a + b, 0) / this.totalSteps,
            operator_id: "736-SFS-OPERATOR"
        };

        // Enviar a la API para generar PDF
        try {
            const res = await fetch('/api/state', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(finalData)
            });
            const result = await res.json();
            
            this.renderFinalUI(result.download_url, finalData.average);
        } catch (e) {
            console.error("Report generation failed.");
        }
    },

    renderFinalUI(downloadUrl, avg) {
        const container = document.getElementById("app");
        const performance = avg >= 2.5 ? "ELITE" : avg >= 1.5 ? "OPERATIONAL" : "RE-TRAINING REQUIRED";
        
        container.innerHTML = `
            <div class="card">
                <h1 style="color:var(--success)">READINESS: ${performance}</h1>
                <p>NEURAL SYNC AVERAGE: ${(avg * 33.3).toFixed(2)}%</p>
                <hr>
                <button class="btn-tactical" onclick="window.location.href='${downloadUrl}'">DOWNLOAD PDF REPORT</button>
                <button class="btn-tactical" onclick="location.reload()">RESTART PROTOCOL</button>
            </div>
        `;
    },

    speak(txt) {
        this.voice.synth.cancel(); // Detiene cualquier voz previa
        const u = new SpeechSynthesisUtterance(txt);
        u.lang = this.voice.lang;
        u.rate = this.voice.rate;
        u.pitch = this.voice.pitch;
        this.voice.synth.speak(u);
    }
};
