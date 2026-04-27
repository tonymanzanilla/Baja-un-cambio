(function () {
  const questionBankBuilder = window.buildTheoryQuestionBank;
  if (typeof questionBankBuilder !== "function") {
    return;
  }

  const elements = {
    entryMenu: document.querySelector("#mainMenu"),
    appShell: document.querySelector("#appShell"),
    backToMenuLinks: document.querySelectorAll(".section-back-link"),
    openPracticeMenuButton: document.querySelector("#openPracticeMenuButton"),
    openTheoryMenuButton: document.querySelector("#openTheoryMenuButton"),
    showPracticeButton: document.querySelector("#showPracticeButton"),
    showTheoryButton: document.querySelector("#showTheoryButton"),
    practiceDashboard: document.querySelector("#practiceDashboard"),
    theoryDashboard: document.querySelector("#theoryDashboard"),
    generateTheoryExamButton: document.querySelector("#generateTheoryExamButton"),
    nextTheoryQuestionButton: document.querySelector("#nextTheoryQuestionButton"),
    theoryQuestionMeta: document.querySelector("#theoryQuestionMeta"),
    theoryQuestionPrompt: document.querySelector("#theoryQuestionPrompt"),
    theoryQuestionTopic: document.querySelector("#theoryQuestionTopic"),
    theoryVisualCard: document.querySelector("#theoryVisualCard"),
    theoryOptions: document.querySelector("#theoryOptions"),
    theoryFeedback: document.querySelector("#theoryFeedback"),
    theoryFeedbackTitle: document.querySelector("#theoryFeedbackTitle"),
    theoryFeedbackText: document.querySelector("#theoryFeedbackText"),
    theorySourceTitle: document.querySelector("#theorySourceTitle"),
    theorySourceText: document.querySelector("#theorySourceText"),
    theoryStatsCount: document.querySelector("#theoryStatsCount"),
    theoryStatsAnswered: document.querySelector("#theoryStatsAnswered"),
    theoryStatsCorrect: document.querySelector("#theoryStatsCorrect"),
    theoryStatsPassRate: document.querySelector("#theoryStatsPassRate"),
    theoryStatsResult: document.querySelector("#theoryStatsResult"),
    theoryOutline: document.querySelector("#theoryOutline"),
    theoryQuestionCountInput: document.querySelector("#theoryQuestionCountInput"),
    theoryPassRateInput: document.querySelector("#theoryPassRateInput"),
    autoAdvanceInput: document.querySelector("#autoAdvanceInput"),
    shuffleOptionsInput: document.querySelector("#shuffleOptionsInput"),
  };

  const state = {
    appMode: "practice",
    bank: questionBankBuilder(),
    examQuestions: [],
    currentQuestionIndex: 0,
    answers: new Map(),
    autoAdvanceTimeoutId: null,
  };

  function updateViewParam(mode) {
    const url = new URL(window.location.href);
    if (mode) {
      url.searchParams.set("view", mode);
    } else {
      url.searchParams.delete("view");
    }
    window.history.replaceState({}, "", url);
  }

  function shuffle(list) {
    const clone = [...list];
    for (let index = clone.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [clone[index], clone[randomIndex]] = [clone[randomIndex], clone[index]];
    }
    return clone;
  }

  function getExamConfig() {
    const bankSize = state.bank.length;
    const requestedCount = Number(elements.theoryQuestionCountInput?.value ?? 40);
    const passRate = Number(elements.theoryPassRateInput?.value ?? 85);

    return {
      questionCount: Math.max(5, Math.min(bankSize, requestedCount || 40)),
      passRate: Math.max(50, Math.min(100, passRate || 85)),
      autoAdvance: Boolean(elements.autoAdvanceInput?.checked),
      shuffleOptions: elements.shuffleOptionsInput?.checked !== false,
    };
  }

  function normalizeConfigInputs() {
    const config = getExamConfig();
    if (elements.theoryQuestionCountInput) {
      elements.theoryQuestionCountInput.max = String(state.bank.length);
      elements.theoryQuestionCountInput.value = String(config.questionCount);
    }
    if (elements.theoryPassRateInput) {
      elements.theoryPassRateInput.value = String(config.passRate);
    }
  }

  function randomizeQuestionOptions(question, shouldShuffle) {
    if (!shouldShuffle) {
      return question;
    }

    const correctOption = question.options[question.correctIndex];
    const options = shuffle(question.options);
    return {
      ...question,
      options,
      correctIndex: options.indexOf(correctOption),
    };
  }

  function buildExamQuestions() {
    const config = getExamConfig();
    const groups = state.bank.reduce((accumulator, question) => {
      const group = accumulator.get(question.factId) ?? [];
      group.push(question);
      accumulator.set(question.factId, group);
      return accumulator;
    }, new Map());

    const firstPass = shuffle([...groups.values()]).map((group) => shuffle(group)[0]);
    const usedIds = new Set(firstPass.map((question) => question.id));
    const fillPass = shuffle(state.bank).filter((question) => !usedIds.has(question.id));
    return [...firstPass, ...fillPass]
      .slice(0, config.questionCount)
      .map((question) => randomizeQuestionOptions(question, config.shuffleOptions));
  }

  function setAppMode(mode) {
    state.appMode = mode;
    const isPractice = mode === "practice";
    document.body.classList.add("app-open");
    document.body.classList.remove("app-closed");
    updateViewParam(mode);

    elements.showPracticeButton?.classList.toggle("active", isPractice);
    elements.showTheoryButton?.classList.toggle("active", !isPractice);

    const target = isPractice ? elements.practiceDashboard : elements.theoryDashboard;
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function setupEntryParallax() {
    const scene = document.querySelector("#scene");
    const cursor = document.querySelector("#cursor");
    if (!elements.entryMenu || !scene) {
      return;
    }

    const layers = Array.from(scene.querySelectorAll("[data-sx]")).map((element) => ({
      element,
      sx: Number(element.dataset.sx || 0),
      sy: Number(element.dataset.sy || 0),
    }));

    let width = window.innerWidth;
    let height = window.innerHeight;
    let centerX = width / 2;
    let centerY = height / 2;
    let mouseX = centerX;
    let mouseY = centerY;
    let lerpX = centerX;
    let lerpY = centerY;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      centerX = width / 2;
      centerY = height / 2;
    };

    const setCursorPosition = () => {
      if (!cursor) {
        return;
      }
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    };

    document.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      setCursorPosition();
    });

    document.querySelectorAll(".scene-button").forEach((button) => {
      button.addEventListener("mouseenter", () => cursor?.classList.add("hovering"));
      button.addEventListener("mouseleave", () => cursor?.classList.remove("hovering"));
    });

    window.addEventListener("resize", handleResize);
    handleResize();
    setCursorPosition();

    const tick = () => {
      lerpX += (mouseX - lerpX) * 0.07;
      lerpY += (mouseY - lerpY) * 0.07;
      const dx = lerpX - centerX;
      const dy = lerpY - centerY;

      layers.forEach(({ element, sx, sy }) => {
        const tx = -dx * sx;
        const ty = -dy * sy;
        const id = element.id;

        if (id === "island-wrap") {
          element.style.marginLeft = `${tx}px`;
          element.style.marginTop = `${ty}px`;
        } else if (id === "title-wrap" || id === "subtitle" || id === "buttons") {
          element.style.transform = `translateX(calc(-50% + ${tx}px)) translateY(${ty}px)`;
        } else {
          element.style.transform = `translateX(${tx}px) translateY(${ty}px)`;
        }
      });

      window.requestAnimationFrame(tick);
    };

    tick();
  }

  function generateExam() {
    normalizeConfigInputs();
    window.clearTimeout(state.autoAdvanceTimeoutId);
    state.examQuestions = buildExamQuestions();
    state.currentQuestionIndex = 0;
    state.answers = new Map();
    renderTheory();
  }

  function getCurrentQuestion() {
    return state.examQuestions[state.currentQuestionIndex] ?? null;
  }

  function answerCurrentQuestion(optionIndex) {
    const question = getCurrentQuestion();
    if (!question || state.answers.has(question.id)) {
      return;
    }

    state.answers.set(question.id, optionIndex);
    renderTheory();

    if (
      elements.autoAdvanceInput?.checked &&
      optionIndex === question.correctIndex &&
      state.currentQuestionIndex < state.examQuestions.length - 1
    ) {
      window.clearTimeout(state.autoAdvanceTimeoutId);
      state.autoAdvanceTimeoutId = window.setTimeout(nextQuestion, 650);
    }
  }

  function nextQuestion() {
    if (state.currentQuestionIndex < state.examQuestions.length - 1) {
      state.currentQuestionIndex += 1;
      renderTheory();
    }
  }

  function countCorrectAnswers() {
    return state.examQuestions.reduce((total, question) => {
      const answer = state.answers.get(question.id);
      return total + (answer === question.correctIndex ? 1 : 0);
    }, 0);
  }

  function createOptionButton(question, option, optionIndex) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theory-option";

    const savedAnswer = state.answers.get(question.id);
    const alreadyAnswered = typeof savedAnswer === "number";
    const isCorrectOption = optionIndex === question.correctIndex;
    const isChosenWrong = alreadyAnswered && savedAnswer === optionIndex && !isCorrectOption;

    if (alreadyAnswered && isCorrectOption) {
      button.classList.add("correct");
    }
    if (isChosenWrong) {
      button.classList.add("wrong");
    }

    button.innerHTML = `
      <strong>${option}</strong>
      <small>${alreadyAnswered && isCorrectOption ? "Respuesta correcta" : alreadyAnswered && savedAnswer === optionIndex ? "Tu respuesta" : "Opcion"}</small>
    `;

    button.disabled = alreadyAnswered;
    button.addEventListener("click", () => answerCurrentQuestion(optionIndex));
    return button;
  }

  function getVisualSvg(visual) {
    if (!visual) {
      return "";
    }

    if (visual.type === "fog-v") {
      const count = Math.max(1, Math.min(3, Number(visual.count ?? 1)));
      const markers = Array.from({ length: 3 }, (_, index) => {
        const isVisible = index >= 3 - count;
        const y = 88 + index * 72;
        return `
          <path d="M76 ${y + 34} L116 ${y} L156 ${y + 34}" fill="none" stroke="${isVisible ? "#ffffff" : "rgba(255,255,255,0.2)"}" stroke-width="16" stroke-linecap="square" stroke-linejoin="miter"/>
        `;
      }).join("");

      return `
        <svg viewBox="0 0 760 320" role="img" aria-label="${visual.alt}">
          <defs>
            <linearGradient id="fogGradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stop-color="#8f9398"/>
              <stop offset="1" stop-color="#f3f3ee"/>
            </linearGradient>
          </defs>
          <rect width="760" height="320" fill="url(#fogGradient)"/>
          <rect x="38" y="0" width="165" height="320" fill="#8c8f94"/>
          <rect x="204" y="0" width="9" height="320" fill="#ffffff" opacity="0.75"/>
          ${markers}
          <rect x="282" y="54" width="410" height="210" rx="26" fill="rgba(255,255,255,0.86)"/>
          <text x="316" y="112" fill="#11202d" font-size="24" font-family="Outfit, sans-serif" font-weight="700">Visibilidad con niebla</text>
          <text x="316" y="158" fill="#0d6b73" font-size="34" font-family="Space Grotesk, sans-serif" font-weight="700">${count} V ${count === 1 ? "invertida visible" : "invertidas visibles"}</text>
          <text x="316" y="206" fill="#5b6873" font-size="22" font-family="Outfit, sans-serif">Respondé según la demarcación que ves.</text>
        </svg>
      `;
    }

    if (visual.type === "tire-depth") {
      return `
        <svg viewBox="0 0 760 320" role="img" aria-label="${visual.alt}">
          <rect width="760" height="320" fill="#f5efe5"/>
          <rect x="56" y="58" width="648" height="204" rx="26" fill="#262b31"/>
          <g transform="translate(86 82)">
            ${Array.from({ length: 11 }, (_, index) => {
              const x = index * 56;
              const depth = index < 7 ? 126 : 46;
              const color = index < 7 ? "#d8dee4" : "#dd5f33";
              return `<rect x="${x}" y="${92 - depth / 2}" width="26" height="${depth}" rx="8" fill="${color}"/>`;
            }).join("")}
          </g>
          <line x1="486" y1="78" x2="486" y2="250" stroke="#ffd5bc" stroke-width="5" stroke-dasharray="8 8"/>
          <text x="76" y="42" fill="#11202d" font-size="22" font-family="Outfit, sans-serif" font-weight="700">Dibujo del neumático</text>
          <text x="506" y="112" fill="#dd5f33" font-size="34" font-family="Space Grotesk, sans-serif" font-weight="700">1,6 mm</text>
          <text x="506" y="154" fill="#5b6873" font-size="21" font-family="Outfit, sans-serif">Límite mínimo antes de reemplazar.</text>
          <text x="506" y="194" fill="#5b6873" font-size="21" font-family="Outfit, sans-serif">El dibujo evacúa agua y ayuda a evitar aquaplaning.</text>
        </svg>
      `;
    }

    return "";
  }

  function renderQuestionVisual(question) {
    if (!elements.theoryVisualCard) {
      return;
    }

    const svg = getVisualSvg(question.visual);
    if (!svg) {
      elements.theoryVisualCard.hidden = true;
      elements.theoryVisualCard.replaceChildren();
      return;
    }

    elements.theoryVisualCard.innerHTML = svg;
    elements.theoryVisualCard.hidden = false;
  }

  function renderOutline() {
    elements.theoryOutline.replaceChildren();
    state.examQuestions.forEach((question, index) => {
      const item = document.createElement("article");
      const answered = state.answers.has(question.id);
      item.className = `theory-outline-item${index === state.currentQuestionIndex ? " active" : ""}`;
      item.innerHTML = `
        <strong>Pregunta ${index + 1}</strong>
        <p>${question.topic}${answered ? " · respondida" : ""}</p>
      `;
      elements.theoryOutline.append(item);
    });
  }

  function renderTheory() {
    if (!elements.theoryDashboard) {
      return;
    }

    if (state.examQuestions.length === 0) {
      generateExam();
      return;
    }

    const question = getCurrentQuestion();
    if (!question) {
      return;
    }

    const answered = state.answers.has(question.id);
    const selectedIndex = state.answers.get(question.id);
    const selectedCorrect = selectedIndex === question.correctIndex;
    const config = getExamConfig();
    const correctAnswers = countCorrectAnswers();
    const answeredCount = state.answers.size;
    const currentScore = state.examQuestions.length
      ? Math.round((correctAnswers / state.examQuestions.length) * 100)
      : 0;
    const finished = answeredCount === state.examQuestions.length;

    elements.theoryQuestionMeta.textContent = `Pregunta ${state.currentQuestionIndex + 1} de ${state.examQuestions.length}`;
    elements.theoryQuestionPrompt.textContent = question.prompt;
    elements.theoryQuestionTopic.textContent = question.topic;
    renderQuestionVisual(question);

    elements.theoryOptions.replaceChildren();
    question.options.forEach((option, optionIndex) => {
      elements.theoryOptions.append(createOptionButton(question, option, optionIndex));
    });

    elements.theoryFeedback.hidden = !answered;
    if (answered) {
      elements.theoryFeedbackTitle.textContent = selectedCorrect ? "Correcta" : "Para revisar";
      elements.theoryFeedbackText.textContent = question.explanation;
    }

    elements.theorySourceTitle.textContent = `Manual oficial de conduccion GCBA · pag. impresa ${question.source.page}`;
    elements.theorySourceText.textContent = `${question.source.section}. La referencia usa la paginacion interna del manual y puede no coincidir exactamente con el numero de pagina que muestra el visor PDF. Esta pregunta se genera desde un hecho normalizado del manual, no desde texto inventado.`;

    elements.theoryStatsCount.textContent = String(state.examQuestions.length);
    elements.theoryStatsAnswered.textContent = String(answeredCount);
    elements.theoryStatsCorrect.textContent = String(correctAnswers);
    elements.theoryStatsPassRate.textContent = `${config.passRate}%`;
    elements.theoryStatsResult.textContent = finished
      ? currentScore >= config.passRate
        ? "Aprobado"
        : "A revisar"
      : "En curso";

    renderOutline();
  }

  elements.showPracticeButton?.addEventListener("click", () => setAppMode("practice"));
  elements.showTheoryButton?.addEventListener("click", () => {
    setAppMode("theory");
    renderTheory();
  });
  elements.openPracticeMenuButton?.addEventListener("click", () => setAppMode("practice"));
  elements.openTheoryMenuButton?.addEventListener("click", () => {
    setAppMode("theory");
    renderTheory();
  });
  elements.backToMenuLinks?.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.remove("app-open");
      document.body.classList.add("app-closed");
      updateViewParam(null);
      document.querySelector("#mainMenu")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  elements.generateTheoryExamButton?.addEventListener("click", generateExam);
  elements.nextTheoryQuestionButton?.addEventListener("click", nextQuestion);
  elements.theoryQuestionCountInput?.addEventListener("change", normalizeConfigInputs);
  elements.theoryPassRateInput?.addEventListener("change", normalizeConfigInputs);

  setupEntryParallax();
  normalizeConfigInputs();
  generateExam();
  const requestedView = new URLSearchParams(window.location.search).get("view");
  if (requestedView === "practice" || requestedView === "theory") {
    setAppMode(requestedView);
    if (requestedView === "theory") {
      renderTheory();
    }
  } else {
    document.body.classList.remove("app-open");
    document.body.classList.add("app-closed");
  }
})();
