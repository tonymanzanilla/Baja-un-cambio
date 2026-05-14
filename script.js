const circuits = window.DRIVING_CIRCUITS ?? [];
const currentUrlParams = new URLSearchParams(window.location.search);
const requestedCircuitId = currentUrlParams.get("circuit");
const onboardingStorageKey = "b2c-onboarding-seen-v2";
const activeCircuit =
  circuits.find((circuit) => circuit.id === requestedCircuitId) ??
  circuits.find((circuit) => circuit.id === "aca-libertador-a") ??
  circuits[0];

if (!activeCircuit) {
  throw new Error("No hay circuitos cargados. Revisá los scripts de /circuits.");
}

const mapRoutePoints = activeCircuit.mapRoutePoints;
const progressIndexByStep = activeCircuit.progressIndexByStep;
const routeSteps = buildPlayableRouteSteps(
  activeCircuit.routeSteps,
  mapRoutePoints,
  progressIndexByStep
);

function buildPlayableRouteSteps(baseSteps, routePoints, progressByStep) {
  if (!Array.isArray(routePoints) || routePoints.length < 2) {
    return baseSteps;
  }

  const targetSpacingMeters = 44;
  const requiredStepsByRouteIndex = new Map();
  baseSteps.forEach((step) => {
    const routeIndex = Math.max(0, (progressByStep[step.id] ?? 1) - 1);
    const guidedHeading = getGuidedHeadingForRouteIndex(routePoints, routeIndex, step.correctAction);
    requiredStepsByRouteIndex.set(routeIndex, {
      ...step,
      streetView: {
        ...step.streetView,
        heading: guidedHeading,
      },
      routeProgressIndex: routeIndex + 1,
      routePointIndex: routeIndex,
    });
  });

  const playableSteps = [];
  const usedIds = new Set();
  const addStep = (step) => {
    if (usedIds.has(step.id)) {
      return;
    }
    usedIds.add(step.id);
    playableSteps.push(step);
  };

  routePoints.forEach((point, index) => {
    const requiredStep = requiredStepsByRouteIndex.get(index);
    if (requiredStep) {
      addStep(requiredStep);
    } else if (index > 0) {
      addStep(createCruiseCheckpoint(routePoints, index, 0));
    }

    const nextPoint = routePoints[index + 1];
    if (!nextPoint) {
      return;
    }

    const segmentDistance = distanceInMeters(point, nextPoint);
    const extraStops = Math.max(0, Math.floor(segmentDistance / targetSpacingMeters));
    for (let stop = 1; stop <= extraStops; stop += 1) {
      const fraction = stop / (extraStops + 1);
      addStep(createCruiseCheckpoint(routePoints, index, fraction));
    }
  });

  const lastBaseStep = baseSteps[baseSteps.length - 1];
  if (!usedIds.has(lastBaseStep.id)) {
    addStep({
      ...lastBaseStep,
      routeProgressIndex: routePoints.length,
      routePointIndex: routePoints.length - 1,
    });
  }

  return playableSteps;
}

function createCruiseCheckpoint(routePoints, index, fraction) {
  const currentPoint = routePoints[index];
  const nextPoint = routePoints[index + 1] ?? routePoints[index];
  const previousPoint = routePoints[index - 1] ?? currentPoint;
  const point = fraction > 0
    ? interpolatePoint(currentPoint, nextPoint, fraction)
    : currentPoint;
  const headingTarget = fraction > 0 ? nextPoint : nextPoint ?? previousPoint;
  const routeProgressIndex = index + 1;
  const idSuffix = fraction > 0 ? `${index + 1}-${Math.round(fraction * 100)}` : `${index + 1}`;

  return {
    id: `cruise-${idSuffix}`,
    segment: "Tramo guiado",
    title: "Seguí el recorrido",
    kicker: "Checkpoint",
    description:
      "Punto intermedio para reconocer la cuadra real sin depender del avance nativo de Street View.",
    progressLabel: "Checkpoint intermedio",
    prompt: "Avanzá hasta el próximo hito del recorrido.",
    correctAction: "straight",
    speedHint: "20 km/h",
    trigger: point,
    streetView: {
      ...point,
      heading: getHeadingBetweenPoints(point, headingTarget),
      pitch: -2,
      zoom: 1,
    },
    cue: {
      farTitle: "Seguí derecho",
      farText: "Reconocé la cuadra y avanzá al próximo checkpoint.",
      nearTitle: "Seguí derecho",
      nearText: "Este checkpoint es para no perder continuidad visual.",
    },
    alerts: [
      {
        type: "note",
        title: "Reconocimiento",
        body: "Usá la vista 360 para ubicar referencias: esquinas, senda, carteles y carriles.",
      },
    ],
    mapPoint: point,
    routeProgressIndex,
    routePointIndex: index,
  };
}

function interpolatePoint(from, to, fraction) {
  return {
    lat: from.lat + (to.lat - from.lat) * fraction,
    lng: from.lng + (to.lng - from.lng) * fraction,
  };
}

function getHeadingBetweenPoints(from, to) {
  const fromLat = toRadians(from.lat);
  const toLat = toRadians(to.lat);
  const deltaLng = toRadians(to.lng - from.lng);
  const y = Math.sin(deltaLng) * Math.cos(toLat);
  const x =
    Math.cos(fromLat) * Math.sin(toLat) -
    Math.sin(fromLat) * Math.cos(toLat) * Math.cos(deltaLng);
  return Math.round(normalizeHeading((Math.atan2(y, x) * 180) / Math.PI));
}

function blendHeadings(fromHeading, toHeading, weight = 0.5) {
  const start = normalizeHeading(fromHeading);
  const end = normalizeHeading(toHeading);
  const delta = ((end - start + 540) % 360) - 180;
  return Math.round(normalizeHeading(start + delta * weight));
}

function getGuidedHeadingForRouteIndex(routePoints, index, action) {
  const currentPoint = routePoints[index];
  const previousPoint = routePoints[Math.max(0, index - 1)] ?? currentPoint;
  const nextPoint = routePoints[Math.min(routePoints.length - 1, index + 1)] ?? currentPoint;

  if (!currentPoint || !nextPoint) {
    return 0;
  }

  const incomingHeading = getHeadingBetweenPoints(previousPoint, currentPoint);
  const outgoingHeading = getHeadingBetweenPoints(currentPoint, nextPoint);

  if (index === 0) {
    return outgoingHeading;
  }

  if (index >= routePoints.length - 1) {
    return incomingHeading;
  }

  if (action === "left" || action === "right") {
    return blendHeadings(incomingHeading, outgoingHeading, 0.58);
  }

  return outgoingHeading;
}

function getCircuitCardSubtitle(circuit) {
  const summary = typeof circuit.routeSummary === "string" ? circuit.routeSummary.trim() : "";
  if (summary) {
    return summary;
  }
  return "";
}

const availableCircuits = circuits.map((circuit) => ({
  id: circuit.id,
  title: circuit.title,
  subtitle: getCircuitCardSubtitle(circuit),
  active: circuit.id === activeCircuit.id,
}));
const contextualMessages = activeCircuit.contextualMessages;
const mapContextRules = activeCircuit.mapContextRules;

const config = window.APP_CONFIG ?? {};
const assistantData = window.DRIVING_ASSISTANT_DATA ?? { starterPrompts: [], knowledgeBase: [] };
const mobileAssistantWelcomeMessage = "Preguntame lo que quieras sobre vialidad, el recorrido o el examen.";

