const KamizenEngine = {
    currentMissionIndex: 0,
    currentStepIndex: 0,
    missionData: null,

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
        try {
            const res = await fetch('/static/missions_tactical.json');
            this.missionData = await res.json();

            this.renderDashboard();
            this.startTelemetryLoop();
        } catch (e) {
            console.error("ENGINE INIT FAILED", e);
        }
    },

    // =========================
    // 🚀 MISSION CONTROL
    // =========================
    startMission(id) {
        this.currentMissionIndex =
            this.missionData.missions.findIndex(m => m.id === id);

        this.currentStepIndex = 0;

        this.logEvent("MISSION_START", { id });

        this.executeStep();
    },

    executeStep() {
        const mission = this.missionData.missions[this.currentMissionIndex];
        if (!mission) return;

        const step = mission.b[this.currentStepIndex];

        if (!step) {
            this.completeMission();
            return;
        }

        switch (step.t) {

            case 'v':
                this.renderTitle(step.tx.en);
                break;

            case 'breath_auto':
                this.runBreathing(step);
                break;

            case 'd':
                this.renderDecision(step);
                break;

            case 'sil':
                this.runSilence(step);
                break;

            case 'r':
                this.showResult(step);
                break;
        }
    },

    // =========================
    // 🎯 DECISION ENGINE (NO FREEZE)
    // =========================
    renderDecision(step) {
        const container = document.getElementById("app");

        const start = performance.now();

        const html = `
            <div class="card">
                <h3>ASSESSMENT</h3>
                <p>${step.q.en}</p>

                <div>
                    ${step.op.map((opt, i) => `
                        <button onclick="KamizenEngine.processDecision(${i}, ${step.c}, '${step.ex[0]}')">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;

        this.currentStepStart = start;
    },

    processDecision(choice, correct, explanation) {
        const latency = performance.now() - this.currentStepStart;

        const success = choice === correct;

        // 🔥 ADAPTIVE STRESS ENGINE
        if (success) {
            this.adaptiveState.successStreak++;
            this.adaptiveState.failureCount = 0;

            this.adaptiveState.difficultyMultiplier += 0.05;
            this.telemetry.roeCompliance += 1;
        } else {
            this.adaptiveState.failureCount++;
            this.adaptiveState.successStreak = 0;

            this.adaptiveState.difficultyMultiplier -= 0.1;
            this.adaptiveState.stressLevel += 1;

            this.telemetry.hesitationIndex += 5;
        }

        // 📡 TELEMETRY UPDATE
        this.telemetry.reactionTime = latency;
        this.telemetry.stressIndex =
            this.adaptiveState.stressLevel * 10;

        this.telemetry.cognitiveLoad =
            Math.min(100,
                this.adaptiveState.difficultyMultiplier * 30
            );

        this.logEvent("DECISION", {
            choice,
            success,
            latency
        });

        // 🔁 AUTO ADVANCE (NO UI FREEZE)
        setTimeout(() => {
            this.currentStepIndex++;
            this.executeStep();
        }, 600);
    },

    // =========================
    // 🫁 BREATHING SYSTEM
    // =========================
    runBreathing(step) {
        let t = step.d;
        const el = document.getElementById("app");

        const interval = setInterval(() => {

            el.innerHTML = `
                <div class="card">
                    <h3>${step.tx.en}</h3>
                    <p>${step.inf.en}</p>
                    <h2>${t}s</h2>
                </div>
            `;

            this.telemetry.focusStability =
                Math.min(100,
                    this.telemetry.focusStability + 0.5
                );

            if (t-- <= 0) {
                clearInterval(interval);
                this.currentStepIndex++;
                this.executeStep();
            }

        }, 1000);
    },

    runSilence(step) {
        setTimeout(() => {
            this.currentStepIndex++;
            this.executeStep();
        }, step.d * 1000);
    },

    showResult(step) {
        document.getElementById("app").innerHTML = `
            <div class="card">
                <h2>${step.tx}</h2>
                <p>+${step.p} SCORE</p>
            </div>
        `;

        this.logEvent("RESULT", step);
    },

    completeMission() {
        this.logEvent("MISSION_COMPLETE", this.telemetry);

        this.renderDashboard();
    },

    // =========================
    // 📡 LIVE DASHBOARD (INSTRUCTOR VIEW)
    // =========================
    renderDashboard() {

        const panel = document.getElementById("dashboard") || this.createDashboard();

        panel.innerHTML = `
            <div class="card">
                <h3>INSTRUCTOR DASHBOARD</h3>

                <p>REACTION: ${this.telemetry.reactionTime.toFixed(0)} ms</p>
                <p>STRESS: ${this.telemetry.stressIndex}</p>
                <p>COGNITIVE LOAD: ${this.telemetry.cognitiveLoad.toFixed(1)}</p>
                <p>ROE: ${this.telemetry.roeCompliance}</p>
                <p>HESITATION: ${this.telemetry.hesitationIndex}</p>
                <p>FOCUS: ${this.telemetry.focusStability.toFixed(1)}</p>

                <hr/>

                <p>DYNAMIC DIFFICULTY: ${this.adaptiveState.difficultyMultiplier.toFixed(2)}</p>
                <p>STRESS ENGINE: ${this.adaptiveState.stressLevel}</p>
            </div>
        `;
    },

    createDashboard() {
        const div = document.createElement("div");
        div.id = "dashboard";
        document.body.appendChild(div);
        return div;
    },

    // =========================
    // 📡 TELEMETRY LOOP
    // =========================
    startTelemetryLoop() {
        setInterval(() => {
            this.renderDashboard();
        }, 1000);
    },

    logEvent(type, data) {
        this.sessionLog.push({
            t: Date.now(),
            type,
            data
        });
    }
};

document.addEventListener("DOMContentLoaded", () => KamizenEngine.init());
