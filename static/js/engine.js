/**
 * =========================================================
 * KAMIZEN NEURO-COGNITIVE ENGINE v3.0
 * FULL STABLE TACTICAL SYSTEM
 * =========================================================
 * ✔ No freeze
 * ✔ Stable rendering
 * ✔ Mission progression
 * ✔ Stories supported
 * ✔ Headers supported
 * ✔ Tactical decisions
 * ✔ Breathing calibration
 * ✔ Silence calibration
 * ✔ Result system
 * ✔ Notifications
 * ✔ Offline-safe architecture
 * =========================================================
 */

const KamizenEngine = {

    currentMissionIndex: 0,
    currentStepIndex: 0,
    missionData: null,
    timer: null,

    userStats: {
        accuracy: 0,
        stability: 0,
        discipline: 0,
        focus: 0,
        total_sessions: 0
    },

    // =====================================================
    // INIT
    // =====================================================

    async init() {

        console.log("KAMIZEN ENGINE INITIALIZING...");

        try {

            const response = await fetch('/api/missions');

            if (!response.ok) {
                throw new Error("MISSION DATABASE FAILED");
            }

            this.missionData = await response.json();

            console.log("MISSION DATABASE LOADED");

            // AUTO START
            this.startMission(1);

        } catch (error) {

            console.error("CRITICAL SYSTEM FAILURE:", error);

            const container = document.getElementById('app');

            container.innerHTML = `
                <div class="card center">
                    <h2 style="color:#ff3e3e;">
                        DATABASE CONNECTION FAILURE
                    </h2>

                    <p style="color:#7d8590;">
                        VERIFY API /api/missions
                    </p>
                </div>
            `;
        }
    },

    // =====================================================
    // START MISSION
    // =====================================================

    startMission(id) {

        if (!this.missionData || !this.missionData.missions) {
            console.error("MISSION DATA NOT READY");
            return;
        }

        const index = this.missionData.missions.findIndex(
            m => m.id === id
        );

        if (index === -1) {
            console.error("MISSION NOT FOUND:", id);
            return;
        }

        this.currentMissionIndex = index;
        this.currentStepIndex = 0;

        this.executeStep();
    },

    // =====================================================
    // EXECUTE STEP
    // =====================================================

    executeStep() {

        clearInterval(this.timer);

        const mission =
            this.missionData.missions[this.currentMissionIndex];

        if (!mission) {
            this.completeMission();
            return;
        }

        const step = mission.b[this.currentStepIndex];

        if (!step) {

            this.currentMissionIndex++;

            if (
                this.currentMissionIndex >=
                this.missionData.missions.length
            ) {
                this.completeMission();
                return;
            }

            this.currentStepIndex = 0;

            this.executeStep();

            return;
        }

        console.log("STEP:", step);

        // =================================================
        // STORY
        // =================================================

        if (step.story) {
            this.ui_renderStory(step.story.en);
            return;
        }

        // =================================================
        // STEP TYPES
        // =================================================

        switch (step.t) {

            // ---------------------------------------------
            // TITLE
            // ---------------------------------------------

            case 'v':

                this.ui_renderTitle(step.tx.en);

                break;

            // ---------------------------------------------
            // HEADER
            // ---------------------------------------------

            case 'h':

                this.ui_renderHeader(step.tx.en);

                break;

            // ---------------------------------------------
            // BREATHING
            // ---------------------------------------------

            case 'breath_auto':

                this.ui_startBreathing(
                    step.d,
                    step.tx.en,
                    step.inf?.en || ""
                );

                break;

            // ---------------------------------------------
            // DECISION
            // ---------------------------------------------

            case 'd':

                this.ui_renderDecision(
                    step.q.en,
                    step.op,
                    step.c,
                    step.ex
                );

                break;

            // ---------------------------------------------
            // SILENCE
            // ---------------------------------------------

            case 'sil':

                this.ui_startSilence(
                    step.d,
                    step.tx.en,
                    step.inf?.en || ""
                );

                break;

            // ---------------------------------------------
            // RESULT
            // ---------------------------------------------

            case 'r':

                this.ui_showResult(
                    step.tx,
                    step.p || 0
                );

                break;

            // ---------------------------------------------
            // COMMENT
            // ---------------------------------------------

            case 'c':

                this.ui_renderComment(step.tx.en);

                break;

            // ---------------------------------------------
            // UNKNOWN
            // ---------------------------------------------

            default:

                console.warn("UNKNOWN STEP:", step);

                this.currentStepIndex++;

                this.executeStep();

                break;
        }
    },

    // =====================================================
    // NEXT STEP
    // =====================================================

    nextStep() {

        this.currentStepIndex++;

        this.executeStep();
    },

    // =====================================================
    // TITLE SCREEN
    // =====================================================

    ui_renderTitle(title) {

        const container = document.getElementById('app');

        container.innerHTML = `
            <div class="card center">

                <h2 style="color:var(--primary);">
                    ${title}
                </h2>

                <p style="color:var(--dim);">
                    TACTICAL MODULE READY
                </p>

                <button id="beginMissionBtn">
                    BEGIN MISSION
                </button>

            </div>
        `;

        document
            .getElementById('beginMissionBtn')
            .onclick = () => this.nextStep();
    },

    // =====================================================
    // HEADER
    // =====================================================

    ui_renderHeader(text) {

        const container = document.getElementById('app');

        container.innerHTML = `
            <div class="card center">

                <h2>${text}</h2>

                <button id="headerContinueBtn">
                    CONTINUE
                </button>

            </div>
        `;

        document
            .getElementById('headerContinueBtn')
            .onclick = () => this.nextStep();
    },

    // =====================================================
    // STORY
    // =====================================================

    ui_renderStory(text) {

        const container = document.getElementById('app');

        container.innerHTML = `
            <div class="card">

                <h2 style="color:var(--primary);">
                    TACTICAL KNOWLEDGE
                </h2>

                <p style="
                    line-height:1.8;
                    color:var(--text);
                    text-align:left;
                ">
                    ${text}
                </p>

                <button id="storyContinueBtn">
                    CONTINUE
                </button>

            </div>
        `;

        document
            .getElementById('storyContinueBtn')
            .onclick = () => this.nextStep();
    },

    // =====================================================
    // DECISION
    // =====================================================

    ui_renderDecision(
        question,
        options,
        correct,
        explanations
    ) {

        const container = document.getElementById('app');

        container.innerHTML = `
            <div class="card">

                <h3 style="color:var(--primary);">
                    SITUATIONAL ASSESSMENT
                </h3>

                <p class="question">
                    ${question}
                </p>

                <div class="options-grid">

                    ${options.map((opt, i) => `
                        <button
                            class="btn-tactical"
                            onclick="KamizenEngine.processDecision(
                                ${i},
                                ${correct},
                                ${JSON.stringify(explanations)}
                            )"
                        >
                            ${opt}
                        </button>
                    `).join('')}

                </div>

            </div>
        `;
    },

    // =====================================================
    // PROCESS DECISION
    // =====================================================

    processDecision(
        choiceIndex,
        correctIndex,
        explanation
    ) {

        if (choiceIndex === correctIndex) {

            this.userStats.discipline += 10;

            this.ui_notify(
                "SUCCESS",
                "PROTOCOL ADHERENCE CONFIRMED",
                "success"
            );

        } else {

            this.userStats.discipline -= 5;

            this.ui_notify(
                "WARNING",
                explanation[0] || "TACTICAL ERROR",
                "error"
            );
        }

        setTimeout(() => {
            this.nextStep();
        }, 2500);
    },

    // =====================================================
    // BREATHING
    // =====================================================

    ui_startBreathing(
        duration,
        title,
        info
    ) {

        let timeLeft = duration;

        const container = document.getElementById('app');

        const renderBreath = () => {

            const phase =
                timeLeft % 8 < 4
                    ? "INHALE"
                    : "EXHALE";

            container.innerHTML = `
                <div class="card center">

                    <h2 style="color:var(--primary);">
                        ${title}
                    </h2>

                    <div class="breath-circle pulse">

                        <div style="
                            font-size:22px;
                            font-weight:bold;
                        ">
                            ${phase}
                        </div>

                        <div style="
                            margin-top:10px;
                            font-size:30px;
                        ">
                            ${timeLeft}s
                        </div>

                    </div>

                    <p style="color:var(--dim);">
                        ${info}
                    </p>

                </div>
            `;
        };

        renderBreath();

        this.timer = setInterval(() => {

            timeLeft--;

            renderBreath();

            if (timeLeft <= 0) {

                clearInterval(this.timer);

                this.nextStep();
            }

        }, 1000);
    },

    // =====================================================
    // SILENCE MODE
    // =====================================================

    ui_startSilence(
        duration,
        title,
        info
    ) {

        let timeLeft = duration;

        const container = document.getElementById('app');

        const renderSilence = () => {

            container.innerHTML = `
                <div class="card center">

                    <h2>${title}</h2>

                    <div class="breath-circle pulse">

                        <div style="
                            font-size:30px;
                            font-weight:bold;
                        ">
                            ${timeLeft}s
                        </div>

                    </div>

                    <p style="color:var(--dim);">
                        ${info}
                    </p>

                </div>
            `;
        };

        renderSilence();

        this.timer = setInterval(() => {

            timeLeft--;

            renderSilence();

            if (timeLeft <= 0) {

                clearInterval(this.timer);

                this.nextStep();
            }

        }, 1000);
    },

    // =====================================================
    // RESULT
    // =====================================================

    ui_showResult(text, points) {

        const container = document.getElementById('app');

        container.innerHTML = `
            <div class="card center">

                <h1 style="color:var(--success);">
                    ${text}
                </h1>

                <h2>
                    +${points} XP
                </h2>

                <button id="continueResultBtn">
                    CONTINUE
                </button>

            </div>
        `;

        document
            .getElementById('continueResultBtn')
            .onclick = () => this.nextStep();
    },

    // =====================================================
    // COMMENT
    // =====================================================

    ui_renderComment(text) {

        const container = document.getElementById('app');

        container.innerHTML = `
            <div class="card center">

                <h2 style="color:var(--primary);">
                    OPERATIONAL NOTE
                </h2>

                <p style="
                    line-height:1.8;
                ">
                    ${text}
                </p>

                <button id="commentContinueBtn">
                    CONTINUE
                </button>

            </div>
        `;

        document
            .getElementById('commentContinueBtn')
            .onclick = () => this.nextStep();
    },

    // =====================================================
    // NOTIFICATIONS
    // =====================================================

    ui_notify(
        title,
        message,
        type = 'success'
    ) {

        const color =
            type === 'success'
                ? '#00ff88'
                : '#ff3e3e';

        const notification =
            document.createElement('div');

        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px';
        notification.style.background = '#111';
        notification.style.border =
            `1px solid ${color}`;
        notification.style.color = color;
        notification.style.zIndex = '9999';
        notification.style.maxWidth = '300px';

        notification.innerHTML = `
            <strong>${title}</strong>
            <br>
            ${message}
        `;

        document.body.appendChild(notification);

        setTimeout(() => {

            notification.remove();

        }, 3000);
    },

    // =====================================================
    // COMPLETE SYSTEM
    // =====================================================

    completeMission() {

        const container = document.getElementById('app');

        container.innerHTML = `
            <div class="card center">

                <h1 style="color:var(--success);">
                    ALL MISSIONS COMPLETE
                </h1>

                <p>
                    OPERATOR STATUS:
                    READY FOR VR DEPLOYMENT
                </p>

                <h2>
                    DISCIPLINE SCORE:
                    ${this.userStats.discipline}
                </h2>

                <button id="restartBtn">
                    RESTART SYSTEM
                </button>

            </div>
        `;

        document
            .getElementById('restartBtn')
            .onclick = () => {

                this.currentMissionIndex = 0;
                this.currentStepIndex = 0;

                this.startMission(1);
            };

        console.log(
            "KAMIZEN TACTICAL SEQUENCE COMPLETE"
        );
    }
};

// =========================================================
// SYSTEM BOOT
// =========================================================

document.addEventListener(
    'DOMContentLoaded',
    () => {
        KamizenEngine.init();
    }
);