const elements = {
  startStudyMode: document.querySelector("#startStudyMode"),
  startExamMode: document.querySelector("#startExamMode"),
  studyModeButton: document.querySelector("#studyModeButton"),
  examModeButton: document.querySelector("#examModeButton"),
  segmentName: document.querySelector("#segmentName"),
  progressValue: document.querySelector("#progressValue"),
  scoreValue: document.querySelector("#scoreValue"),
  progressLabel: document.querySelector("#progressLabel"),
  progressFill: document.querySelector("#progressFill"),
  decisionPrompt: document.querySelector("#decisionPrompt"),
  decisionFeedback: document.querySelector("#decisionFeedback"),
  viewport: document.querySelector("#viewport"),
  viewportKicker: document.querySelector("#viewportKicker"),
  viewportTitle: document.querySelector("#viewportTitle"),
  viewportDescription: document.querySelector("#viewportDescription"),
  signalStack: document.querySelector("#signalStack"),
  speedHint: document.querySelector("#speedHint"),
  microTip: document.querySelector("#microTip"),
  routeMapCanvas: document.querySelector("#routeMapCanvas"),
  gpsMapSlot: document.querySelector(".gps-map-slot"),
  mapPanelTitle: document.querySelector("#mapPanelTitle"),
  nextStepButton: document.querySelector("#nextStepButton"),
  backStepButton: document.querySelector("#backStepButton"),
  decisionButtons: [...document.querySelectorAll(".decision-button")],
  streetViewCanvas: document.querySelector("#streetViewCanvas"),
  viewerModeBadge: document.querySelector("#viewerModeBadge"),
  viewerStatusText: document.querySelector("#viewerStatusText"),
  captureViewButton: document.querySelector("#captureViewButton"),
  captureOutput: document.querySelector("#captureOutput"),
  calibrationStepLabel: document.querySelector("#calibrationStepLabel"),
  circuitOptions: document.querySelector("#circuitOptions"),
  circuitPickerSummary: document.querySelector("#circuitPickerSummary"),
  routeCue: document.querySelector("#routeCue"),
  routeCueArrow: document.querySelector("#routeCueArrow"),
  routeCueTitle: document.querySelector("#routeCueTitle"),
  routeCueText: document.querySelector("#routeCueText"),
  turnBadge: document.querySelector("#turnBadge"),
  turnLeftButton: document.querySelector("#turnLeftButton"),
  driveForwardButton: document.querySelector("#driveForwardButton"),
  turnRightButton: document.querySelector("#turnRightButton"),
  leftSignalIndicator: document.querySelector("#leftSignalIndicator"),
  rightSignalIndicator: document.querySelector("#rightSignalIndicator"),
  onboardingModal: document.querySelector("#onboardingModal"),
  onboardingOkButton: document.querySelector("#onboardingOkButton"),
  contextualList: document.querySelector("#contextualList"),
  mapContextCard: document.querySelector("#mapContextCard"),
  mapContextLabel: document.querySelector("#mapContextLabel"),
  mapContextTitle: document.querySelector("#mapContextTitle"),
  mapContextText: document.querySelector("#mapContextText"),
  heroRouteSummary: document.querySelector("#heroRouteSummary"),
  heroRouteBlurb: document.querySelector("#heroRouteBlurb"),
  practiceDashboard: document.querySelector("#practiceDashboard"),
  mobileExperienceViewButton: document.querySelector("#mobileExperienceViewButton"),
  mobileMapViewButton: document.querySelector("#mobileMapViewButton"),
  assistantToggleButton: document.querySelector("#assistantToggleButton"),
  mobileAssistantBubble: document.querySelector("#mobileAssistantBubble"),
  mobileAssistantRotate: document.querySelector("#mobileAssistantRotate"),
  mobileAssistantRotateClose: document.querySelector("#mobileAssistantRotateClose"),
  assistantPanel: document.querySelector("#assistantPanel"),
  assistantCloseButton: document.querySelector("#assistantCloseButton"),
  assistantCircuitPill: document.querySelector("#assistantCircuitPill"),
  assistantStepPill: document.querySelector("#assistantStepPill"),
  assistantMessages: document.querySelector("#assistantMessages"),
  assistantForm: document.querySelector("#assistantForm"),
  assistantInput: document.querySelector("#assistantInput"),
};

const state = {
  mode: "study",
  currentStep: 0,
  score: 100,
  answeredStepIds: new Set(),
  driveHoldIntervalId: null,
  moveCooldownUntil: 0,
  reachedCurrentCheckpoint: false,
  lastDistanceToCheckpoint: null,
  assistantOpen: false,
  mobileAssistantMode: false,
  mobilePracticeView: "experience",
  turnSignal: null,
  sunglassesOn: false,
  turnSignalMisses: 0,
  turnSignalHits: 0,
  onboardingSeen: window.sessionStorage?.getItem(onboardingStorageKey) === "true",
};

const streetViewState = {
  supported: false,
  loading: false,
  loaded: false,
  failed: false,
  panorama: null,
  service: null,
  geocoder: null,
  geocodeCache: new Map(),
};

const mapState = {
  map: null,
  routeLine: null,
  completedLine: null,
  currentMarker: null,
  nextMarker: null,
  fittedRoute: false,
};

const cockpitAsset = {
  width: 1309,
  height: 743,
  gpsScreen: {
    x: 589,
    y: 481,
    width: 317,
    height: 130,
  },
};

const assistantState = {
  messages: [
    {
      role: "bot",
      text: assistantData.welcomeMessage,
      sources: ["Base local del asistente"],
    },
  ],
  pending: false,
};

function setMode(mode) {
  state.mode = mode;
  const isStudy = mode === "study";
  elements.studyModeButton.classList.toggle("active", isStudy);
  elements.examModeButton.classList.toggle("active", !isStudy);
  elements.startStudyMode.classList.toggle("primary-button", isStudy);
  elements.startStudyMode.classList.toggle("ghost-button", !isStudy);
  elements.startExamMode.classList.toggle("primary-button", !isStudy);
  elements.startExamMode.classList.toggle("ghost-button", isStudy);
  render();
}

function clampStep(index) {
  return Math.max(0, Math.min(routeSteps.length - 1, index));
}

function clearDecisionStyles() {
  elements.decisionButtons.forEach((button) => {
    button.classList.remove("correct", "wrong");
  });
}

function goToStep(index, options = {}) {
  const { reposition = true } = options;
  state.currentStep = clampStep(index);
  state.reachedCurrentCheckpoint = false;
  state.lastDistanceToCheckpoint = null;
  clearDecisionStyles();
  render();
  if (reposition) {
    updateStreetViewForCurrentStep();
  }
}

function nextStep() {
  moveCheckpoint(1);
}

function previousStep() {
  moveCheckpoint(-1);
}

function getRequiredTurnSignal(step) {
  return step.correctAction === "left" || step.correctAction === "right"
    ? step.correctAction
    : null;
}

function syncTurnSignalIndicators() {
  elements.leftSignalIndicator?.classList.toggle("active", state.turnSignal === "left");
  elements.rightSignalIndicator?.classList.toggle("active", state.turnSignal === "right");
  elements.leftSignalIndicator?.classList.toggle("hazard", state.turnSignal === "hazard");
  elements.rightSignalIndicator?.classList.toggle("hazard", state.turnSignal === "hazard");
}

function setTurnSignal(direction) {
  state.turnSignal = state.turnSignal === direction ? null : direction;
  syncTurnSignalIndicators();
}

function clearTurnSignal() {
  state.turnSignal = null;
  syncTurnSignalIndicators();
}

function toggleSunglasses() {
  state.sunglassesOn = !state.sunglassesOn;
  elements.viewport?.classList.toggle("sunglasses-on", state.sunglassesOn);
}

const mobileTapControls = {
  lastTapAt: 0,
  pendingSingleTap: null,
  pointerStart: null,
};

function isMobileTapControlSurface() {
  return window.matchMedia("(pointer: coarse) and (max-height: 620px) and (orientation: landscape)").matches;
}

function getResponsiveStreetViewPitch(step) {
  const basePitch = step.streetView.pitch ?? 0;
  if (isMobileTapControlSurface()) {
    return Math.max(-20, basePitch - 10);
  }
  return basePitch;
}

function handleViewportPointerDown(event) {
  if (!isMobileTapControlSurface() || event.pointerType === "mouse") {
    return;
  }
  if (event.target?.closest?.(".gps-map-slot")) {
    return;
  }

  mobileTapControls.pointerStart = {
    x: event.clientX,
    y: event.clientY,
    time: window.performance.now(),
  };
}

function handleViewportPointerUp(event) {
  if (!isMobileTapControlSurface() || event.pointerType === "mouse" || !mobileTapControls.pointerStart) {
    return;
  }
  if (event.target?.closest?.(".gps-map-slot")) {
    mobileTapControls.pointerStart = null;
    return;
  }

  const start = mobileTapControls.pointerStart;
  mobileTapControls.pointerStart = null;
  const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y);
  const elapsed = window.performance.now() - start.time;
  if (moved > 18 || elapsed > 520) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const now = window.performance.now();
  if (now - mobileTapControls.lastTapAt < 290) {
    window.clearTimeout(mobileTapControls.pendingSingleTap);
    mobileTapControls.pendingSingleTap = null;
    mobileTapControls.lastTapAt = 0;
    moveCheckpoint(-1);
    return;
  }

  mobileTapControls.lastTapAt = now;
  mobileTapControls.pendingSingleTap = window.setTimeout(() => {
    mobileTapControls.pendingSingleTap = null;
    moveCheckpoint(1);
  }, 220);
}

