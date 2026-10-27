/* ==========================================================================
   Personal Development Studio - core
   State, persistence, shell, search, settings, and shared UI helpers.
   ========================================================================== */
(() => {
  "use strict";

  const DATA = window.STUDY_DATA;
  const STORAGE_KEY = "personalDevelopment.reviewer.v1";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  const esc = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[character]));
  const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
  const percent = (part, total) => (total > 0 ? Math.round((part / total) * 100) : 0);
  const pad = (number) => String(number).padStart(2, "0");
  const formatTime = (seconds) => {
    const safe = Math.max(0, Math.round(Number(seconds) || 0));
    return `${pad(Math.floor(safe / 60))}:${pad(safe % 60)}`;
  };
  const shuffle = (items) => {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[target]] = [copy[target], copy[index]];
    }
    return copy;
  };
  const prefersDark = () => window.matchMedia?.("(prefers-color-scheme: dark)").matches;

  const LESSON_IDS = DATA.lessons.map((lesson) => lesson.id);
  const CARD_IDS = DATA.flashcards.map((card) => card.id);
  const GAME_KEYS = Object.keys(DATA.games);
  const REVIEW_TABS = ["overview", ...DATA.lessons.map((lesson) => lesson.route), "test", "cheat"];

  const createDefaultState = () => ({
    version: 1,
    theme: prefersDark() ? "dark" : "light",
    lessons: Object.fromEntries(LESSON_IDS.map((id) => [id, false])),
    cards: {},
    test: { attempts: [], best: 0 },
    games: Object.fromEntries(GAME_KEYS.map((key) => [key, { best: 0, plays: 0 }])),
    settings: { sound: true }
  });

  function sanitizeState(input) {
    const base = createDefaultState();
    if (!input || typeof input !== "object") return base;

    if (input.theme === "dark" || input.theme === "light") base.theme = input.theme;

    for (const id of LESSON_IDS) {
      base.lessons[id] = Boolean(input.lessons?.[id]);
    }

    if (input.cards && typeof input.cards === "object") {
      for (const id of CARD_IDS) {
        if (input.cards[id] === true) base.cards[id] = true;
      }
    }

    const attempts = Array.isArray(input.test?.attempts) ? input.test.attempts : [];
    base.test.attempts = attempts
      .filter((attempt) => attempt && Number.isFinite(Number(attempt.score)))
      .slice(0, 30)
      .map((attempt) => ({
        score: clamp(Math.round(Number(attempt.score)), 0, DATA.test.length),
        total: DATA.test.length,
        mode: attempt.mode === "timed" ? "timed" : "practice",
        duration: clamp(Math.round(Number(attempt.duration) || 0), 0, 60 * 60 * 4),
        date: typeof attempt.date === "string" ? attempt.date : new Date().toISOString()
      }));
    base.test.best = base.test.attempts.reduce((best, attempt) => Math.max(best, attempt.score), 0);

    if (input.games && typeof input.games === "object") {
      for (const key of GAME_KEYS) {
        const game = input.games[key] || {};
        base.games[key] = {
          best: clamp(Math.round(Number(game.best) || 0), 0, 9999),
          plays: clamp(Math.round(Number(game.plays) || 0), 0, 99999)
        };
      }
    }

    base.settings.sound = input.settings?.sound === undefined ? base.settings.sound : Boolean(input.settings.sound);
    return base;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? sanitizeState(JSON.parse(raw)) : createDefaultState();
    } catch {
      return createDefaultState();
    }
  }

  const state = loadState();
  let storageAvailable = true;

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      storageAvailable = true;
    } catch {
      if (storageAvailable) {
        storageAvailable = false;
        toast("Progress could not be saved. Your browser may be blocking local storage.", "error", 6500);
      }
    }
  }

  function knownCardCount() {
    return CARD_IDS.filter((id) => state.cards[id]).length;
  }

  function lessonsDoneCount() {
    return LESSON_IDS.filter((id) => state.lessons[id]).length;
  }

  function getStats() {
    const lessons = lessonsDoneCount();
    const cards = knownCardCount();
    const best = state.test.best;
    const readiness = Math.round(
      (lessons / LESSON_IDS.length) * 60 +
      (cards / CARD_IDS.length) * 20 +
      (best / DATA.test.length) * 20
    );
    return {
      lessons,
      lessonsTotal: LESSON_IDS.length,
      cards,
      cardsTotal: CARD_IDS.length,
      testBest: best,
      testTotal: DATA.test.length,
      readiness: clamp(readiness, 0, 100),
      attempts: state.test.attempts.length
    };
  }

  function applyTheme() {
    document.documentElement.dataset.theme = state.theme;
    const isDark = state.theme === "dark";
    $$("[data-theme-icon]").forEach((node) => {
      node.innerHTML = `<use href="#i-${isDark ? "sun" : "moon"}"></use>`;
    });
    $$("#theme-toggle, #sidebar-theme").forEach((button) => {
      button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      button.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
    });
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = isDark ? "#071220" : "#f3eee5";
  }

  function toggleTheme() {
    state.theme = state.theme === "dark" ? "light" : "dark";
    saveState();
    applyTheme();
  }

  function updateShell() {
    const stats = getStats();
    const badge = $("#nav-card-badge");
    if (badge) badge.textContent = `${stats.cards}/${stats.cardsTotal}`;

    const summary = $("#sb-summary");
    if (summary) summary.textContent = `${stats.lessons} of ${stats.lessonsTotal} modules done`;
    const label = $("#sb-ring-label");
    if (label) label.textContent = stats.readiness;
    const fill = $("#sb-ring-fill");
    if (fill) fill.style.strokeDashoffset = String(100 - stats.readiness);

    for (const id of LESSON_IDS) {
      const minor = $(`[data-lesson-check="${id}"]`)?.closest(".sidebar-minor");
      if (minor) minor.classList.toggle("is-done", Boolean(state.lessons[id]));
    }
  }

  const LEGACY_ROUTES = {
    "index.html": "overview",
    "mind.html": "mind",
    "heart.html": "heart",
    "grief.html": "grief",
    "career.html": "career",
    "test.html": "test",
    "cheat-sheet.html": "cheat",
    "cheat-sheet": "cheat",
    "flashcards.html": "flashcards",
    "games.html": "games"
  };

  function navKey(value) {
    const raw = String(value || "")
      .replace(/^#\/?/, "")
      .split("?")[0]
      .replace(/\/+$/, "");
    return LEGACY_ROUTES[raw] || raw || "overview";
  }

  function setRouteUI(route) {
    const activeKey = route.page === "reviewer" ? (route.tab || "overview") : route.page;
    $$(".sidebar-link[data-nav]").forEach((button) => {
      const targetKey = navKey(button.dataset.nav);
      const active = targetKey === "overview" ? route.page === "reviewer" : targetKey === route.page;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });

    $$(".sidebar-minor[data-nav]").forEach((button) => {
      const targetKey = navKey(button.dataset.nav);
      const active = route.page === "reviewer" && activeKey === targetKey;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });

    const labels = {
      overview: "Overview",
      ...Object.fromEntries(DATA.lessons.map((lesson) => [lesson.route, `Module ${lesson.num} - ${lesson.short}`])),
      test: "Practice test",
      cheat: "Cheat sheet"
    };
    const crumb = $("#crumb-current");
    if (crumb) {
      if (route.page === "flashcards") crumb.textContent = "Flashcards";
      else if (route.page === "games") {
        crumb.textContent = route.params?.game && DATA.games[route.params.game]
          ? DATA.games[route.params.game].name
          : "Arcade games";
      } else crumb.textContent = labels[route.tab] || "Overview";
    }

    const baseTitle = "Personal Development Reviewer";
    document.title = route.page === "flashcards"
      ? "Flashcards - Personal Development Reviewer"
      : route.page === "games"
        ? `${route.params?.game && DATA.games[route.params.game] ? DATA.games[route.params.game].name : "Arcade"} - Personal Development Reviewer`
        : `${labels[route.tab] || "Reviewer"} - Personal Development Reviewer`;
    if (!document.title) document.title = baseTitle;
  }

  /* ---------- Toasts ---------- */
  function toast(message, type = "default", timeout = 3800) {
    const stack = $("#toasts");
    if (!stack) return;
    const node = document.createElement("div");
    node.className = `toast${type === "success" || type === "error" ? ` toast--${type}` : ""}`;
    const toastIcon = type === "success" ? "check-circle" : type === "error" ? "alert" : "info";
    node.innerHTML = `<span class="toast-icon">${icon(toastIcon)}</span><span class="toast-copy"></span><button class="toast-close" type="button" aria-label="Dismiss">${icon("x")}</button>`;
    node.querySelector(".toast-copy").textContent = message;
    const remove = () => {
      if (!node.isConnected || node.classList.contains("is-leaving")) return;
      node.classList.add("is-leaving");
      window.setTimeout(() => node.remove(), 230);
    };
    node.querySelector(".toast-close").addEventListener("click", remove);
    stack.appendChild(node);
    window.setTimeout(remove, timeout);
  }

  /* ---------- Scroll lock ---------- */
  let modalOpen = false;
  let paletteOpen = false;
  let menuOpen = false;
  function lockBody() {
    document.body.classList.toggle("no-scroll", modalOpen || paletteOpen || menuOpen);
  }

  /* ---------- Modal ---------- */
  const modalRoot = $("#modal-root");
  let lastFocused = null;

  function openModal({ title, subtitle = "", content = "", footer = "", wide = false, onMount }) {
    if (!modalRoot) return;
    lastFocused = document.activeElement;
    modalRoot.innerHTML = `
      <div class="modal-overlay" data-modal-overlay>
        <div class="modal${wide ? " modal--wide" : ""}" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div class="modal-head">
            <div><h2 id="modal-title">${esc(title)}</h2>${subtitle ? `<p>${esc(subtitle)}</p>` : ""}</div>
            <button class="modal-close" type="button" data-modal-close aria-label="Close dialog">${icon("x")}</button>
          </div>
          <div class="modal-body">${content}${footer ? `<div class="modal-actions">${footer}</div>` : ""}</div>
        </div>
      </div>`;
    modalRoot.hidden = false;
    modalOpen = true;
    lockBody();
    const overlay = $("[data-modal-overlay]", modalRoot);
    const close = () => closeModal();
    overlay?.addEventListener("mousedown", (event) => {
      if (event.target === overlay) close();
    });
    $$("[data-modal-close]", modalRoot).forEach((button) => button.addEventListener("click", close));
    window.setTimeout(() => {
      const target = $(".modal button, .modal input, .modal select, .modal [tabindex]", modalRoot);
      target?.focus();
    }, 20);
    onMount?.(modalRoot, close);
    return close;
  }

  function closeModal() {
    if (!modalRoot || !modalOpen) return;
    modalRoot.hidden = true;
    modalRoot.innerHTML = "";
    modalOpen = false;
    lockBody();
    if (lastFocused instanceof HTMLElement) lastFocused.focus({ preventScroll: true });
  }

  function openConfirm({ title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", danger = false, onConfirm }) {
    openModal({
      title,
      content: `<div class="${danger ? "danger-zone" : "callout callout--note"}">${danger ? `<strong>This cannot be undone.</strong><p>${esc(message)}</p>` : `<span class="callout-label">Please confirm</span><p>${esc(message)}</p>`}</div>`,
      footer: `<button class="btn btn-ghost" type="button" data-confirm-cancel>${esc(cancelLabel)}</button><button class="btn ${danger ? "btn-danger" : "btn-primary"}" type="button" data-confirm-ok>${esc(confirmLabel)}</button>`,
      onMount(root, close) {
        $("[data-confirm-cancel]", root)?.addEventListener("click", close);
        $("[data-confirm-ok]", root)?.addEventListener("click", () => {
          close();
          onConfirm?.();
        });
      }
    });
  }

  /* ---------- Settings & backup ---------- */
  function downloadBackup() {
    const payload = {
      app: "personal-development-reviewer",
      exportedAt: new Date().toISOString(),
      state
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `personal-development-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast("Backup downloaded. Keep it somewhere safe.", "success");
  }

  function replaceState(incoming) {
    const clean = sanitizeState(incoming);
    Object.assign(state, clean);
    saveState();
    applyTheme();
    updateShell();
    RS.sessionResets.forEach((reset) => reset());
    RS.renderRoute?.({ announce: false });
    toast("Backup restored. Your progress is back.", "success");
  }

  function importBackup(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const incoming = parsed?.state || parsed;
        if (!incoming || typeof incoming !== "object" || !("lessons" in incoming || "cards" in incoming)) {
          throw new Error("This does not look like a Personal Development Reviewer backup.");
        }
        replaceState(incoming);
        closeModal();
      } catch (error) {
        toast(error instanceof Error ? error.message : "The backup could not be read.", "error", 5000);
      }
    };
    reader.onerror = () => toast("The backup file could not be opened.", "error");
    reader.readAsText(file);
  }

  function resetProgress({ full = false } = {}) {
    const fresh = createDefaultState();
    if (!full) {
      fresh.theme = state.theme;
      fresh.settings.sound = state.settings.sound;
    }
    Object.assign(state, fresh);
    saveState();
    applyTheme();
    updateShell();
    RS.sessionResets.forEach((reset) => reset());
    RS.renderRoute?.({ announce: false });
    toast("Progress reset. A clean slate.", "success");
  }

  function openSettings() {
    openModal({
      title: "Settings & backup",
      subtitle: "Everything is stored privately in this browser — no account, no database.",
      content: `
        <div class="setting-row">
          <div class="setting-copy"><strong>Appearance</strong><span>Switch between the warm paper and midnight themes.</span></div>
          <div class="setting-actions"><button class="btn btn-secondary btn-sm" type="button" data-setting-theme>${icon(state.theme === "dark" ? "sun" : "moon")}<span>${state.theme === "dark" ? "Light mode" : "Dark mode"}</span></button></div>
        </div>
        <div class="setting-row">
          <div class="setting-copy"><strong>Interface sound</strong><span>Soft feedback tones across lessons, flashcards, and games.</span></div>
          <div class="setting-actions"><button class="btn btn-secondary btn-sm" type="button" data-setting-sound aria-pressed="${state.settings.sound}">${icon(state.settings.sound ? "volume" : "volume-off")}<span>${state.settings.sound ? "Sound on" : "Sound off"}</span></button></div>
        </div>
        <div class="setting-row">
          <div class="setting-copy"><strong>Backup your progress</strong><span>Download a small JSON file, or restore one you saved earlier.</span></div>
          <div class="setting-actions">
            <button class="btn btn-secondary btn-sm" type="button" data-setting-export>${icon("download")}Export</button>
            <button class="btn btn-secondary btn-sm" type="button" data-setting-import>${icon("upload")}Import</button>
            <input type="file" accept="application/json,.json" data-backup-input hidden />
          </div>
        </div>
        <div class="danger-zone">
          <strong>Reset progress</strong>
          <p>Clears module checks, flashcard mastery, test attempts, and arcade best scores. Your theme and sound choice stay.</p>
          <div class="setting-actions"><button class="btn btn-danger btn-sm" type="button" data-setting-reset>${icon("rotate")}Reset progress</button></div>
        </div>
        <p class="setting-copy"><span>Static study app · Personal Development Reviewer · A.Y. 2025–2026.</span></p>`,      footer: `<button class="btn btn-ghost" type="button" data-modal-close>Close</button>`,
      onMount(root, close) {
        $("[data-setting-theme]", root)?.addEventListener("click", () => {
          toggleTheme();
          const button = $("[data-setting-theme]", root);
          if (button) {
            button.innerHTML = `${icon(state.theme === "dark" ? "sun" : "moon")}<span>${state.theme === "dark" ? "Light mode" : "Dark mode"}</span>`;
          }
        });
        $("[data-setting-sound]", root)?.addEventListener("click", () => {
          toggleSound();
          const button = $("[data-setting-sound]", root);
          if (button) {
            button.innerHTML = `${icon(state.settings.sound ? "volume" : "volume-off")}<span>${state.settings.sound ? "Sound on" : "Sound off"}</span>`;
            button.setAttribute("aria-pressed", String(state.settings.sound));
          }
        });
        $("[data-setting-export]", root)?.addEventListener("click", downloadBackup);
        const input = $("[data-backup-input]", root);
        $("[data-setting-import]", root)?.addEventListener("click", () => input?.click());
        input?.addEventListener("change", () => {
          importBackup(input.files?.[0]);
          input.value = "";
        });
        $("[data-setting-reset]", root)?.addEventListener("click", () => {
          close();
          window.setTimeout(() => {
            openConfirm({
              title: "Reset all progress?",
              message: "Your lesson checks, flashcard progress, test history, and game high scores will be erased.",
              confirmLabel: "Reset progress",
              danger: true,
              onConfirm: () => resetProgress()
            });
          }, 30);
        });
      }
    });
  }

  /* ---------- Sound ---------- */
  let audioContext = null;
  function ensureAudio() {
    if (!audioContext) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return null;
      audioContext = new AudioCtor();
    }
    if (audioContext.state === "suspended") audioContext.resume();
    return audioContext;
  }

  function tone(frequency, start, duration, type = "sine", gain = 0.04) {
    const context = ensureAudio();
    if (!context) return;
    const oscillator = context.createOscillator();
    const volume = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime + start);
    volume.gain.setValueAtTime(0.0001, context.currentTime + start);
    volume.gain.exponentialRampToValueAtTime(gain, context.currentTime + start + 0.012);
    volume.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + start + duration);
    oscillator.connect(volume);
    volume.connect(context.destination);
    oscillator.start(context.currentTime + start);
    oscillator.stop(context.currentTime + start + duration + 0.03);
  }

  function playSound(kind) {
    if (!state.settings.sound) return;
    try {
      if (kind === "correct") {
        tone(523.25, 0, 0.12, "sine", 0.045);
        tone(783.99, 0.09, 0.18, "sine", 0.04);
      } else if (kind === "wrong") {
        tone(220, 0, 0.14, "triangle", 0.035);
        tone(174.61, 0.1, 0.18, "triangle", 0.03);
      } else if (kind === "start") {
        tone(392, 0, 0.1, "sine", 0.035);
        tone(587.33, 0.09, 0.16, "sine", 0.035);
      } else if (kind === "win") {
        tone(523.25, 0, 0.12, "sine", 0.04);
        tone(659.25, 0.1, 0.12, "sine", 0.04);
        tone(783.99, 0.2, 0.2, "sine", 0.045);
      } else if (kind === "found") {
        tone(587.33, 0, 0.1, "sine", 0.035);
        tone(880, 0.08, 0.14, "sine", 0.035);
        tone(1174.66, 0.17, 0.22, "sine", 0.03);
      } else if (kind === "flip") {
        tone(440, 0, 0.07, "triangle", 0.025);
        tone(660, 0.06, 0.1, "sine", 0.022);
      } else if (kind === "click") {
        tone(620, 0, 0.04, "square", 0.015);
      }
    } catch {
      /* Audio is a nice-to-have; never break the study flow. */
    }
  }

  function applySoundUI() {
    const on = state.settings.sound;
    $$("[data-sound-toggle]").forEach((button) => {
      button.setAttribute("aria-pressed", String(on));
      button.innerHTML = icon(on ? "volume" : "volume-off");
      button.setAttribute("aria-label", on ? "Mute interface sounds" : "Enable interface sounds");
      button.setAttribute("title", on ? "Mute interface sounds" : "Enable interface sounds");
    });
  }

  function toggleSound() {
    state.settings.sound = !state.settings.sound;
    saveState();
    applySoundUI();
    if (state.settings.sound) playSound("click");
    updateShell();
    return state.settings.sound;
  }

  /* ---------- Confetti ---------- */
  let confettiFrame = null;
  function celebrate(strength = 1) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = $("#confetti-canvas");
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colors = ["#2f7568", "#9a4b67", "#b05a34", "#d9a441", "#e8dcc8", "#f8f2e6"];
    const count = Math.round(80 * clamp(strength, 0.5, 1.6));
    const particles = Array.from({ length: count }, () => ({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * Math.min(420, window.innerWidth * 0.4),
      y: window.innerHeight * 0.34 + (Math.random() - 0.5) * 90,
      vx: (Math.random() - 0.5) * 9,
      vy: -Math.random() * 9 - 2,
      gravity: 0.2 + Math.random() * 0.12,
      size: 4 + Math.random() * 7,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.24,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 80 + Math.random() * 50
    }));
    if (confettiFrame) cancelAnimationFrame(confettiFrame);
    let frame = 0;
    const run = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let alive = false;
      for (const particle of particles) {
        if (particle.life <= 0) continue;
        alive = true;
        particle.life -= 1;
        particle.vy += particle.gravity;
        particle.vx *= 0.995;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.spin;
        context.save();
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);
        context.globalAlpha = Math.min(1, particle.life / 25);
        context.fillStyle = particle.color;
        context.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size / 2);
        context.restore();
      }
      frame += 1;
      if (alive && frame < 190) confettiFrame = requestAnimationFrame(run);
      else {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        confettiFrame = null;
      }
    };
    run();
  }

  /* ---------- Hash routing (one page, one shell) ---------- */
  function readHash() {
    const raw = location.hash.replace(/^#\/?/, "");
    const [pathPart, queryPart = ""] = raw.split("?");
    const clean = decodeURIComponent(pathPart).replace(/\/+$/, "") || "overview";
    return { path: LEGACY_ROUTES[clean] || clean, params: new URLSearchParams(queryPart) };
  }

  function normalizeRoute() {
    const { path, params: query } = readHash();
    const params = Object.fromEntries(query);
    let currentPage = path;
    if (currentPage === "reviewer" && params.tab) currentPage = params.tab;
    if (currentPage === "flashcards") return { page: "flashcards", tab: "", params };
    if (currentPage === "games") {
      const game = GAME_KEYS.includes(params.game) ? params.game : null;
      return { page: "games", tab: "", params: game ? { ...params, game } : params };
    }
    if (currentPage === "overview") return { page: "reviewer", tab: "overview", params };
    if (currentPage === "test" || currentPage === "cheat") return { page: "reviewer", tab: currentPage, params };
    if (REVIEW_TABS.includes(currentPage)) return { page: "reviewer", tab: currentPage, params };
    return { page: "reviewer", tab: "overview", params };
  }

  function toRouteHash(target) {
    const value = String(target || "").trim();
    if (!value) return "#/overview";
    if (value.startsWith("#/")) return value;
    if (value.startsWith("#")) return `#/${value.slice(1)}`;
    if (/^(https?:|mailto:|tel:)/i.test(value)) return value;
    const [pathPart, queryPart = ""] = value.split("?");
    const path = navKey(pathPart);
    return `#/${path}${queryPart ? `?${queryPart}` : ""}`;
  }

  function navigate(target) {
    if (!target) return;
    const value = String(target);
    if (value.startsWith("#") && !value.startsWith("#/")) {
      document.querySelector(value)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (/^(https?:|mailto:|tel:)/i.test(value)) {
      window.location.href = value;
      return;
    }
    const nextHash = toRouteHash(value);
    if (location.hash === nextHash) return;
    window.location.hash = nextHash;
  }

  /* ---------- Search palette ---------- */
  const QUICK_RESULTS = [
    { title: "Reviewer overview", label: "A.Y. 2025-2026 · Start here", keywords: "home review modules personal development", icon: "book-open", route: "#/overview" },
    { title: "Practice test - 31 items", label: "Check your recall", keywords: "exam quiz answer review test", icon: "clipboard-check", route: "#/test" },
    { title: "Flashcards", label: "Study tools · 50 cards", keywords: "cards definitions memorize terms", icon: "cards", route: "#/flashcards" },
    { title: "Arcade games", label: "Play to learn · 4 games", keywords: "game arcade crossword mind heart life compass", icon: "sparkles", route: "#/games" }
  ];

  function routeForSearchItem(item) {
    if (DATA.lessons.some((lesson) => lesson.route === item.page)) {
      const section = item.section ? `?section=${encodeURIComponent(item.section)}` : "";
      return `#/${item.page}${section}`;
    }
    if (item.page === "practice") return "#/test";
    if (item.page === "cheat") return "#/cheat";
    if (item.page === "flashcards") return "#/flashcards";
    if (item.page === "games") return `#/games${item.section ? `?game=${item.section}` : ""}`;
    return "#/overview";
  }

  const searchItems = [
    ...DATA.searchIndex.map((item) => ({
      title: item.title,
      label: item.label,
      keywords: item.keywords,
      icon: item.page === "flashcards" ? "cards" : item.page === "practice" ? "clipboard-check" : item.page === "cheat" ? "file-text" : "book-open",
      route: routeForSearchItem(item)
    })),
    ...GAME_KEYS.map((key) => ({
      title: DATA.games[key].name,
      label: `${DATA.games[key].kicker} · Arcade`,
      keywords: `${DATA.games[key].tagline} ${DATA.games[key].description} game arcade`,
      icon: DATA.games[key].icon,
      route: `#/games?game=${key}`
    }))
  ];

  let paletteResults = [];
  let paletteIndex = 0;
  let paletteTrigger = null;

  function renderPaletteResults(query) {
    const container = $("#palette-results");
    if (!container) return;
    const normalized = query.trim().toLowerCase();
    const source = normalized
      ? searchItems.filter((item) => `${item.title} ${item.label} ${item.keywords}`.toLowerCase().includes(normalized))
      : QUICK_RESULTS;
    paletteResults = source.slice(0, 10);
    paletteIndex = clamp(paletteIndex, 0, Math.max(0, paletteResults.length - 1));
    if (!paletteResults.length) {
      container.innerHTML = `<div class="palette-empty">No matches for “${esc(query)}”. Try “Hermann”, “grief”, “OCPD”, “attachment”, or “career”.</div>`;
      return;
    }
    container.innerHTML = `
      <div class="palette-group-label">${normalized ? "Search results" : "Jump to"}</div>
      ${paletteResults.map((item, index) => `
        <button class="palette-result${index === paletteIndex ? " is-active" : ""}" type="button" role="option" aria-selected="${index === paletteIndex}" data-palette-index="${index}">
          <span class="palette-result-icon">${icon(item.icon)}</span>
          <span class="palette-result-copy"><strong>${esc(item.title)}</strong><span>${esc(item.label)}</span></span>
          ${icon("arrow-up-right")}
        </button>`).join("")}`;
    $$("[data-palette-index]", container).forEach((button) => {
      button.addEventListener("mouseenter", () => {
        paletteIndex = Number(button.dataset.paletteIndex);
        $$("[data-palette-index]", container).forEach((node) => {
          node.classList.toggle("is-active", node === button);
          node.setAttribute("aria-selected", String(node === button));
        });
      });
      button.addEventListener("click", () => choosePaletteItem(Number(button.dataset.paletteIndex)));
    });
  }

  function openPalette() {
    const root = $("#palette-root");
    const input = $("#palette-input");
    if (!root || !input) return;
    paletteTrigger = document.activeElement;
    paletteOpen = true;
    root.hidden = false;
    lockBody();
    $("#search-trigger")?.setAttribute("aria-expanded", "true");
    input.value = "";
    paletteIndex = 0;
    renderPaletteResults("");
    window.setTimeout(() => input.focus(), 20);
  }

  function closePalette() {
    const root = $("#palette-root");
    if (!root || !paletteOpen) return;
    paletteOpen = false;
    root.hidden = true;
    lockBody();
    $("#search-trigger")?.setAttribute("aria-expanded", "false");
    if (paletteTrigger instanceof HTMLElement) paletteTrigger.focus({ preventScroll: true });
  }

  function choosePaletteItem(index) {
    const item = paletteResults[index];
    if (!item) return;
    closePalette();
    navigate(item.route);
  }

  function movePalette(direction) {
    if (!paletteResults.length) return;
    paletteIndex = (paletteIndex + direction + paletteResults.length) % paletteResults.length;
    const container = $("#palette-results");
    $$("[data-palette-index]", container).forEach((node) => {
      const active = Number(node.dataset.paletteIndex) === paletteIndex;
      node.classList.toggle("is-active", active);
      node.setAttribute("aria-selected", String(active));
      if (active) node.scrollIntoView({ block: "nearest" });
    });
  }

  function initPalette() {
    const root = $("#palette-root");
    const input = $("#palette-input");
    if (!root || !input) return;
    $("#search-trigger")?.addEventListener("click", openPalette);
    root.addEventListener("mousedown", (event) => {
      if (event.target === root) closePalette();
    });
    input.addEventListener("input", () => {
      paletteIndex = 0;
      renderPaletteResults(input.value);
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        movePalette(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        movePalette(-1);
      } else if (event.key === "Enter") {
        event.preventDefault();
        choosePaletteItem(paletteIndex);
      }
    });
    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        paletteOpen ? closePalette() : openPalette();
      } else if (event.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || "")) {
        event.preventDefault();
        openPalette();
      } else if (event.key === "Escape") {
        if (paletteOpen) closePalette();
        else if (modalOpen) closeModal();
      }
    });
  }

  /* ---------- Mobile sidebar & shell events ---------- */
  function openMenu() {
    $("#sidebar")?.classList.add("open");
    const backdrop = $("#sidebar-backdrop");
    if (backdrop) backdrop.hidden = false;
    $("#menu-btn")?.setAttribute("aria-expanded", "true");
    menuOpen = true;
    lockBody();
  }

  function closeMenu() {
    $("#sidebar")?.classList.remove("open");
    const backdrop = $("#sidebar-backdrop");
    if (backdrop) backdrop.hidden = true;
    $("#menu-btn")?.setAttribute("aria-expanded", "false");
    menuOpen = false;
    lockBody();
  }

  function initShell() {
    applyTheme();
    applySoundUI();
    updateShell();
    initPalette();

    $("#menu-btn")?.addEventListener("click", () => (menuOpen ? closeMenu() : openMenu()));
    $("#sidebar-close")?.addEventListener("click", closeMenu);
    $("#sidebar-backdrop")?.addEventListener("click", closeMenu);
    $("#theme-toggle")?.addEventListener("click", toggleTheme);
    $("#sidebar-theme")?.addEventListener("click", toggleTheme);
    $("#sidebar-settings")?.addEventListener("click", () => {
      closeMenu();
      openSettings();
    });
    $$("[data-open-settings]").forEach((button) => button.addEventListener("click", openSettings));
    $$("[data-sound-toggle]").forEach((button) => {
      button.addEventListener("click", toggleSound);
    });

    document.addEventListener("click", (event) => {
      const nav = event.target.closest("[data-nav]");
      if (nav) {
        event.preventDefault();
        closeMenu();
        navigate(nav.dataset.nav);
      }
    });

    window.addEventListener("hashchange", () => {
      window.RS?.renderRoute?.({ announce: true, transition: true });
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1024) closeMenu();
    });
    if (window.innerWidth > 1024) closeMenu();
  }

  window.RS = {
    DATA, state, saveState, sanitizeState,
    $, $$, icon, esc, clamp, percent, pad, formatTime, shuffle,
    toast, openModal, closeModal, openConfirm, openSettings, downloadBackup, importBackup, resetProgress,
    celebrate, playSound, tone, toggleSound,
    applyTheme, toggleTheme, updateShell, setRouteUI, getStats, knownCardCount, lessonsDoneCount,
    navigate, normalizeRoute, openPalette, closePalette, closeMenu, initShell, lockBody,
    sessionResets: []
  };
})();
