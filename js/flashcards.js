/* ==========================================================================
   Personal Development Reviewer - flashcards
   ========================================================================== */
(() => {
  "use strict";

  const RS = window.RS;
  const { DATA, state, esc, icon, shuffle, percent } = RS;
  const LESSONS = Object.fromEntries(DATA.lessons.map((lesson) => [lesson.id, lesson]));
  const TOTAL = DATA.flashcards.length;

  let filter = "all";
  let deck = null;
  let index = 0;
  let flipped = false;
  let shuffled = false;
  let keyHandler = null;
  let cardTransition = null;
  let repaintToken = 0;
  let cardDirection = 1;
  let chipFrom = null;
  let chipRefreshFrame = null;

  const knownCount = () => DATA.flashcards.filter((card) => state.cards[card.id]).length;
  const knownInLesson = (id) => DATA.flashcards.filter((card) => card.lesson === id && state.cards[card.id]).length;
  const cardsInLesson = (id) => DATA.flashcards.filter((card) => card.lesson === id).length;

  function filterLabel() {
    if (filter === "review") return "To review";
    if (filter === "all") return "All cards";
    return `Module ${LESSONS[Number(filter)]?.num || filter}`;
  }

  function chipMetrics(group) {
    const active = group?.querySelector(".chip.is-active");
    if (!group || !active) return null;
    const container = group.getBoundingClientRect();
    const button = active.getBoundingClientRect();
    return {
      x: button.left - container.left - group.clientLeft + group.scrollLeft,
      y: button.top - container.top - group.clientTop,
      width: button.width,
      height: button.height,
      scrollLeft: group.scrollLeft
    };
  }

  function placeChipIndicator(root = document, from = null) {
    const group = root.querySelector(".chip-group");
    if (!group) return;
    const target = chipMetrics(group);
    if (!target) return;
    let indicator = group.querySelector(".chip-indicator");
    if (!indicator) {
      indicator = document.createElement("span");
      indicator.className = "chip-indicator";
      indicator.setAttribute("aria-hidden", "true");
      group.prepend(indicator);
    }
    group.classList.add("has-indicator");
    const place = (metrics) => {
      indicator.style.transform = `translateX(${metrics.x}px)`;
      indicator.style.top = `${metrics.y}px`;
      indicator.style.width = `${metrics.width}px`;
      indicator.style.height = `${metrics.height}px`;
    };

    if (from) {
      group.scrollLeft = from.scrollLeft || 0;
      indicator.style.transition = "none";
      place(from);
      void indicator.offsetWidth;
      indicator.style.transition = "";
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => place(target));
      });
    } else {
      indicator.style.transition = "none";
      place(target);
      void indicator.offsetWidth;
      window.setTimeout(() => {
        indicator.style.transition = "";
      }, 30);
    }
  }

  function buildDeck({ reshuffle = shuffled } = {}) {
    let cards = DATA.flashcards.filter((card) => {
      if (filter === "review") return !state.cards[card.id];
      if (filter === "all") return true;
      return card.lesson === Number(filter);
    });
    if (reshuffle) cards = shuffle(cards);
    deck = cards;
    index = 0;
    flipped = false;
  }

  function ensureDeck() {
    if (deck === null) buildDeck({ reshuffle: false });
  }

  function currentCard() {
    ensureDeck();
    return deck[index] || null;
  }

  function renderCard(card) {
    const known = Boolean(state.cards[card.id]);
    const lesson = LESSONS[card.lesson];
    const position = `${String(index + 1).padStart(2, "0")} / ${String(deck.length).padStart(2, "0")}`;
    return `
      <div class="flashcard${flipped ? " is-flipped" : ""}" data-flashcard style="--card-dir:${cardDirection}" role="button" tabindex="0" aria-label="${flipped ? `Definition: ${esc(card.definition)}` : `Flashcard: ${esc(card.term)}. Press Enter or Space to reveal the definition.`}" aria-pressed="${flipped}">
        <div class="flashcard-inner">
          <div class="flash-face flash-front">
            <div class="flash-face-top">
              <span class="flash-lesson"><i></i>Module ${lesson.num} · ${esc(lesson.short)}</span>
              <span>${position}</span>
            </div>
            <div class="flash-front-main${flipped ? "" : " flash-copy-morph"}">
              <div class="flash-term">${esc(card.term)}</div>
              <span class="flash-tap">${icon("rotate")} Click or press Space to reveal</span>
            </div>
            <div class="flash-face-bottom"><span>${esc(filterLabel())}</span><span>A.Y. 2025–2026</span></div>
          </div>
          <div class="flash-face flash-back">
            <div class="flash-face-top">
              <span class="flash-lesson"><i></i>${esc(card.term)}</span>
              <span>${position}</span>
            </div>
            <div class="flash-back-main${flipped ? " flash-copy-morph" : ""}">
              <span class="flash-term-sm">Definition</span>
              <p class="flash-definition">${esc(card.definition)}</p>
              <div class="flash-tag-row">
                <span class="tag">Module ${lesson.num}</span>
                <span class="tag">${esc(lesson.short)}</span>
                ${known ? `<span class="flash-card-known">${icon("check-circle")} Marked known</span>` : ""}
              </div>
            </div>
            <div class="flash-face-bottom"><span>${icon("keyboard")} Space to flip back</span><span>${flipped ? "Answer side" : ""}</span></div>
          </div>
        </div>
      </div>`;
  }

  function renderDone() {
    const allKnown = knownCount() === TOTAL;
    return `
      <div class="flashcard" style="cursor:default">
        <div class="flash-face flash-front">
          <div class="flash-face-top"><span class="flash-lesson"><i></i>Deck complete</span><span>${TOTAL} cards</span></div>
          <div class="flash-front-main">
            <div class="flash-term">${allKnown ? "Every card is known." : "Deck cleared."}</div>
            <span class="flash-tap">${icon("award")} ${allKnown ? "Now keep it fresh" : "Nothing left in this filter"}</span>
          </div>
          <div class="flash-face-bottom">
            <span>${knownCount()} / ${TOTAL} marked known</span>
            <span>A.Y. 2025–2026</span>
          </div>
        </div>
      </div>
      <div class="flash-controls">
        <button class="btn btn-cream btn-sm" type="button" data-flash-all>${icon("cards")} Study all cards</button>
        <button class="btn btn-ghost btn-sm" type="button" data-shuffle>${icon("shuffle")} Shuffle again</button>
        <button class="btn btn-ghost btn-sm" type="button" data-nav="#/test">${icon("clipboard-check")} Practice test</button>
      </div>`;
  }

  function renderSide() {
    const known = knownCount();
    return `
      <aside class="flash-side">
        <div class="side-panel">
          <h3>Deck progress</h3>
          <p>${known === TOTAL ? "Every term is marked known. Test the recall, don't just trust the label." : "Mark a card known only after you can say the definition without flipping."}</p>
          <div class="flash-deck-total"><strong>${known}</strong><span>/ ${TOTAL} known</span></div>
          <div class="deck-bar"><i style="width:${percent(known, TOTAL)}%"></i></div>
          <div class="lesson-progress-list">
            ${DATA.lessons.map((lesson) => {
              const lessonKnown = knownInLesson(lesson.id);
              const total = cardsInLesson(lesson.id);
              return `
                <div class="lesson-progress-row">
                  <span class="lesson-progress-num lesson-progress-num--${lesson.color}">${lesson.num}</span>
                  <div class="lesson-progress-copy">
                    <span>${esc(lesson.short)}</span>
                    <div class="lesson-progress-mini"><i style="width:${percent(lessonKnown, total)}%"></i></div>
                  </div>
                  <b>${lessonKnown}/${total}</b>
                </div>`;
            }).join("")}
          </div>
        </div>

        <div class="side-panel">
          <h3>Keyboard</h3>
          <p>Keep your hands on the keys and your eyes on the card.</p>
          <div class="shortcut-list">
            <div class="shortcut-row"><span>Flip the card</span><span><kbd>Space</kbd><kbd>↵</kbd></span></div>
            <div class="shortcut-row"><span>Previous / next</span><span><kbd>←</kbd><kbd>→</kbd></span></div>
            <div class="shortcut-row"><span>Mark known</span><span><kbd>K</kbd></span></div>
            <div class="shortcut-row"><span>Review again</span><span><kbd>R</kbd></span></div>
            <div class="shortcut-row"><span>Shuffle deck</span><span><kbd>S</kbd></span></div>
          </div>
        </div>

        <div class="side-panel side-panel--accent">
          <div class="side-panel-icon">${icon("sparkles")}</div>
          <h3>Recall, don't recognize</h3>
          <p>Say the definition out loud before you flip. If you only recognize the term, it is not known yet.</p>
          <button class="btn btn-secondary btn-sm btn-block" type="button" data-shuffle>${icon("shuffle")} Shuffle this deck</button>
          <button class="btn btn-ghost btn-sm btn-block" type="button" data-nav="#/cheat">${icon("file-text")} Open cheat sheet</button>
        </div>
      </aside>`;
  }

  function renderToolbar() {
    const known = knownCount();
    const reviewLeft = TOTAL - known;
    return `
      <div class="flash-toolbar">
        <div class="chip-group" role="group" aria-label="Filter flashcards">
          <span class="chip-indicator" aria-hidden="true"></span>
          <button class="chip${filter === "all" ? " is-active" : ""}" type="button" data-flash-filter="all"><span class="chip-label">All</span><span class="chip-count">${TOTAL}</span></button>
          ${DATA.lessons.map((lesson) => `<button class="chip${filter === String(lesson.id) ? " is-active" : ""}" type="button" data-flash-filter="${lesson.id}"><span class="chip-label">${lesson.num}</span><span class="chip-count">${cardsInLesson(lesson.id)}</span></button>`).join("")}
          <button class="chip${filter === "review" ? " is-active" : ""}" type="button" data-flash-filter="review"><span class="chip-label">To review</span><span class="chip-count">${reviewLeft}</span></button>
        </div>
        <div class="flash-toolbar-right">
          <span class="flash-known-label"><b>${known}</b> / ${TOTAL} known</span>
          <button class="btn btn-ghost btn-sm" type="button" data-shuffle>${icon("shuffle")} Shuffle</button>
        </div>
      </div>`;
  }

  function renderBody() {
    ensureDeck();
    if (!deck.length) {
      return `
        ${renderToolbar()}
        <div class="flash-layout">
          <div class="flash-stage" aria-live="polite">
            ${renderDone()}
          </div>
          ${renderSide()}
        </div>`;
    }
    const card = currentCard();
    const controlsDisabled = deck.length <= 1 ? " disabled" : "";
    return `
      ${renderToolbar()}
      <div class="flash-layout">
        <div class="flash-stage" aria-live="polite">
          ${renderCard(card)}
          <div class="flash-controls">
            <button class="round-btn" type="button" data-card-prev aria-label="Previous card"${controlsDisabled}>${icon("arrow-left")}</button>
            <button class="flash-flip-btn" type="button" data-flip>${icon("rotate")} ${flipped ? "Show term" : "Reveal definition"}</button>
            <button class="round-btn" type="button" data-card-next aria-label="Next card"${controlsDisabled}>${icon("arrow-right")}</button>
          </div>
          <div class="flash-mastery">
            <button class="mastery-btn mastery-btn--again" type="button" data-mark="again">${icon("rotate")} Review again</button>
            <button class="mastery-btn mastery-btn--known${state.cards[card.id] ? " is-active" : ""}" type="button" data-mark="known">${icon("check-circle")} ${state.cards[card.id] ? "Known — next" : "I know this"}</button>
          </div>
          <div class="flash-kbd">
            <span><kbd>Space</kbd> flip</span><span><kbd>←</kbd><kbd>→</kbd> move</span><span><kbd>K</kbd> known</span><span><kbd>R</kbd> review</span><span><kbd>S</kbd> shuffle</span>
          </div>
        </div>
        ${renderSide()}
      </div>`;
  }

  function renderFlashcards() {
    const known = knownCount();
    const reviewLeft = TOTAL - known;
    ensureDeck();
    return `
      <div class="page-enter" data-flash-root>
        <div class="page-head">
          <div class="page-head-copy">
            <span class="eyebrow eyebrow--indigo">Study tools · Active recall</span>
            <h1>Flash<em>cards</em></h1>
            <p>Fifty cards: all 42 numbered glossary terms plus the 8 external career factors. Flip first, decide honestly, then let the deck do the sorting.</p>
          </div>
          <div class="page-head-side">
            <div class="page-stat"><span>Marked known</span><strong>${known}</strong><small>of ${TOTAL} cards</small></div>
            <div class="page-stat"><span>Still to review</span><strong>${reviewLeft}</strong><small>keep going</small></div>
            <div class="page-stat"><span>This deck</span><strong>${deck?.length ?? TOTAL}</strong><small>${esc(filterLabel())}</small></div>
          </div>
        </div>
        <section class="flash-page">
          ${renderBody()}
        </section>
      </div>`;
  }

  function swapDeck() {
    const root = document.querySelector("[data-flash-root]");
    if (!root) return;
    const template = document.createElement("template");
    template.innerHTML = renderFlashcards();
    const next = template.content.firstElementChild;
    next.classList.remove("page-enter");
    root.replaceWith(next);
    bindFlashcards(next);
  }

  function repaint(direction = 1, { view = true } = {}) {
    if (!document.querySelector("[data-flash-root]")) return;
    const scrollY = window.scrollY;
    cardDirection = direction >= 0 ? 1 : -1;
    const oldCard = document.querySelector("[data-flashcard]");
    const wasFlipped = Boolean(oldCard?.classList.contains("is-flipped"));
    oldCard?.style.setProperty("--card-dir", String(cardDirection));
    oldCard?.querySelectorAll(".flash-copy-morph").forEach((node) => node.classList.remove("flash-copy-morph"));
    oldCard?.querySelector(wasFlipped ? ".flash-back-main" : ".flash-front-main")?.classList.add("flash-copy-morph");
    const token = ++repaintToken;
    let swapped = false;
    const swap = () => {
      if (swapped || token !== repaintToken) return;
      swapped = true;
      swapDeck();
      window.scrollTo({ top: scrollY, behavior: "auto" });
    };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!view || reduceMotion || typeof document.startViewTransition !== "function") {
      swap();
      return;
    }
    if (cardTransition) {
      try {
        cardTransition.skipTransition();
      } catch (error) {
        /* Ignore a transition that has already finished. */
      }
    }
    try {
      const transition = document.startViewTransition(swap);
      cardTransition = transition;
      transition.ready?.catch(() => {});
      transition.updateCallbackDone?.catch(() => {});
      const watchdog = window.setTimeout(() => {
        if (token !== repaintToken) return;
        try {
          transition.skipTransition();
        } catch (error) {
          /* Ignore a transition that already ended. */
        }
        swap();
      }, 720);
      transition.finished.catch(() => {}).finally(() => {
        window.clearTimeout(watchdog);
        if (cardTransition === transition) cardTransition = null;
      });
    } catch (error) {
      cardTransition = null;
      swap();
    }
  }

  function advance(direction = 1) {
    if (!deck.length) return;
    index = (index + direction + deck.length) % deck.length;
    flipped = false;
  }

  function setFilter(nextFilter) {
    if (filter === nextFilter) return;
    chipFrom = chipMetrics(document.querySelector(".chip-group"));
    filter = nextFilter;
    buildDeck();
    repaint(1, { view: false });
    RS.playSound("click");
  }

  function markCard(known) {
    const card = currentCard();
    if (!card) return;
    const position = index;
    if (known) state.cards[card.id] = true;
    else delete state.cards[card.id];
    RS.saveState();
    RS.updateShell();
    RS.toast(known ? `“${card.term}” marked known.` : `“${card.term}” moved back to review.`, known ? "success" : "default");
    RS.playSound(known ? "correct" : "click");
    if (filter === "review") {
      buildDeck();
      index = deck.length ? Math.min(position, deck.length - 1) : 0;
      flipped = false;
    } else {
      advance();
    }
    repaint(1);
  }

  function syncFlipUI() {
    const card = document.querySelector("[data-flashcard]");
    const current = currentCard();
    if (!card || !current) return;
    card.classList.toggle("is-flipped", flipped);
    card.setAttribute("aria-pressed", String(flipped));
    card.setAttribute(
      "aria-label",
      flipped
        ? `Definition: ${esc(current.definition)}`
        : `Flashcard: ${esc(current.term)}. Press Enter or Space to reveal the definition.`
    );
    const flipButton = document.querySelector("[data-flip]");
    if (flipButton) {
      flipButton.innerHTML = `${icon("rotate")} ${flipped ? "Show term" : "Reveal definition"}`;
    }
    const backLabel = card.querySelector(".flash-back .flash-face-bottom span:last-child");
    if (backLabel) backLabel.textContent = flipped ? "Answer side" : "";
  }

  function flipCard() {
    if (!currentCard()) return;
    flipped = !flipped;
    RS.playSound("flip");
    syncFlipUI();
  }

  function shuffleDeck() {
    shuffled = true;
    buildDeck({ reshuffle: true });
    repaint();
    RS.toast("Deck shuffled. Same cards, new order.", "default");
    RS.playSound("click");
  }

  function showAllCards() {
    if (filter !== "all") {
      setFilter("all");
      return;
    }
    buildDeck();
    repaint();
  }

  function handleKeys(event) {
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName || "")) return;
    if (!document.querySelector("[data-flash-root]")) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const key = event.key;
    if (key === " " || key === "Enter") {
      if (event.target?.closest?.("[data-flashcard], button, a")) return;
      event.preventDefault();
      flipCard();
    } else if (key === "ArrowLeft") {
      event.preventDefault();
      advance(-1);
      repaint(-1);
    } else if (key === "ArrowRight") {
      event.preventDefault();
      advance(1);
      repaint(1);
    } else if (key.toLowerCase() === "k") {
      event.preventDefault();
      markCard(true);
    } else if (key.toLowerCase() === "r") {
      event.preventDefault();
      markCard(false);
    } else if (key.toLowerCase() === "s") {
      event.preventDefault();
      shuffleDeck();
    }
  }

  function bindFlashcards(root = document.querySelector("[data-flash-root]")) {
    if (!root) return;
    if (keyHandler) document.removeEventListener("keydown", keyHandler);
    root.querySelectorAll("[data-flash-filter]").forEach((button) => {
      button.addEventListener("click", () => setFilter(button.dataset.flashFilter));
    });
    root.querySelectorAll("[data-flashcard]").forEach((card) => {
      card.addEventListener("click", flipCard);
      card.addEventListener("keydown", (event) => {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          flipCard();
        }
      });
    });
    root.querySelector("[data-flip]")?.addEventListener("click", flipCard);
    root.querySelector("[data-card-prev]")?.addEventListener("click", () => {
      advance(-1);
      repaint(-1);
    });
    root.querySelector("[data-card-next]")?.addEventListener("click", () => {
      advance(1);
      repaint(1);
    });
    root.querySelectorAll("[data-mark]").forEach((button) => {
      button.addEventListener("click", () => markCard(button.dataset.mark === "known"));
    });
    root.querySelectorAll("[data-shuffle]").forEach((button) => button.addEventListener("click", shuffleDeck));
    root.querySelector("[data-flash-all]")?.addEventListener("click", showAllCards);
    placeChipIndicator(root, chipFrom);
    chipFrom = null;
    keyHandler = handleKeys;
    document.addEventListener("keydown", keyHandler);
  }

  function cleanupFlashcards() {
    repaintToken += 1;
    chipFrom = null;
    if (keyHandler) {
      document.removeEventListener("keydown", keyHandler);
      keyHandler = null;
    }
    if (cardTransition) {
      try {
        cardTransition.skipTransition();
      } catch (error) {
        /* Nothing left to skip. */
      }
      cardTransition = null;
    }
  }

  // The chip pill is sized in pixels; re-measure when the bar's width changes.
  function refreshChipIndicator() {
    if (!document.querySelector(".chip-group")) return;
    placeChipIndicator(document);
  }

  function scheduleChipRefresh() {
    if (chipRefreshFrame) return;
    chipRefreshFrame = window.requestAnimationFrame(() => {
      chipRefreshFrame = null;
      refreshChipIndicator();
    });
  }

  window.addEventListener("resize", scheduleChipRefresh, { passive: true });
  window.addEventListener("orientationchange", scheduleChipRefresh, { passive: true });
  if (document.fonts?.ready) document.fonts.ready.then(scheduleChipRefresh).catch(() => {});

  RS.renderFlashcards = renderFlashcards;
  RS.bindFlashcards = bindFlashcards;
  RS.cleanupFlashcards = cleanupFlashcards;
  RS.sessionResets.push(() => {
    cleanupFlashcards();
    filter = "all";
    deck = null;
    index = 0;
    flipped = false;
    shuffled = false;
    chipFrom = null;
  });
})();