function applyTurnSignalPenalty(step) {
  const requiredSignal = getRequiredTurnSignal(step);
  if (!requiredSignal) {
    return;
  }

  if (state.turnSignal === requiredSignal || state.turnSignal === "hazard") {
    state.turnSignalHits += 1;
    clearTurnSignal();
    return;
  }

  state.turnSignalMisses += 1;
  state.score = Math.max(0, state.score - 6);
  elements.scoreValue.textContent = String(state.score);
  elements.decisionFeedback.textContent =
    requiredSignal === "left"
      ? "Te olvidaste el guiño izquierdo. -6 puntos."
      : "Te olvidaste el guiño derecho. -6 puntos.";
  clearTurnSignal();
}

function getTurnSignalSummary() {
  const totalRequiredSignals = state.turnSignalHits + state.turnSignalMisses;
  if (totalRequiredSignals === 0) {
    return "Todavia no hubo giros con guiño obligatorio.";
  }

  if (state.turnSignalMisses === 0) {
    return "Los pusiste siempre, muy bien crack.";
  }

  const countText = state.turnSignalMisses === 1 ? "1 vez" : `${state.turnSignalMisses} veces`;
  return `Che capo, no pusiste el guiño ${countText}.`;
}

function moveCheckpoint(direction) {
  holdForwardStop();
  if (direction > 0) {
    applyTurnSignalPenalty(routeSteps[state.currentStep]);
  }
  goToStep(state.currentStep + direction);
}

function getCheckpointInstruction(step) {
  if (step.correctAction === "left") {
    return "Giro a la izquierda";
  }
  if (step.correctAction === "right") {
    return "Giro a la derecha";
  }
  return state.currentStep === routeSteps.length - 1 ? "Final del recorrido" : "Seguir derecho";
}

function getStepPoint(step) {
  if (step.mapPoint) {
    return { lat: step.mapPoint.lat, lng: step.mapPoint.lng };
  }

  if (step.trigger) {
    return { lat: step.trigger.lat, lng: step.trigger.lng };
  }

  return { lat: step.streetView.lat, lng: step.streetView.lng };
}

function getNearestRoutePointIndex(point) {
  if (!point || !Array.isArray(mapRoutePoints) || mapRoutePoints.length === 0) {
    return null;
  }

  return mapRoutePoints.reduce((bestIndex, routePoint, index) => {
    if (bestIndex === null) {
      return index;
    }

    const bestDistance = distanceInMeters(point, mapRoutePoints[bestIndex]);
    const candidateDistance = distanceInMeters(point, routePoint);
    return candidateDistance < bestDistance ? index : bestIndex;
  }, null);
}

function getContextRuleRouteIndexes(rule) {
  return (rule.stepIds ?? [rule.stepId])
    .map((stepId) => progressIndexByStep[stepId])
    .filter((routeProgressIndex) => typeof routeProgressIndex === "number")
    .map((routeProgressIndex) => Math.max(0, routeProgressIndex - 1));
}

function createSignalPill(alert) {
  const pill = document.createElement("article");
  pill.className = `signal-pill ${alert.type}`;
  pill.innerHTML = `<strong>${alert.title}</strong><span>${alert.body}</span>`;
  return pill;
}

function labelForType(type) {
  switch (type) {
    case "stop":
      return "Pare";
    case "school":
      return "Escuela";
    case "traffic-light":
      return "Semaforo";
    case "priority":
      return "Prioridad";
    default:
      return "Nota";
  }
}

function renderSignals(step) {
  elements.signalStack.replaceChildren();
  const signals =
    state.mode === "study"
      ? step.alerts
      : step.alerts.filter((alert) => alert.type === "traffic-light" || alert.type === "stop").slice(0, 1);
  signals.forEach((alert) => {
    elements.signalStack.append(createSignalPill(alert));
  });
}

function buildMicroTip(step) {
  if (state.mode === "exam") {
    return "Modo examen: menos ayudas, mas foco en lectura del entorno.";
  }

  return step.cue.farText;
}

function createContextualItem(message, index, isCurrent) {
  const item = document.createElement("details");
  item.className = `contextual-item${isCurrent ? " opening" : ""}`;
  if (index < 2 || isCurrent) {
    item.open = true;
  }

  item.innerHTML = `
    <summary>
      <div class="contextual-title">
        <div class="contextual-index">${index + 1}</div>
        <div class="contextual-heading">
          <strong>${message.title}</strong>
          <span>${message.subtitle}</span>
        </div>
      </div>
      <span class="contextual-meta">${message.category}</span>
    </summary>
    <div class="contextual-body">
      <p><strong>Lo que vemos:</strong> ${message.observation}</p>
      <p><strong>Que entrenar:</strong> ${message.takeaway}</p>
      <blockquote>${message.source.quote}</blockquote>
      <div class="contextual-source">
        <span><strong>Fuente:</strong> ${message.source.document}</span>
        <span><strong>Tema:</strong> ${message.source.section}</span>
      </div>
    </div>
  `;

  return item;
}

function renderContextualMessages() {
  if (!elements.contextualList) {
    return;
  }

  elements.contextualList.replaceChildren();
  contextualMessages.forEach((message, index) => {
    const isCurrent = message.stepId === routeSteps[state.currentStep].id;
    elements.contextualList.append(createContextualItem(message, index, isCurrent));
  });
}

function renderCircuitOptions() {
  if (!elements.circuitOptions) {
    return;
  }

  elements.circuitPickerSummary.textContent = activeCircuit.title;
  if (elements.heroRouteSummary) {
    elements.heroRouteSummary.textContent = activeCircuit.routeSummary;
  }
  if (elements.heroRouteBlurb) {
    elements.heroRouteBlurb.textContent = activeCircuit.subtitle;
  }
  elements.circuitOptions.replaceChildren();
  availableCircuits.forEach((circuit) => {
    const item = document.createElement("article");
    item.className = `circuit-option${circuit.active ? " active" : ""}`;
    item.tabIndex = circuit.active ? -1 : 0;
    item.role = "button";
    item.innerHTML = circuit.subtitle
      ? `
      <strong>${circuit.title}</strong>
      <span>${circuit.subtitle}</span>
    `
      : `
      <strong>${circuit.title}</strong>
    `;
    if (!circuit.active) {
      item.addEventListener("click", () => {
        const params = new URLSearchParams(window.location.search);
        params.set("circuit", circuit.id);
        window.location.search = `?${params.toString()}`;
      });
      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          const params = new URLSearchParams(window.location.search);
          params.set("circuit", circuit.id);
          window.location.search = `?${params.toString()}`;
        }
      });
    }
    elements.circuitOptions.append(item);
  });
}

function normalizeAssistantText(value) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getAssistantStepContext(step = routeSteps[state.currentStep]) {
  const relatedMessages = contextualMessages.filter((message) => message.stepId === step.id);
  const activeRule = getActiveMapContextRule();

  return {
    circuitId: activeCircuit.id,
    circuitTitle: activeCircuit.title,
    stepId: step.id,
    stepTitle: step.title,
    stepPrompt: step.prompt,
    stepDescription: step.description,
    stepCueNear: step.cue?.nearText ?? "",
    stepCueFar: step.cue?.farText ?? "",
    stepAlerts: step.alerts ?? [],
    relatedMessages,
    activeRule,
  };
}

