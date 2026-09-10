// TechPrep Matrix - Interactive Engine
document.addEventListener("DOMContentLoaded", () => {
  const PAGE_SIZE = 25;

  // App State
  let state = {
    selectedCategory: "all",
    searchQuery: "",
    difficultyFilter: "all",
    statusFilter: "all",
    mode: "explore", // 'explore', 'flashcards', 'quiz'
    theme: localStorage.getItem("techprep_theme") || "dark",
    page: 1,

    // User progress stored in localStorage
    bookmarks: JSON.parse(localStorage.getItem("techprep_bookmarks")) || [],
    mastered: JSON.parse(localStorage.getItem("techprep_mastered")) || [],

    // Flashcard State
    flashcardIndex: 0,
    flashcardFlipped: false,

    // Quiz State
    quizQuestions: [],
    quizIndex: 0,
    quizResults: [],
    quizRevealed: false,
    quizTimer: null,
    quizSeconds: 0
  };

  // DOM Elements
  const categoryGrid = document.getElementById("category-grid");
  const questionFeed = document.getElementById("explore-view");
  const searchInput = document.getElementById("search-input");
  const searchInputHeader = document.getElementById("search-input-header");
  const navBtns = document.querySelectorAll(".mode-nav-btn");
  const themeBtn = document.getElementById("theme-toggle-btn");
  const themeToggleIcon = document.getElementById("theme-toggle-icon");
  const exportBtn = document.getElementById("export-btn");

  const exploreView = document.getElementById("explore-view");
  const flashcardView = document.getElementById("flashcard-view");
  const quizView = document.getElementById("quiz-view");

  const trackCountBadge = document.getElementById("track-count-badge");
  const telemetryActive = document.getElementById("telemetry-active");
  const telemetryMastery = document.getElementById("telemetry-mastery");
  const telemetryStreak = document.getElementById("telemetry-streak");
  const masteryDonutFill = document.getElementById("mastery-donut-fill");
  const masteryDonutPct = document.getElementById("mastery-donut-pct");
  const masteryStreakLabel = document.getElementById("mastery-streak-label");
  const feedEyebrow = document.getElementById("feed-eyebrow");
  const paginationBar = document.getElementById("pagination-bar");
  const paginationSummary = document.getElementById("pagination-summary");
  const paginationControls = document.getElementById("pagination-controls");
  const dailyDrillBtn = document.getElementById("daily-drill-btn");
  const dailyDrillBtnTop = document.getElementById("daily-drill-btn-top");
  const resumeBtn = document.getElementById("resume-btn");

  // Category Configuration - each domain carries its own Tailwind accent
  // tokens (icon background, left-border accent, progress-fill color).
  const CATEGORIES = [
    { id: "all", name: "All Domains", icon: "🚀", topics: "Cross-functional preparation", iconBg: "bg-primary-container/25", border: "", fill: "bg-primary" },
    { id: "android", name: "Android", icon: "🤖", topics: "Jetpack Compose, Coroutines, Memory, MVVM", iconBg: "bg-secondary/15", border: "border-secondary", fill: "bg-secondary" },
    { id: "kotlin", name: "Kotlin", icon: "🟣", topics: "Language, Generics, Coroutines, Flow", iconBg: "bg-primary/15", border: "border-primary-fixed", fill: "bg-primary-fixed" },
    { id: "oop", name: "OOP & Patterns", icon: "🧩", topics: "SOLID, Design Patterns, Architecture", iconBg: "bg-tertiary-container/25", border: "border-tertiary-container", fill: "bg-tertiary-container" },
    { id: "dsa", name: "DSA", icon: "🧮", topics: "Arrays, Strings, Linked Lists, Trees, DP", iconBg: "bg-secondary-fixed/20", border: "border-secondary-fixed", fill: "bg-secondary-fixed" },
    { id: "flutter", name: "Flutter", icon: "💙", topics: "Dart, Riverpod, BLoC, RenderObjects", iconBg: "bg-secondary-fixed/15", border: "border-secondary-fixed-dim", fill: "bg-secondary-fixed-dim" },
    { id: "swiftui", name: "SwiftUI", icon: "🍊", topics: "Swift, @StateObject, Actors, Combine", iconBg: "bg-tertiary/15", border: "border-tertiary", fill: "bg-tertiary" },
    { id: "react-native", name: "React Native", icon: "⚛️", topics: "JSI, Fabric, TurboModules, Hermes, Reanimated", iconBg: "bg-secondary-fixed/15", border: "border-secondary-fixed", fill: "bg-secondary-fixed" },
    { id: "ai-eng", name: "AI Engineering", icon: "🧠", topics: "LLMs, RAG, Embeddings, Agents, Evals", iconBg: "bg-tertiary-container/25", border: "border-tertiary-fixed-dim", fill: "bg-tertiary-fixed-dim" },
    { id: "project-management", name: "Project Mgmt", icon: "📊", topics: "Agile, Scrum, Scope Creep, Metrics", iconBg: "bg-primary-container/20", border: "border-primary-container", fill: "bg-primary-container" },
    { id: "product-management", name: "Product Mgmt", icon: "🎯", topics: "RICE, PRD, Retention, Strategy", iconBg: "bg-tertiary-container/30", border: "border-tertiary-fixed-dim", fill: "bg-tertiary-fixed-dim" },
    { id: "spring-boot", name: "Spring Boot", icon: "🍃", topics: "Java, IoC/DI, Security, JPA, Microservices", iconBg: "bg-secondary-container/20", border: "border-secondary-container", fill: "bg-secondary-container" },
    { id: "nodejs", name: "Node.js", icon: "🟢", topics: "Event Loop, libuv, Streams, Worker Threads", iconBg: "bg-primary/15", border: "border-primary", fill: "bg-primary" },
    { id: "full-stack", name: "Full Stack", icon: "⚡", topics: "System Design, OWASP, Scalability, JWT", iconBg: "bg-tertiary-fixed/20", border: "border-tertiary-fixed", fill: "bg-tertiary-fixed" }
  ];

  const DIFF_BADGE_CLASSES = {
    Junior: "bg-secondary/15 text-secondary",
    Mid: "bg-primary/15 text-primary",
    Senior: "bg-tertiary-container/30 text-tertiary",
    Lead: "bg-error-container/30 text-error"
  };

  // Initialize App
  init();

  function init() {
    applyTheme(state.theme);
    updateStreak();
    renderCategoryGrid();
    renderQuestions();
    updateTelemetry();
    setupEventListeners();
    setupGlossaryTooltips();
    showBuildInfo();
  }

  // "Last updated" date in the footer — build-info.json is regenerated
  // from the latest commit date by the GitHub Pages deploy workflow.
  function showBuildInfo() {
    const el = document.getElementById("last-updated");
    if (!el) return;
    fetch("build-info.json", { cache: "no-store" })
      .then(r => (r.ok ? r.json() : null))
      .then(info => {
        if (info && info.lastUpdated) {
          el.textContent = info.lastUpdated;
          if (info.commit && info.commit !== "local") {
            el.title = `commit ${info.commit} · ${QUESTION_DATA.length} questions`;
          }
        }
      })
      .catch(() => { /* offline / missing — leave the placeholder */ });
  }

  function applyTheme(theme) {
    state.theme = theme;
    localStorage.setItem("techprep_theme", theme);
    if (theme === "light") {
      document.body.classList.add("light-theme");
      if (themeToggleIcon) themeToggleIcon.textContent = "light_mode";
    } else {
      document.body.classList.remove("light-theme");
      if (themeToggleIcon) themeToggleIcon.textContent = "dark_mode";
    }
  }

  // ==========================================
  // Study Streak (real, computed from localStorage)
  // ==========================================
  function updateStreak() {
    const today = new Date().toISOString().slice(0, 10);
    const stored = JSON.parse(localStorage.getItem("techprep_streak")) || { count: 0, lastDate: null };
    if (stored.lastDate === today) {
      // already counted today
    } else {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      stored.count = stored.lastDate === yesterday ? stored.count + 1 : 1;
      stored.lastDate = today;
      localStorage.setItem("techprep_streak", JSON.stringify(stored));
    }
    state.streak = stored.count;
  }

  // Render Category Selection Cards
  function renderCategoryGrid() {
    categoryGrid.innerHTML = CATEGORIES.map(cat => {
      const count = cat.id === "all"
        ? QUESTION_DATA.length
        : QUESTION_DATA.filter(q => q.category === cat.id).length;

      const masteredCount = cat.id === "all"
        ? state.mastered.length
        : QUESTION_DATA.filter(q => q.category === cat.id && state.mastered.includes(q.id)).length;

      const progressPct = count > 0 ? Math.round((masteredCount / count) * 100) : 0;
      const isSelected = state.selectedCategory === cat.id;

      const cardClasses = isSelected
        ? "bg-surface-container/90 ring-1 ring-primary-container/70 shadow-md"
        : `bg-surface-container/70 shadow-sm ${cat.border ? "border-l-2 " + cat.border : ""} hover:bg-surface-container-high/90`;

      const iconClasses = isSelected ? "bg-primary-container/25 text-primary" : cat.iconBg;
      const countBadgeClasses = isSelected
        ? "bg-primary-container/20 text-primary font-semibold"
        : "bg-surface-container-highest text-on-surface-variant";

      return `
        <div class="group relative flex items-center justify-between p-3 rounded-xl backdrop-blur-md transition-all duration-200 cursor-pointer ${cardClasses}" data-cat-id="${cat.id}">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 rounded-lg ${iconClasses} flex items-center justify-center text-lg flex-shrink-0">${cat.icon}</div>
            <div class="min-w-0">
              <h3 class="font-headline-sm text-[15px] font-semibold text-on-surface truncate">${cat.name}</h3>
              <p class="font-body-sm text-[11px] text-on-surface-variant truncate">${cat.topics}</p>
            </div>
          </div>
          <div class="flex flex-col items-end gap-1 flex-shrink-0 pl-2">
            <span class="font-label-sm text-[10px] px-2 py-0.5 rounded-full ${countBadgeClasses}">${masteredCount}/${count}</span>
            <div class="w-12 bg-surface-container-highest h-1 rounded-full overflow-hidden">
              <div class="${cat.fill} h-full" style="width: ${progressPct}%"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (trackCountBadge) trackCountBadge.textContent = `${CATEGORIES.length} Tracks`;

    document.querySelectorAll("[data-cat-id]").forEach(card => {
      card.addEventListener("click", () => {
        state.selectedCategory = card.dataset.catId;
        state.page = 1;
        renderCategoryGrid();
        renderQuestions();
        updateTelemetry();
        if (state.mode === 'flashcards') setupFlashcards();
      });
    });
  }

  // Filter Questions based on State
  function getFilteredQuestions() {
    return QUESTION_DATA.filter(q => {
      if (state.selectedCategory !== "all" && q.category !== state.selectedCategory) return false;
      if (state.difficultyFilter !== "all" && q.difficulty !== state.difficultyFilter) return false;
      if (state.statusFilter === "bookmarked" && !state.bookmarks.includes(q.id)) return false;
      if (state.statusFilter === "mastered" && !state.mastered.includes(q.id)) return false;
      if (state.searchQuery.trim() !== "") {
        const query = state.searchQuery.toLowerCase();
        const inTitle = q.title.toLowerCase().includes(query);
        const inQuestion = q.question.toLowerCase().includes(query);
        const inAnswer = q.answer.toLowerCase().includes(query);
        const inTags = q.tags.some(t => t.toLowerCase().includes(query));
        if (!inTitle && !inQuestion && !inAnswer && !inTags) return false;
      }
      return true;
    });
  }

  function updateTelemetry() {
    const domainCount = CATEGORIES.length - 1;
    if (telemetryActive) telemetryActive.textContent = `${domainCount} Tracks`;
    if (telemetryMastery) telemetryMastery.textContent = `${state.mastered.length}/${QUESTION_DATA.length}`;
    if (telemetryStreak) telemetryStreak.textContent = `${state.streak || 0} Days`;
    if (masteryStreakLabel) masteryStreakLabel.textContent = `${state.streak || 0} Day Streak`;

    const pct = QUESTION_DATA.length > 0 ? Math.round((state.mastered.length / QUESTION_DATA.length) * 100) : 0;
    if (masteryDonutFill) masteryDonutFill.setAttribute("stroke-dasharray", `${pct}, 100`);
    if (masteryDonutPct) masteryDonutPct.textContent = `${pct}%`;

    if (feedEyebrow) {
      const cat = CATEGORIES.find(c => c.id === state.selectedCategory);
      feedEyebrow.textContent = cat && cat.id !== "all" ? `${cat.name} Track` : "Cross-Domain Nexus";
    }
  }

  // Render Main Question Feed (paginated)
  function renderQuestions() {
    const filtered = getFilteredQuestions();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (state.page > totalPages) state.page = totalPages;
    if (state.page < 1) state.page = 1;

    const startIdx = (state.page - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(startIdx, startIdx + PAGE_SIZE);

    if (filtered.length === 0) {
      questionFeed.innerHTML = `
        <div class="text-center py-12 text-on-surface-variant">
          <div class="text-5xl mb-3">🔍</div>
          <h3 class="font-headline-sm text-headline-sm text-on-surface">No Questions Found</h3>
          <p class="font-body-sm text-body-sm mt-1">Try adjusting your search criteria or category filters.</p>
        </div>
      `;
      renderPagination(0, 0, 1);
      return;
    }

    questionFeed.innerHTML = pageItems.map(q => {
      const isBookmarked = state.bookmarks.includes(q.id);
      const isMastered = state.mastered.includes(q.id);
      const diffClasses = DIFF_BADGE_CLASSES[q.difficulty] || "bg-surface-container-highest text-on-surface-variant";

      const bookmarkClasses = isBookmarked
        ? "bg-tertiary-container/20 text-tertiary"
        : "bg-surface-container-low text-on-surface-variant hover:text-tertiary hover:bg-surface-container-highest";
      const masterClasses = isMastered
        ? "bg-secondary-container/20 text-secondary"
        : "bg-surface-container-low text-on-surface-variant hover:text-secondary hover:bg-surface-container-highest";

      return `
        <article class="p-space-lg rounded-xl bg-surface-container/75 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-300 border border-surface-container-high/30" id="card-${q.id}">
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-space-sm">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2.5 py-1 rounded-md bg-primary-container/20 text-primary font-label-sm text-label-sm font-semibold uppercase">${q.categoryName}</span>
              <span class="px-2.5 py-1 rounded-md ${diffClasses} font-label-sm text-label-sm font-semibold uppercase">${q.difficulty}</span>
              <span class="px-2.5 py-1 rounded-md bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm uppercase">${q.topic}</span>
            </div>
            <div class="flex items-center gap-2 self-end sm:self-auto">
              <button aria-label="Bookmark this inquiry" class="w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${bookmarkClasses}" data-action="bookmark" data-id="${q.id}" type="button">
                <span class="material-symbols-outlined text-lg">star</span>
              </button>
              <button aria-label="Mark as mastered" class="w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${masterClasses}" data-action="master" data-id="${q.id}" type="button">
                <span class="material-symbols-outlined text-lg">check</span>
              </button>
            </div>
          </div>

          <div class="mt-3">
            <h3 class="font-headline-sm text-headline-sm text-on-surface leading-snug">${q.title}</h3>
            <p class="font-body-md text-body-md text-on-surface-variant mt-2 max-w-5xl leading-relaxed">${q.question}</p>
            ${(q.tags && q.tags.length) ? `
              <div class="flex flex-wrap items-center gap-1.5 mt-3">
                ${[...new Set(q.tags)].filter(t => t && t !== q.topic).map(t => `
                  <button class="px-2 py-0.5 rounded-full bg-surface-container-high/60 hover:bg-primary-container/30 text-on-surface-variant hover:text-primary font-label-sm text-label-sm transition-colors" data-action="search-tag" data-tag="${escapeHtml(t)}" type="button">#${escapeHtml(t)}</button>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <div class="mt-4">
            <button class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container/20 hover:bg-primary-container/30 text-primary font-label-md text-label-md font-semibold transition-colors" data-action="toggle-answer" data-id="${q.id}" type="button">
              <span class="material-symbols-outlined text-base">lightbulb</span>
              <span data-role="toggle-label">Hide Answer</span>
            </button>

            <div class="mt-space-md p-space-md rounded-lg bg-surface-container-lowest/90 answer-content" id="answer-${q.id}">
              ${linkifyGlossary(q.answer, q.glossary)}

              ${q.code ? `
                <div class="code-block">
                  <div class="code-header">
                    <span>${q.codeLanguage.toUpperCase()}</span>
                    <button class="copy-code-btn" data-action="copy-code" data-code="${encodeURIComponent(q.code)}" type="button">📋 Copy Code</button>
                  </div>
                  <pre><code>${escapeHtml(q.code)}</code></pre>
                </div>
              ` : ''}

              ${q.keyTakeaways ? `
                <div class="takeaways-box">
                  <div class="takeaways-title">Key Interview Takeaways</div>
                  <ul>${q.keyTakeaways.map(kt => `<li>${kt}</li>`).join('')}</ul>
                </div>
              ` : ''}

              ${q.followUp ? `
                <div class="answer-followup">💬 <strong>Interviewer Follow-up:</strong> "${q.followUp}"</div>
              ` : ''}
            </div>
          </div>
        </article>
      `;
    }).join('');

    attachQuestionActionListeners();
    renderPagination(startIdx + 1, Math.min(startIdx + PAGE_SIZE, filtered.length), filtered.length, totalPages);
  }

  function renderPagination(shownFrom, shownTo, total, totalPages) {
    if (!paginationSummary || !paginationControls) return;

    if (total === 0) {
      paginationSummary.innerHTML = `Showing <strong class="text-on-surface">0</strong> of ${QUESTION_DATA.length} questions`;
      paginationControls.innerHTML = '';
      return;
    }

    paginationSummary.innerHTML = `Showing <strong class="text-on-surface">${shownFrom}-${shownTo}</strong> of ${total} questions`;

    const pages = totalPages || 1;
    const current = state.page;
    const pageNumbers = [];
    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1, 2, 3);
      if (current > 4 && current < pages - 2) pageNumbers.push("...", current, "...");
      else pageNumbers.push("...");
      pageNumbers.push(pages);
    }

    const prevDisabled = current <= 1;
    const nextDisabled = current >= pages;

    paginationControls.innerHTML = `
      <button class="px-3 py-1.5 rounded-lg font-label-md text-label-md transition-colors ${prevDisabled ? 'bg-surface-container text-outline cursor-not-allowed' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'}" id="page-prev" ${prevDisabled ? 'disabled' : ''} type="button">Previous</button>
      <div class="flex items-center gap-1">
        ${[...new Set(pageNumbers)].map(p => p === "..."
          ? `<span class="text-outline px-1">...</span>`
          : `<button class="w-8 h-8 rounded-lg font-label-sm text-label-sm transition-colors ${p === current ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:bg-surface-container'}" data-page="${p}" type="button">${p}</button>`
        ).join('')}
      </div>
      <button class="px-3 py-1.5 rounded-lg font-label-md text-label-md transition-colors ${nextDisabled ? 'bg-surface-container text-outline cursor-not-allowed' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'}" id="page-next" ${nextDisabled ? 'disabled' : ''} type="button">Next</button>
    `;

    document.getElementById("page-prev")?.addEventListener("click", () => {
      if (state.page > 1) { state.page--; renderQuestions(); window.scrollTo({ top: 0, behavior: "smooth" }); }
    });
    document.getElementById("page-next")?.addEventListener("click", () => {
      if (state.page < pages) { state.page++; renderQuestions(); window.scrollTo({ top: 0, behavior: "smooth" }); }
    });
    paginationControls.querySelectorAll("[data-page]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.page = parseInt(btn.dataset.page, 10);
        renderQuestions();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  function attachQuestionActionListeners() {
    questionFeed.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        if (!action) return;

        if (action === "toggle-answer") {
          const answerDiv = document.getElementById(`answer-${id}`);
          const label = btn.querySelector('[data-role="toggle-label"]');
          const isHidden = answerDiv.classList.contains("hidden");
          if (isHidden) {
            answerDiv.classList.remove("hidden");
            if (label) label.textContent = "Hide Answer";
          } else {
            answerDiv.classList.add("hidden");
            if (label) label.textContent = "Reveal Answer & Concepts";
          }
        } else if (action === "bookmark") {
          if (state.bookmarks.includes(id)) {
            state.bookmarks = state.bookmarks.filter(b => b !== id);
          } else {
            state.bookmarks.push(id);
          }
          localStorage.setItem("techprep_bookmarks", JSON.stringify(state.bookmarks));
          renderQuestions();
        } else if (action === "master") {
          if (state.mastered.includes(id)) {
            state.mastered = state.mastered.filter(m => m !== id);
          } else {
            state.mastered.push(id);
          }
          localStorage.setItem("techprep_mastered", JSON.stringify(state.mastered));
          renderCategoryGrid();
          renderQuestions();
          updateTelemetry();
        } else if (action === "copy-code") {
          const codeText = decodeURIComponent(btn.dataset.code);
          navigator.clipboard.writeText(codeText).then(() => {
            const original = btn.innerHTML;
            btn.innerHTML = `✅ Copied!`;
            setTimeout(() => { btn.innerHTML = original; }, 2000);
          });
        } else if (action === "search-tag") {
          const tag = btn.dataset.tag;
          state.searchQuery = tag;
          state.page = 1;
          if (searchInput) searchInput.value = tag;
          if (searchInputHeader) searchInputHeader.value = tag;
          renderQuestions();
          if (state.mode === 'flashcards') setupFlashcards();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    });
  }

  // ==========================================
  // Jump-to-question helper (used by Daily Drill & Resume)
  // ==========================================
  function jumpToQuestion(q) {
    if (!q) return;
    state.mode = "explore";
    navBtns.forEach(b => setNavActive(b, b.dataset.mode === "explore"));
    exploreView.style.display = "flex";
    flashcardView.classList.remove("active");
    quizView.classList.remove("active");
    if (paginationBar) paginationBar.style.display = "flex";

    state.selectedCategory = "all";
    state.searchQuery = "";
    state.difficultyFilter = "all";
    state.statusFilter = "all";
    if (searchInput) searchInput.value = "";
    if (searchInputHeader) searchInputHeader.value = "";
    resetPillActive(".diff-filter", "all");
    resetPillActive(".status-filter", "all");
    renderCategoryGrid();

    const filtered = getFilteredQuestions();
    const idx = filtered.findIndex(item => item.id === q.id);
    state.page = idx >= 0 ? Math.floor(idx / PAGE_SIZE) + 1 : 1;
    renderQuestions();
    updateTelemetry();

    requestAnimationFrame(() => {
      const card = document.getElementById(`card-${q.id}`);
      if (!card) return;
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      const revealBtn = card.querySelector('[data-action="toggle-answer"]');
      const answerDiv = document.getElementById(`answer-${q.id}`);
      if (revealBtn && answerDiv && answerDiv.classList.contains("hidden")) {
        revealBtn.click();
      }
      card.classList.add("ring-2", "ring-primary");
      setTimeout(() => card.classList.remove("ring-2", "ring-primary"), 2000);
    });
  }

  function pickDailyDrill() {
    const pool = QUESTION_DATA;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    jumpToQuestion(pick);
  }

  function pickResumeQuestion() {
    const unmastered = QUESTION_DATA.find(q => !state.mastered.includes(q.id));
    jumpToQuestion(unmastered || QUESTION_DATA[0]);
  }

  function resetPillActive(selector, targetValue) {
    document.querySelectorAll(selector).forEach(btn => {
      const isActive = (btn.dataset.diff || btn.dataset.status) === targetValue;
      setPillActive(btn, isActive);
    });
  }

  function setPillActive(btn, isActive) {
    const activeClasses = ["bg-gradient-to-r", "from-primary", "to-inverse-primary", "text-on-primary", "font-semibold", "shadow-sm"];
    const inactiveClasses = ["text-on-surface-variant"];
    if (isActive) {
      btn.classList.add(...activeClasses);
      btn.classList.remove(...inactiveClasses);
      btn.classList.add("active");
    } else {
      btn.classList.remove(...activeClasses);
      btn.classList.add(...inactiveClasses);
      btn.classList.remove("active");
    }
  }

  function setNavActive(btn, isActive) {
    if (isActive) {
      btn.classList.add("bg-surface-container-high", "text-primary", "font-semibold");
      btn.classList.remove("text-on-surface-variant");
    } else {
      btn.classList.remove("bg-surface-container-high", "text-primary", "font-semibold");
      btn.classList.add("text-on-surface-variant");
    }
  }

  // ==========================================
  // Flashcard Mode Logic
  // ==========================================
  function setupFlashcards() {
    const questions = getFilteredQuestions();
    state.flashcardIndex = 0;
    state.flashcardFlipped = false;
    renderFlashcard(questions);
  }

  function renderFlashcard(questions) {
    if (!questions || questions.length === 0) {
      flashcardView.innerHTML = `
        <div class="text-center py-12 text-on-surface-variant">
          <h3 class="font-headline-sm text-headline-sm text-on-surface">No questions available for current filter</h3>
          <p class="font-body-sm text-body-sm mt-1">Please select a different category or search parameter.</p>
        </div>
      `;
      return;
    }

    const q = questions[state.flashcardIndex];
    flashcardView.innerHTML = `
      <div class="flashcard-wrapper ${state.flashcardFlipped ? 'flipped' : ''}" id="flashcard">
        <div class="flashcard-inner">
          <div class="flashcard-front">
            <div class="flex gap-2">
              <span class="px-2.5 py-1 rounded-md bg-primary-container/20 text-primary font-label-sm text-label-sm font-semibold uppercase">${q.categoryName}</span>
              <span class="px-2.5 py-1 rounded-md ${DIFF_BADGE_CLASSES[q.difficulty] || ''} font-label-sm text-label-sm font-semibold uppercase">${q.difficulty}</span>
            </div>
            <div class="font-headline-sm text-headline-sm text-on-surface">${q.title}</div>
            <div class="card-hint">Click or press Space to flip card 🔄</div>
          </div>

          <div class="flashcard-back">
            <div class="font-label-md text-label-md text-secondary font-semibold uppercase tracking-wider mb-2">Model Answer:</div>
            <div class="answer-content">${linkifyGlossary(q.answer, q.glossary)}</div>
            ${q.code ? `<div class="code-block mt-3"><pre><code>${escapeHtml(q.code)}</code></pre></div>` : ''}
          </div>
        </div>
      </div>

      <div class="flashcard-controls">
        <button class="px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high font-label-md text-label-md transition-colors" id="fc-prev" type="button">← Previous</button>
        <span class="font-label-md text-label-md text-on-surface-variant">${state.flashcardIndex + 1} / ${questions.length}</span>
        <button class="px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high font-label-md text-label-md transition-colors" id="fc-next" type="button">Next →</button>
      </div>
    `;

    const cardEl = document.getElementById("flashcard");
    if (cardEl) {
      cardEl.addEventListener("click", () => {
        state.flashcardFlipped = !state.flashcardFlipped;
        cardEl.classList.toggle("flipped", state.flashcardFlipped);
      });
    }

    document.getElementById("fc-prev")?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (state.flashcardIndex > 0) {
        state.flashcardIndex--;
        state.flashcardFlipped = false;
        renderFlashcard(questions);
      }
    });

    document.getElementById("fc-next")?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (state.flashcardIndex < questions.length - 1) {
        state.flashcardIndex++;
        state.flashcardFlipped = false;
        renderFlashcard(questions);
      }
    });
  }

  // ==========================================
  // Quiz Mode — timed self-assessment over the currently-filtered content
  // ==========================================
  function stopQuizTimer() {
    if (state.quizTimer) {
      clearInterval(state.quizTimer);
      state.quizTimer = null;
    }
  }

  function formatDuration(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  // Config screen: pick how many questions; the pool is whatever the
  // current category / difficulty / status / search filters select.
  function setupQuiz() {
    stopQuizTimer();
    const pool = getFilteredQuestions();
    state.quizPoolSize = pool.length;

    if (pool.length === 0) {
      quizView.innerHTML = `
        <div class="text-center py-12 text-on-surface-variant">
          <h3 class="font-headline-sm text-headline-sm text-on-surface">No questions match the current filters</h3>
          <p class="font-body-sm text-body-sm mt-1">Adjust the category, difficulty or search to build a quiz.</p>
        </div>`;
      return;
    }

    const cat = CATEGORIES.find(c => c.id === state.selectedCategory);
    const scopeLabel = cat && cat.id !== "all" ? cat.name : "All domains";
    const diffLabel = state.difficultyFilter === "all" ? "" : ` · ${state.difficultyFilter}`;
    const options = [5, 10, 20, 30].filter(n => n <= pool.length);
    if (!options.includes(pool.length) && pool.length < 30) options.push(pool.length);

    quizView.innerHTML = `
      <div class="w-full max-w-xl mx-auto text-center flex flex-col gap-space-md">
        <span class="material-symbols-outlined text-5xl text-primary mx-auto">quiz</span>
        <h2 class="font-headline-lg text-headline-lg text-on-surface">Self-Test Quiz</h2>
        <p class="font-body-md text-body-md text-on-surface-variant">
          Answer from memory, reveal the model answer, and grade yourself.
          Pool: <strong class="text-on-surface">${pool.length}</strong> questions from
          <strong class="text-on-surface">${escapeHtml(scopeLabel)}${escapeHtml(diffLabel)}</strong>
          ${state.statusFilter !== "all" ? ` · ${state.statusFilter}` : ""}
          ${state.searchQuery.trim() ? ` · matching "${escapeHtml(state.searchQuery.trim())}"` : ""}.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-2 mt-2">
          ${options.map(n => `
            <button class="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-primary-container/30 hover:text-primary font-label-md text-label-md transition-colors" data-quiz-count="${n}" type="button">${n} questions</button>
          `).join("")}
        </div>
        <p class="font-label-sm text-label-sm text-outline mt-1">Questions are drawn at random and shuffled each time.</p>
      </div>`;

    quizView.querySelectorAll("[data-quiz-count]").forEach(btn => {
      btn.addEventListener("click", () => startQuiz(parseInt(btn.dataset.quizCount, 10)));
    });
  }

  function startQuiz(count) {
    const pool = getFilteredQuestions().slice();
    // Fisher–Yates shuffle, then take the first `count`
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    state.quizQuestions = pool.slice(0, count);
    state.quizIndex = 0;
    state.quizResults = [];   // { id, correct }
    state.quizRevealed = false;
    state.quizSeconds = 0;

    stopQuizTimer();
    state.quizTimer = setInterval(() => {
      state.quizSeconds++;
      const t = document.getElementById("quiz-timer");
      if (t) t.textContent = formatDuration(state.quizSeconds);
    }, 1000);

    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    const q = state.quizQuestions[state.quizIndex];
    const n = state.quizQuestions.length;
    const diffClasses = DIFF_BADGE_CLASSES[q.difficulty] || "bg-surface-container-highest text-on-surface-variant";

    quizView.innerHTML = `
      <div class="w-full flex flex-col gap-space-md">
        <div class="flex items-center justify-between gap-space-sm">
          <div class="flex items-center gap-2">
            <span class="font-label-md text-label-md text-on-surface-variant">Question ${state.quizIndex + 1} / ${n}</span>
            <span class="font-label-md text-label-md text-secondary">Score ${state.quizResults.filter(r => r.correct).length}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-base text-tertiary">timer</span>
            <span class="font-label-md text-label-md text-tertiary font-semibold" id="quiz-timer">${formatDuration(state.quizSeconds)}</span>
          </div>
        </div>

        <div class="h-1.5 w-full rounded-full bg-surface-container-high overflow-hidden">
          <div class="h-full bg-primary transition-all duration-300" style="width: ${Math.round((state.quizIndex / n) * 100)}%"></div>
        </div>

        <div class="p-space-lg rounded-xl bg-surface-container/75 border border-surface-container-high/30">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-2.5 py-1 rounded-md bg-primary-container/20 text-primary font-label-sm text-label-sm font-semibold uppercase">${q.categoryName}</span>
            <span class="px-2.5 py-1 rounded-md ${diffClasses} font-label-sm text-label-sm font-semibold uppercase">${q.difficulty}</span>
            <span class="px-2.5 py-1 rounded-md bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm uppercase">${q.topic}</span>
          </div>
          <h3 class="font-headline-sm text-headline-sm text-on-surface leading-snug mt-3">${q.title}</h3>
          <p class="font-body-md text-body-md text-on-surface-variant mt-2 leading-relaxed">${q.question}</p>

          <div class="${state.quizRevealed ? "" : "hidden"} mt-space-md p-space-md rounded-lg bg-surface-container-lowest/90 answer-content" id="quiz-answer">
            ${state.quizRevealed ? linkifyGlossary(q.answer, q.glossary) : ""}
            ${state.quizRevealed && q.code ? `
              <div class="code-block">
                <div class="code-header"><span>${(q.codeLanguage || "code").toUpperCase()}</span></div>
                <pre><code>${escapeHtml(q.code)}</code></pre>
              </div>` : ""}
          </div>

          <div class="mt-4">
            ${state.quizRevealed ? `
              <p class="font-label-md text-label-md text-on-surface-variant mb-2">How did you do?</p>
              <div class="flex flex-wrap gap-2">
                <button class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary-container/20 text-secondary hover:bg-secondary-container/30 font-label-md text-label-md font-semibold transition-colors" data-quiz-grade="1" type="button">
                  <span class="material-symbols-outlined text-base">check_circle</span> Got it
                </button>
                <button class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-error-container/20 text-error hover:bg-error-container/30 font-label-md text-label-md font-semibold transition-colors" data-quiz-grade="0" type="button">
                  <span class="material-symbols-outlined text-base">cancel</span> Missed it
                </button>
              </div>
            ` : `
              <button class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container/20 hover:bg-primary-container/30 text-primary font-label-md text-label-md font-semibold transition-colors" id="quiz-reveal" type="button">
                <span class="material-symbols-outlined text-base">lightbulb</span> Reveal answer
              </button>
            `}
          </div>
        </div>

        <div class="flex items-center justify-between">
          <button class="px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high font-label-sm text-label-sm transition-colors" id="quiz-quit" type="button">End quiz</button>
        </div>
      </div>`;

    document.getElementById("quiz-reveal")?.addEventListener("click", () => {
      state.quizRevealed = true;
      renderQuizQuestion();
    });
    quizView.querySelectorAll("[data-quiz-grade]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.quizResults.push({ id: q.id, correct: btn.dataset.quizGrade === "1" });
        state.quizRevealed = false;
        if (state.quizIndex < state.quizQuestions.length - 1) {
          state.quizIndex++;
          renderQuizQuestion();
        } else {
          renderQuizResults();
        }
      });
    });
    document.getElementById("quiz-quit")?.addEventListener("click", () => {
      if (state.quizResults.length > 0) renderQuizResults();
      else setupQuiz();
    });
  }

  function renderQuizResults() {
    stopQuizTimer();
    const results = state.quizResults;
    const correct = results.filter(r => r.correct).length;
    const total = results.length;
    const pct = total ? Math.round((correct / total) * 100) : 0;
    const missed = results.filter(r => !r.correct)
      .map(r => QUESTION_DATA.find(q => q.id === r.id))
      .filter(Boolean);
    const gotIds = results.filter(r => r.correct).map(r => r.id);

    quizView.innerHTML = `
      <div class="w-full max-w-2xl mx-auto flex flex-col gap-space-md">
        <div class="text-center flex flex-col gap-2">
          <span class="material-symbols-outlined text-5xl ${pct >= 70 ? "text-secondary" : pct >= 40 ? "text-tertiary" : "text-error"} mx-auto">
            ${pct >= 70 ? "military_tech" : "insights"}
          </span>
          <h2 class="font-headline-lg text-headline-lg text-on-surface">${correct} / ${total} &nbsp;·&nbsp; ${pct}%</h2>
          <p class="font-body-md text-body-md text-on-surface-variant">Completed in ${formatDuration(state.quizSeconds)}${total ? ` &nbsp;·&nbsp; ~${formatDuration(Math.round(state.quizSeconds / total))} per question` : ""}.</p>
        </div>

        ${gotIds.length ? `
          <button class="mx-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary-container/20 text-secondary hover:bg-secondary-container/30 font-label-md text-label-md font-semibold transition-colors" id="quiz-mark-mastered" type="button">
            <span class="material-symbols-outlined text-base">check</span> Mark my ${gotIds.length} correct as mastered
          </button>
        ` : ""}

        ${missed.length ? `
          <div class="mt-2">
            <h3 class="font-label-md text-label-md text-error font-semibold uppercase tracking-wider mb-2">Review these (${missed.length})</h3>
            <div class="flex flex-col gap-2">
              ${missed.map(q => `
                <button class="text-left p-3 rounded-lg bg-surface-container/75 border border-surface-container-high/30 hover:border-primary-container/50 transition-colors" data-quiz-review="${q.id}" type="button">
                  <span class="font-label-sm text-label-sm text-on-surface-variant">${q.categoryName} · ${q.topic}</span>
                  <p class="font-body-md text-body-md text-on-surface mt-0.5">${q.title}</p>
                </button>
              `).join("")}
            </div>
          </div>
        ` : `<p class="text-center font-body-md text-body-md text-secondary">Clean sweep — nothing to review.</p>`}

        <div class="flex flex-wrap items-center justify-center gap-2 mt-2">
          <button class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary hover:opacity-90 font-label-md text-label-md font-semibold transition-opacity" id="quiz-again" type="button">
            <span class="material-symbols-outlined text-base">refresh</span> New quiz
          </button>
          <button class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright font-label-md text-label-md transition-colors" id="quiz-to-explore" type="button">
            Back to Explore
          </button>
        </div>
      </div>`;

    document.getElementById("quiz-again")?.addEventListener("click", setupQuiz);
    document.getElementById("quiz-to-explore")?.addEventListener("click", () => {
      const exploreBtn = [...navBtns].find(b => b.dataset.mode === "explore");
      if (exploreBtn) exploreBtn.click();
    });
    document.getElementById("quiz-mark-mastered")?.addEventListener("click", (e) => {
      gotIds.forEach(id => { if (!state.mastered.includes(id)) state.mastered.push(id); });
      localStorage.setItem("techprep_mastered", JSON.stringify(state.mastered));
      renderCategoryGrid();
      updateTelemetry();
      e.currentTarget.disabled = true;
      e.currentTarget.innerHTML = `<span class="material-symbols-outlined text-base">done_all</span> Marked ${gotIds.length} as mastered`;
    });
    quizView.querySelectorAll("[data-quiz-review]").forEach(btn => {
      btn.addEventListener("click", () => {
        const q = QUESTION_DATA.find(x => x.id === btn.dataset.quizReview);
        if (q) jumpToQuestion(q);
      });
    });
  }

  // ==========================================
  // Event Listeners Setup
  // ==========================================
  function setupEventListeners() {
    // Search Bar Input (main + header copy, kept in sync)
    const onSearchInput = (value) => {
      state.searchQuery = value;
      state.page = 1;
      if (searchInput) searchInput.value = value;
      if (searchInputHeader) searchInputHeader.value = value;
      renderQuestions();
      if (state.mode === 'flashcards') setupFlashcards();
    };
    searchInput?.addEventListener("input", (e) => onSearchInput(e.target.value));
    searchInputHeader?.addEventListener("input", (e) => onSearchInput(e.target.value));

    // Difficulty Filter Pills
    document.querySelectorAll(".diff-filter").forEach(chip => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".diff-filter").forEach(c => setPillActive(c, false));
        setPillActive(chip, true);
        state.difficultyFilter = chip.dataset.diff;
        state.page = 1;
        renderQuestions();
        if (state.mode === 'flashcards') setupFlashcards();
      });
    });

    // Status Filter Pills
    document.querySelectorAll(".status-filter").forEach(chip => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".status-filter").forEach(c => setPillActive(c, false));
        setPillActive(chip, true);
        state.statusFilter = chip.dataset.status;
        state.page = 1;
        renderQuestions();
        if (state.mode === 'flashcards') setupFlashcards();
      });
    });

    // Mode Switcher (nav)
    navBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        navBtns.forEach(b => setNavActive(b, false));
        setNavActive(btn, true);
        state.mode = btn.dataset.mode;

        exploreView.style.display = state.mode === "explore" ? "flex" : "none";
        if (paginationBar) paginationBar.style.display = state.mode === "explore" ? "flex" : "none";
        flashcardView.classList.toggle("active", state.mode === "flashcards");
        quizView.classList.toggle("active", state.mode === "quiz");

        if (state.mode !== "quiz") stopQuizTimer();
        if (state.mode === "flashcards") setupFlashcards();
        if (state.mode === "quiz") setupQuiz();
      });
    });

    // Theme Toggle
    themeBtn?.addEventListener("click", () => {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      applyTheme(newTheme);
    });

    // Export Study Plan (Markdown Download)
    exportBtn?.addEventListener("click", exportQuestionsToMarkdown);

    // Daily Drill / Resume
    dailyDrillBtn?.addEventListener("click", pickDailyDrill);
    dailyDrillBtnTop?.addEventListener("click", pickDailyDrill);
    resumeBtn?.addEventListener("click", pickResumeQuestion);

    // Keyboard Shortcuts for Flashcards
    document.addEventListener("keydown", (e) => {
      if (state.mode === "flashcards") {
        if (e.code === "Space") {
          e.preventDefault();
          const cardEl = document.getElementById("flashcard");
          if (cardEl) {
            state.flashcardFlipped = !state.flashcardFlipped;
            cardEl.classList.toggle("flipped", state.flashcardFlipped);
          }
        } else if (e.code === "ArrowRight") {
          document.getElementById("fc-next")?.click();
        } else if (e.code === "ArrowLeft") {
          document.getElementById("fc-prev")?.click();
        }
      } else if (state.mode === "quiz") {
        if (e.code === "Space") {
          e.preventDefault();
          document.getElementById("quiz-reveal")?.click();
        } else if (e.key === "1") {
          quizView.querySelector('[data-quiz-grade="1"]')?.click();
        } else if (e.key === "2") {
          quizView.querySelector('[data-quiz-grade="0"]')?.click();
        }
      }
    });
  }

  // Export Q&As to Markdown File
  function exportQuestionsToMarkdown() {
    const filtered = getFilteredQuestions();
    let mdContent = `# TechPrep Matrix - Study Guide Export\n\n`;
    mdContent += `Generated on: ${new Date().toLocaleDateString()}\n`;
    mdContent += `Total Questions: ${filtered.length}\n\n---\n\n`;

    filtered.forEach((q, idx) => {
      mdContent += `### ${idx + 1}. ${q.title}\n`;
      mdContent += `**Category:** ${q.categoryName} | **Difficulty:** ${q.difficulty} | **Topic:** ${q.topic}\n\n`;
      mdContent += `**Question:**\n${q.question}\n\n`;
      mdContent += `**Model Answer:**\n${q.answer.replace(/<[^>]*>?/gm, '')}\n\n`;
      if (q.code) {
        mdContent += `\`\`\`${q.codeLanguage}\n${q.code}\n\`\`\`\n\n`;
      }
      mdContent += `---\n\n`;
    });

    const blob = new Blob([mdContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TechPrep_Interview_Questions.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ==========================================
  // Glossary Tooltip System
  // Wraps the first mention of each jargon term in a question's `glossary`
  // map with a clickable/tappable span, so beginners can tap a term (RICE,
  // Reach, MoSCoW, ...) and see a plain-English explanation on the spot.
  // ==========================================
  function linkifyGlossary(html, glossary) {
    if (!glossary) return html;

    const container = document.createElement("div");
    container.innerHTML = html;

    const terms = Object.keys(glossary).sort((a, b) => b.length - a.length);
    const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const pattern = new RegExp(`\\b(${escaped.join("|")})\\b`, "g");
    const seen = new Set();
    const skipTags = new Set(["SCRIPT", "STYLE", "CODE", "PRE", "A"]);

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      const parentTag = node.parentElement ? node.parentElement.tagName : null;
      if (parentTag && skipTags.has(parentTag)) continue;
      if (node.parentElement && node.parentElement.closest(".glossary-term")) continue;
      textNodes.push(node);
    }

    textNodes.forEach(textNode => {
      const text = textNode.nodeValue;
      pattern.lastIndex = 0;
      let match;
      let lastIndex = 0;
      let hadMatch = false;
      const frag = document.createDocumentFragment();

      while ((match = pattern.exec(text))) {
        hadMatch = true;
        frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));

        const term = match[1];
        if (!seen.has(term.toLowerCase())) {
          seen.add(term.toLowerCase());
          const span = document.createElement("span");
          span.className = "glossary-term";
          span.tabIndex = 0;
          span.setAttribute("role", "button");
          span.setAttribute("data-def", glossary[term]);
          span.textContent = match[0];
          frag.appendChild(span);
        } else {
          frag.appendChild(document.createTextNode(match[0]));
        }
        lastIndex = match.index + match[0].length;
      }

      if (hadMatch) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex)));
        textNode.parentNode.replaceChild(frag, textNode);
      }
    });

    return container.innerHTML;
  }

  let glossaryTooltipEl = null;

  function ensureGlossaryTooltip() {
    if (!glossaryTooltipEl) {
      glossaryTooltipEl = document.createElement("div");
      glossaryTooltipEl.className = "glossary-tooltip";
      document.body.appendChild(glossaryTooltipEl);
    }
    return glossaryTooltipEl;
  }

  function showGlossaryTooltip(termEl) {
    const tip = ensureGlossaryTooltip();
    tip.textContent = termEl.dataset.def;
    tip.dataset.forDef = termEl.dataset.def;
    tip.classList.add("visible");

    const rect = termEl.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();

    let left = rect.left;
    let top = rect.bottom + 8;
    if (left + tipRect.width > window.innerWidth - 12) left = window.innerWidth - tipRect.width - 12;
    if (left < 12) left = 12;
    if (top + tipRect.height > window.innerHeight - 12) top = rect.top - tipRect.height - 8;

    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
  }

  function hideGlossaryTooltip() {
    if (glossaryTooltipEl) glossaryTooltipEl.classList.remove("visible");
  }

  function setupGlossaryTooltips() {
    document.addEventListener("click", (e) => {
      const termEl = e.target.closest(".glossary-term");
      if (termEl) {
        e.stopPropagation();
        const alreadyOpenForThis = glossaryTooltipEl
          && glossaryTooltipEl.classList.contains("visible")
          && glossaryTooltipEl.dataset.forDef === termEl.dataset.def;
        if (alreadyOpenForThis) hideGlossaryTooltip();
        else showGlossaryTooltip(termEl);
      } else if (!e.target.closest(".glossary-tooltip")) {
        hideGlossaryTooltip();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        hideGlossaryTooltip();
      } else if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("glossary-term")) {
        e.preventDefault();
        e.target.click();
      }
    });

    window.addEventListener("scroll", hideGlossaryTooltip, true);
    window.addEventListener("resize", hideGlossaryTooltip);
  }

  // Helper Utilities
  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
  }
});
