/* ==========================================================================
   Personal Development Reviewer - overview, lesson shell & cheat sheet
   ========================================================================== */
(() => {
  "use strict";

  const RS = window.RS;
  const { DATA, state, esc, icon, getStats, percent } = RS;

  const LESSON_META = Object.fromEntries(DATA.lessons.map((lesson) => [lesson.id, lesson]));
  let tabRefreshFrame = null;
  const TAB_META = [
    { tab: "overview", label: "Overview", icon: "book-open" },
    ...DATA.lessons.map((lesson) => ({
      tab: lesson.route,
      num: lesson.num,
      label: lesson.tabLabel,
      full: lesson.short
    })),
    { tab: "test", label: "Practice test", shortLabel: "Test", icon: "clipboard-check", tag: String(DATA.test.length) },
    { tab: "cheat", label: "Cheat sheet", shortLabel: "Cheat", icon: "file-text" }
  ];

  const CALLOUT_ICONS = {
    trap: "alert",
    memory: "lightbulb",
    key: "target",
    note: "info",
    plain: "list"
  };

  function pageHref(tab, section) {
    const path = !tab || tab === "overview" ? "overview" : tab;
    const query = section ? `?section=${encodeURIComponent(section)}` : "";
    return `#/${path}${query}`;
  }

  function section({ id, num, title, lede = "", body, flag = "", eyebrow = "Study note" }) {
    return `
      <section class="content-section" id="${esc(id)}">
        <div class="section-kicker"><span class="section-index">${esc(num)}</span><span class="eyebrow">${esc(eyebrow)}</span></div>
        <h2>${esc(title)}${flag ? `<span class="extra-flag">${esc(flag)}</span>` : ""}</h2>
        ${lede ? `<p class="section-lede">${lede}</p>` : ""}
        ${body}
      </section>`;
  }

  function callout(type, label, body) {
    const safeType = CALLOUT_ICONS[type] ? type : "note";
    return `
      <div class="callout callout--${safeType}">
        <span class="callout-icon">${icon(CALLOUT_ICONS[safeType])}</span>
        <div class="callout-copy"><span class="callout-label">${esc(label)}</span>${body}</div>
      </div>`;
  }

  function table(headers, rows, className = "") {
    return `
      <div class="table-wrap">
        <table class="data-table ${className}">
          <thead><tr>${headers.map((header) => `<th scope="col">${header}</th>`).join("")}</tr></thead>
          <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </div>`;
  }

  function tabsMarkup() {
    return TAB_META.map((item) => {
      const href = pageHref(item.tab);
      const label = item.shortLabel
        ? `<span class="tab-label tab-label-long">${esc(item.label)}</span><span class="tab-label tab-label-short">${esc(item.shortLabel)}</span>`
        : `<span class="tab-label">${esc(item.label)}</span>`;
      return `<a class="review-tab" id="review-tab-${item.tab}" role="tab" aria-selected="false" aria-controls="review-panel" href="${href}" data-nav="${href}" title="${esc(item.full || item.label)}">
        ${item.num ? `<span class="tab-num">${item.num}</span>` : icon(item.icon)}
        ${label}
        ${item.tag ? `<span class="tab-tag">${item.tag}</span>` : ""}
      </a>`;
    }).join("");
  }

  function tabMetrics(tabs, active) {
    const container = tabs.getBoundingClientRect();
    const button = active.getBoundingClientRect();
    return {
      x: button.left - container.left - tabs.clientLeft + tabs.scrollLeft,
      y: button.top - container.top - tabs.clientTop,
      width: button.width,
      height: button.height
    };
  }

  function syncReviewerTabs(activeTab = "overview") {
    const bar = document.getElementById("reviewer-bar");
    const tabs = document.getElementById("reviewer-tabs");
    if (!bar || !tabs) return;
    const wasHidden = bar.hidden;
    bar.hidden = false;

    if (tabs.dataset.ready !== "true") {
      tabs.insertAdjacentHTML("beforeend", tabsMarkup());
      tabs.dataset.ready = "true";
      bindTabKeys(tabs);
    }

    const previous = tabs.querySelector(".review-tab.is-active");
    tabs.querySelectorAll(".review-tab").forEach((link) => {
      const active = link.dataset.nav === pageHref(activeTab);
      link.classList.toggle("is-active", active);
      link.setAttribute("aria-selected", String(active));
      link.setAttribute("tabindex", active ? "0" : "-1");
    });

    const active = tabs.querySelector(".review-tab.is-active");
    if (!active) return;
    const indicator = tabs.querySelector(".review-tab-indicator");
    if (!indicator) return;

    // The tab is synced once before the route loads and once when it renders.
    // Leave the running transition alone on the second pass so it keeps sliding.
    const alreadyAnimating = tabs.dataset.synced === "true" && !wasHidden && previous && previous === active;
    if (alreadyAnimating) return;

    const next = tabMetrics(tabs, active);
    const animate = tabs.dataset.synced === "true" && !wasHidden && previous && previous !== active;
    const visibleLeft = tabs.scrollLeft;
    const visibleRight = visibleLeft + tabs.clientWidth;

    if (!animate) indicator.style.transition = "none";
    indicator.style.transform = `translateX(${next.x}px)`;
    indicator.style.width = `${next.width}px`;
    indicator.style.height = `${next.height}px`;
    indicator.style.top = `${next.y}px`;
    tabs.classList.add("has-indicator");
    tabs.dataset.synced = "true";

    if (!animate) {
      void indicator.offsetWidth;
      indicator.style.transition = "";
    }

    if (next.x < visibleLeft + 4 || next.x + next.width > visibleRight - 4) {
      const target = Math.max(0, next.x - (tabs.clientWidth - next.width) / 2);
      tabs.scrollTo({ left: target, behavior: animate ? "smooth" : "auto" });
    }
  }

  // Re-measure without animating. The indicator is sized in pixels, so it goes
  // stale whenever the bar changes width (resize, rotation, late web fonts).
  function refreshReviewerTabs() {
    const bar = document.getElementById("reviewer-bar");
    const tabs = document.getElementById("reviewer-tabs");
    if (!bar || bar.hidden || !tabs || tabs.dataset.ready !== "true") return;
    const active = tabs.querySelector(".review-tab.is-active");
    const indicator = tabs.querySelector(".review-tab-indicator");
    if (!active || !indicator) return;
    const next = tabMetrics(tabs, active);
    indicator.style.transition = "none";
    indicator.style.transform = `translateX(${next.x}px)`;
    indicator.style.width = `${next.width}px`;
    indicator.style.height = `${next.height}px`;
    indicator.style.top = `${next.y}px`;
    void indicator.offsetWidth;
    indicator.style.transition = "";
  }

  function scheduleTabRefresh() {
    if (tabRefreshFrame) return;
    tabRefreshFrame = window.requestAnimationFrame(() => {
      tabRefreshFrame = null;
      refreshReviewerTabs();
    });
  }

  function bindTabKeys(tabs) {
    tabs.addEventListener("keydown", (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const links = [...tabs.querySelectorAll(".review-tab")];
      const current = event.target.closest?.(".review-tab");
      if (!current) return;
      const index = links.indexOf(current);
      let nextIndex = null;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % links.length;
      else if (event.key === "ArrowLeft") nextIndex = (index - 1 + links.length) % links.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = links.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      const target = links[nextIndex];
      target.focus();
      target.click();
    });
  }

  function hideReviewerTabs() {
    const bar = document.getElementById("reviewer-bar");
    if (bar) bar.hidden = true;
  }

  function renderReviewer(route) {
    const tab = route.tab || "overview";
    let content = "";
    if (tab === "overview") content = renderOverview();
    else if (tab === "mind") content = RS.renderMind?.() || "";
    else if (tab === "heart") content = RS.renderHeart?.() || "";
    else if (tab === "grief") content = RS.renderGrief?.() || "";
    else if (tab === "career") content = RS.renderCareer?.() || "";
    else if (tab === "test") content = RS.renderPracticeTest?.() || "";
    else if (tab === "cheat") content = renderCheatSheet();
    if (!content) content = renderOverview();
    return `<div class="page-enter"><div class="review-panel" id="review-panel" role="tabpanel" aria-labelledby="review-tab-${esc(tab)}">${content}</div></div>`;
  }

  function getNextStep(stats) {
    if (stats.lessons < stats.lessonsTotal) {
      const lesson = DATA.lessons.find((item) => !state.lessons[item.id]);
      return {
        label: `Continue Module ${lesson.num}`,
        note: lesson.short,
        route: pageHref(lesson.route)
      };
    }
    if (stats.cards < stats.cardsTotal) {
      return { label: "Practice the flashcards", note: `${stats.cardsTotal - stats.cards} terms left to lock in`, route: "#/flashcards" };
    }
    if (!stats.attempts) {
      return { label: "Take the practice test", note: "31 items, full answer review", route: "#/test" };
    }
    if (stats.testBest < 24) {
      return { label: "Reread before your retake", note: "Use the cheat sheet, then try again", route: "#/cheat" };
    }
    return { label: "Keep sharp in the arcade", note: "Four games, including the Word Garden crossword", route: "#/games" };
  }

  function statusForLesson(id) {
    return state.lessons[id]
      ? { label: "Completed", className: "path-status", iconName: "check" }
      : { label: "Module", className: "path-status path-status--muted", iconName: "book-open" };
  }

  function renderOverview() {
    const stats = getStats();
    const next = getNextStep(stats);
    const ringOffset = 100 - stats.readiness;
    const gamePlays = Object.values(state.games).reduce((sum, game) => sum + (game.plays || 0), 0);

    return `
      <section class="overview">
        <div class="hero">
          <div class="hero-watermark" aria-hidden="true">04</div>
          <div class="hero-inner">
            <div class="hero-copy">
              <div class="hero-eyebrow-row">
                <span class="eyebrow eyebrow--gold">Personal Development · A.Y. 2025–2026</span>
                <span class="pill pill--dark">Reviewer · Four modules</span>
              </div>
              <h1 class="hero-title">Personal<br><em>Development</em></h1>
              <p class="hero-lede">Know your mind, understand your heart, hold grief with care, and choose your path. Four interactive modules, 50 exact terms, and a study arcade built for recall.</p>
              <div class="hero-actions">
                <button class="btn btn-cream" type="button" data-nav="${next.route}">${esc(next.label)} ${icon("arrow-right")}</button>
                <button class="btn btn-ghost" type="button" data-nav="#/test">${icon("play")} Practice test</button>
              </div>
              <div class="hero-stats">
                <span><strong>4</strong> modules</span><i class="dot-sep" aria-hidden="true"></i>
                <span><strong>31</strong> test items</span><i class="dot-sep" aria-hidden="true"></i>
                <span><strong>50</strong> flashcards</span><i class="dot-sep" aria-hidden="true"></i>
                <span><strong>4</strong> arcade games</span>
              </div>
            </div>

            <aside class="hero-panel" aria-label="Your progress">
              <div class="hero-panel-head"><span>Exam readiness</span><span class="hero-live"><i></i>Saved locally</span></div>
              <div class="hero-readiness">
                <div class="readiness-ring">
                  <svg viewBox="0 0 120 120" aria-hidden="true">
                    <circle class="ring-track" cx="60" cy="60" r="50" pathLength="100"></circle>
                    <circle class="ring-fill" cx="60" cy="60" r="50" pathLength="100" stroke-dasharray="100" style="stroke-dashoffset:${ringOffset}"></circle>
                  </svg>
                  <span><strong>${stats.readiness}%</strong><small>ready</small></span>
                </div>
                <div class="hero-readiness-copy">
                  <span>Your study pulse</span>
                  <h3>${stats.readiness >= 80 ? "Almost exam-ready" : stats.readiness >= 40 ? "Building momentum" : "A strong start"}</h3>
                  <p>${stats.readiness >= 80 ? "Skim the cheat sheet, then rest." : "Read, recall, then test yourself."}</p>
                </div>
              </div>
              <div class="hero-breakdown">
                <div class="breakdown-row"><span>Modules</span><div class="breakdown-track"><i style="width:${percent(stats.lessons, stats.lessonsTotal)}%"></i></div><b>${stats.lessons}/${stats.lessonsTotal}</b></div>
                <div class="breakdown-row"><span>Cards</span><div class="breakdown-track"><i style="width:${percent(stats.cards, stats.cardsTotal)}%"></i></div><b>${stats.cards}/${stats.cardsTotal}</b></div>
                <div class="breakdown-row"><span>Test best</span><div class="breakdown-track"><i style="width:${percent(stats.testBest, stats.testTotal)}%"></i></div><b>${stats.testBest}/${stats.testTotal}</b></div>
              </div>
              <button class="btn btn-cream btn-block" type="button" data-nav="#/cheat">${icon("file-text")} Open the one-page cheat sheet</button>
              <p class="hero-note">${icon("save")} Progress saves in this browser. Back it up anytime from Settings.</p>
            </aside>
          </div>

          <div class="hero-lessons" aria-label="Jump to a module">
            ${DATA.lessons.map((lesson) => `
              <button class="hero-lesson" type="button" data-nav="${pageHref(lesson.route)}">
                <span class="hero-lesson-num">${lesson.num}</span>
                <span class="hero-lesson-copy"><strong>${esc(lesson.short)}</strong><span>${state.lessons[lesson.id] ? "Completed" : `${lesson.minutes} min read`}</span></span>
                ${icon(state.lessons[lesson.id] ? "check" : "arrow-up-right")}
              </button>`).join("")}
          </div>
        </div>

        <div class="overview-body">
          <section aria-labelledby="path-heading">
            <div class="block-head">
              <div><span class="eyebrow eyebrow--teal">Your path</span><h2 id="path-heading">Four modules, one connected story.</h2><p class="block-sub">Start with the brain that thinks, move into the heart that connects, make space for grief, then choose a path with clear eyes.</p></div>
              <button class="btn btn-secondary btn-sm" type="button" data-nav="${next.route}">${esc(next.label)} ${icon("arrow-right")}</button>
            </div>
            <div class="path-grid">
              ${DATA.lessons.map((lesson) => {
                const status = statusForLesson(lesson.id);
                return `
                  <button class="path-card path-card--${lesson.color}" type="button" data-nav="${pageHref(lesson.route)}">
                    <span class="path-card-top"><span class="path-num">${lesson.num}</span><span class="${status.className}">${icon(status.iconName)}${status.label}</span></span>
                    <h3>${esc(lesson.title)}</h3>
                    <p>${esc(lesson.summary)}</p>
                    <span class="tag-row">${lesson.tags.slice(0, 3).map((tag) => `<span class="tag">${esc(tag)}</span>`).join("")}</span>
                    <span class="path-foot"><span>${lesson.sections.length} sections · ${lesson.minutes} min</span><b>${state.lessons[lesson.id] ? "Review" : "Read"} ${icon("arrow-right")}</b></span>
                  </button>`;
              }).join("")}
            </div>
          </section>

          <section aria-labelledby="tools-heading">
            <div class="block-head">
              <div><span class="eyebrow eyebrow--indigo">Study tools</span><h2 id="tools-heading">Read it. Recall it. Test it. Play it.</h2><p class="block-sub">The modules hold the explanations. These tools turn them into memory.</p></div>
            </div>
            <div class="tools-grid">
              <button class="tool-tile tool-tile--teal" type="button" data-nav="#/test">
                <span class="tool-tile-top"><span class="tool-icon">${icon("clipboard-check")}</span>${icon("arrow-up-right")}</span>
                <h3>Practice test</h3>
                <p>31 items across all four modules, with a timer and a full “why” for every answer.</p>
                <span class="tool-meta"><span>${stats.attempts ? `Best ${stats.testBest}/31` : "Not attempted"}</span><span>25 min</span></span>
              </button>
              <button class="tool-tile tool-tile--indigo" type="button" data-nav="#/flashcards">
                <span class="tool-tile-top"><span class="tool-icon">${icon("cards")}</span>${icon("arrow-up-right")}</span>
                <h3>Flashcards</h3>
                <p>All 50 terms in exact reviewer wording. Flip, mark what you know, and watch the deck fill up.</p>
                <span class="tool-meta"><span>${stats.cards}/${stats.cardsTotal} known</span><span>Recall</span></span>
              </button>
              <button class="tool-tile tool-tile--gold" type="button" data-nav="#/cheat">
                <span class="tool-tile-top"><span class="tool-icon">${icon("file-text")}</span>${icon("arrow-up-right")}</span>
                <h3>Cheat sheet</h3>
                <p>One page for the last ten minutes: brain regions, love stages, grief distinctions, and the eight career factors.</p>
                <span class="tool-meta"><span>Print-ready</span><span>1 page</span></span>
              </button>
              <button class="tool-tile tool-tile--rust" type="button" data-nav="#/games">
                <span class="tool-tile-top"><span class="tool-icon">${icon("sparkles")}</span>${icon("arrow-up-right")}</span>
                <h3>Arcade</h3>
                <p>Three fast recall rounds plus the Word Garden crossword, where every found word blooms into its meaning.</p>
                <span class="tool-meta"><span>${gamePlays} plays</span><span>4 games</span></span>
              </button>
            </div>
          </section>

          <section aria-labelledby="big-picture-heading">
            <div class="block-head">
              <div><span class="eyebrow eyebrow--gold">The big picture</span><h2 id="big-picture-heading">Mind → Heart → Grief → Career.</h2><p class="block-sub">This is the whole reviewer in one line. Each module answers one part of becoming a person.</p></div>
            </div>
            <div class="big-picture pd-big-picture">
              <div class="bp-step bp-step--teal"><span>Step 1 · Module 01</span><h3>Think</h3><p>Meet the lobes, the hemispheres, and the thinking preferences that shape how you learn.</p></div>
              <div class="bp-arrow" aria-hidden="true">${icon("arrow-right")}</div>
              <div class="bp-step bp-step--indigo"><span>Step 2 · Module 02</span><h3>Connect</h3><p>Name what draws people together, how attachment forms, and what Sternberg says love is made of.</p></div>
              <div class="bp-arrow" aria-hidden="true">${icon("arrow-right")}</div>
              <div class="bp-step bp-step--rust"><span>Step 3 · Module 03</span><h3>Hold</h3><p>Recognize grief responses, offer real support, and separate mental-health conditions with care.</p></div>
              <div class="bp-arrow" aria-hidden="true">${icon("arrow-right")}</div>
              <div class="bp-step bp-step--gold"><span>Step 4 · Module 04</span><h3>Choose</h3><p>Name the eight external forces around a Filipino adolescent's career choice—then choose with agency.</p></div>
            </div>
          </section>

          <section aria-label="How to use this reviewer">
            <div class="grid-2">
              <div class="info-card">
                <span class="info-card-label">A good order</span>
                <h3>Read → compare → retrieve</h3>
                <p>Read the definitions first. Use the comparison tables to separate ideas that sound alike. Then close the notes and answer the quick checks and practice test from memory.</p>
              </div>
              <div class="info-card info-card--soft">
                <span class="info-card-label">About the terms</span>
                <h3>Exact wording, then your own words</h3>
                <p>The 42 numbered glossary terms and 8 career factors follow the supplied reviewer. Learn the wording first; explain it in your own words after. If your teacher adds a nuance, follow the teacher.</p>
              </div>
            </div>
            ${callout("note", "One promise", "<p><strong>No passive scrolling.</strong> Every module has a hands-on lab, every test answer has an explanation, and the arcade turns the definitions into quick decisions. When something feels hard, go back to the comparison table — that is where the exam lives.</p>")}
          </section>
        </div>
      </section>`;
  }

  function glossarySection(lesson) {
    const terms = DATA.terms.filter((term) => term.lesson === lesson.id);
    return section({
      id: "glossary",
      num: String(lesson.sections.length).padStart(2, "0"),
      eyebrow: "Key terms",
      title: "Words worth keeping",
      lede: "Every term from this module, using the exact definition from the reviewer. Read the wording once, then cover it and say it back.",
      body: `<div class="pd-term-grid">${terms.map((term) => `
        <article class="term-card pd-term-card">
          <span class="term-label">${term.lesson === 4 ? `Factor ${term.numberLabel.replace("E", "")}` : `Term ${term.numberLabel}`}</span>
          <h3>${esc(term.term)}</h3>
          <p>${esc(term.definition)}</p>
        </article>`).join("")}</div>`
    });
  }

  function quickCheck(lessonId) {
    const lesson = LESSON_META[lessonId];
    const questions = DATA.quickChecks[lessonId] || [];
    return `
      <section class="quick-check" id="quick-check">
        <div class="qc-head">
          <div><span class="eyebrow eyebrow--${lesson.color}">Retrieval practice</span><h2>Quick check</h2></div>
          <span class="qc-score" data-qc-score aria-live="polite"><b>0</b> / ${questions.length} correct</span>
        </div>
        <div class="qc-grid">
          ${questions.map((question, index) => `
            <article class="qc-card" data-qc-card data-qc-index="${index}" data-answer="${question.answer}" data-correct="false">
              <p class="qc-prompt">${index + 1}. ${esc(question.prompt)}</p>
              <div class="qc-options">
                ${question.options.map((option, optionIndex) => `
                  <button class="qc-option" type="button" data-qc-option="${optionIndex}">
                    <span class="qc-key">${String.fromCharCode(65 + optionIndex)}</span><span>${esc(option)}</span>
                  </button>`).join("")}
              </div>
              <div class="qc-feedback" data-qc-feedback hidden></div>
            </article>`).join("")}
        </div>
        <div class="qc-complete" data-qc-complete hidden>${icon("award")}<span>Quick check complete. Any miss is a section worth rereading — not a failure.</span></div>
      </section>`;
  }

  function bindQuickCheck(root = document, lessonId = 0) {
    const container = root.querySelector(".quick-check");
    if (!container) return;
    const cards = [...container.querySelectorAll("[data-qc-card]")];
    const questions = DATA.quickChecks[lessonId] || [];
    const scoreNode = container.querySelector("[data-qc-score] b");
    const complete = container.querySelector("[data-qc-complete]");

    const updateScore = () => {
      const answered = cards.filter((card) => card.dataset.answered === "true");
      const correct = cards.filter((card) => card.dataset.correct === "true").length;
      if (scoreNode) scoreNode.textContent = correct;
      if (complete && answered.length === cards.length) {
        complete.hidden = false;
        if (correct === cards.length) {
          complete.classList.add("is-perfect");
          window.setTimeout(() => RS.celebrate(0.55), 120);
        }
      }
    };

    cards.forEach((card) => {
      card.querySelectorAll("[data-qc-option]").forEach((button) => {
        button.addEventListener("click", () => {
          if (card.dataset.answered === "true") return;
          const selected = Number(button.dataset.qcOption);
          const answer = Number(card.dataset.answer);
          const isCorrect = selected === answer;
          card.dataset.answered = "true";
          card.dataset.correct = String(isCorrect);
          card.classList.add(isCorrect ? "is-correct" : "is-wrong");
          card.querySelectorAll("[data-qc-option]").forEach((optionButton, index) => {
            optionButton.disabled = true;
            if (index === answer) optionButton.classList.add("is-correct");
            if (index === selected && !isCorrect) optionButton.classList.add("is-wrong");
          });
          const feedback = card.querySelector("[data-qc-feedback]");
          const question = questions[Number(card.dataset.qcIndex)];
          if (feedback) {
            feedback.hidden = false;
            feedback.classList.add(isCorrect ? "is-correct" : "is-wrong");
            feedback.innerHTML = `<b>${isCorrect ? "Correct." : "Not quite."}</b> ${esc(question?.why || "")}`;
          }
          RS.playSound(isCorrect ? "correct" : "wrong");
          updateScore();
        });
      });
    });
  }

  function scenarioLab({ id, iconName = "flask", title, description, badge = "Try it", questions = [], doneText = "Lab complete. Say the distinction out loud before you move on." }) {
    const prepared = questions.map((question) => {
      const options = RS.shuffle(question.options);
      return { ...question, options, answer: options.indexOf(question.options[question.answer]) };
    });
    return `
      <div class="lab pd-lab" data-lab-id="${esc(id)}" data-lab-total="${questions.length}">
        <div class="lab-head">
          <span class="lab-icon">${icon(iconName)}</span>
          <div class="lab-title"><h3>${esc(title)}</h3><p>${esc(description)}</p></div>
          <span class="lab-badge">${esc(badge)}</span>
        </div>
        <div class="pd-lab-progress">
          <span data-lab-progress>0 / ${questions.length} answered</span>
          <div class="pd-lab-track" role="progressbar" aria-valuemin="0" aria-valuemax="${questions.length}" aria-valuenow="0"><i></i></div>
          <span class="pd-lab-score" data-lab-score aria-live="polite"><b>0</b> correct</span>
        </div>
        <div class="pd-lab-list">
          ${prepared.map((question, questionIndex) => `
            <article class="pd-lab-item" data-lab-item data-answer="${question.answer}" data-correct="false" data-why="${esc(question.why || "")}" data-answer-label="${esc(question.options[question.answer])}">
              <p class="pd-lab-prompt"><span class="pd-lab-number">${String(questionIndex + 1).padStart(2, "0")}</span>${esc(question.prompt)}</p>
              <div class="pd-lab-options">
                ${question.options.map((option, optionIndex) => `
                  <button class="pd-lab-option" type="button" data-lab-option="${optionIndex}">
                    <span class="pd-lab-key">${String.fromCharCode(65 + optionIndex)}</span><span>${esc(option)}</span>
                  </button>`).join("")}
              </div>
              <div class="pd-lab-feedback" data-lab-feedback hidden></div>
            </article>`).join("")}
        </div>
        <div class="pd-lab-complete" data-lab-complete hidden>${icon("award")}<span>${esc(doneText)}</span></div>
      </div>`;
  }

  function bindScenarioLab(root, labId, { onComplete } = {}) {
    const container = root.querySelector(`[data-lab-id="${labId}"]`);
    if (!container || container.dataset.bound === "true") return;
    container.dataset.bound = "true";
    const items = [...container.querySelectorAll("[data-lab-item]")];
    const progressLabel = container.querySelector("[data-lab-progress]");
    const progressBar = container.querySelector(".pd-lab-track");
    const progressFill = progressBar?.querySelector("i");
    const scoreNode = container.querySelector("[data-lab-score] b");
    const complete = container.querySelector("[data-lab-complete]");

    const update = () => {
      const answered = items.filter((item) => item.dataset.answered === "true");
      const correct = items.filter((item) => item.dataset.correct === "true").length;
      if (progressLabel) progressLabel.textContent = `${answered.length} / ${items.length} answered`;
      if (scoreNode) scoreNode.textContent = correct;
      if (progressFill) progressFill.style.width = `${(answered.length / items.length) * 100}%`;
      progressBar?.setAttribute("aria-valuenow", String(answered.length));
      if (complete && answered.length === items.length) {
        complete.hidden = false;
        if (correct === items.length) complete.classList.add("is-perfect");
        onComplete?.({ correct, total: items.length });
      }
    };

    items.forEach((item) => {
      item.querySelectorAll("[data-lab-option]").forEach((button) => {
        button.addEventListener("click", () => {
          if (item.dataset.answered === "true") return;
          const selected = Number(button.dataset.labOption);
          const answer = Number(item.dataset.answer);
          const isCorrect = selected === answer;
          item.dataset.answered = "true";
          item.dataset.correct = String(isCorrect);
          item.classList.add(isCorrect ? "is-correct" : "is-wrong");
          item.querySelectorAll("[data-lab-option]").forEach((optionButton, index) => {
            optionButton.disabled = true;
            if (index === answer) optionButton.classList.add("is-correct");
            if (index === selected && !isCorrect) optionButton.classList.add("is-wrong");
          });
          const feedback = item.querySelector("[data-lab-feedback]");
          if (feedback) {
            feedback.hidden = false;
            feedback.classList.add(isCorrect ? "is-correct" : "is-wrong");
            feedback.innerHTML = `<b>${isCorrect ? "Yes." : `Not quite - ${esc(item.dataset.answerLabel || "")}.`}</b> ${esc(item.dataset.why || "")}`;
          }
          RS.playSound(isCorrect ? "correct" : "wrong");
          update();
        });
      });
    });
    update();
  }

  function lessonNext(lesson) {
    const index = DATA.lessons.findIndex((item) => item.id === lesson.id);
    const next = DATA.lessons[index + 1];
    if (!next) {
      return `
        <div class="lesson-next lesson-next--finish">
          <div><span class="eyebrow">The last module</span><h2>All four corners of the map.</h2><p>Now check the whole picture: 31 items, a full answer review, and a diagnosis that points back to the exact section.</p></div>
          <button class="btn btn-primary" type="button" data-nav="#/test">${icon("clipboard-check")} Take the practice test ${icon("arrow-right")}</button>
        </div>`;
    }
    return `
      <div class="lesson-next">
        <div><span class="eyebrow">Next module</span><h2>${esc(next.title)}</h2><p>${esc(next.tagline)}</p></div>
        <button class="btn btn-primary" type="button" data-nav="${pageHref(next.route)}">Continue to ${esc(next.short)} ${icon("arrow-right")}</button>
      </div>`;
  }

  function lessonPage({ lesson, title, lede, intro = "", sections }) {
    const terms = DATA.terms.filter((term) => term.lesson === lesson.id);
    const tocItems = [
      ...lesson.sections.filter((item) => item.id !== "glossary").map((item) => ({ id: item.id, label: item.label })),
      { id: "glossary", label: "Key terms" },
      { id: "quick-check", label: "Quick check" }
    ];
    const next = DATA.lessons[DATA.lessons.findIndex((item) => item.id === lesson.id) + 1];
    return `
      <section class="lesson-page lesson--${lesson.color} page-enter" data-lesson-page="${lesson.id}">
        <div class="lesson-hero">
          <div class="lesson-hero-top">
            <span class="eyebrow eyebrow--${lesson.color}">${esc(lesson.kicker)}</span>
            <span class="lesson-status${state.lessons[lesson.id] ? " is-done" : ""}">${icon(state.lessons[lesson.id] ? "check-circle" : "clock")}${state.lessons[lesson.id] ? "Completed" : "Read again"}</span>
          </div>
          <div class="lesson-title-row">
            <span class="lesson-big-num" aria-hidden="true">${lesson.num}</span>
            <div class="lesson-title-copy">
              <h1>${title}</h1>
              <p>${lede}</p>
            </div>
          </div>
          <div class="lesson-meta">
            <span class="lesson-meta-item">${icon("clock")} ${lesson.minutes} min read</span>
            <span class="lesson-meta-item">${icon("list")} ${terms.length} key terms</span>
            <span class="lesson-meta-item">${icon("flask")} 1 interactive lab</span>
            <div class="tag-row">${lesson.tags.map((tag) => `<span class="tag">${esc(tag)}</span>`).join("")}</div>
            <button class="lesson-complete-btn${state.lessons[lesson.id] ? " is-complete" : ""}" type="button" data-lesson-toggle="${lesson.id}">${icon(state.lessons[lesson.id] ? "check-circle" : "check")} ${state.lessons[lesson.id] ? "Completed" : "Mark complete"}</button>
          </div>
        </div>

        <div class="lesson-layout">
          <aside class="toc" aria-label="On this page">
            <div class="toc-inner">
              <p class="toc-label">On this page</p>
              ${tocItems.map((item) => `<button class="toc-link" type="button" data-scroll="${item.id}"><span class="toc-dot" aria-hidden="true"></span>${esc(item.label)}</button>`).join("")}
            </div>
            <div class="toc-foot">
              <span>${next ? "Next up" : "Last stop"}</span>
              <strong>${next ? `${next.num} · ${esc(next.short)}` : "The full practice test"}</strong>
            </div>
            <div class="toc-foot toc-foot--accent">
              <span>Active recall</span>
              <strong>Close the notes and say each definition out loud before you flip a card.</strong>
            </div>
          </aside>

          <div class="lesson-content">
            ${intro ? `<div class="pd-lesson-intro">${intro}</div>` : ""}
            ${sections.join("")}
            ${glossarySection(lesson)}
            ${quickCheck(lesson.id)}
            ${lessonNext(lesson)}
          </div>
        </div>
      </section>`;
  }

  function renderCheatSheet() {
    return `
      <section class="cheat-page page-enter">
        <header class="cheat-hero">
          <div class="cheat-hero-copy">
            <span class="eyebrow">Last-minute recall · A.Y. 2025–2026</span>
            <h1>One-page <em>cheat sheet</em></h1>
            <p>If you only have ten minutes before the test, read this page. Brain regions first, love and grief distinctions second, the eight career factors last.</p>
          </div>
          <div class="cheat-toolbar print-hidden">
            <button class="btn btn-cream btn-sm" type="button" data-print-cheat>${icon("printer")} Print</button>
            <button class="btn btn-ghost btn-sm" type="button" data-nav="#/test" style="border-color:rgba(255,255,255,.22);color:#f7f0e2">${icon("clipboard-check")} Test</button>
          </div>
        </header>

        <div class="cheat-grid">
          <article class="cheat-card">
            <h2>Mind &amp; brain <span>01</span></h2>
            <div class="cheat-block">
              <div class="cheat-line"><b>Frontal:</b> planning, decision-making, impulse control, executive functions.</div>
              <div class="cheat-line"><b>Parietal:</b> integrates sensory information into a coherent perception.</div>
              <div class="cheat-line"><b>Occipital:</b> visual information — color, depth, reading a road sign.</div>
              <div class="cheat-line"><b>Cerebellum:</b> balance, coordination, smooth movement.</div>
              <div class="cheat-line"><b>Broca:</b> language production and language functions.</div>
              <div class="cheat-line"><b>Sperry:</b> left = logical/analytical; hemispheres have specialized functions.</div>
              <div class="cheat-line"><b>MacLean:</b> Triune Brain Theory — three interconnected systems.</div>
            </div>
            <div class="cheat-formula"><span>Hermann</span><b>4 quadrants</b></div>
            <div class="cheat-block">
              <div class="cheat-line"><b>Analytical:</b> upper-left — logic, facts, critical analysis.</div>
              <div class="cheat-line"><b>Sequential:</b> order, step-by-step tasks, planning, checklists.</div>
              <div class="cheat-line"><b>Interpersonal:</b> teamwork, relationships, communication.</div>
              <div class="cheat-line"><b>Mind map:</b> central idea in the middle; branches hold main topics.</div>
            </div>
          </article>

          <article class="cheat-card">
            <h2>Love &amp; attachment <span>02</span></h2>
            <div class="cheat-block">
              <div class="cheat-line"><b>Propinquity:</b> nearness and repeated contact build familiarity.</div>
              <div class="cheat-line"><b>Similarity:</b> shared values, interests, backgrounds increase liking.</div>
              <div class="cheat-line"><b>Reciprocity:</b> we like people who show they like us.</div>
              <div class="cheat-line"><b>Physical attractiveness:</b> initial attraction; health, vitality, reproductive fitness.</div>
              <div class="cheat-line"><b>Self-disclosure:</b> sharing thoughts and feelings honestly builds intimacy.</div>
            </div>
            <div class="cheat-formula"><span>Sequence</span><b>Lust → Attraction → Attachment</b></div>
            <div class="cheat-block">
              <div class="cheat-line"><b>Secure:</b> warm, consistent, emotionally available caregiver.</div>
              <div class="cheat-line"><b>Avoidant:</b> unresponsive/detached caregiver; child keeps distance.</div>
              <div class="cheat-line"><b>Anxious-ambivalent:</b> inconsistent care; separation anxiety or uncertainty.</div>
              <div class="cheat-line"><b>Sternberg:</b> intimacy, passion, commitment.</div>
            </div>
          </article>

          <article class="cheat-card">
            <h2>Grief &amp; mental health <span>03</span></h2>
            <div class="cheat-block">
              <div class="cheat-line"><b>Denial:</b> refuses to believe or accept a painful truth.</div>
              <div class="cheat-line"><b>Bargaining:</b> negotiates, makes deals, imagines reversing or postponing loss.</div>
              <div class="cheat-line"><b>Acceptance:</b> increasingly accepts the loss; ready to move forward.</div>
              <div class="cheat-line"><b>High-grief death:</b> sudden traumatic loss (e.g., fatal car accident) → intense breakdown.</div>
              <div class="cheat-line"><b>Support:</b> listen carefully, show empathy, support the grieving friend.</div>
            </div>
            <div class="cheat-formula"><span>OCD vs OCPD</span><b>obsessions/compulsions vs perfectionism/control</b></div>
            <div class="cheat-block">
              <div class="cheat-line"><b>Bipolar:</b> episodes of significant mood changes; elevated mood and depression.</div>
              <div class="cheat-line"><b>Schizophrenia:</b> difficulty distinguishing reality from imagination.</div>
              <div class="cheat-line"><b>OCD:</b> obsessions and/or compulsions; repetitive cleaning to reduce anxiety can be a sign.</div>
              <div class="cheat-line"><b>OCPD:</b> personality pattern of perfectionism, orderliness, and need for control.</div>
            </div>
          </article>

          <article class="cheat-card">
            <h2>Career compass <span>04</span></h2>
            <div class="cheat-block">
              <div class="cheat-line"><b>1. Parental pressure:</b> pressure from parents or guardians.</div>
              <div class="cheat-line"><b>2. Financial constraints:</b> limits on money for education, training, or opportunities.</div>
              <div class="cheat-line"><b>3. Job market:</b> availability of jobs and demand for workers in particular fields.</div>
              <div class="cheat-line"><b>4. School location:</b> distance or accessibility of a school or training institution.</div>
              <div class="cheat-line"><b>5. Peer pressure:</b> influence from friends or classmates.</div>
              <div class="cheat-line"><b>6. Gender bias:</b> unfair assumptions about careers and gender.</div>
              <div class="cheat-line"><b>7. Language limitation:</b> language difficulty restricting access.</div>
              <div class="cheat-line"><b>8. Academic performance:</b> grades and school achievement.</div>
            </div>
            <div class="callout callout--note" style="margin-top:12px"><span class="callout-icon">${icon("lightbulb")}</span><div class="callout-copy"><span class="callout-label">Remember</span><p>These forces <strong>influence</strong> a choice. They do not erase agency. Name the force, then decide what you can control.</p></div></div>
          </article>

          <article class="cheat-card cheat-card--wide">
            <h2>Top distinctions <span>Δ</span></h2>
            <div class="cheat-distinctions">
              <div class="cheat-distinction"><span><b>Frontal = planning; parietal = sensory integration; occipital = vision; cerebellum = balance.</b></span></div>
              <div class="cheat-distinction"><span><b>Left hemisphere = logical/analytical; split-brain theory = specialized functions.</b></span></div>
              <div class="cheat-distinction"><span><b>Propinquity = nearness; similarity = shared traits; reciprocity = mutual liking; self-disclosure = sharing.</b></span></div>
              <div class="cheat-distinction"><span><b>Lust = physical desire; attachment = lasting bond and commitment.</b></span></div>
              <div class="cheat-distinction"><span><b>Secure = warm/consistent; avoidant = detached; anxious-ambivalent = inconsistent.</b></span></div>
              <div class="cheat-distinction"><span><b>Sternberg's three components = intimacy, passion, commitment.</b></span></div>
              <div class="cheat-distinction"><span><b>Denial refuses the truth; bargaining negotiates with it.</b></span></div>
              <div class="cheat-distinction"><span><b>OCD = obsessions/compulsions; OCPD = perfectionism/order/control.</b></span></div>
              <div class="cheat-distinction"><span><b>Bipolar = mood episodes; schizophrenia = reality vs imagination.</b></span></div>
              <div class="cheat-distinction"><span><b>Career factors are external forces — not labels for who the student is.</b></span></div>
            </div>
            ${callout("memory", "Memory hook", "<p><strong>Four specialists, three love stages, three grief responses, eight career forces.</strong> Count them on your fingers before you enter the exam.</p>")}
          </article>
        </div>

        <div class="cheat-stats">
          <div class="cheat-stat"><strong>42</strong><span>numbered glossary terms</span></div>
          <div class="cheat-stat"><strong>8</strong><span>external career factors</span></div>
          <div class="cheat-stat"><strong>50</strong><span>flashcards in the deck</span></div>
          <div class="cheat-stat"><strong>4</strong><span>modules, one reviewer</span></div>
        </div>

        <div class="cheat-footer">
          <p>You don't need to reread everything.<br><em>Know the differences, and the rest will follow.</em></p>
          <span>Personal Development · A.Y. 2025–2026<br>Mind · Heart · Grief · Career</span>
        </div>
      </section>`;
  }

  let tocObserver = null;

  window.addEventListener("resize", scheduleTabRefresh, { passive: true });
  window.addEventListener("orientationchange", scheduleTabRefresh, { passive: true });
  if (document.fonts?.ready) document.fonts.ready.then(scheduleTabRefresh).catch(() => {});

  function bindToc() {
    cleanupToc();
    const root = document.getElementById("review-panel") || document;
    const links = [...root.querySelectorAll(".toc-link[data-scroll]")];
    if (!links.length) return;
    const sections = links
      .map((link) => document.getElementById(link.dataset.scroll))
      .filter((node) => node && root.contains(node));
    if (!("IntersectionObserver" in window)) return;
    tocObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach((link) => link.classList.toggle("is-active", link.dataset.scroll === visible.target.id));
    }, { rootMargin: "-18% 0px -62% 0px", threshold: [0.01, 0.15, 0.4] });
    sections.forEach((item) => tocObserver.observe(item));
  }

  function cleanupToc() {
    if (tocObserver) {
      tocObserver.disconnect();
      tocObserver = null;
    }
  }

  RS.renderReviewer = renderReviewer;
  RS.syncReviewerTabs = syncReviewerTabs;
  RS.refreshReviewerTabs = refreshReviewerTabs;
  RS.hideReviewerTabs = hideReviewerTabs;
  RS.renderOverview = renderOverview;
  RS.renderCheatSheet = renderCheatSheet;
  RS.quickCheck = quickCheck;
  RS.bindQuickCheck = bindQuickCheck;
  RS.bindToc = bindToc;
  RS.cleanupToc = cleanupToc;
  RS.bindScenarioLab = bindScenarioLab;
  RS.ui = { section, callout, table, getNextStep, lessonPage, scenarioLab };
  RS.lessonMeta = LESSON_META;
})();