function getAssistantDocuments(stepContext) {
  const stepDocuments = stepContext.relatedMessages.map((message) => ({
    id: `context-${message.id}`,
    title: message.title,
    topic: message.category,
    keywords: [
      message.title,
      message.subtitle,
      message.category,
      message.observation,
      message.takeaway,
    ],
    content: `${message.observation} ${message.takeaway} ${message.source.quote}`,
    source: message.source.document,
    section: message.source.section,
    priorityBoost: 3,
  }));

  const routeDocument = {
    id: `step-${stepContext.stepId}`,
    title: stepContext.stepTitle,
    topic: "Tramo actual",
    keywords: [
      stepContext.stepTitle,
      stepContext.stepPrompt,
      stepContext.stepCueNear,
      stepContext.stepCueFar,
      stepContext.circuitTitle,
      "aca",
      "doblar",
      "derecha",
      "izquierda",
      "cruce",
      "contramano",
    ],
    content: `${stepContext.stepDescription} ${stepContext.stepPrompt} ${stepContext.stepCueNear} ${stepContext.stepCueFar}`,
    source: stepContext.circuitTitle,
    section: "Recorrido actual",
    priorityBoost: 4,
  };

  const alertDocuments = stepContext.stepAlerts.map((alert, index) => ({
    id: `alert-${stepContext.stepId}-${index}`,
    title: alert.title,
    topic: "Alerta de maniobra",
    keywords: [alert.type, alert.title, alert.body, "maniobra", "giro", "cruce"],
    content: alert.body,
    source: stepContext.circuitTitle,
    section: "Alertas del hito",
    priorityBoost: 2,
  }));

  const activeRuleDocument = stepContext.activeRule
    ? [
        {
          id: `rule-${stepContext.activeRule.id}`,
          title: stepContext.activeRule.title,
          topic: stepContext.activeRule.label,
          keywords: [
            stepContext.activeRule.title,
            stepContext.activeRule.label,
            stepContext.activeRule.text,
          ],
          content: stepContext.activeRule.text,
          source: stepContext.circuitTitle,
          section: "Contexto del mapa",
          priorityBoost: 3,
        },
      ]
    : [];

  return [
    ...assistantData.knowledgeBase,
    routeDocument,
    ...alertDocuments,
    ...stepDocuments,
    ...activeRuleDocument,
  ];
}

function scoreAssistantDocument(questionText, document, stepContext) {
  const haystack = normalizeAssistantText(
    [document.title, document.topic, document.content, ...(document.keywords ?? [])].join(" ")
  );
  const tokens = questionText.split(" ").filter(Boolean);
  let score = document.priorityBoost ?? 0;

  tokens.forEach((token) => {
    if (token.length < 3) {
      return;
    }
    if (haystack.includes(token)) {
      score += token.length > 6 ? 4 : 2;
    }
  });

  if (
    questionText.includes("aca") ||
    questionText.includes("este cruce") ||
    questionText.includes("esta maniobra") ||
    questionText.includes("por que dobl")
  ) {
    if (document.id.startsWith("step-") || document.id.startsWith("context-") || document.id.startsWith("rule-")) {
      score += 4;
    }
  }

  if (stepContext.stepPrompt && haystack.includes(normalizeAssistantText(stepContext.stepPrompt))) {
    score += 2;
  }

  return score;
}

function getAssistantMatches(question, stepContext) {
  const normalizedQuestion = normalizeAssistantText(question);
  const documents = getAssistantDocuments(stepContext);

  return documents
    .map((document) => ({
      document,
      score: scoreAssistantDocument(normalizedQuestion, document, stepContext),
    }))
    .filter((match) => match.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);
}

function isGeneralRoadRuleQuestion(questionText) {
  return [
    "bici",
    "bicicleta",
    "ciclista",
    "pare",
    "ceda",
    "semaforo",
    "prioridad",
    "rotonda",
    "peaton",
    "peatones",
  ].some((term) => questionText.includes(term));
}

function getLocalAssistantAnswerMode(questionText) {
  const contenedoraSignals = [
    "nunca use",
    "explicame",
    "explicamelo",
    "estoy nerv",
    "me da miedo",
    "no entiendo",
    "como hago",
    "como uso",
    "street view",
    "que hago primero",
    "apenas me siento",
  ];

  const compactaSignals = [
    "cuanto",
    "quien tiene prioridad",
    "tengo que",
    "pare",
    "ceda",
    "semaforo",
  ];

  if (contenedoraSignals.some((term) => questionText.includes(term))) {
    return "contenedora";
  }

  if (compactaSignals.some((term) => questionText.includes(term)) || questionText.split(" ").length <= 10) {
    return "corta-y-filosa";
  }

  return "equilibrada";
}

function buildAssistantAnswer(question, stepContext) {
  const normalizedQuestion = normalizeAssistantText(question);
  const matches = getAssistantMatches(question, stepContext);
  const mode = getLocalAssistantAnswerMode(normalizedQuestion);

  if (!matches.length) {
    return {
      text:
        mode === "contenedora"
          ? "Con lo que tengo cargado ahora no te lo puedo afirmar bien sin inventarte. Si queres, decimelo mas concreto o despues le sumamos mas material y lo afinamos un poco mejor."
          : "No te lo puedo afirmar con seguridad solo con el material que tengo cargado ahora. Si queres, reformulalo mas concreto.",
      sources: ["Base local del asistente"],
    };
  }

  if (normalizedQuestion.includes("bici") || normalizedQuestion.includes("bicicleta")) {
    const bikeMatch = matches.find((match) => match.document.id === "bike-overtake");
    if (bikeMatch) {
      return {
        text:
          mode === "contenedora"
            ? "Con una bici, pensalo facil: no la encierres ni la apures, y deja aire de sobra al pasar. En esta base local no tengo cargada una medida oficial exacta para darte un numero con seguridad, asi que prefiero no chamuyartelo. Si no te da el ancho para pasar comodo, espera un poco y listo."
            : "Con una bici, deja distancia lateral segura y no la encierres. En esta base local no tengo una medida oficial exacta cargada, asi que prefiero no inventarte un numero.",
        sources: [`${bikeMatch.document.source} · ${bikeMatch.document.section}`],
      };
    }
  }

  const [primaryMatch, secondaryMatch] = matches;
  const intro =
    primaryMatch.document.id.startsWith("step-") || primaryMatch.document.id.startsWith("context-")
      ? `Por el tramo actual, yo lo pensaria asi: ${primaryMatch.document.content}`
      : primaryMatch.document.content;

  const currentStepHint =
    !isGeneralRoadRuleQuestion(normalizedQuestion) &&
    (normalizedQuestion.includes("aca") ||
      normalizedQuestion.includes("este") ||
      normalizedQuestion.includes("doblar"))
      ? `\n\nEn este momento estas en "${stepContext.stepTitle}". La instruccion visible es: ${stepContext.stepPrompt}`
      : "";

  const support =
    secondaryMatch && secondaryMatch.document.id !== primaryMatch.document.id
      ? `\n\nComo respaldo, tambien aplica esto: ${secondaryMatch.document.content}`
      : "";

  const baseText = `${intro}${currentStepHint}${support}`;
  const text =
    mode === "contenedora"
      ? `${baseText}\n\nSi queres, lo bajamos a tierra paso a paso y lo pensamos como si estuvieras sentado en el auto.`
      : mode === "corta-y-filosa"
        ? `${baseText}\n\nClave: no te apures al pedo.`
        : `${baseText}\n\nSi queres, lo afinamos con el detalle puntual que te esta trabando.`;

  return {
    text,
    sources: matches.map((match) => `${match.document.source} · ${match.document.section}`),
  };
}

function buildAssistantHistoryPayload() {
  return assistantState.messages
    .slice(-6)
    .map((message) => ({
      role: message.role === "bot" ? "assistant" : message.role,
      content: message.text,
    }));
}

async function requestAssistantApi(question, stepContext) {
  const response = await fetch("/api/assistant", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      context: stepContext,
      history: buildAssistantHistoryPayload(),
    }),
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    const details = errorPayload?.message || errorPayload?.error || `HTTP ${response.status}`;
    throw new Error(details);
  }

  const payload = await response.json();
  if (!payload?.answer) {
    throw new Error("Respuesta vacia del asistente.");
  }

  return {
    text: payload.answer,
    sources: payload.sources ?? ["Claude"],
  };
}

function createAssistantMessageElement(message) {
  const article = document.createElement("article");
  article.className = `assistant-message ${message.role}`;

  const meta = document.createElement("div");
  meta.className = "assistant-message-meta";
  meta.textContent = message.role === "user" ? "Tu duda" : "Instructor";

  const body = document.createElement("div");
  body.className = "assistant-message-body";
  body.textContent = message.text;

  article.append(meta, body);

  if (message.role === "bot" && message.sources?.length) {
    const sources = document.createElement("div");
    sources.className = "assistant-message-sources";
    sources.textContent = `Base usada: ${message.sources.join(" / ")}`;
    article.append(sources);
  }

  return article;
}

