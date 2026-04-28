const circuits = window.DRIVING_CIRCUITS ?? [];
const currentUrlParams = new URLSearchParams(window.location.search);
const requestedCircuitId = currentUrlParams.get("circuit");
const activeCircuit =
  circuits.find((circuit) => circuit.id === requestedCircuitId) ??
  circuits.find((circuit) => circuit.id === "aca-libertador-a") ??
  circuits[0];

if (!activeCircuit) {
  throw new Error("No hay circuitos cargados. Revisá los scripts de /circuits.");
}

const routeSteps = activeCircuit.routeSteps;
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
const mapRoutePoints = activeCircuit.mapRoutePoints;
const progressIndexByStep = activeCircuit.progressIndexByStep;

const config = window.APP_CONFIG ?? {};

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
  contextualList: document.querySelector("#contextualList"),
  mapContextCard: document.querySelector("#mapContextCard"),
  mapContextLabel: document.querySelector("#mapContextLabel"),
  mapContextTitle: document.querySelector("#mapContextTitle"),
  mapContextText: document.querySelector("#mapContextText"),
  heroRouteSummary: document.querySelector("#heroRouteSummary"),
  heroRouteBlurb: document.querySelector("#heroRouteBlurb"),
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
  goToStep(state.currentStep + 1);
}

function previousStep() {
  goToStep(state.currentStep - 1);
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

function getActiveMapContextRule() {
  const currentLocation = getCurrentPanoramaLocation();
  if (!currentLocation) {
    return null;
  }

  const currentStepId = routeSteps[state.currentStep].id;
  const currentPano = streetViewState.panorama?.getPano();
  const matchingRules = mapContextRules
    .filter((rule) => {
      const eligibleStepIds = rule.stepIds ?? [rule.stepId];
      return eligibleStepIds.includes(currentStepId);
    })
    .map((rule) => ({
      rule,
      distance: distanceInMeters(currentLocation, rule.trigger),
      panoMatches: Boolean(rule.pano && currentPano && rule.pano === currentPano),
    }))
    .filter((match) => match.distance <= match.rule.activationRadius)
    .sort((a, b) => {
      if (a.panoMatches !== b.panoMatches) {
        return a.panoMatches ? -1 : 1;
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
}

function getCompletedPolylineIndex() {
  const completedStep = routeSteps[Math.max(0, state.currentStep - 1)];
  const completedStepId = completedStep?.id ?? "start";
  return Math.max(1, progressIndexByStep[completedStepId] ?? 1);
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
  const distance = getDistanceToCurrentCheckpoint();
  const nearTurn = typeof distance === "number" && distance < 42;
  const arrowClass =
    step.correctAction === "left"
      ? "route-cue-arrow turn-left"
      : step.correctAction === "right"
        ? "route-cue-arrow turn-right"
        : "route-cue-arrow";

  elements.routeCue.classList.toggle("near-turn", nearTurn);
  elements.routeCueArrow.className = arrowClass;
  elements.routeCueArrow.textContent = "↑";
  elements.routeCueTitle.textContent = nearTurn ? step.cue.nearTitle : step.cue.farTitle;
  elements.routeCueText.textContent = nearTurn ? step.cue.nearText : step.cue.farText;
  elements.turnBadge.classList.toggle("visible", nearTurn && step.correctAction !== "straight");
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
    pitch: step.streetView.pitch,
  });
  panorama.setZoom(step.streetView.zoom ?? 1);
  setViewportLive(true);
  renderRouteCue();
  renderMap();
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
      `Street View activo en ${step.segment}. Hito resuelto desde ${
        step.trigger
          ? `${step.trigger.lat.toFixed(6)}, ${step.trigger.lng.toFixed(6)}`
          : geocoded?.formattedAddress ?? step.address
      }.`
    );
  } catch (error) {
    try {
      const fallbackData = await getPanoramaForLocation({
        lat: step.streetView.lat,
        lng: step.streetView.lng,
      });
      applyPanorama(step, fallbackData);
      setViewerStatus("error", `Use una aproximacion para ${step.segment}.`);
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

  streetViewState.panorama.addListener("position_changed", maybeAdvanceCheckpoint);
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
      linksControl: true,
      panControl: true,
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
    zoom: activeCircuit.mapZoom ?? 17,
    mapTypeId: "roadmap",
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
    clickableIcons: false,
    gestureHandling: "greedy",
  });

  renderMap();
}

function render() {
  const step = routeSteps[state.currentStep];
  const progress = ((state.currentStep + 1) / routeSteps.length) * 100;

  elements.mapPanelTitle.textContent = activeCircuit.title;
  elements.calibrationStepLabel.textContent = step.id;
  elements.segmentName.textContent = step.segment;
  elements.progressValue.textContent = `${state.currentStep + 1} / ${routeSteps.length}`;
  elements.scoreValue.textContent = String(state.score);
  elements.progressLabel.textContent = step.progressLabel;
  elements.progressFill.style.width = `${progress}%`;
  elements.decisionPrompt.textContent = step.prompt;
  elements.decisionFeedback.textContent = "Cada mensaje ahora corresponde a un hito real de giro del circuito.";
  elements.viewportKicker.textContent = step.kicker;
  elements.viewportTitle.textContent = step.title;
  elements.viewportDescription.textContent = step.description;
  elements.speedHint.textContent = step.speedHint;
  elements.microTip.textContent = buildMicroTip(step);

  renderSignals(step);
  renderContextualMessages();
  renderCircuitOptions();
  renderMap();
  renderRouteCue();
  renderMapContextCard();
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

window.addEventListener("keydown", (event) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(event.key)) {
    event.preventDefault();
  }

  if (event.key === "ArrowLeft") {
    stepPanorama("left");
  }

  if (event.key === "ArrowRight") {
    stepPanorama("right");
  }

  if (event.key === "ArrowUp") {
    if (!event.repeat) {
      holdForwardStart();
    }
  }

  if (event.key === " ") {
    nextStep();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowUp") {
    holdForwardStop();
  }
});

elements.turnLeftButton.addEventListener("click", () => stepPanorama("left"));
elements.turnRightButton.addEventListener("click", () => stepPanorama("right"));
elements.driveForwardButton.addEventListener("click", () => stepPanorama("forward"));
elements.driveForwardButton.addEventListener("pointerdown", holdForwardStart);
elements.driveForwardButton.addEventListener("pointerup", holdForwardStop);
elements.driveForwardButton.addEventListener("pointerleave", holdForwardStop);
elements.driveForwardButton.addEventListener("pointercancel", holdForwardStop);

render();
initStreetView();
