/* ==========================================================================
   Personal Development Reviewer - single-page boot, transitions, lazy assets
   ========================================================================== */
(() => {
  "use strict";

  const RS = window.RS;
  const { icon } = RS;

  let targetTimer = null;
  let navToken = 0;
  let bootComplete = false;
  let progressTimer = null;
  let progressRevealTimer = null;
  let routeSlideTimer = null;

  const ASSET_VERSION = document.documentElement.dataset.assetVersion || "";
  const withVersion = (path) => (ASSET_VERSION ? `${path}?v=${encodeURIComponent(ASSET_VERSION)}` : path);
  const INITIAL_CSS = new Set(["css/styles.css", "css/overview.css"]);
  const loadedCss = new Set(INITIAL_CSS);
  const loadingCss = new Map();
  const loadedJs = new Set();
  const loadingJs = new Map();

  // Legacy entry pages link some route assets directly; count those as loaded
  // so this boot never injects a second copy of a module.
  document.querySelectorAll('link[rel="stylesheet"][href]').forEach((link) => {
    loadedCss.add(link.getAttribute("href").split("?")[0]);
  });
  document.querySelectorAll("script[src]").forEach((script) => {
    loadedJs.add(script.getAttribute("src").split("?")[0]);
  });

  const ROUTE_ASSETS = {
    overview: { css: ["css/overview.css"], js: ["js/reviewer.js"] },
    mind: { css: ["css/lesson.css", "css/personal.css"], js: ["js/reviewer.js", "js/mind.js"] },
    heart: { css: ["css/lesson.css", "css/personal.css"], js: ["js/reviewer.js", "js/heart.js"] },
    grief: { css: ["css/lesson.css", "css/personal.css"], js: ["js/reviewer.js", "js/grief.js"] },
    career: { css: ["css/lesson.css", "css/personal.css"], js: ["js/reviewer.js", "js/career.js"] },
    test: { css: ["css/practice.css"], js: ["js/reviewer.js", "js/practice.js"] },
    cheat: { css: ["css/cheat-sheet.css"], js: ["js/reviewer.js"] },
    flashcards: { css: ["css/flashcards.css"], js: ["js/flashcards.js"] },
    games: { css: ["css/games.css", "css/crossword.css"], js: ["js/crossword.js", "js/games.js"] }
  };

  const ROUTE_ORDER = ["overview", "mind", "heart", "grief", "career", "test", "cheat", "flashcards", "games"];
  let lastRouteKey = null;
  let lastRouteSection = null;

  function routeKey(route) {
    return route.page === "reviewer" ? (route.tab || "overview") : route.page;
  }

  function routeSection(route) {
    if (route.page === "flashcards") return "flashcards";
    if (route.page === "games") return "games";
    return "reviewer";
  }

  function directionFor(route) {
    const key = routeKey(route);
    if (!lastRouteKey || key === lastRouteKey) return 1;
    const previous = ROUTE_ORDER.indexOf(lastRouteKey);
    const next = ROUTE_ORDER.indexOf(key);
    if (previous < 0 || next < 0) return 1;
    return next >= previous ? 1 : -1;
  }

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  function loaderNode() {
    return document.getElementById("page-loader");
  }

  function setLoaderLabel(text) {
    const label = document.getElementById("page-loader-label");
    if (label) label.textContent = text;
  }

  function showLoader() {
    const loader = loaderNode();
    if (!loader) return;
    loader.classList.remove("is-hidden");
    loader.removeAttribute("aria-hidden");
  }

  function hideLoader() {
    const loader = loaderNode();
    if (!loader) return;
    loader.classList.add("is-hidden");
    loader.setAttribute("aria-hidden", "true");
  }

  function showProgress() {
    const progress = document.getElementById("route-progress");
    if (!progress) return;
    if (progressTimer) window.clearTimeout(progressTimer);
    progress.classList.remove("is-active", "is-complete");
    void progress.offsetWidth;
    progress.classList.add("is-active");
  }

  function scheduleProgress() {
    if (progressRevealTimer) window.clearTimeout(progressRevealTimer);
    progressRevealTimer = window.setTimeout(() => {
      progressRevealTimer = null;
      showProgress();
    }, 180);
  }

  function finishProgress() {
    if (progressRevealTimer) {
      window.clearTimeout(progressRevealTimer);
      progressRevealTimer = null;
    }
    const progress = document.getElementById("route-progress");
    if (!progress) return;
    progress.classList.add("is-complete");
    if (progressTimer) window.clearTimeout(progressTimer);
    progressTimer = window.setTimeout(() => {
      progress.classList.remove("is-active", "is-complete");
    }, 340);
  }

  function routeLabel(route) {
    if (route.page === "flashcards") return "Flashcards";
    if (route.page === "games") {
      return route.params?.game && RS.DATA.games[route.params.game]
        ? RS.DATA.games[route.params.game].name
        : "Arcade games";
    }
    if (route.tab === "overview") return "Reviewer overview";
    if (route.tab === "test") return "Practice test";
    if (route.tab === "cheat") return "Cheat sheet";
    const lesson = RS.DATA.lessons.find((item) => item.route === route.tab);
    return lesson ? `Module ${lesson.num} - ${lesson.short}` : "Reviewer";
  }

  function routeAssetKey(route) {
    if (route.page === "reviewer") return route.tab || "overview";
    return route.page;
  }

  function loadCss(href) {
    if (loadedCss.has(href)) return Promise.resolve();
    if (loadingCss.has(href)) return loadingCss.get(href);
    const promise = new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = withVersion(href);
      link.dataset.routeAsset = "css";
      link.addEventListener("load", () => {
        loadedCss.add(href);
        loadingCss.delete(href);
        resolve();
      }, { once: true });
      link.addEventListener("error", () => {
        loadingCss.delete(href);
        reject(new Error(`Could not load stylesheet: ${href}`));
      }, { once: true });
      document.head.appendChild(link);
    });
    loadingCss.set(href, promise);
    return promise;
  }

  function loadScript(src) {
    if (loadedJs.has(src)) return Promise.resolve();
    if (loadingJs.has(src)) return loadingJs.get(src);
    const promise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = withVersion(src);
      script.async = false;
      script.dataset.routeAsset = "js";
      script.addEventListener("load", () => {
        loadedJs.add(src);
        loadingJs.delete(src);
        resolve();
      }, { once: true });
      script.addEventListener("error", () => {
        loadingJs.delete(src);
        reject(new Error(`Could not load script: ${src}`));
      }, { once: true });
      document.head.appendChild(script);
    });
    loadingJs.set(src, promise);
    return promise;
  }

  async function ensureRouteAssets(route) {
    const spec = ROUTE_ASSETS[routeAssetKey(route)] || ROUTE_ASSETS.overview;
    await Promise.all(spec.css.map(loadCss));
    for (const src of spec.js) {
      await loadScript(src);
    }
  }

  function routeAssetsReady(route) {
    const spec = ROUTE_ASSETS[routeAssetKey(route)] || ROUTE_ASSETS.overview;
    return spec.css.every((href) => loadedCss.has(href)) && spec.js.every((src) => loadedJs.has(src));
  }

  function warmRouteAssets() {
    const css = new Set();
    const js = new Set();
    Object.values(ROUTE_ASSETS).forEach((spec) => {
      spec.css.forEach((href) => css.add(href));
      spec.js.forEach((src) => js.add(src));
    });
    css.forEach((href) => {
      if (!loadedCss.has(href)) loadCss(href).catch(() => {});
    });
    js.forEach((src) => {
      if (!loadedJs.has(src)) loadScript(src).catch(() => {});
    });
  }

  function clearTarget() {
    if (targetTimer) {
      window.clearTimeout(targetTimer);
      targetTimer = null;
    }
    document.querySelectorAll(".is-target").forEach((node) => node.classList.remove("is-target"));
  }

  function cleanupRoute() {
    RS.cleanupPractice?.();
    RS.cleanupFlashcards?.();
    RS.cleanupGames?.();
    RS.cleanupToc?.();
    clearTarget();
  }

  function jumpToTop() {
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previous;
  }

  function clearRouteSlide() {
    if (routeSlideTimer) {
      window.clearTimeout(routeSlideTimer);
      routeSlideTimer = null;
    }
    document.querySelectorAll("#view .route-old").forEach((node) => node.remove());
    document.querySelectorAll("#view .route-slide-in").forEach((node) => {
      node.classList.remove("route-slide-in");
      node.style.removeProperty("--page-dir");
    });
  }

  function bindPrint(root) {
    root.querySelector("[data-print-cheat]")?.addEventListener("click", () => {
      RS.playSound("click");
      window.print();
    });
  }

  function bindLessonToggle(root) {
    const button = root.querySelector("[data-lesson-toggle]");
    if (!button) return;
    const id = Number(button.dataset.lessonToggle);
    const lesson = RS.DATA.lessons.find((item) => item.id === id);
    button.addEventListener("click", () => {
      const nowDone = !RS.state.lessons[id];
      RS.state.lessons[id] = nowDone;
      RS.saveState();
      RS.updateShell();
      button.classList.toggle("is-complete", nowDone);
      button.innerHTML = `${icon(nowDone ? "check-circle" : "check")} ${nowDone ? "Completed" : "Mark complete"}`;
      const status = root.querySelector(".lesson-status");
      if (status) {
        status.classList.toggle("is-done", nowDone);
        status.innerHTML = `${icon(nowDone ? "check-circle" : "clock")}${nowDone ? "Completed" : "Read again"}`;
      }
      RS.playSound(nowDone ? "correct" : "click");
      RS.toast(
        nowDone
          ? `Module ${lesson?.num || id} marked complete.`
          : `Module ${lesson?.num || id} marked incomplete.`,
        nowDone ? "success" : "default"
      );
      const stats = RS.getStats();
      if (nowDone && stats.lessons === stats.lessonsTotal) {
        window.setTimeout(() => RS.celebrate(0.9), 150);
        window.setTimeout(() => RS.toast("All four modules are complete. The practice test is next.", "success", 5200), 350);
      }
    });
  }

  function bindScrollButtons() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-scroll]");
      if (!button) return;
      const target = document.getElementById(button.dataset.scroll);
      if (!target) return;
      event.preventDefault();
      RS.closeMenu?.();
      document.querySelectorAll(".toc-link[data-scroll]").forEach((link) => link.classList.toggle("is-active", link === button));
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function focusRoute(route) {
    const sectionId = route.params?.section;
    if (sectionId) {
      const target = document.getElementById(sectionId);
      if (target) {
        targetTimer = window.setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          target.classList.add("is-target");
          targetTimer = window.setTimeout(() => target.classList.remove("is-target"), 2200);
        }, 120);
        return;
      }
    }
    if (window.scrollY > 4) jumpToTop();
  }

  function announce(route) {
    const announcer = document.getElementById("route-announcer");
    if (announcer) announcer.textContent = `${routeLabel(route)} loaded.`;
  }

  function bindLessonTools(route, view) {
    if (route.tab === "mind") {
      RS.bindMind?.(view);
    } else if (route.tab === "heart") {
      RS.bindHeart?.(view);
    } else if (route.tab === "grief") {
      RS.bindGrief?.(view);
    } else if (route.tab === "career") {
      RS.bindCareer?.(view);
    } else if (route.tab === "test") {
      RS.bindPractice?.(view);
    } else if (route.tab === "cheat") {
      bindPrint(view);
    }
    const lessonPage = view.querySelector("[data-lesson-page]");
    if (lessonPage) {
      bindLessonToggle(view);
      RS.bindToc?.();
    }
  }

  function renderContent(route) {
    if (route.page === "flashcards") return RS.renderFlashcards?.() || "";
    if (route.page === "games") return RS.renderGames?.(route) || "";
    return RS.renderReviewer?.(route) || "";
  }

  function syncReviewerBar(route) {
    if (route.page === "reviewer") RS.syncReviewerTabs?.(route.tab || "overview");
    else RS.hideReviewerTabs?.();
  }

  async function runRoute({ initial = false, announce: shouldAnnounce = false, transition = true } = {}) {
    const token = ++navToken;
    const fromBoot = !bootComplete;
    const route = RS.normalizeRoute();
    const label = routeLabel(route);
    const section = routeSection(route);
    const crossSection = !fromBoot && transition && lastRouteSection !== null && lastRouteSection !== section;
    const started = performance.now();

    if (fromBoot) {
      showLoader();
      setLoaderLabel(`Opening ${label}`);
    } else if (transition) {
      if (crossSection) {
        showLoader();
        setLoaderLabel(`Opening ${label}`);
      }
      if (!document.getElementById("reviewer-bar")?.hidden && route.page === "reviewer") {
        RS.syncReviewerTabs?.(route.tab || "overview");
      }
      if (!crossSection && !routeAssetsReady(route)) scheduleProgress();
    }

    document.body.setAttribute("aria-busy", "true");

    let assetError = null;
    try {
      await ensureRouteAssets(route);
    } catch (error) {
      assetError = error;
      console.error("Personal Development Reviewer asset loading failed:", error);
    }

    const minimum = fromBoot ? 280 : crossSection ? 440 : 0;
    const remaining = minimum - (performance.now() - started);
    if (remaining > 0) await wait(remaining);

    if (token !== navToken) return;

    const view = document.getElementById("view");
    if (!view) return;
    const direction = directionFor(route);

    let content = "";
    if (assetError) {
      content = `
        <div class="page-enter">
          <div class="callout callout--trap">
            <span class="callout-icon">${icon("alert")}</span>
            <div class="callout-copy">
              <span class="callout-label">This page could not finish loading</span>
              <p>${RS.esc(assetError.message)}</p>
              <p>Check the connection, then reload the page.</p>
            </div>
          </div>
        </div>`;
    } else {
      try {
        content = renderContent(route);
      } catch (error) {
        console.error("Personal Development Reviewer route render failed:", error);
        content = `
          <div class="page-enter">
            <div class="callout callout--trap">
              <span class="callout-icon">${icon("alert")}</span>
              <div class="callout-copy"><span class="callout-label">Something went wrong</span><p>This page could not be rendered. Reload the page, or use the sidebar to return to the reviewer.</p></div>
            </div>
          </div>`;
      }
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let applied = false;

    const applyRoute = () => {
      if (applied) return;
      applied = true;
      cleanupRoute();
      clearRouteSlide();
      RS.setRouteUI(route);
      syncReviewerBar(route);
      lastRouteKey = routeKey(route);
      lastRouteSection = section;
      jumpToTop();

      const template = document.createElement("template");
      template.innerHTML = content;
      template.content.querySelectorAll(".page-enter").forEach((node) => node.classList.remove("page-enter"));
      const newRoot = template.content.firstElementChild;
      const oldRoot = view.firstElementChild;
      const canSlide = !fromBoot && transition && !crossSection && !reduceMotion && Boolean(oldRoot && newRoot);

      if (newRoot && canSlide) {
        const oldRect = oldRoot.getBoundingClientRect();
        const viewRect = view.getBoundingClientRect();
        const oldLayer = document.createElement("div");
        oldLayer.className = "route-old";
        oldLayer.setAttribute("aria-hidden", "true");
        oldLayer.inert = true;
        oldLayer.style.top = `${Math.max(0, oldRect.top - viewRect.top)}px`;
        oldLayer.style.height = `${Math.max(0, Math.min(oldRect.height, window.innerHeight - oldRect.top))}px`;
        oldLayer.appendChild(oldRoot);

        view.replaceChildren(template.content);
        view.appendChild(oldLayer);
        newRoot.style.setProperty("--page-dir", String(direction));
        newRoot.classList.add("route-slide-in");

        const finishSlide = () => clearRouteSlide();
        newRoot.addEventListener("animationend", (event) => {
          if (event.target === newRoot && event.animationName === "routeSlideIn") finishSlide();
        }, { once: true });
        routeSlideTimer = window.setTimeout(finishSlide, 640);
      } else {
        view.replaceChildren(template.content);
      }

      if (!assetError && newRoot) {
        if (route.page === "flashcards") {
          RS.bindFlashcards?.(view);
        } else if (route.page === "games") {
          RS.bindGames?.(view, route);
        } else {
          bindLessonTools(route, view);
        }
      }

      bootComplete = true;
      const loader = loaderNode();
      if (fromBoot || (loader && !loader.classList.contains("is-hidden"))) hideLoader();
      if (!fromBoot) finishProgress();
    };

    applyRoute();
    if (token !== navToken) return;
    document.body.removeAttribute("aria-busy");
    focusRoute(route);
    if (shouldAnnounce) announce(route);
  }

  function boot() {
    bindScrollButtons();
    RS.initShell();
    RS.renderRoute = (options) => runRoute(options);
    if (!location.hash) {
      const page = document.body.dataset.page;
      history.replaceState(null, "", page && page !== "app" ? `#/${page}` : "#/overview");
    }
    runRoute({ initial: true, announce: false }).finally(() => {
      window.setTimeout(warmRouteAssets, 450);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