function renderAssistantMessages() {
  if (!elements.assistantMessages) {
    return;
  }

  elements.assistantMessages.replaceChildren();
  assistantState.messages.forEach((message, index) => {
    const renderedMessage =
      state.mobileAssistantMode && index === 0 && message.role === "bot"
        ? { ...message, text: mobileAssistantWelcomeMessage, sources: [] }
        : message;
    elements.assistantMessages.append(createAssistantMessageElement(renderedMessage));
  });
  if (assistantState.pending) {
    const pendingMessage = document.createElement("article");
    pendingMessage.className = "assistant-message bot";
    pendingMessage.innerHTML = `
      <div class="assistant-message-meta">Instructor</div>
      <div class="assistant-message-body">Pensando la mejor respuesta...</div>
    `;
    elements.assistantMessages.append(pendingMessage);
  }
  elements.assistantMessages.scrollTop = elements.assistantMessages.scrollHeight;
}

function renderAssistantMeta() {
  if (!elements.assistantCircuitPill || !elements.assistantStepPill) {
    return;
  }

  const step = routeSteps[state.currentStep];
  elements.assistantCircuitPill.textContent = activeCircuit.title;
  elements.assistantStepPill.textContent = `${step.segment} · ${step.title}`;
}

function isMobilePracticeLayout() {
  return window.matchMedia(
    "(max-width: 920px) and (orientation: portrait), (max-width: 1100px) and (max-height: 620px) and (orientation: landscape)"
  ).matches;
}

function syncMobilePracticeView() {
  if (!elements.practiceDashboard || !elements.mobileExperienceViewButton || !elements.mobileMapViewButton) {
    return;
  }

  const isMobile = isMobilePracticeLayout();
  elements.practiceDashboard.classList.toggle("mobile-view-experience", isMobile && state.mobilePracticeView === "experience");
  elements.practiceDashboard.classList.toggle("mobile-view-map", isMobile && state.mobilePracticeView === "map");
  elements.mobileExperienceViewButton.classList.toggle("active", state.mobilePracticeView === "experience");
  elements.mobileMapViewButton.classList.toggle("active", state.mobilePracticeView === "map");
  elements.mobileExperienceViewButton.setAttribute("aria-pressed", state.mobilePracticeView === "experience" ? "true" : "false");
  elements.mobileMapViewButton.setAttribute("aria-pressed", state.mobilePracticeView === "map" ? "true" : "false");
}

function setMobilePracticeView(nextView) {
  state.mobilePracticeView = nextView === "map" ? "map" : "experience";
  syncMobilePracticeView();
  syncGpsMapSlot();
  renderMap();
}

function syncAssistantViewportSize() {
  if (!window.visualViewport) {
    return;
  }

  document.documentElement.style.setProperty("--assistant-visual-height", `${window.visualViewport.height}px`);
  document.documentElement.style.setProperty("--assistant-visual-top", `${window.visualViewport.offsetTop}px`);
}

function syncAssistantPanel() {
  if (!elements.assistantPanel || !elements.assistantToggleButton) {
    return;
  }

  syncAssistantViewportSize();
  elements.assistantPanel.classList.toggle("is-open", state.assistantOpen);
  document.body.classList.toggle("mobile-assistant-mode", state.mobileAssistantMode && state.assistantOpen);
  elements.assistantPanel.setAttribute("aria-hidden", state.assistantOpen ? "false" : "true");
  elements.assistantToggleButton.setAttribute("aria-expanded", state.assistantOpen ? "true" : "false");
  elements.mobileAssistantRotate?.setAttribute(
    "aria-hidden",
    state.mobileAssistantMode && state.assistantOpen ? "false" : "true"
  );
}

function syncGpsMapSlot() {
  if (!elements.viewport || !elements.gpsMapSlot) {
    return;
  }

  const viewportWidth = elements.viewport.clientWidth;
  const viewportHeight = elements.viewport.clientHeight;
  if (!viewportWidth || !viewportHeight) {
    return;
  }

  const imageScale = Math.max(
    viewportWidth / cockpitAsset.width,
    viewportHeight / cockpitAsset.height
  );
  const renderedImageWidth = cockpitAsset.width * imageScale;
  const renderedImageHeight = cockpitAsset.height * imageScale;
  const imageOffsetX = (viewportWidth - renderedImageWidth) / 2;
  const imageOffsetY = viewportHeight - renderedImageHeight;
  const { gpsScreen } = cockpitAsset;

  elements.gpsMapSlot.style.left = `${imageOffsetX + gpsScreen.x * imageScale}px`;
  elements.gpsMapSlot.style.top = `${imageOffsetY + gpsScreen.y * imageScale}px`;
  elements.gpsMapSlot.style.width = `${gpsScreen.width * imageScale}px`;
  elements.gpsMapSlot.style.height = `${gpsScreen.height * imageScale}px`;

  if (mapState.map && window.google?.maps?.event) {
    google.maps.event.trigger(mapState.map, "resize");
  }
}

function setAssistantOpen(nextValue, options = {}) {
  state.assistantOpen = nextValue;
  if (!nextValue) {
    state.mobileAssistantMode = false;
  }
  syncAssistantPanel();
  if (nextValue) {
    renderAssistantMeta();
    renderAssistantMessages();
    if (options.focus !== false) {
      window.setTimeout(() => {
        elements.assistantInput?.focus();
      }, 40);
    }
  }
}

function showOnboardingIfNeeded() {
  if (!elements.onboardingModal || state.onboardingSeen || !document.body.classList.contains("app-open")) {
    return;
  }

  elements.onboardingModal.hidden = false;
}

function dismissOnboarding() {
  state.onboardingSeen = true;
  window.sessionStorage?.setItem(onboardingStorageKey, "true");
  if (elements.onboardingModal) {
    elements.onboardingModal.hidden = true;
  }
}

async function handleAssistantSubmit(event) {
  event.preventDefault();
  const question = elements.assistantInput?.value.trim();
  if (!question || assistantState.pending) {
    return;
  }

  const stepContext = getAssistantStepContext();
  assistantState.messages.push({ role: "user", text: question });
  elements.assistantInput.value = "";
  assistantState.pending = true;
  renderAssistantMessages();

  try {
    const answer = await requestAssistantApi(question, stepContext);
    assistantState.messages.push({ role: "bot", text: answer.text, sources: answer.sources });
  } catch (error) {
    const fallbackAnswer = buildAssistantAnswer(question, stepContext);
    assistantState.messages.push({
      role: "bot",
      text: `${fallbackAnswer.text}\n\nNota: por ahora te respondí con la base local porque la API externa no estuvo disponible.`,
      sources: fallbackAnswer.sources,
    });
  } finally {
    assistantState.pending = false;
    renderAssistantMessages();
  }
}

function isEditableTarget(target) {
  if (!target) {
    return false;
  }

  const tagName = target.tagName?.toLowerCase();
  return (
    tagName === "input" ||
    tagName === "textarea" ||
    target.isContentEditable
  );
}

function getActiveMapContextRule() {
  const currentStep = routeSteps[state.currentStep];
  const currentLocation = getStepPoint(currentStep) ?? getCurrentPanoramaLocation();
  if (!currentLocation) {
    return null;
  }

  const currentStepId = currentStep.id;
  const currentRouteIndex =
    typeof currentStep.routePointIndex === "number"
      ? currentStep.routePointIndex
      : getNearestRoutePointIndex(currentLocation);
  const currentPano = streetViewState.panorama?.getPano();
  const matchingRules = mapContextRules
    .map((rule) => {
      const ruleRouteIndexes = getContextRuleRouteIndexes(rule);
      return {
        rule,
        ruleRouteIndexes,
        routeIndexDistance:
          currentRouteIndex === null || ruleRouteIndexes.length === 0
            ? Number.POSITIVE_INFINITY
            : Math.min(...ruleRouteIndexes.map((ruleRouteIndex) => Math.abs(currentRouteIndex - ruleRouteIndex))),
        distance: distanceInMeters(currentLocation, rule.trigger),
        panoMatches: Boolean(rule.pano && currentPano && rule.pano === currentPano),
        stepMatches: (rule.stepIds ?? [rule.stepId]).includes(currentStepId),
      };
    })
    .filter((match) => match.distance <= match.rule.activationRadius && match.routeIndexDistance <= 1)
    .sort((a, b) => {
      if (a.panoMatches !== b.panoMatches) {
        return a.panoMatches ? -1 : 1;
      }
      if (a.stepMatches !== b.stepMatches) {
        return a.stepMatches ? -1 : 1;
      }
      if (a.routeIndexDistance !== b.routeIndexDistance) {
        return a.routeIndexDistance - b.routeIndexDistance;
      }
      return a.distance - b.distance;
    });

  return matchingRules[0]?.rule ?? null;
}

