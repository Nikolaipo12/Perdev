/* ==========================================================================
   Personal Development Reviewer - Word Garden crossword
   A keyboard-friendly crossword where every completed word blooms open.
   ========================================================================== */
(() => {
  "use strict";

  const RS = window.RS;
  const { DATA, state, esc, icon } = RS;
  const CROSSWORD = DATA.crossword;
  const WORD_POINTS = 100;
  const COMPLETE_BONUS = 250;

  let words = [];
  let found = new Set();
  let activeWordId = null;
  let score = 0;
  let completed = false;
  let started = false;
  let popTimer = null;
  let currentRoot = null;
  let lastCellKey = "";

  const cellKey = (row, col) => `${row}:${col}`;

  function buildWords() {
    const numberAt = new Map();
    let number = 1;
    for (let row = 0; row < CROSSWORD.grid.length; row += 1) {
      for (let col = 0; col < CROSSWORD.grid[row].length; col += 1) {
        const startsHere = CROSSWORD.words.filter((word) => word.row === row && word.col === col);
        if (!startsHere.length) continue;
        numberAt.set(cellKey(row, col), number);
        number += 1;
      }
    }

    words = CROSSWORD.words.map((word, index) => {
      const cells = [];
      for (let step = 0; step < word.answer.length; step += 1) {
        cells.push({
          row: word.row + (word.dir === "down" ? step : 0),
          col: word.col + (word.dir === "across" ? step : 0),
          letter: word.answer[step]
        });
      }
      return {
        ...word,
        id: `cw-${index}`,
        cells,
        number: numberAt.get(cellKey(word.row, word.col)) || index + 1,
        found: false
      };
    });
  }

  function wordForCell(row, col, dir) {
    return words.find((word) => word.dir === dir && word.cells.some((cell) => cell.row === row && cell.col === col)) || null;
  }

  function wordsForCell(row, col) {
    return words.filter((word) => word.cells.some((cell) => cell.row === row && cell.col === col));
  }

  function inputAt(row, col, root = currentRoot) {
    return root?.querySelector(`[data-cw-r="${row}"][data-cw-c="${col}"]`) || null;
  }

  function wordInputs(word, root = currentRoot) {
    return word.cells.map((cell) => inputAt(cell.row, cell.col, root)).filter(Boolean);
  }

  function activeWord() {
    return words.find((word) => word.id === activeWordId) || null;
  }

  function updateHud() {
    if (!currentRoot) return;
    const foundNode = currentRoot.querySelector("[data-cw-found]");
    const scoreNode = currentRoot.querySelector("[data-cw-score]");
    const bestNode = currentRoot.querySelector("[data-cw-best]");
    const progress = currentRoot.querySelector("[data-cw-progress]");
    const progressLabel = currentRoot.querySelector("[data-cw-progress-label]");
    const best = state.games.crossword?.best || 0;
    if (foundNode) foundNode.textContent = `${found.size} / ${words.length}`;
    if (scoreNode) scoreNode.textContent = score.toLocaleString("en-US");
    if (bestNode) bestNode.textContent = Math.max(best, score).toLocaleString("en-US");
    if (progress) progress.style.width = `${(found.size / words.length) * 100}%`;
    if (progressLabel) progressLabel.textContent = `${found.size} of ${words.length} words found`;
  }

  function markStarted() {
    if (started) return;
    started = true;
    state.games.crossword.plays += 1;
    RS.saveState();
    RS.updateShell();
  }

  function saveBest() {
    const previous = state.games.crossword.best || 0;
    if (score > previous) {
      state.games.crossword.best = score;
      RS.saveState();
      return true;
    }
    return false;
  }

  function setActiveWord(word, { focus = false } = {}) {
    if (!word || !currentRoot) return;
    activeWordId = word.id;
    currentRoot.querySelectorAll("[data-cw-cell]").forEach((cell) => cell.classList.remove("is-active"));
    currentRoot.querySelectorAll("[data-cw-clue]").forEach((button) => {
      const active = button.dataset.cwClue === word.id;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
      if (active) button.scrollIntoView({ block: "nearest" });
    });
    word.cells.forEach((cell) => {
      const input = inputAt(cell.row, cell.col);
      input?.closest("[data-cw-cell]")?.classList.add("is-active");
    });
    if (focus) {
      const target = word.cells
        .map((cell) => inputAt(cell.row, cell.col))
        .find((input) => input && !input.value) || wordInputs(word)[0];
      target?.focus({ preventScroll: true });
    }
  }

  function focusCellInput(row, col, direction = null) {
    const input = inputAt(row, col);
    if (!input) return;
    if (direction) {
      const word = wordForCell(row, col, direction) || wordForCell(row, col, direction === "across" ? "down" : "across");
      if (word) setActiveWord(word);
    }
    input.focus({ preventScroll: true });
  }

  function selectWordFromCell(input) {
    if (!input || !currentRoot) return;
    const row = Number(input.dataset.cwR);
    const col = Number(input.dataset.cwC);
    const key = cellKey(row, col);
    const previous = activeWord();
    if (previous && previous.cells.some((cell) => cell.row === row && cell.col === col)) {
      lastCellKey = key;
      return;
    }
    const across = wordForCell(row, col, "across");
    const down = wordForCell(row, col, "down");
    let next = across || down;
    if (previous && key === lastCellKey) {
      if (previous.dir === "across" && down) next = down;
      else if (previous.dir === "down" && across) next = across;
    }
    lastCellKey = key;
    if (next) setActiveWord(next);
  }

  function normalizeLetter(value) {
    return String(value || "").replace(/[^a-z]/gi, "").slice(-1).toUpperCase();
  }

  function moveWithinWord(word, input, delta) {
    const inputs = wordInputs(word);
    const index = inputs.indexOf(input);
    const next = inputs[index + delta];
    next?.focus({ preventScroll: true });
    next?.select();
  }

  function wordIsCorrect(word) {
    return wordInputs(word).every((input, index) => normalizeLetter(input.value) === word.answer[index]);
  }

  function clearWrong(word) {
    wordInputs(word).forEach((input) => {
      input.closest("[data-cw-cell]")?.classList.remove("is-wrong");
      input.removeAttribute("aria-invalid");
    });
  }

  function flashWrong(word) {
    clearWrong(word);
    wordInputs(word).forEach((input) => {
      input.closest("[data-cw-cell]")?.classList.add("is-wrong");
      input.setAttribute("aria-invalid", "true");
    });
    RS.playSound("wrong");
    const message = currentRoot?.querySelector("[data-cw-message]");
    if (message) {
      message.textContent = "Not quite. Check the clue and try that word again.";
      message.classList.remove("is-good");
      message.classList.add("is-bad");
    }
    window.setTimeout(() => clearWrong(word), 900);
  }

  function popupWord(word, { final = false } = {}) {
    const pop = currentRoot?.querySelector("[data-cw-pop]");
    if (!pop) return;
    const isFinal = final || completed;
    pop.innerHTML = `
      <button class="cw-pop-close" type="button" data-cw-close-pop aria-label="Close definition">${icon("x")}</button>
      <span class="cw-pop-kicker">${isFinal ? "Word garden complete" : `${word.dir === "across" ? "Across" : "Down"} ${word.number} · found`}</span>
      <strong>${esc(word.term || word.answer)}</strong>
      <p>${esc(word.definition)}</p>
      <div class="cw-pop-foot">
        <span>${esc(word.answer)}</span>
        <b>${isFinal ? "+ completion bonus" : "+100 points"}</b>
      </div>`;
    pop.hidden = false;
    pop.classList.remove("is-open");
    void pop.offsetWidth;
    pop.classList.add("is-open");
    pop.querySelector("[data-cw-close-pop]")?.addEventListener("click", hidePopup);
    if (popTimer) window.clearTimeout(popTimer);
    popTimer = window.setTimeout(hidePopup, isFinal ? 7600 : 5200);
  }

  function hidePopup() {
    const pop = currentRoot?.querySelector("[data-cw-pop]");
    if (pop) {
      pop.classList.remove("is-open");
      window.setTimeout(() => {
        if (!pop.classList.contains("is-open")) pop.hidden = true;
      }, 220);
    }
    if (popTimer) {
      window.clearTimeout(popTimer);
      popTimer = null;
    }
  }

  function markWordFound(word) {
    word.found = true;
    found.add(word.id);
    score = found.size * WORD_POINTS + (completed ? COMPLETE_BONUS : 0);
    wordInputs(word).forEach((input) => {
      input.readOnly = true;
      input.classList.add("is-found");
      input.closest("[data-cw-cell]")?.classList.add("is-found");
      input.removeAttribute("aria-invalid");
    });
    currentRoot?.querySelector(`[data-cw-clue="${word.id}"]`)?.classList.add("is-found");
    currentRoot?.querySelector(`[data-cw-clue="${word.id}"]`)?.setAttribute("aria-label", `${word.answer}, completed`);
    const message = currentRoot?.querySelector("[data-cw-message]");
    if (message) {
      message.textContent = `Found: ${word.term || word.answer}. The meaning is blooming beside the grid.`;
      message.classList.remove("is-bad");
      message.classList.add("is-good");
    }
    RS.playSound("found");
    saveBest();
    updateHud();
  }

  function completePuzzle() {
    if (completed) return;
    completed = true;
    score = found.size * WORD_POINTS + COMPLETE_BONUS;
    saveBest();
    updateHud();
    const progress = currentRoot?.querySelector("[data-cw-progress]");
    if (progress) progress.style.width = "100%";
    const banner = currentRoot?.querySelector("[data-cw-complete]");
    if (banner) banner.hidden = false;
    RS.playSound("win");
    window.setTimeout(() => RS.celebrate(1.35), 260);
    RS.toast("All eight words found. +250 completion bonus.", "success", 6000);
  }

  function checkWord(word, { final = false } = {}) {
    if (!word || word.found) return;
    const inputs = wordInputs(word);
    if (!inputs.length || inputs.some((input) => !normalizeLetter(input.value))) return;
    if (wordIsCorrect(word)) {
      markWordFound(word);
      const wasComplete = found.size === words.length;
      if (wasComplete) {
        completePuzzle();
        popupWord(word, { final: true });
      } else {
        popupWord(word);
      }
      if (final) return;
      const last = inputs.find((input) => document.activeElement === input) || inputs[inputs.length - 1];
      if (last && !last.readOnly) last.select();
    } else {
      flashWrong(word);
      inputs[inputs.length - 1]?.select();
    }
  }

  function handleInput(event) {
    const input = event.target.closest("[data-cw-r]");
    if (!input || input.readOnly) return;
    const word = activeWord();
    if (!word || word.found) return;
    markStarted();
    const letter = normalizeLetter(input.value);
    input.value = letter;
    input.closest("[data-cw-cell]")?.classList.remove("is-wrong");
    if (!letter) return;
    const inputs = wordInputs(word);
    const index = inputs.indexOf(input);
    if (index >= 0 && index < inputs.length - 1) {
      const next = inputs[index + 1];
      window.setTimeout(() => {
        next.focus({ preventScroll: true });
        next.select();
      }, 0);
    }
    if (inputs.every((item) => normalizeLetter(item.value))) {
      window.setTimeout(() => checkWord(word), 60);
    }
  }

  function moveArrow(input, key) {
    const row = Number(input.dataset.cwR);
    const col = Number(input.dataset.cwC);
    const direction = key === "ArrowLeft" || key === "ArrowRight" ? "across" : "down";
    const delta = key === "ArrowRight" || key === "ArrowDown" ? 1 : -1;
    let nextRow = row + (direction === "down" ? delta : 0);
    let nextCol = col + (direction === "across" ? delta : 0);
    while (nextRow >= 0 && nextRow < CROSSWORD.grid.length && nextCol >= 0 && nextCol < CROSSWORD.grid[0].length) {
      const candidate = inputAt(nextRow, nextCol);
      if (candidate) {
        const word = wordForCell(nextRow, nextCol, direction);
        if (word) setActiveWord(word);
        candidate.focus({ preventScroll: true });
        candidate.select();
        return true;
      }
      nextRow += direction === "down" ? delta : 0;
      nextCol += direction === "across" ? delta : 0;
    }
    return false;
  }

  function handleKey(event) {
    const input = event.target.closest("[data-cw-r]");
    if (!input) return;
    if (event.key === "Backspace" && !input.readOnly) {
      event.preventDefault();
      if (input.value) {
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
      } else {
        moveWithinWord(activeWord() || wordForCell(Number(input.dataset.cwR), Number(input.dataset.cwC), "across"), input, -1);
        const previous = document.activeElement;
        if (previous && previous.matches?.("[data-cw-r]") && !previous.readOnly) {
          previous.value = "";
          previous.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "ArrowDown") {
      if (moveArrow(input, event.key)) event.preventDefault();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (activeWord()) checkWord(activeWord(), { final: true });
    }
  }

  function resetPuzzle() {
    if (!currentRoot) return;
    if (popTimer) window.clearTimeout(popTimer);
    popTimer = null;
    found = new Set();
    words.forEach((word) => { word.found = false; });
    completed = false;
    score = 0;
    activeWordId = null;
    started = false;
    lastCellKey = "";
    currentRoot.querySelectorAll("[data-cw-r]").forEach((input) => {
      input.value = "";
      input.readOnly = false;
      input.classList.remove("is-found");
      input.removeAttribute("aria-invalid");
      input.closest("[data-cw-cell]")?.classList.remove("is-found", "is-wrong", "is-active");
    });
    currentRoot.querySelectorAll("[data-cw-clue]").forEach((button) => {
      button.classList.remove("is-found", "is-active");
      button.setAttribute("aria-pressed", "false");
      button.setAttribute("aria-label", `${button.dataset.cwClueLabel || "Clue"}, not completed`);
    });
    currentRoot.querySelectorAll("[data-cw-cell]").forEach((cell) => cell.classList.remove("is-active"));
    const pop = currentRoot.querySelector("[data-cw-pop]");
    if (pop) {
      pop.hidden = true;
      pop.classList.remove("is-open");
    }
    const banner = currentRoot.querySelector("[data-cw-complete]");
    if (banner) banner.hidden = true;
    const message = currentRoot.querySelector("[data-cw-message]");
    if (message) {
      message.textContent = "Fresh grid. Pick a clue, start typing, and let the meanings bloom.";
      message.classList.remove("is-good", "is-bad");
    }
    updateHud();
    setActiveWord(words.find((word) => word.dir === "across") || words[0]);
    RS.playSound("click");
    RS.toast("Grid cleared. Best score is safe.", "default");
  }

  function requestReset() {
    const hasLetters = [...(currentRoot?.querySelectorAll("[data-cw-r]") || [])].some((input) => input.value) || found.size > 0;
    if (!hasLetters) {
      resetPuzzle();
      return;
    }
    RS.openConfirm({
      title: "Clear the grid?",
      message: "Your current letters and found words will be cleared. Your personal best and play count will stay.",
      confirmLabel: "Clear the grid",
      cancelLabel: "Keep playing",
      onConfirm: resetPuzzle
    });
  }

  function bindSound(root) {
    root.querySelector("[data-cw-sound]")?.addEventListener("click", () => {
      RS.toggleSound();
    });
  }

  function renderCrossword() {
    buildWords();
    found = new Set();
    activeWordId = null;
    score = 0;
    completed = false;
    started = false;
    lastCellKey = "";
    if (popTimer) window.clearTimeout(popTimer);
    popTimer = null;

    const game = DATA.games.crossword;
    const across = words.filter((word) => word.dir === "across").sort((a, b) => a.number - b.number);
    const down = words.filter((word) => word.dir === "down").sort((a, b) => a.number - b.number);
    const rows = CROSSWORD.grid.length;
    const cols = CROSSWORD.grid[0].length;
    const starts = new Map();
    words.forEach((word) => starts.set(cellKey(word.row, word.col), word.number));

    let cells = "";
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const solution = CROSSWORD.grid[row][col];
        const key = cellKey(row, col);
        if (solution === ".") {
          cells += `<span class="cw-cell cw-cell--block" aria-hidden="true"></span>`;
          continue;
        }
        const acrossWord = wordForCell(row, col, "across");
        const downWord = wordForCell(row, col, "down");
        const number = starts.get(key);
        cells += `
          <div class="cw-cell" data-cw-cell>
            ${number ? `<span class="cw-num" aria-hidden="true">${number}</span>` : ""}
            <input class="cw-input" type="text" maxlength="1" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false"
              value="" aria-label="Row ${row + 1}, column ${col + 1}${number ? `, answer ${number}` : ""}"
              data-cw-r="${row}" data-cw-c="${col}"
              ${acrossWord ? `data-cw-across="${acrossWord.id}"` : ""}
              ${downWord ? `data-cw-down="${downWord.id}"` : ""} />
          </div>`;
      }
    }

    const clueMarkup = (items, label) => `
      <div class="cw-clue-group">
        <h3>${label}</h3>
        <div class="cw-clue-list">
          ${items.map((word) => `
            <button class="cw-clue" type="button" data-cw-clue="${word.id}" data-cw-clue-label="${esc(`${label} ${word.number}: ${word.clue}`)}" aria-pressed="false">
              <span class="cw-clue-num">${word.number}</span>
              <span class="cw-clue-copy"><span>${esc(word.clue)}</span><small>${word.answer.length} letters</small></span>
              <span class="cw-clue-check" aria-hidden="true">${icon("check")}</span>
            </button>`).join("")}
        </div>
      </div>`;

    return `
      <div class="page-enter" data-crossword-page>
        <section class="game-screen cw-screen" data-game-key="crossword">
          <div class="game-topbar">
            <button class="game-back" type="button" data-nav="#/games">${icon("arrow-left")} Arcade</button>
            <div class="game-title-mini"><span>${esc(game.kicker)}</span><strong>${esc(game.name)}</strong></div>
            <div class="game-hud">
              <div class="game-hud-item"><span>Found</span><strong data-cw-found aria-live="polite">0 / ${words.length}</strong></div>
              <div class="game-hud-item"><span>Score</span><strong data-cw-score>0</strong></div>
              <div class="game-hud-item"><span>Best</span><strong data-cw-best>${(state.games.crossword?.best || 0).toLocaleString("en-US")}</strong></div>
              <button class="game-icon-btn" type="button" data-cw-sound data-sound-toggle aria-pressed="${state.settings.sound}" aria-label="${state.settings.sound ? "Mute game sounds" : "Enable game sounds"}" title="${state.settings.sound ? "Mute game sounds" : "Enable game sounds"}">${icon(state.settings.sound ? "volume" : "volume-off")}</button>
            </div>
          </div>
          <div class="game-progress"><i data-cw-progress style="width:0%"></i></div>
          <div class="game-body cw-body">
            <header class="cw-head">
              <div>
                <span class="game-qnum"><b>${words.length} words</b> · no timer · all four modules</span>
                <h1 class="game-question">Word <em>Garden</em></h1>
                <p class="cw-lede">${esc(CROSSWORD.intro)} When the last letter lands, the definition opens in a little bloom. Click a clue to jump in.</p>
              </div>
              <div class="cw-progress-copy"><span data-cw-progress-label>0 of ${words.length} words found</span><span class="cw-progress-note">Scores save in this browser</span></div>
            </header>

            <div class="cw-layout">
              <div class="cw-stage">
                <div class="cw-grid-shell">
                  <div class="cw-grid" style="--cw-cols:${cols}" role="group" aria-label="Word Garden crossword grid, ${rows} rows by ${cols} columns">${cells}</div>
                </div>
                <p class="cw-message" data-cw-message aria-live="polite">Pick a clue, type a word, and let its meaning bloom. Use the arrow keys to move around the grid.</p>
                <div class="cw-pop" data-cw-pop hidden aria-live="polite"></div>
                <div class="cw-complete" data-cw-complete hidden>
                  <span>${icon("award")} <b>Word Garden complete.</b> Every meaning has bloomed.</span>
                  <button class="btn btn-cream btn-sm" type="button" data-cw-reset>${icon("rotate")} Play a fresh grid</button>
                </div>
              </div>

              <aside class="cw-clues" aria-label="Crossword clues">
                ${clueMarkup(across, "Across")}
                ${clueMarkup(down, "Down")}
                <div class="cw-clue-actions">
                  <button class="btn btn-secondary btn-sm" type="button" data-cw-check>${icon("check")} Check current word</button>
                  <button class="btn btn-ghost btn-sm" type="button" data-cw-reset>${icon("rotate")} Clear grid</button>
                </div>
              </aside>
            </div>

            <div class="cw-foot">
              <div><span class="eyebrow">Keyboard-friendly</span><p>Type letters. <kbd>Backspace</kbd> clears. <kbd>←</kbd><kbd>↑</kbd><kbd>↓</kbd><kbd>→</kbd> move. <kbd>Enter</kbd> checks the active word.</p></div>
              <button class="btn btn-ghost btn-sm" type="button" data-nav="#/cheat">${icon("file-text")} Cheat sheet</button>
            </div>
          </div>
        </section>
      </div>`;
  }

  function bindCrossword(root) {
    if (!root) return;
    currentRoot = root;
    bindSound(root);
    const grid = root.querySelector(".cw-grid");
    grid?.addEventListener("focusin", (event) => {
      const input = event.target.closest("[data-cw-r]");
      if (input) selectWordFromCell(input);
    });
    grid?.addEventListener("input", handleInput);
    grid?.addEventListener("keydown", handleKey);
    root.querySelectorAll("[data-cw-clue]").forEach((button) => {
      button.addEventListener("click", () => {
        const word = words.find((item) => item.id === button.dataset.cwClue);
        if (!word) return;
        setActiveWord(word, { focus: !word.found });
        if (word.found) popupWord(word);
        else RS.playSound("click");
      });
    });
    root.querySelector("[data-cw-check]")?.addEventListener("click", () => {
      const word = activeWord();
      if (!word) return;
      if (word.found) popupWord(word);
      else checkWord(word, { final: true });
    });
    root.querySelectorAll("[data-cw-reset]").forEach((button) => button.addEventListener("click", requestReset));
    root.querySelector("[data-cw-close-pop]")?.addEventListener("click", hidePopup);
    setActiveWord(words.find((word) => word.dir === "across") || words[0]);
    updateHud();
  }

  function cleanupCrossword() {
    if (popTimer) {
      window.clearTimeout(popTimer);
      popTimer = null;
    }
    currentRoot = null;
  }

  RS.renderCrossword = renderCrossword;
  RS.bindCrossword = bindCrossword;
  RS.cleanupCrossword = cleanupCrossword;
  RS.sessionResets.push(() => {
    cleanupCrossword();
    found = new Set();
    activeWordId = null;
    score = 0;
    completed = false;
    started = false;
  });
})();
