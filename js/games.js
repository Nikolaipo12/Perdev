/* ==========================================================================
   Personal Development Reviewer - arcade
   ========================================================================== */
(() => {
  "use strict";

  const RS = window.RS;
  const { DATA, state, esc, icon, formatTime, shuffle, percent } = RS;
  const GAMES = DATA.games;
  const KEYS = Object.keys(GAMES);
  const LESSON_NUMS = { mind: "01", heart: "02", life: "03", crossword: "04" };

  let active = null;
  let timerId = null;
  let keyHandler = null;

  const bestTotal = () => KEYS.reduce((sum, key) => sum + (state.games[key]?.best || 0), 0);
  const pointsFor = (streak) => 100 + Math.max(0, streak - 1) * 25;
  const starsFor = (correct) => correct >= 9 ? 3 : correct >= 7 ? 2 : correct >= 5 ? 1 : 0;

  function prepareQuestions(game) {
    return shuffle(game.questions).map((question) => ({
      prompt: question.prompt,
      why: question.why,
      options: shuffle(question.options.map((text, originalIndex) => ({
        text,
        correct: originalIndex === question.answer
      })))
    }));
  }

  function soundButton() {
    return `<button class="game-icon-btn" type="button" data-game-sound data-sound-toggle aria-pressed="${state.settings.sound}" aria-label="${state.settings.sound ? "Mute game sounds" : "Enable game sounds"}" title="${state.settings.sound ? "Mute game sounds" : "Enable game sounds"}">${icon(state.settings.sound ? "volume" : "volume-off")}</button>`;
  }

  function renderHub() {
    return `
      <div class="page-enter" data-game-page>
        <section class="games-page">
          <div class="arcade-hero">
            <div class="arcade-copy">
              <span class="eyebrow">Play to learn · A.Y. 2025–2026</span>
              <h1>The Study<br><em>Arcade</em></h1>
              <p>Four fast games across the four modules. Three rapid-fire recall rounds, plus a crossword where every completed word blooms into its meaning.</p>
              <div class="arcade-chips"><span class="tag">90 seconds per recall round</span><span class="tag">8-word crossword</span><span class="tag">Streak bonuses</span><span class="tag">Instant explanations</span></div>
            </div>
            <aside class="arcade-scoreboard" aria-label="Your arcade best scores">
              <span>Total personal best</span>
              <div class="arcade-total">${bestTotal().toLocaleString("en-US")}<small>points</small></div>
              <p>Best scores are saved in this browser. Each game can be replayed as often as you like.</p>
              <div class="arcade-score-rows">
                ${KEYS.map((key) => `<div class="arcade-score-row"><span><i></i>${esc(GAMES[key].name)}</span><b>${(state.games[key]?.best || 0).toLocaleString("en-US")}</b></div>`).join("")}
              </div>
            </aside>
          </div>

          <div class="game-grid">
            ${KEYS.map((key) => {
              const game = GAMES[key];
              const progress = active && active.key === key && !active.finished;
              const isCrossword = game.type === "crossword";
              return `
                <article class="game-card game-card--${game.color}">
                  <div class="game-visual">
                    <span class="game-visual-ring" aria-hidden="true"></span>
                    <span class="game-visual-icon">${icon(game.icon)}</span>
                    <span class="game-visual-tag">${esc(game.kicker)}</span>
                  </div>
                  <div class="game-card-body">
                    <span class="game-kicker">${esc(game.tagline)}</span>
                    <h2>${esc(game.name)}</h2>
                    <p>${esc(game.description)}</p>
                    <div class="game-meta-row">
                      <span>${icon(isCrossword ? "grid" : "list")} ${isCrossword ? "8 words" : "10 questions"}</span>
                      <span>${icon(isCrossword ? "lightbulb" : "clock")} ${isCrossword ? "No timer" : "90 sec"}</span>
                      <span>${icon("sparkles")} ${state.games[key]?.plays || 0} plays</span>
                    </div>
                    <div class="game-card-foot">
                      <span class="game-best">Best <b>${(state.games[key]?.best || 0).toLocaleString("en-US")}</b></span>
                      <button class="btn btn-primary btn-sm game-play-btn" type="button" data-nav="#/games?game=${key}">${progress ? "Resume" : state.games[key]?.plays ? "Play again" : "Play"} ${icon("arrow-right")}</button>
                    </div>
                  </div>
                </article>`;
            }).join("")}
          </div>

          <div class="arcade-foot">
            <div><span class="eyebrow">Want the full picture?</span><p><b>The arcade is fast recall.</b> The 31-item practice test is the full check, with a timer, diagnosis, and answer review.</p></div>
            <div class="page-head-side">
              <button class="btn btn-secondary btn-sm" type="button" data-nav="#/cheat">${icon("file-text")} Cheat sheet</button>
              <button class="btn btn-primary btn-sm" type="button" data-nav="#/test">${icon("clipboard-check")} Practice test</button>
            </div>
          </div>
        </section>
      </div>`;
  }

  function gameTopbar(game, mode = "game") {
    const current = active && active.key === game.key ? active : null;
    return `
      <div class="game-topbar">
        <button class="game-back" type="button" data-nav="#/games">${icon("arrow-left")} Arcade</button>
        <div class="game-title-mini"><span>${esc(game.kicker)}</span><strong>${esc(game.name)}</strong></div>
        <div class="game-hud">
          <div class="game-hud-item"><span>Score</span><strong data-game-score>${current?.score ?? 0}</strong></div>
          <div class="game-hud-item"><span>Streak</span><strong data-game-streak class="${current && current.answered && current.lastCorrect && current.streak > 1 ? "game-streak-flash" : ""}">${current?.streak ?? 0}</strong></div>
          <div class="game-hud-item"><span>Best</span><strong>${(state.games[game.key]?.best || 0).toLocaleString("en-US")}</strong></div>
          <div class="game-timer${current && current.remaining <= 20 ? " is-low" : ""}" role="timer" aria-label="Time remaining"><span class="game-timer-icon">${icon("clock")}</span><strong data-game-timer>${formatTime(current?.remaining ?? game.duration)}</strong></div>
          ${soundButton()}
        </div>
      </div>`;
  }

  function renderReady(game) {
    return `
      <div class="page-enter" data-game-page>
        <section class="game-screen" data-game-key="${game.key}">
          ${gameTopbar(game, "ready")}
          <div class="game-progress"><i style="width:0%"></i></div>
          <div class="game-body">
            <div class="game-question-meta">
              <span class="game-qnum"><b>${game.questions.length} scenarios</b> · 90 seconds</span>
              <span class="game-cat-pill">${esc(game.kicker)}</span>
            </div>
            <h1 class="game-question">${esc(game.name)}</h1>
            <p style="margin-top:10px;max-width:620px;font-size:0.78rem;line-height:1.7;color:rgba(247,240,226,0.55)">${esc(game.description)}</p>
            <div class="game-feedback" style="margin-top:20px">
              <div class="game-feedback-title">${icon("target")} How this round works</div>
              <p><b>Answer as many of the 10 scenarios as you can in 90 seconds.</b> Correct answers earn 100 points. Each consecutive correct answer adds a 25-point streak bonus. Feedback pauses the clock so you can read the explanation. Three stars needs at least 9 correct.</p>
            </div>
            <div class="game-actions">
              <button class="btn btn-primary" type="button" data-start-game="${game.key}">${icon("play")} Start the round</button>
              <span class="game-hint">Personal best: ${(state.games[game.key]?.best || 0).toLocaleString("en-US")} ${esc(game.pointsLabel)}</span>
            </div>
            <div class="game-bg-number" aria-hidden="true">${LESSON_NUMS[game.key]}</div>
          </div>
        </section>
      </div>`;
  }

  function renderQuestion(game) {
    const question = active.questions[active.index];
    const answered = active.answered;
    const answeredCount = active.answeredCount;
    return `
      <div class="game-question-meta">
        <span class="game-qnum">Question <b>${active.index + 1}</b> / ${active.questions.length}</span>
        <span class="game-cat-pill">${esc(game.tagline)}</span>
      </div>
      <h1 class="game-question">${esc(question.prompt)}</h1>
      <div class="game-options" role="group" aria-label="Answer choices">
        ${question.options.map((option, optionIndex) => {
          const isSelected = answered && optionIndex === active.selected;
          const className = ["game-option"];
          if (answered && option.correct) className.push("is-correct");
          if (answered && isSelected && !option.correct) className.push("is-wrong");
          if (answered && !option.correct && !isSelected) className.push("is-dimmed");
          return `<button class="${className.join(" ")}" type="button" data-game-option="${optionIndex}"${answered ? " disabled" : ""}>
            <span class="game-option-key">${String.fromCharCode(65 + optionIndex)}</span><span>${esc(option.text)}</span>
          </button>`;
        }).join("")}
      </div>
      ${answered ? renderFeedback(question) : `<div class="game-actions"><span class="game-hint">Choose the best answer. Press 1–${question.options.length} to answer.</span><span class="game-hint">${answeredCount} answered</span></div>`}
      <div class="game-bg-number" aria-hidden="true">${LESSON_NUMS[game.key]}</div>`;
  }

  function renderFeedback(question) {
    const isCorrect = active.lastCorrect;
    return `
      <div class="game-feedback ${isCorrect ? "is-correct" : "is-wrong"}">
        <div class="game-feedback-title">${icon(isCorrect ? "check-circle" : "x-circle")} ${isCorrect ? "Correct" : "Not quite"}<span class="points-earned">${isCorrect ? `+${active.lastPoints}` : "+0"}</span></div>
        <p><b>${isCorrect ? "" : `Correct answer: ${esc(question.options.find((option) => option.correct)?.text || "")}. `}</b>${esc(question.why)}</p>
      </div>
      <div class="game-actions">
        <span class="game-hint">${active.index < active.questions.length - 1 ? "The clock resumes on the next question." : "Last question — see your round result."}</span>
        <button class="btn btn-primary" type="button" data-next-game-question>${active.index < active.questions.length - 1 ? `Next question ${icon("arrow-right")}` : `See results ${icon("arrow-right")}`}</button>
      </div>`;
  }

  function renderActive(game) {
    return `
      <div class="page-enter" data-game-page>
        <section class="game-screen" data-game-key="${game.key}">
          ${gameTopbar(game)}
          <div class="game-progress"><i style="width:${percent(active.answeredCount, active.questions.length)}%"></i></div>
          <div class="game-body">
            ${renderQuestion(game)}
          </div>
        </section>
      </div>`;
  }

  function renderResult() {
    const game = GAMES[active.key];
    const stars = starsFor(active.correct);
    const headline = stars === 3 ? "Sharp. <em>Very sharp.</em>" : stars === 2 ? "A strong <em>round</em>." : stars === 1 ? "Good start. <em>Run it back.</em>" : "Read the tells. <em>Try again.</em>";
    const accuracy = percent(active.correct, Math.max(1, active.answeredCount));
    const missed = active.answers.filter((answer) => !answer.correct);
    return `
      <div class="page-enter" data-game-page>
        <section class="game-screen" data-game-key="${active.key}">
          ${gameTopbar(game, "result")}
          <div class="game-result">
            <span class="eyebrow">Round complete · ${esc(game.name)}</span>
            <div class="game-stars" aria-label="${stars} of 3 stars">
              ${[0, 1, 2].map((index) => `<span class="game-star${index < stars ? " is-on" : ""}">${icon("star")}</span>`).join("")}
            </div>
            <h1>${headline}</h1>
            <p>${active.result.newBest ? "That is a new personal best." : `Your best for this game remains ${(state.games[active.key]?.best || 0).toLocaleString("en-US")} points.`} ${active.result.reason === "time" ? "The 90-second clock ran out." : "All ten scenarios were answered."}</p>
            <div class="game-result-score"><strong>${active.score.toLocaleString("en-US")}</strong><span>${esc(game.pointsLabel)}</span></div>
            <div class="game-result-stats">
              <div class="game-result-stat"><span>Correct</span><b>${active.correct} / ${active.questions.length}</b></div>
              <div class="game-result-stat"><span>Best streak</span><b>${active.bestStreak}</b></div>
              <div class="game-result-stat"><span>Accuracy</span><b>${accuracy}%</b></div>
            </div>
            <div class="game-result-actions">
              <button class="btn btn-primary" type="button" data-start-game="${active.key}">${icon("rotate")} Play again</button>
              <button class="btn btn-secondary" type="button" data-nav="#/games">${icon("arrow-left")} Back to arcade</button>
              <button class="btn btn-ghost" type="button" data-nav="#/test">${icon("clipboard-check")} Practice test</button>
            </div>
            ${missed.length
              ? `<div class="game-result-review"><h2>Review the ${missed.length === 1 ? "one" : missed.length} you missed</h2><div class="game-review-list">${missed.map((answer) => `<div class="game-review-item">${icon("x-circle")}<span><b>${esc(answer.question.prompt)}</b><br>Correct: ${esc(answer.question.options.find((option) => option.correct)?.text || "")} — ${esc(answer.question.why)}</span></div>`).join("")}</div></div>`
              : `<p class="game-result-perfect">${icon("award")} No misses. Try another game or take the full practice test.</p>`}
          </div>
        </section>
      </div>`;
  }

  function renderGame(key) {
    const game = GAMES[key];
    if (!game) return renderHub();
    if (game.type === "crossword") return RS.renderCrossword?.() || renderHub();
    if (!active || active.key !== key) return renderReady(game);
    if (active.finished) return renderResult();
    return renderActive(game);
  }

  function renderGames(route) {
    const key = route?.params?.game;
    return key && GAMES[key] ? renderGame(key) : renderHub();
  }

  function repaint() {
    const root = document.querySelector("[data-game-page]");
    if (!root) return;
    const route = RS.normalizeRoute();
    const template = document.createElement("template");
    template.innerHTML = renderGames(route);
    const next = template.content.firstElementChild;
    root.replaceWith(next);
    bindGames(next, route);
  }

  function stopTimer() {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function updateTimerUI() {
    if (!active) return;
    const node = document.querySelector("[data-game-timer]");
    if (node) node.textContent = formatTime(active.remaining);
    node?.closest(".game-timer")?.classList.toggle("is-low", active.remaining <= 20);
  }

  function startTimer() {
    stopTimer();
    if (!active || active.finished || active.answered) return;
    updateTimerUI();
    timerId = window.setInterval(() => {
      if (!active || active.finished || active.answered) {
        stopTimer();
        return;
      }
      active.remaining -= 1;
      updateTimerUI();
      if (active.remaining <= 0) {
        active.remaining = 0;
        finishGame("time");
      }
    }, 1000);
  }

  function startGame(key) {
    const game = GAMES[key];
    if (!game || game.type === "crossword") return;
    stopTimer();
    active = {
      key,
      questions: prepareQuestions(game),
      index: 0,
      score: 0,
      streak: 0,
      bestStreak: 0,
      correct: 0,
      answeredCount: 0,
      answers: [],
      selected: null,
      answered: false,
      lastCorrect: false,
      lastPoints: 0,
      remaining: game.duration,
      finished: false,
      result: null
    };
    state.games[key].plays += 1;
    RS.saveState();
    RS.updateShell();
    repaint();
    RS.playSound("start");
  }

  function answerQuestion(optionIndex) {
    if (!active || active.finished || active.answered) return;
    const game = GAMES[active.key];
    const question = active.questions[active.index];
    const option = question.options[optionIndex];
    if (!option) return;
    stopTimer();
    active.selected = optionIndex;
    active.answered = true;
    active.answeredCount += 1;
    active.lastCorrect = option.correct;
    if (option.correct) {
      active.correct += 1;
      active.streak += 1;
      active.bestStreak = Math.max(active.bestStreak, active.streak);
      active.lastPoints = pointsFor(active.streak);
      active.score += active.lastPoints;
    } else {
      active.streak = 0;
      active.lastPoints = 0;
    }
    active.answers.push({
      question,
      selected: optionIndex,
      correct: option.correct,
      points: active.lastPoints
    });
    RS.playSound(option.correct ? "correct" : "wrong");
    repaint();
  }

  function nextQuestion() {
    if (!active || active.finished || !active.answered) return;
    if (active.index >= active.questions.length - 1) {
      finishGame("complete");
      return;
    }
    active.index += 1;
    active.selected = null;
    active.answered = false;
    active.lastCorrect = false;
    active.lastPoints = 0;
    repaint();
  }

  function finishGame(reason = "complete") {
    if (!active || active.finished) return;
    stopTimer();
    active.finished = true;
    active.result = { reason, newBest: false };
    const previousBest = state.games[active.key].best || 0;
    if (active.score > previousBest) {
      state.games[active.key].best = active.score;
      active.result.newBest = true;
    }
    RS.saveState();
    RS.updateShell();
    const stars = starsFor(active.correct);
    RS.playSound(stars === 3 ? "win" : "click");
    if (stars === 3 || active.result.newBest) window.setTimeout(() => RS.celebrate(stars === 3 ? 1.1 : 0.65), 240);
    repaint();
    if (stars === 3) RS.toast("Three stars. You know this lesson.", "success", 4500);
    else if (active.result.newBest) RS.toast("New personal best in the arcade.", "success", 3800);
  }

  function bindSound(root) {
    root.querySelector("[data-game-sound]")?.addEventListener("click", () => {
      RS.toggleSound();
      const button = root.querySelector("[data-game-sound]");
      if (button) {
        button.innerHTML = icon(state.settings.sound ? "volume" : "volume-off");
        button.setAttribute("aria-pressed", String(state.settings.sound));
        button.setAttribute("aria-label", state.settings.sound ? "Mute game sounds" : "Enable game sounds");
      }
    });
  }

  function attachKeys() {
    if (keyHandler) document.removeEventListener("keydown", keyHandler);
    keyHandler = (event) => {
      if (!active || active.finished) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName || "")) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.target?.closest?.("button, a")) return;
      if (!active.answered && /^[1-5]$/.test(event.key)) {
        const optionIndex = Number(event.key) - 1;
        if (optionIndex < active.questions[active.index].options.length) {
          event.preventDefault();
          answerQuestion(optionIndex);
        }
      } else if (active.answered && event.key === "Enter") {
        event.preventDefault();
        nextQuestion();
      }
    };
    document.addEventListener("keydown", keyHandler);
  }

  function bindGames(root = document.querySelector("[data-game-page]"), route = RS.normalizeRoute()) {
    if (!root) return;
    bindSound(root);
    if (keyHandler) {
      document.removeEventListener("keydown", keyHandler);
      keyHandler = null;
    }
    const key = route?.params?.game;
    if (!key || !GAMES[key]) {
      stopTimer();
      return;
    }
    if (GAMES[key].type === "crossword") {
      stopTimer();
      if (keyHandler) {
        document.removeEventListener("keydown", keyHandler);
        keyHandler = null;
      }
      RS.bindCrossword?.(root);
      return;
    }
    root.querySelector("[data-start-game]")?.addEventListener("click", () => startGame(key));
    root.querySelectorAll("[data-game-option]").forEach((button) => {
      button.addEventListener("click", () => answerQuestion(Number(button.dataset.gameOption)));
    });
    root.querySelector("[data-next-game-question]")?.addEventListener("click", nextQuestion);
    if (active && active.key === key && !active.finished) {
      attachKeys();
      if (!active.answered) startTimer();
      else stopTimer();
    } else {
      stopTimer();
    }
  }

  function cleanupGames() {
    stopTimer();
    RS.cleanupCrossword?.();
    if (active?.finished) active = null;
    if (keyHandler) {
      document.removeEventListener("keydown", keyHandler);
      keyHandler = null;
    }
  }

  RS.renderGames = renderGames;
  RS.bindGames = bindGames;
  RS.cleanupGames = cleanupGames;
  RS.sessionResets.push(() => {
    cleanupGames();
    active = null;
  });
})();