function renderMapContextCard() {
  if (!elements.mapContextCard) {
    return;
  }

  const activeRule = getActiveMapContextRule();

  if (!activeRule) {
    elements.mapContextCard.hidden = true;
    return;
  }

  elements.mapContextLabel.textContent = activeRule.label;
  elements.mapContextTitle.textContent = activeRule.title;
  elements.mapContextText.textContent = activeRule.text;
  elements.mapContextCard.hidden = false;
}

function renderViewportMessage(step = routeSteps[state.currentStep]) {
  const activeRule = getActiveMapContextRule();
  if (activeRule) {
    elements.viewportKicker.textContent = activeRule.label;
    elements.viewportTitle.textContent = activeRule.title;
    elements.viewportDescription.textContent = getCompactViewportText(activeRule.text);
    return;
  }

  elements.viewportKicker.textContent = step.kicker;
  elements.viewportTitle.textContent = step.title;
  elements.viewportDescription.textContent = getCompactViewportText(step.description);
}

function getCompactViewportText(text) {
  const cleanText = String(text ?? "").replace(/\s+/g, " ").trim();
  if (cleanText.length <= 112) {
    return cleanText;
  }

  const firstSentence = cleanText.split(/(?<=\.)\s+/)[0];
  if (firstSentence && firstSentence.length <= 112) {
    return firstSentence;
  }

  return `${cleanText.slice(0, 109).trim()}...`;
}

function isAvenueSegment(step) {
  const segment = normalizeAssistantText(step.segment);
  return (
    segment.includes("av ") ||
    segment.includes("avenida") ||
    segment.includes("alcorta") ||
    segment.includes("scalabrini") ||
    segment.includes("casares")
  );
}

function getSuggestedSpeed(step) {
  return isAvenueSegment(step) ? "30-35 km/h max." : "25-30 km/h";
}

function getSessionFeedback(step) {
  if (state.currentStep === routeSteps.length - 1 || step.id === "finish") {
    return `${getTurnSignalSummary()} Puntaje actual: ${state.score}.`;
  }

  return "Cada flecha te lleva a un checkpoint real del recorrido.";
}

function fitMiniMapToRoute(force = false) {
  if (!mapState.map || !window.google?.maps || !Array.isArray(mapRoutePoints) || mapRoutePoints.length === 0) {
    return;
  }

  if (mapState.fittedRoute && !force) {
    return;
  }

  const bounds = new google.maps.LatLngBounds();
  mapRoutePoints.forEach((point) => bounds.extend(point));
  const isMobile = isMobilePracticeLayout();
  const isFullscreenMobileMap =
    isMobile && elements.practiceDashboard?.classList.contains("mobile-view-map");
  const padding = isMobile
    ? isFullscreenMobileMap
      ? { top: 60, right: 42, bottom: 42, left: 42 }
      : { top: 8, right: 10, bottom: 8, left: 10 }
    : { top: 28, right: 58, bottom: 32, left: 28 };

  mapState.map.fitBounds(bounds, {
    top: padding.top,
    right: padding.right,
    bottom: padding.bottom,
    left: padding.left,
  });
  mapState.fittedRoute = true;
}

function renderMap() {
  if (!mapState.map || !window.google?.maps) {
    return;
  }

  const routePath = mapRoutePoints;
  const completedPath = mapRoutePoints.slice(0, getCompletedPolylineIndex());

  if (!mapState.routeLine) {
    mapState.routeLine = new google.maps.Polyline({
      path: routePath,
      geodesic: false,
      strokeColor: "#7f8c96",
      strokeOpacity: 0.9,
      strokeWeight: 7,
      zIndex: 1,
      map: mapState.map,
    });
  } else {
    mapState.routeLine.setPath(routePath);
  }

  if (!mapState.completedLine) {
    mapState.completedLine = new google.maps.Polyline({
      path: completedPath,
      geodesic: false,
      strokeColor: "#dd5f33",
      strokeOpacity: 0.95,
      strokeWeight: 6,
      zIndex: 2,
      map: mapState.map,
    });
  } else {
    mapState.completedLine.setPath(completedPath);
  }

  const currentPosition = getCurrentPanoramaLocation() ?? getStepPoint(routeSteps[state.currentStep]);
  const nextPosition = getStepPoint(routeSteps[state.currentStep]);

  if (!mapState.currentMarker) {
    mapState.currentMarker = new google.maps.Marker({
      position: currentPosition,
      map: mapState.map,
      title: "Tu posición",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#0d6b73",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
    });
  } else {
    mapState.currentMarker.setPosition(currentPosition);
  }

  if (!mapState.nextMarker) {
    mapState.nextMarker = new google.maps.Marker({
      position: nextPosition,
      map: mapState.map,
      title: "Próximo hito",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 7,
        fillColor: "#dd5f33",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
    });
  } else {
    mapState.nextMarker.setPosition(nextPosition);
  }

  fitMiniMapToRoute();
}

function getCompletedPolylineIndex() {
  const completedStep = routeSteps[Math.max(0, state.currentStep - 1)];
  const completedStepId = completedStep?.id ?? "start";
  const routeProgressIndex =
    completedStep?.routeProgressIndex ??
    (typeof completedStep?.routePointIndex === "number"
      ? Math.floor(completedStep.routePointIndex) + 1
      : progressIndexByStep[completedStepId]);
  return Math.max(1, routeProgressIndex ?? 1);
}

function normalizeHeading(value) {
  return ((value % 360) + 360) % 360;
}

