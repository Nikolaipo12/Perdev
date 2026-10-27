/* ==========================================================================
   Personal Development Reviewer - 31-item practice test
   ========================================================================== */
(() => {
  "use strict";

  const RS = window.RS;
  const { DATA, state, esc, icon, formatTime, clamp, percent } = RS;
  const TEST = DATA.test;
  const LIMIT = 25 * 60;
  const LETTERS = "ABCDE";
  const reviewHref = (tab, section) => `#/${tab}${section ? `?section=${encodeURIComponent(section)}` : ""}`;
  const BANDS = [
    { min: 26, className: "green", label: "Ready", title: "Ready to <em>perform</em>.", note: "You can tell the brain regions, attraction factors, grief responses, and career forces apart. Skim the cheat sheet once, then let it rest." },
    { min: 20, className: "gold", label: "Almost there", title: "Close — <em>finish the gaps</em>.", note: "Reread the module sections you missed, then retake the test. The answer review below points to the exact section." },
    { min: 0, className: "red", label: "Reread", title: "Go back to the <em>lessons</em>.", note: "Don't just retake this immediately. Redo the module quick checks and labs, then come back with a fresh baseline." }
  ];

  const QUESTION_SECTIONS = {
    1: "brain-map", 2: "lobes", 3: "lobes", 4: "lobes", 5: "lobes",
    6: "hemispheres", 7: "triune", 8: "thinking",
    9: "attraction", 10: "attraction", 11: "attraction", 12: "attraction", 13: "stages", 14: "stages", 15: "attachment",
    16: "grief-stages", 17: "grief-stages", 18: "grief-stages", 19: "grief-stages", 20: "support",
    21: "conditions", 22: "conditions", 23: "conditions",
    24: "factors", 25: "factors", 26: "factors", 27: "factors", 28: "factors",
    29: "factors", 30: "factors", 31: "factors"
  };
  const LESSON_TABS = { 1: "mind", 2: "heart", 3: "grief", 4: "career" };
  const GROUPS = [
    { label: "Module 01 · Mind & Brain", min: 1, max: 8 },
    { label: "Module 02 · Love & Attachment", min: 9, max: 15 },
    { label: "Module 03 · Grief & Mental Health", min: 16, max: 23 },
    { label: "Module 04 · Career Compass", min: 24, max: 31 }
  ];

  let activeTest = null;
  let reviewFilter = "all";
  let timerId = null;
  let runnerKeyHandler = null;
  let questionDirection = 1;
  let questionTransition = null;
  let questionToken = 0;

  const number = (value) => Number(value).toLocaleString("en-US");
  const getBand = (score) => BANDS.find((band) => score >= band.min) || BANDS[BANDS.length - 1];

  function formatDate(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "Recent";
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function answerText(question, raw) {
    if (raw === null || raw === undefined || raw === "") return "No answer";
    if (question.type === "mc") return `${LETTERS[Number(raw)]}. ${question.options[Number(raw)]}`;
    if (question.type === "pair") {
      return question.fields.map((field) => `${field.label}: ${raw?.[field.key] || "—"}`).join(" · ");
    }
    return `${raw}${question.unit ? ` ${question.unit}` : ""}`;
  }

  function correctText(question) {
    if (question.type === "mc") return `${LETTERS[question.answer]}. ${question.options[question.answer]}`;
    if (question.type === "pair") return question.fields.map((field) => `${field.label}: ${question.answers[field.key]}`).join(" · ");
    return `${question.answer}${question.unit ? ` ${question.unit}` : ""}`;
  }

  function isAnswered(question, raw) {
    if (raw === null || raw === undefined) return false;
    if (question.type === "mc") return Number.isInteger(Number(raw)) && Number(raw) >= 0;
    if (question.type === "pair") return question.fields.every((field) => String(raw?.[field.key] ?? "").trim() !== "");
    return String(raw).trim() !== "";
  }

  function isCorrect(question, raw) {
    if (!isAnswered(question, raw)) return false;
    if (question.type === "mc") return Number(raw) === question.answer;
    if (question.type === "pair") {
      return question.fields.every((field) => {
        const value = Number(raw?.[field.key]);
        return Number.isFinite(value) && Math.round(value) === question.answers[field.key];
      });
    }
    const value = Number(raw);
    return Number.isFinite(value) && Math.round(value) === question.answer;
  }

  function renderIntro() {
    const attempts = state.test.attempts;
    const best = state.test.best;
    const average = attempts.length ? (attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length).toFixed(1) : "—";
    const lastMode = attempts[0]?.mode === "practice" ? "practice" : "timed";
    return `
      <section class="test-page" data-test-root>
        <div class="test-intro-hero">
          <div class="test-intro-copy">
            <span class="eyebrow">Practice test · All four modules</span>
            <h1>Prove what you <em>remember</em>.</h1>
            <p class="test-intro-lede">31 items across the full reviewer: mind and brain, love and attachment, grief and mental health, and career factors. No hints while you answer — a full “why” for every item afterward.</p>
            <div class="tag-row"><span class="tag">31 items</span><span class="tag">25 min timed mode</span><span class="tag">Full answer review</span><span class="tag">Diagnosis by module</span></div>
          </div>
          <aside class="test-best-card">
            <span>Your best so far</span>
            <div class="test-best-score"><strong>${best}</strong><span>/ ${TEST.length}</span></div>
            <p>${attempts.length ? (best >= 26 ? "Exam-ready territory. Protect it with a light review." : "Every attempt updates this card and your readiness score.") : "No attempts yet. Your first score is a baseline, not a verdict."}</p>
            <div class="test-best-stats">
              <span>Attempts<b>${attempts.length}</b></span>
              <span>Average<b>${average}</b></span>
              <span>Readiness<b>${RS.getStats().readiness}%</b></span>
            </div>
          </aside>
        </div>

        <div class="test-start-grid">
          <div class="test-mode-card">
            <div class="test-card-head"><span class="eyebrow eyebrow--teal">Set your conditions</span><h2>Start a new attempt</h2><p>Choose the clock, then begin. You can submit early, but the timer never pauses while you are on the test.</p></div>
            <div class="mode-list">
              <label class="mode-option">
                <input type="radio" name="test-mode" value="timed" ${lastMode === "timed" ? "checked" : ""} />
                <span class="mode-radio" aria-hidden="true"></span>
                <span class="mode-copy"><strong>Exam mode <span class="pill pill--teal">Recommended</span></strong><span>25-minute countdown. Best for simulating the real thing.</span></span>
                <span class="mode-meta">25:00</span>
              </label>
              <label class="mode-option">
                <input type="radio" name="test-mode" value="practice" ${lastMode === "practice" ? "checked" : ""} />
                <span class="mode-radio" aria-hidden="true"></span>
                <span class="mode-copy"><strong>Practice mode</strong><span>No countdown — just an elapsed timer. Take the time you need.</span></span>
                <span class="mode-meta">No limit</span>
              </label>
            </div>
            <button class="btn btn-primary btn-block" type="button" data-start-test>${icon("play")} Start the test</button>
            <p class="test-start-note">Answers stay put when you move around. Your best score and attempt history save in this browser.</p>
          </div>

          <aside class="test-info-card">
            <h3>How to read the result</h3>
            <p>The bands are a study guide, not a grade. Every band comes with a next move.</p>
            <div class="score-bands">
              <div class="score-band score-band--green"><i></i><span><b>26–31</b> Ready · skim, then rest</span></div>
              <div class="score-band score-band--gold"><i></i><span><b>20–25</b> Reread the comparisons</span></div>
              <div class="score-band score-band--red"><i></i><span><b>0–19</b> Redo the lessons</span></div>
            </div>
            <div class="test-info-divider"></div>
            <h3>Recent attempts</h3>
            ${attempts.length ? `<div class="attempt-history">${attempts.slice(0, 3).map((attempt) => `<div class="attempt-row"><span>${formatDate(attempt.date)} · ${attempt.mode === "timed" ? "Timed" : "Practice"}</span><b>${attempt.score}/${TEST.length}</b></div>`).join("")}</div>` : `<div class="attempt-empty">No attempts yet. The answer review appears right after your first submission.</div>`}
          </aside>
        </div>

        <div class="test-map-strip">
          <div class="test-map-item"><span class="test-map-num test-map-num--teal">01–08</span><span><b>Mind &amp; Brain</b>Module 01</span></div>
          <div class="test-map-item"><span class="test-map-num test-map-num--indigo">09–15</span><span><b>Love &amp; Attachment</b>Module 02</span></div>
          <div class="test-map-item"><span class="test-map-num test-map-num--rust">16–23</span><span><b>Grief &amp; Mental Health</b>Module 03</span></div>
          <div class="test-map-item"><span class="test-map-num test-map-num--gold">24–31</span><span><b>Career Compass</b>Module 04</span></div>
        </div>
      </section>`;
  }

  function renderPalette() {
    return TEST.map((question, index) => {
      const current = activeTest.index === index;
      const answered = isAnswered(question, activeTest.answers[index]);
      const flagged = activeTest.flagged.has(question.id);
      return `${index === 8 || index === 15 || index === 23 ? `<span class="palette-sep" aria-hidden="true"></span>` : ""}
        <button class="palette-btn${answered ? " is-answered" : ""}${current ? " is-current" : ""}${flagged ? " has-flag" : ""}" type="button" data-palette-q="${index}" aria-label="Question ${question.id}, ${answered ? "answered" : "unanswered"}${flagged ? ", flagged" : ""}" aria-current="${current ? "step" : "false"}">${question.id}</button>`;
    }).join("");
  }

  function renderQuestion() {
    const index = activeTest.index;
    const question = TEST[index];
    const raw = activeTest.answers[index];
    const answered = isAnswered(question, raw);
    const flagged = activeTest.flagged.has(question.id);
    const lesson = DATA.lessons.find((item) => item.id === question.lesson);
    let answerArea = "";

    if (question.type === "mc") {
      answerArea = `<div class="options" role="group" aria-label="Answer choices">
        ${question.options.map((option, optionIndex) => {
          const selected = answered && Number(raw) === optionIndex;
          return `<button class="option-btn${selected ? " is-selected" : ""}" type="button" data-option="${optionIndex}" aria-pressed="${selected}">
            <span class="option-key">${LETTERS[optionIndex]}</span><span class="option-copy">${esc(option)}</span><span class="option-mark">${selected ? icon("check") : ""}</span>
          </button>`;
        }).join("")}
      </div>`;
    } else if (question.type === "pair") {
      answerArea = `<div class="numeric-grid">
        ${question.fields.map((field) => `<label class="numeric-field"><span>${esc(field.label)}</span><input class="input" type="number" min="0" step="1" inputmode="numeric" value="${esc(raw?.[field.key] ?? "")}" data-pair-key="${field.key}" placeholder="0" /></label>`).join("")}
      </div>
      <div class="question-hint">${icon("lightbulb")}<span>${esc(question.hint || "")}</span></div>`;
    } else {
      answerArea = `<div class="numeric-grid">
        <label class="numeric-field"><span>Your answer${question.unit ? ` (${esc(question.unit)})` : ""}</span><input class="input" type="number" min="0" step="1" inputmode="numeric" value="${esc(raw ?? "")}" data-number-answer placeholder="0" /></label>
      </div>
      <div class="question-hint">${icon("lightbulb")}<span>${esc(question.hint || "")}</span></div>`;
    }

    return `
      <article class="question-card" data-question-card style="--question-dir:${questionDirection}" aria-live="polite">
        <div class="question-meta">
          <span class="question-num">Question ${String(question.id).padStart(2, "0")}</span>
          <span class="pill pill--${lesson.color}">${esc(lesson.short)}</span>
          ${flagged ? `<span class="question-flag-note">${icon("flag")} Flagged</span>` : ""}
          <span class="question-type">${question.type === "mc" ? "Multiple choice" : question.type === "pair" ? "Two answers" : "Numeric"}</span>
        </div>
        <p class="question-prompt">${esc(question.prompt)}</p>
        ${answerArea}
        <div class="test-controls">
          <button class="btn btn-secondary btn-sm" type="button" data-prev-question ${index === 0 ? "disabled" : ""}>${icon("arrow-left")} Previous</button>
          <button class="btn btn-ghost btn-sm flag-btn${flagged ? " is-flagged" : ""}" type="button" data-flag-question aria-pressed="${flagged}">${icon("flag")} ${flagged ? "Flagged" : "Flag for review"}</button>
          ${index < TEST.length - 1
            ? `<button class="btn btn-primary btn-sm" type="button" data-next-question>Next ${icon("arrow-right")}</button>`
            : `<button class="btn btn-primary btn-sm" type="button" data-submit-test>Review &amp; submit ${icon("check")}</button>`}
        </div>
        <div class="test-kbd"><kbd>←</kbd><kbd>→</kbd> move <kbd>1–5</kbd> answer <kbd>F</kbd> flag <kbd>Ctrl</kbd><kbd>Enter</kbd> submit</div>
      </article>`;
  }

  function renderRunner() {
    const question = TEST[activeTest.index];
    const answered = TEST.filter((item, index) => isAnswered(item, activeTest.answers[index])).length;
    const remaining = TEST.length - answered;
    const seconds = activeTest.mode === "timed" ? activeTest.remaining : activeTest.elapsed;
    return `
      <section class="test-page test-runner" data-test-root>
        <div class="test-toolbar">
          <div class="test-toolbar-left">
            <button class="test-exit" type="button" data-exit-test>${icon("arrow-left")} Exit</button>
            <span class="test-mode-pill">${activeTest.mode === "timed" ? "Exam mode" : "Practice mode"}</span>
          </div>
          <div class="test-toolbar-right">
            <div class="test-timer${activeTest.mode === "timed" && seconds <= 300 ? " is-low" : ""}" role="timer" aria-label="${activeTest.mode === "timed" ? "Time remaining" : "Time elapsed"}">
              ${icon("clock")}<span>${activeTest.mode === "timed" ? "Time left" : "Elapsed"}</span><strong data-test-timer>${formatTime(seconds)}</strong>
            </div>
            <button class="btn btn-primary btn-sm" type="button" data-submit-test>Submit test</button>
          </div>
        </div>

        <div class="test-progress-row">
          <div class="test-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="${TEST.length}" aria-valuenow="${answered}"><i data-test-progress style="width:${percent(answered, TEST.length)}%"></i></div>
          <span data-test-progress-label>${answered} of ${TEST.length} answered</span>
        </div>

        <div class="test-layout">
          <div class="test-main" data-test-main>${renderQuestion()}</div>
          <aside class="test-side">
            <div class="test-side-card">
              <div class="side-head"><h3>Question map</h3><span data-test-palette-count>${remaining} left</span></div>
              <div class="test-palette" data-test-palette>${renderPalette()}</div>
              <div class="test-legend"><span><i class="legend-swatch legend-swatch--answered"></i>Answered</span><span><i class="legend-swatch"></i>Unanswered</span><span><i class="legend-swatch legend-swatch--flag"></i>Flagged</span><span>Question ${question.id} current</span></div>
            </div>
            <div class="test-side-card">
              <div class="side-head"><h3>Test notes</h3></div>
              <div class="test-side-note"><b>${activeTest.mode === "timed" ? "The clock stops when you leave this tab." : "No time limit."}</b> Your answers and flags stay put. Submit early from the button above whenever you are ready.</div>
              <button class="btn btn-secondary btn-block" type="button" data-submit-test>Review &amp; submit</button>
            </div>
          </aside>
        </div>
      </section>`;
  }

  function renderBreakdown() {
    const result = activeTest.result;
    return GROUPS.map((group) => {
      const questions = TEST.filter((question) => question.id >= group.min && question.id <= group.max);
      const correct = questions.filter((question) => result.correctById[question.id]).length;
      return `<div class="breakdown-item"><div class="breakdown-top"><span>${group.label}</span><b>${correct}/${questions.length}</b></div><div class="breakdown-bar"><i style="width:${percent(correct, questions.length)}%"></i></div></div>`;
    }).join("");
  }

  function rangeMisses(min, max) {
    const result = activeTest.result;
    return TEST.filter((question) => question.id >= min && question.id <= max && !result.correctById[question.id]).length;
  }

  function renderDiagnosis() {
    return DATA.diagnosis.map((row) => {
      const [min, max] = row.items.split(/[–-]/).map(Number);
      const missed = rangeMisses(min, max);
      return `<button class="diagnosis-row${missed ? " is-missed" : ""}" type="button" data-nav="${reviewHref(row.page, row.section)}">
        ${icon(missed ? "alert" : "check-circle")}
        <span><b>${esc(row.lesson)} · ${esc(row.reread)}</b>${missed ? `${missed} missed. ` : "No misses. "}${esc(row.fix)}</span>
      </button>`;
    }).join("");
  }

  function renderAnswers() {
    const result = activeTest.result;
    const items = TEST.map((question, index) => ({ question, index, raw: activeTest.answers[index] }))
      .filter(({ question, raw }) => {
        if (reviewFilter === "missed") return !isCorrect(question, raw);
        if (reviewFilter === "flagged") return activeTest.flagged.has(question.id);
        return true;
      });

    if (!items.length) {
      return `<div class="attempt-empty">Nothing in this filter. ${reviewFilter === "flagged" ? "You did not flag any questions." : "You got everything right."}</div>`;
    }

    return items.map(({ question, index, raw }) => {
      const answered = isAnswered(question, raw);
      const correct = isCorrect(question, raw);
      const statusClass = correct ? "correct" : answered ? "wrong" : "unanswered";
      const statusLabel = correct ? "Correct" : answered ? "Incorrect" : "Unanswered";
      const flag = activeTest.flagged.has(question.id) ? `<span class="question-flag-note">${icon("flag")} Flagged</span>` : "";
      const tab = LESSON_TABS[question.lesson];
      const section = QUESTION_SECTIONS[question.id];
      return `<article class="answer-item is-${statusClass}">
        <div class="answer-item-head"><span class="answer-num">Q${String(question.id).padStart(2, "0")}</span><span class="answer-status answer-status--${statusClass}">${icon(correct ? "check" : answered ? "x" : "info")}${statusLabel}</span>${flag}<span class="question-type">${esc(question.type === "mc" ? "Multiple choice" : question.type === "pair" ? "Two answers" : "Numeric")}</span></div>
        <p class="answer-prompt">${esc(question.prompt)}</p>
        <div class="answer-compare">
          <span class="answer-choice${correct ? " is-correct" : answered ? " is-wrong" : ""}"><b>You:</b> ${esc(answerText(question, raw))}</span>
          <span class="answer-choice is-correct"><b>Correct:</b> ${esc(correctText(question))}</span>
        </div>
        <p class="answer-why"><b>Why:</b> ${esc(question.why)}</p>
        <button class="answer-link" type="button" data-nav="${reviewHref(tab, section)}">${icon("book-open")} Reread this section</button>
      </article>`;
    }).join("");
  }

  function renderResults() {
    const result = activeTest.result;
    const band = getBand(result.score);
    const scorePercent = percent(result.score, TEST.length);
    return `
      <section class="test-page test-results" data-test-root>
        <div class="results-hero">
          <div class="score-ring" style="--score:${scorePercent}">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle class="ring-track" cx="60" cy="60" r="52" pathLength="100"></circle>
              <circle class="ring-fill" cx="60" cy="60" r="52" pathLength="100" stroke-dasharray="100" stroke-dashoffset="${100 - scorePercent}" data-result-ring></circle>
            </svg>
            <div class="score-ring-copy"><strong>${result.score}</strong><small>of ${TEST.length} · ${scorePercent}%</small></div>
          </div>
          <div class="results-copy">
            <span class="band-badge band-badge--${band.className}">${band.label}</span>
            <span class="eyebrow" style="margin-top:6px">Attempt complete</span>
            <h1>${band.title}</h1>
            <p>${band.note}</p>
            <div class="result-meta">
              <span>${icon("clock")} ${formatTime(result.duration)}</span>
              <span>${icon("clipboard-check")} ${result.answered} answered</span>
              <span>${icon("flag")} ${result.flagged.length} flagged</span>
              <span>${icon("target")} ${band.label}</span>
            </div>
          </div>
          <div class="results-actions">
            <button class="btn btn-primary btn-sm" type="button" data-retake-test>${icon("rotate")} Retake test</button>
            <button class="btn btn-secondary btn-sm" type="button" data-review-missed>Review missed</button>
            <button class="btn btn-ghost btn-sm" type="button" data-test-home>${icon("arrow-left")} Test home</button>
          </div>
        </div>

        <div class="results-diagnosis">
          <div class="breakdown-card">
            <h2>Where the points came from</h2>
            <p>Each block maps to one of the four modules.</p>
            <div class="breakdown-list">${renderBreakdown()}</div>
          </div>
          <div class="diagnosis-card">
            <h2>What to reread</h2>
            <p>Click a line to jump to the exact module section.</p>
            <div class="diagnosis-list">${renderDiagnosis()}</div>
          </div>
        </div>

        <section class="review-section" id="answer-review">
          <div class="review-toolbar">
            <div><h2>Answer review</h2><p>Every prompt, your answer, the correct answer, and the reasoning.</p></div>
            <div class="review-filters" role="group" aria-label="Filter answers">
              <button class="review-filter${reviewFilter === "all" ? " is-active" : ""}" type="button" data-review-filter="all">All</button>
              <button class="review-filter${reviewFilter === "missed" ? " is-active" : ""}" type="button" data-review-filter="missed">Missed</button>
              <button class="review-filter${reviewFilter === "flagged" ? " is-active" : ""}" type="button" data-review-filter="flagged">Flagged</button>
            </div>
          </div>
          <div class="answer-list" data-answer-list>${renderAnswers()}</div>
        </section>
      </section>`;
  }

  function content() {
    if (!activeTest) return renderIntro();
    return activeTest.finished ? renderResults() : renderRunner();
  }

  function stopTimer() {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function updateTimerUI() {
    if (!activeTest || activeTest.finished) return;
    const node = document.querySelector("[data-test-timer]");
    const seconds = activeTest.mode === "timed" ? activeTest.remaining : activeTest.elapsed;
    if (node) node.textContent = formatTime(seconds);
    const timer = node?.closest(".test-timer");
    if (timer) timer.classList.toggle("is-low", activeTest.mode === "timed" && seconds <= 300);
  }

  function startTimer() {
    stopTimer();
    if (!activeTest || activeTest.finished) return;
    updateTimerUI();
    timerId = window.setInterval(() => {
      if (!activeTest || activeTest.finished) {
        stopTimer();
        return;
      }
      if (activeTest.mode === "timed") {
        activeTest.remaining = Math.max(0, activeTest.remaining - 1);
        updateTimerUI();
        if (activeTest.remaining <= 0) submitTest({ auto: true });
      } else {
        activeTest.elapsed += 1;
        updateTimerUI();
      }
    }, 1000);
  }

  function refreshPalette() {
    if (!activeTest) return;
    const palette = document.querySelector("[data-test-palette]");
    if (palette) {
      [...palette.querySelectorAll("[data-palette-q]")].forEach((button) => {
        const index = Number(button.dataset.paletteQ);
        const question = TEST[index];
        const answered = isAnswered(question, activeTest.answers[index]);
        const flagged = activeTest.flagged.has(question.id);
        button.classList.toggle("is-answered", answered);
        button.classList.toggle("has-flag", flagged);
        button.setAttribute("aria-label", `Question ${question.id}, ${answered ? "answered" : "unanswered"}${flagged ? ", flagged" : ""}`);
      });
    }
    const answered = TEST.filter((question, index) => isAnswered(question, activeTest.answers[index])).length;
    const progressLabel = document.querySelector("[data-test-progress-label]");
    if (progressLabel) progressLabel.textContent = `${answered} of ${TEST.length} answered`;
    const progress = document.querySelector("[data-test-progress]");
    if (progress) progress.style.width = `${percent(answered, TEST.length)}%`;
    const progressTrack = progress?.parentElement;
    if (progressTrack) progressTrack.setAttribute("aria-valuenow", String(answered));
    const left = document.querySelector("[data-test-palette-count]");
    if (left) left.textContent = `${TEST.length - answered} left`;
    syncPaletteCurrent();
  }

  function syncPaletteCurrent() {
    if (!activeTest) return;
    document.querySelectorAll("[data-palette-q]").forEach((button) => {
      const current = Number(button.dataset.paletteQ) === activeTest.index;
      button.classList.toggle("is-current", current);
      button.setAttribute("aria-current", current ? "step" : "false");
    });
    const legend = document.querySelector(".test-legend span:last-child");
    if (legend) legend.textContent = `Question ${TEST[activeTest.index].id} current`;
  }

  function setOption(index) {
    if (!activeTest) return;
    const question = TEST[activeTest.index];
    if (question.type !== "mc") return;
    activeTest.answers[activeTest.index] = index;
    document.querySelectorAll("[data-option]").forEach((button) => {
      const selected = Number(button.dataset.option) === index;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
      const mark = button.querySelector(".option-mark");
      if (mark) mark.innerHTML = selected ? icon("check") : "";
    });
    refreshPalette();
    RS.playSound("click");
  }

  function setNumber(value) {
    if (!activeTest) return;
    activeTest.answers[activeTest.index] = value === "" ? null : value;
    refreshPalette();
  }

  function setPair(key, value) {
    if (!activeTest) return;
    const current = activeTest.answers[activeTest.index];
    activeTest.answers[activeTest.index] = { ...(current && typeof current === "object" ? current : {}), [key]: value };
    refreshPalette();
  }

  function toggleFlag() {
    if (!activeTest) return;
    const question = TEST[activeTest.index];
    if (activeTest.flagged.has(question.id)) activeTest.flagged.delete(question.id);
    else activeTest.flagged.add(question.id);
    const button = document.querySelector("[data-flag-question]");
    const flagged = activeTest.flagged.has(question.id);
    if (button) {
      button.classList.toggle("is-flagged", flagged);
      button.setAttribute("aria-pressed", String(flagged));
      button.innerHTML = `${icon("flag")} ${flagged ? "Flagged" : "Flag for review"}`;
    }
    const flagNote = document.querySelector(".question-flag-note");
    if (flagNote) flagNote.remove();
    const meta = document.querySelector(".question-meta");
    if (flagged && meta) {
      meta.insertAdjacentHTML("beforeend", `<span class="question-flag-note">${icon("flag")} Flagged</span>`);
    }
    refreshPalette();
    RS.playSound("click");
  }

  function goTo(index) {
    if (!activeTest) return;
    const nextIndex = clamp(index, 0, TEST.length - 1);
    if (nextIndex === activeTest.index) return;
    questionDirection = nextIndex >= activeTest.index ? 1 : -1;
    activeTest.index = nextIndex;
    moveQuestion();
  }

  function moveQuestion() {
    const main = document.querySelector("[data-test-main]");
    if (!main) {
      repaint();
      return;
    }
    const oldCard = main.querySelector("[data-question-card]");
    oldCard?.style.setProperty("--question-dir", String(questionDirection));
    const token = ++questionToken;
    let swapped = false;
    const swap = () => {
      if (swapped || token !== questionToken) return;
      swapped = true;
      main.innerHTML = renderQuestion();
      bindQuestion(main);
      syncPaletteCurrent();
    };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pageMorphing = document.getElementById("view")?.classList.contains("is-page-transition");
    if (pageMorphing || reduceMotion || typeof document.startViewTransition !== "function") {
      swap();
      return;
    }
    if (questionTransition) {
      try {
        questionTransition.skipTransition();
      } catch (error) {
        /* Ignore a transition that already finished. */
      }
    }
    try {
      const transition = document.startViewTransition(swap);
      questionTransition = transition;
      transition.ready?.catch(() => {});
      transition.updateCallbackDone?.catch(() => {});
      const watchdog = window.setTimeout(() => {
        try {
          transition.skipTransition();
        } catch (error) {
          /* Ignore a transition that already ended. */
        }
        swap();
      }, 720);
      transition.finished.catch(() => {}).finally(() => {
        window.clearTimeout(watchdog);
        if (questionTransition === transition) questionTransition = null;
      });
    } catch (error) {
      questionTransition = null;
      swap();
    }
  }

  function repaint({ scroll = false } = {}) {
    questionToken += 1;
    if (questionTransition) {
      try {
        questionTransition.skipTransition();
      } catch (error) {
        /* Ignore a transition that already ended. */
      }
      questionTransition = null;
    }
    const root = document.querySelector("[data-test-root]");
    if (!root) return;
    const template = document.createElement("template");
    template.innerHTML = content();
    const next = template.content.firstElementChild;
    if (!next) return;
    root.replaceWith(next);
    bindPractice(next);
    if (scroll) {
      const topbar = document.querySelector(".topbar")?.getBoundingClientRect().height || 0;
      const tabs = document.querySelector(".reviewer-tabs-wrap")?.getBoundingClientRect().height || 0;
      const top = next.getBoundingClientRect().top + window.scrollY - topbar - tabs - 8;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  }

  function startTest(mode) {
    activeTest = {
      mode: mode === "practice" ? "practice" : "timed",
      index: 0,
      answers: Array(TEST.length).fill(null),
      flagged: new Set(),
      remaining: LIMIT,
      elapsed: 0,
      finished: false,
      result: null
    };
    reviewFilter = "all";
    repaint({ scroll: true });
    RS.playSound("start");
    RS.toast(activeTest.mode === "timed" ? "25 minutes on the clock. Good luck." : "Practice mode: no countdown. Take your time.", "default");
  }

  function confirmSubmit() {
    if (!activeTest || activeTest.finished) return;
    const answered = TEST.filter((question, index) => isAnswered(question, activeTest.answers[index])).length;
    const unanswered = TEST.length - answered;
    RS.openConfirm({
      title: "Submit the test?",
      message: unanswered
        ? `${unanswered} question${unanswered === 1 ? " is" : "s are"} still unanswered. You can keep working or submit and review every answer.`
        : "All 31 questions are answered. Submit now to see your score and full answer review.",
      confirmLabel: "Submit & see results",
      cancelLabel: "Keep working",
      onConfirm: () => submitTest()
    });
  }

  function submitTest({ auto = false } = {}) {
    if (!activeTest || activeTest.finished) return;
    stopTimer();
    const correctById = {};
    let score = 0;
    let answered = 0;
    TEST.forEach((question, index) => {
      const raw = activeTest.answers[index];
      if (isAnswered(question, raw)) answered += 1;
      const correct = isCorrect(question, raw);
      correctById[question.id] = correct;
      if (correct) score += 1;
    });
    const date = new Date().toISOString();
    const duration = activeTest.mode === "timed" ? LIMIT - activeTest.remaining : activeTest.elapsed;
    const previousBest = state.test.best;
    const result = {
      score,
      total: TEST.length,
      answered,
      duration,
      date,
      mode: activeTest.mode,
      correctById,
      flagged: [...activeTest.flagged]
    };
    activeTest.result = result;
    activeTest.finished = true;
    state.test.attempts.unshift({ score, total: TEST.length, mode: activeTest.mode, duration, date });
    state.test.attempts = state.test.attempts.slice(0, 30);
    state.test.best = Math.max(previousBest, score);
    RS.saveState();
    RS.updateShell();
    reviewFilter = "all";
    repaint({ scroll: true });
    const newBest = score > previousBest;
    if (auto) RS.toast("Time's up — your test was submitted automatically.", "default", 5000);
    RS.playSound(score >= 26 ? "win" : "click");
    if (score >= 26 || newBest) window.setTimeout(() => RS.celebrate(score >= 26 ? 1.3 : 0.8), 250);
    if (score >= 26) RS.toast(`Exam-ready: ${score}/31. That is a strong result.`, "success", 5000);
    else if (newBest) RS.toast(`New personal best: ${score}/31.`, "success", 4500);
    else RS.toast(`Attempt saved: ${score}/31. Use the review below.`, "default", 4500);
  }

  function exitTest() {
    if (!activeTest || activeTest.finished) {
      activeTest = null;
      repaint({ scroll: true });
      return;
    }
    RS.openConfirm({
      title: "Leave this attempt?",
      message: "Your current answers and flags will be discarded. Your saved best score and previous attempts will not change.",
      confirmLabel: "Leave and discard",
      cancelLabel: "Keep testing",
      danger: true,
      onConfirm: () => {
        activeTest = null;
        reviewFilter = "all";
        repaint({ scroll: true });
      }
    });
  }

  function setReviewFilter(filter) {
    reviewFilter = filter;
    document.querySelectorAll("[data-review-filter]").forEach((button) => button.classList.toggle("is-active", button.dataset.reviewFilter === filter));
    const list = document.querySelector("[data-answer-list]");
    if (list) list.innerHTML = renderAnswers();
  }

  function attachRunnerKeys() {
    if (runnerKeyHandler) document.removeEventListener("keydown", runnerKeyHandler);
    runnerKeyHandler = (event) => {
      if (!activeTest || activeTest.finished) return;
      if (event.ctrlKey || event.metaKey || event.altKey) {
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
          event.preventDefault();
          confirmSubmit();
        }
        return;
      }
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName || "")) return;
      const question = TEST[activeTest.index];
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(activeTest.index - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(activeTest.index + 1);
      } else if (question.type === "mc" && /^[1-5]$/.test(event.key)) {
        const choice = Number(event.key) - 1;
        if (choice < question.options.length) {
          event.preventDefault();
          setOption(choice);
        }
      } else if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        toggleFlag();
      }
    };
    document.addEventListener("keydown", runnerKeyHandler);
  }

  function bindIntro(root) {
    root.querySelector("[data-start-test]")?.addEventListener("click", () => {
      const mode = root.querySelector('input[name="test-mode"]:checked')?.value || "timed";
      startTest(mode);
    });
  }

  function bindQuestion(root) {
    root.querySelectorAll("[data-option]").forEach((button) => {
      button.addEventListener("click", () => setOption(Number(button.dataset.option)));
    });
    root.querySelectorAll("[data-number-answer]").forEach((input) => {
      input.addEventListener("input", () => setNumber(input.value));
    });
    root.querySelectorAll("[data-pair-key]").forEach((input) => {
      input.addEventListener("input", () => setPair(input.dataset.pairKey, input.value));
    });
    root.querySelector("[data-flag-question]")?.addEventListener("click", toggleFlag);
    root.querySelector("[data-prev-question]")?.addEventListener("click", () => goTo(activeTest.index - 1));
    root.querySelector("[data-next-question]")?.addEventListener("click", () => goTo(activeTest.index + 1));
    root.querySelectorAll("[data-submit-test]").forEach((button) => button.addEventListener("click", confirmSubmit));
  }

  function bindRunner(root) {
    bindQuestion(root);
    root.querySelectorAll("[data-palette-q]").forEach((button) => {
      button.addEventListener("click", () => goTo(Number(button.dataset.paletteQ)));
    });
    root.querySelector("[data-exit-test]")?.addEventListener("click", exitTest);
    attachRunnerKeys();
    startTimer();
  }

  function bindResults(root) {
    root.querySelector("[data-retake-test]")?.addEventListener("click", () => startTest(activeTest.result.mode));
    root.querySelector("[data-test-home]")?.addEventListener("click", () => {
      activeTest = null;
      reviewFilter = "all";
      repaint({ scroll: true });
    });
    root.querySelector("[data-review-missed]")?.addEventListener("click", () => {
      setReviewFilter("missed");
      document.getElementById("answer-review")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    root.querySelectorAll("[data-review-filter]").forEach((button) => {
      button.addEventListener("click", () => setReviewFilter(button.dataset.reviewFilter));
    });
    const ring = root.querySelector("[data-result-ring]");
    if (ring) {
      const finalOffset = ring.getAttribute("stroke-dashoffset");
      ring.setAttribute("stroke-dashoffset", "100");
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => ring.setAttribute("stroke-dashoffset", finalOffset)));
    }
  }

  function bindPractice(root = document.querySelector("[data-test-root]")) {
    if (!root) return;
    if (!activeTest) {
      bindIntro(root);
      stopTimer();
      return;
    }
    if (activeTest.finished) {
      stopTimer();
      bindResults(root);
      return;
    }
    bindRunner(root);
  }

  function cleanupPractice() {
    stopTimer();
    questionToken += 1;
    if (runnerKeyHandler) {
      document.removeEventListener("keydown", runnerKeyHandler);
      runnerKeyHandler = null;
    }
    if (questionTransition) {
      try {
        questionTransition.skipTransition();
      } catch (error) {
        /* Nothing left to skip. */
      }
      questionTransition = null;
    }
  }

  RS.renderPracticeTest = () => content();
  RS.bindPractice = bindPractice;
  RS.cleanupPractice = cleanupPractice;
  RS.sessionResets.push(() => {
    cleanupPractice();
    activeTest = null;
    reviewFilter = "all";
  });
})();
