// Plantilla para sumar un circuito nuevo.
// Copiar este archivo, renombrarlo y cargarlo en index.html antes de script.js.
// El motor espera la misma forma de datos que aca-libertador.js.

(() => {
const routeSteps = [
  {
    id: "start",
    segment: "Calle inicial",
    title: "Salida",
    kicker: "Punto de partida",
    description: "Descripcion breve del punto de salida.",
    progressLabel: "Salida",
    prompt: "Instruccion para el usuario.",
    correctAction: "straight",
    speedHint: "10 km/h",
    address: "Direccion o referencia",
    streetView: {
      lat: 0,
      lng: 0,
      heading: 0,
      pitch: 0,
      zoom: 1,
    },
    cue: {
      farTitle: "Segui derecho",
      farText: "Instruccion mientras esta lejos del hito.",
      nearTitle: "Llegaste al hito",
      nearText: "Instruccion cuando esta cerca del hito.",
    },
    alerts: [],
  },
];

const availableCircuits = [
  {
    id: "nuevo-circuito",
    title: "Nuevo circuito",
    subtitle: "Pendiente de calibracion.",
    active: true,
  },
];

const contextualMessages = [];

const mapContextRules = [];

const mapRoutePoints = [
  { lat: 0, lng: 0 },
];

const progressIndexByStep = {
  start: 1,
};

window.DRIVING_CIRCUITS = window.DRIVING_CIRCUITS ?? [];
window.DRIVING_CIRCUITS.push({
  id: "nuevo-circuito",
  title: "Nuevo circuito",
  subtitle: "Pendiente de calibracion.",
  heroTitle: "Nuevo circuito",
  routeSummary: "Calle inicial → Calle final",
  routeSteps,
  availableCircuits,
  contextualMessages,
  mapContextRules,
  mapRoutePoints,
  progressIndexByStep,
});
})();