function smallestHeadingDifference(a, b) {
  const diff = Math.abs(normalizeHeading(a) - normalizeHeading(b));
  return Math.min(diff, 360 - diff);
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function distanceInMeters(from, to) {
  const earthRadius = 6371000;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function setViewerStatus(mode, message) {
  elements.viewerModeBadge.className = "viewer-badge";
  if (mode === "live") {
    elements.viewerModeBadge.classList.add("live");
    elements.viewerModeBadge.textContent = "Street View activo";
  } else if (mode === "error") {
    elements.viewerModeBadge.classList.add("error");
    elements.viewerModeBadge.textContent = "Sin Street View";
  } else if (mode === "loading") {
    elements.viewerModeBadge.textContent = "Cargando visor";
  } else {
    elements.viewerModeBadge.textContent = "Modo demo";
  }
  elements.viewerStatusText.textContent = message;
}

function setViewportLive(isLive) {
  elements.viewport.classList.toggle("street-view-live", isLive);
  elements.streetViewCanvas.setAttribute("aria-hidden", isLive ? "false" : "true");
}

function getCurrentPanoramaLocation() {
  const position = streetViewState.panorama?.getPosition();
  if (!position) {
    return null;
  }
  return { lat: position.lat(), lng: position.lng() };
}

async function geocodeStep(step) {
  const cached = streetViewState.geocodeCache.get(step.id);
  if (cached) {
    return cached;
  }

  if (!streetViewState.geocoder || !step.address) {
    return null;
  }

  return new Promise((resolve, reject) => {
    streetViewState.geocoder.geocode({ address: step.address }, (results, status) => {
      if (status === "OK" && results?.[0]?.geometry?.location) {
        const resolved = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
          formattedAddress: results[0].formatted_address,
        };
        streetViewState.geocodeCache.set(step.id, resolved);
        resolve(resolved);
        return;
      }
      reject(new Error(`Geocoding fallo para ${step.address}: ${status}`));
    });
  });
}

function getDistanceToCurrentCheckpoint() {
  const step = routeSteps[state.currentStep];
  const currentLocation = getCurrentPanoramaLocation();
  const checkpoint = step.trigger ?? streetViewState.geocodeCache.get(step.id);

  if (!currentLocation || !checkpoint) {
    return null;
  }

  return distanceInMeters(currentLocation, checkpoint);
}

function hasPassedCurrentCheckpoint() {
  const step = routeSteps[state.currentStep];
  const currentLocation = getCurrentPanoramaLocation();
  const checkpoint = step.trigger ?? streetViewState.geocodeCache.get(step.id);

  if (!currentLocation || !checkpoint) {
    return false;
  }

  const currentDistance = distanceInMeters(currentLocation, checkpoint);
  const previousDistance = state.lastDistanceToCheckpoint;
  state.lastDistanceToCheckpoint = currentDistance;

  if (state.currentStep === 0) {
    return currentDistance < 34;
  }

  const gotCloseEnough = currentDistance < 28 || state.reachedCurrentCheckpoint;
  if (gotCloseEnough) {
    state.reachedCurrentCheckpoint = true;
  }

  return Boolean(
    state.reachedCurrentCheckpoint &&
      previousDistance !== null &&
      currentDistance > previousDistance + 4 &&
      currentDistance > 24
  );
}

function renderRouteCue() {
  const step = routeSteps[state.currentStep];
  const nearTurn = step.correctAction !== "straight";
  const arrowClass =
    step.correctAction === "left"
      ? "route-cue-arrow turn-left"
      : step.correctAction === "right"
        ? "route-cue-arrow turn-right"
        : "route-cue-arrow";

  elements.routeCue.classList.toggle("near-turn", nearTurn);
  elements.routeCueArrow.className = arrowClass;
  elements.routeCueArrow.textContent = "↑";
  elements.routeCueTitle.textContent = getCheckpointInstruction(step);
  elements.routeCueText.textContent =
    step.correctAction === "straight"
      ? step.cue.farText || step.prompt
      : step.cue.nearText || step.prompt;
  elements.turnBadge.classList.toggle("visible", step.correctAction !== "straight");
  elements.turnBadge.textContent =
    step.correctAction === "left"
      ? "GIRO A LA IZQUIERDA"
      : step.correctAction === "right"
        ? "GIRO A LA DERECHA"
        : "SEGUI RECTO";
}

function handleDecision(action) {
  const step = routeSteps[state.currentStep];
  const alreadyAnswered = state.answeredStepIds.has(step.id);
  const isCorrect = action === step.correctAction;

  clearDecisionStyles();
  elements.decisionButtons.forEach((button) => {
    if (button.dataset.action === action) {
      button.classList.add(isCorrect ? "correct" : "wrong");
    }
    if (button.dataset.action === step.correctAction) {
      button.classList.add("correct");
    }
  });

  if (!alreadyAnswered && !isCorrect) {
    state.score = Math.max(0, state.score - 12);
  }

  state.answeredStepIds.add(step.id);
  elements.scoreValue.textContent = String(state.score);
  elements.decisionFeedback.textContent = isCorrect
    ? "La instruccion coincide con este hito del recorrido."
    : "Ese no es el giro correcto para este hito.";
}

function formatCapturedView(step, payload) {
  const activeRule = getActiveMapContextRule();
  const activeRuleLine = activeRule ? `,\n  alertRuleId: "${activeRule.id}"` : "";

  return `{
  id: "${step.id}",
  label: "${step.kicker} · ${step.title}"${activeRuleLine},
  streetView: {
    lat: ${payload.lat},
    lng: ${payload.lng},
    heading: ${payload.heading},
    pitch: ${payload.pitch},
    zoom: ${payload.zoom},
    pano: "${payload.pano}"
  }
}`;
}

async function captureCurrentView() {
  const step = routeSteps[state.currentStep];
  if (!streetViewState.panorama || !streetViewState.loaded) {
    elements.captureOutput.textContent = "Street View no esta activo.";
    return;
  }

  const position = streetViewState.panorama.getPosition();
  const pov = streetViewState.panorama.getPov();
  const zoom = streetViewState.panorama.getZoom();
  const pano = streetViewState.panorama.getPano();

  if (!position || !pov || !pano) {
    elements.captureOutput.textContent = "No pude leer la vista actual.";
    return;
  }

  const output = formatCapturedView(step, {
    lat: Number(position.lat().toFixed(6)),
    lng: Number(position.lng().toFixed(6)),
    heading: Math.round(pov.heading),
    pitch: Math.round(pov.pitch),
    zoom,
    pano,
  });
  elements.captureOutput.textContent = output;
  try {
    await navigator.clipboard.writeText(output);
  } catch (error) {
    // Nada.
  }
}

function loadGoogleMapsApi(apiKey) {
  if (window.google?.maps) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const callbackName = "__codexStreetViewReady";
    window[callbackName] = () => {
      delete window[callbackName];
      resolve();
    };

    const script = document.createElement("script");
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}` +
      `&v=weekly&loading=async&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      delete window[callbackName];
      reject(new Error("No se pudo cargar Google Maps JavaScript API."));
    };
    document.head.append(script);
  });
}

function getPanoramaForLocation(location) {
  return new Promise((resolve, reject) => {
    streetViewState.service.getPanorama(
      {
        location,
        radius: 30,
        source: google.maps.StreetViewSource.OUTDOOR,
      },
      (data, status) => {
        if (status === "OK" && data?.location?.pano) {
          resolve(data);
          return;
        }
        reject(new Error(`Street View no encontro panorama cercano: ${status}`));
      }
    );
  });
}

function getDesiredHeadingForAction(action) {
  const currentHeading = streetViewState.panorama?.getPov()?.heading ?? 0;
  if (action === "left") {
    return normalizeHeading(currentHeading - 90);
  }
  if (action === "right") {
    return normalizeHeading(currentHeading + 90);
  }
  return normalizeHeading(currentHeading);
}

function canMoveNow() {
  return Date.now() >= state.moveCooldownUntil;
}

function registerMoveCooldown() {
  state.moveCooldownUntil = Date.now() + 520;
}

function pickLinkForHeading(targetHeading) {
  const links = streetViewState.panorama?.getLinks() ?? [];
  const ranked = links
    .map((link) => ({
      link,
      diff: smallestHeadingDifference(link.heading ?? targetHeading, targetHeading),
    }))
    .sort((left, right) => left.diff - right.diff);
  return ranked[0]?.link ?? null;
}

function stepPanorama(action = "forward") {
  if (!streetViewState.panorama || !streetViewState.loaded) {
    return;
  }

  if (!canMoveNow()) {
    return;
  }

  const link = pickLinkForHeading(getDesiredHeadingForAction(action));
  if (!link?.pano) {
    setViewerStatus("error", "No encontre una salida valida desde este panorama.");
    return;
  }

  const pov = streetViewState.panorama.getPov();
  streetViewState.panorama.setPano(link.pano);
  streetViewState.panorama.setPov({
    heading: link.heading ?? pov?.heading ?? 0,
    pitch: pov?.pitch ?? 0,
  });
  registerMoveCooldown();
}

function holdForwardStart() {
  if (state.driveHoldIntervalId) {
    return;
  }

  stepPanorama("forward");
  state.driveHoldIntervalId = window.setInterval(() => {
    stepPanorama("forward");
  }, 700);
}

function holdForwardStop() {
  if (!state.driveHoldIntervalId) {
    return;
  }

  window.clearInterval(state.driveHoldIntervalId);
  state.driveHoldIntervalId = null;
}

function maybeAdvanceCheckpoint() {
  renderRouteCue();
  renderMap();
  renderViewportMessage();
  renderMapContextCard();

  if (!streetViewState.panorama || state.currentStep >= routeSteps.length - 1) {
    return;
  }

  const step = routeSteps[state.currentStep];
  if (hasPassedCurrentCheckpoint()) {
    state.reachedCurrentCheckpoint = false;
    state.lastDistanceToCheckpoint = null;
    if (state.currentStep < routeSteps.length - 1) {
      goToStep(state.currentStep + 1, { reposition: false });
      setViewerStatus("live", `Pasaste el hito ${step.segment}. Ahora sigue la instrucción siguiente.`);
    }
  }
}

function applyPanorama(step, panoData) {
  const panorama = streetViewState.panorama;
  if (!panorama) {
    return;
  }

  const resolvedPano = panoData?.location?.pano ?? step.streetView.pano;
  panorama.setVisible(true);
  if (resolvedPano) {
    panorama.setPano(resolvedPano);
  }
  panorama.setPov({
    heading: step.streetView.heading,
    pitch: getResponsiveStreetViewPitch(step),
  });
  panorama.setZoom(step.streetView.zoom ?? 1);
  setViewportLive(true);
  renderRouteCue();
  renderMap();
  renderViewportMessage(step);
  renderMapContextCard();
}

async function updateStreetViewForCurrentStep() {
  if (!streetViewState.loaded || !streetViewState.service || !streetViewState.panorama) {
    return;
  }

  const step = routeSteps[state.currentStep];

  try {
    const geocoded = step.trigger ? null : await geocodeStep(step);
    const targetLocation = step.trigger
      ? { lat: step.trigger.lat, lng: step.trigger.lng }
      : geocoded
        ? { lat: geocoded.lat, lng: geocoded.lng }
        : { lat: step.streetView.lat, lng: step.streetView.lng };
    const data = await getPanoramaForLocation(targetLocation);
    applyPanorama(step, data);
    setViewerStatus(
      "live",
      `Checkpoint ${state.currentStep + 1} de ${routeSteps.length}: ${step.segment}. Usá ↑/→ para avanzar y ↓/← para volver.`
    );
  } catch (error) {
    try {
      const fallbackData = await getPanoramaForLocation({
        lat: step.streetView.lat,
        lng: step.streetView.lng,
      });
      applyPanorama(step, fallbackData);
      setViewerStatus("error", `Checkpoint aproximado en ${step.segment}. Revisá si la cámara quedó bien orientada.`);
    } catch (fallbackError) {
      setViewportLive(false);
      setViewerStatus("error", `No encontre panorama util para ${step.segment}.`);
    }
  }
}

function bindPanoramaGameplay() {
  if (!streetViewState.panorama) {
    return;
  }

  streetViewState.panorama.addListener("pov_changed", renderRouteCue);
}

async function initStreetView() {
  const apiKey = config.googleMapsApiKey?.trim();
  if (!apiKey) {
    setViewerStatus("demo", "Street View no esta configurado todavia.");
    return;
  }

  if (streetViewState.loaded || streetViewState.loading) {
    return;
  }

  streetViewState.loading = true;
  setViewerStatus("loading", "Cargando Google Maps y los hitos del circuito...");

  try {
    await loadGoogleMapsApi(apiKey);
    streetViewState.service = new google.maps.StreetViewService();
    streetViewState.geocoder = new google.maps.Geocoder();
    streetViewState.panorama = new google.maps.StreetViewPanorama(elements.streetViewCanvas, {
      motionTracking: false,
      addressControl: false,
      showRoadLabels: true,
      fullscreenControl: false,
      linksControl: false,
      panControl: false,
      clickToGo: false,
      scrollwheel: false,
      enableCloseButton: false,
      zoomControl: true,
      visible: true,
    });

    streetViewState.loaded = true;
    streetViewState.supported = true;
    initMiniMap();
    setViewportLive(true);
    bindPanoramaGameplay();
    await updateStreetViewForCurrentStep();
  } catch (error) {
    streetViewState.failed = true;
    setViewportLive(false);
    setViewerStatus("error", "No se pudo inicializar Street View.");
  } finally {
    streetViewState.loading = false;
  }
}

function initMiniMap() {
  if (!window.google?.maps || mapState.map) {
    return;
  }

  mapState.map = new google.maps.Map(elements.routeMapCanvas, {
    center: activeCircuit.mapCenter ?? mapRoutePoints[0] ?? { lat: -34.5762, lng: -58.4072 },
    zoom: activeCircuit.mapZoom ?? 15,
    mapTypeId: "roadmap",
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
    clickableIcons: false,
    gestureHandling: "greedy",
  });

  renderMap();
  window.setTimeout(() => fitMiniMapToRoute(true), 80);
}

function render() {
  const step = routeSteps[state.currentStep];
  const progress = ((state.currentStep + 1) / routeSteps.length) * 100;

  elements.viewport.classList.remove("checkpoint-pulse");
  window.requestAnimationFrame(() => {
    elements.viewport.classList.add("checkpoint-pulse");
  });
  elements.mapPanelTitle.textContent = activeCircuit.title;
  elements.calibrationStepLabel.textContent = step.id;
  elements.segmentName.textContent = step.segment;
  elements.progressValue.textContent = `${state.currentStep + 1} / ${routeSteps.length}`;
  elements.scoreValue.textContent = String(state.score);
  elements.progressLabel.textContent = step.progressLabel;
  elements.progressFill.style.width = `${progress}%`;
  elements.decisionPrompt.textContent = step.prompt;
  elements.decisionFeedback.textContent = getSessionFeedback(step);
  renderViewportMessage(step);
  elements.speedHint.textContent = getSuggestedSpeed(step);
  elements.microTip.textContent = buildMicroTip(step);

  syncGpsMapSlot();
  renderSignals(step);
  renderContextualMessages();
  renderCircuitOptions();
  renderMap();
  renderRouteCue();
  renderMapContextCard();
  renderAssistantMeta();
}

elements.startStudyMode.addEventListener("click", () => setMode("study"));
elements.startExamMode.addEventListener("click", () => setMode("exam"));
elements.studyModeButton.addEventListener("click", () => setMode("study"));
elements.examModeButton.addEventListener("click", () => setMode("exam"));
elements.nextStepButton.addEventListener("click", nextStep);
elements.backStepButton.addEventListener("click", previousStep);
elements.captureViewButton.addEventListener("click", captureCurrentView);

elements.decisionButtons.forEach((button) => {
  button.addEventListener("click", () => handleDecision(button.dataset.action));
});

function handleCheckpointKeydown(event) {
  if (isEditableTarget(event.target)) {
    return;
  }

  const key = event.key.toLowerCase();
  const isLeftSignalKey = event.key === "ArrowLeft";
  const isRightSignalKey = event.key === "ArrowRight";
  const isHazardKey = key === "b" || event.code === "KeyB";
  const isSunglassesKey = key === "g" || event.code === "KeyG";
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(event.key) || isHazardKey || isSunglassesKey) {
    event.preventDefault();
    event.stopPropagation();
  } else {
    return;
  }

  if (event.repeat) {
    return;
  }

  if (isLeftSignalKey) {
    setTurnSignal("left");
    return;
  }

  if (isRightSignalKey) {
    setTurnSignal("right");
    return;
  }

  if (isHazardKey) {
    setTurnSignal("hazard");
    return;
  }

  if (isSunglassesKey) {
    toggleSunglasses();
    return;
  }

  if (event.key === "ArrowDown") {
    moveCheckpoint(-1);
  }

  if (event.key === "ArrowUp") {
    moveCheckpoint(1);
  }

  if (event.key === " ") {
    moveCheckpoint(1);
  }
}

document.addEventListener("keydown", handleCheckpointKeydown, true);
elements.viewport?.addEventListener("pointerdown", handleViewportPointerDown, true);
elements.viewport?.addEventListener("pointerup", handleViewportPointerUp, true);

window.addEventListener("keyup", (event) => {
  if (isEditableTarget(event.target)) {
    return;
  }

  if (event.key === "ArrowUp") {
    holdForwardStop();
  }
});

elements.turnLeftButton.addEventListener("click", () => moveCheckpoint(-1));
elements.turnRightButton.addEventListener("click", () => moveCheckpoint(1));
elements.driveForwardButton?.addEventListener("click", () => moveCheckpoint(1));
elements.assistantToggleButton?.addEventListener("click", () => {
  setAssistantOpen(!state.assistantOpen);
});
elements.mobileAssistantBubble?.addEventListener("click", () => {
  state.mobileAssistantMode = true;
  setAssistantOpen(true, { focus: false });
});
elements.assistantCloseButton?.addEventListener("click", () => {
  setAssistantOpen(false);
});
elements.mobileAssistantRotateClose?.addEventListener("click", () => {
  setAssistantOpen(false);
});
elements.mobileExperienceViewButton?.addEventListener("click", () => {
  setMobilePracticeView("experience");
});
elements.mobileMapViewButton?.addEventListener("click", () => {
  setMobilePracticeView("map");
});
elements.assistantForm?.addEventListener("submit", handleAssistantSubmit);
elements.onboardingOkButton?.addEventListener("click", dismissOnboarding);
window.addEventListener("resize", () => {
  syncAssistantViewportSize();
  syncMobilePracticeView();
  syncGpsMapSlot();
});
window.visualViewport?.addEventListener("resize", syncAssistantViewportSize);
window.visualViewport?.addEventListener("scroll", syncAssistantViewportSize);
window.addEventListener("b2c:app-mode-change", (event) => {
  syncGpsMapSlot();
  if (event.detail?.mode === "practice") {
    window.setTimeout(showOnboardingIfNeeded, 80);
  }
});

if ("ResizeObserver" in window && elements.viewport) {
  const gpsSlotObserver = new ResizeObserver(syncGpsMapSlot);
  gpsSlotObserver.observe(elements.viewport);
}

renderAssistantMessages();
syncAssistantPanel();
syncMobilePracticeView();
syncTurnSignalIndicators();
syncGpsMapSlot();
window.setTimeout(syncGpsMapSlot, 80);
window.setTimeout(syncGpsMapSlot, 360);
render();
initStreetView();
window.setTimeout(showOnboardingIfNeeded, 120);
