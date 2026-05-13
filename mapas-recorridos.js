const routeAtlasCircuits = (window.DRIVING_CIRCUITS ?? []).filter(
  (circuit) => Array.isArray(circuit.mapRoutePoints) && circuit.mapRoutePoints.length > 1
);

const routeAtlasState = {
  map: null,
  boundsByCircuit: new Map(),
  linesByCircuit: new Map(),
  activeCircuitId: null,
};

const routeAtlasColors = [
  "#dd5f33",
  "#0d6b73",
  "#1f80ff",
  "#c15fba",
  "#6d7b33",
  "#ffb000",
  "#6c5ce7",
  "#11845b",
];

const atlasElements = {
  map: document.querySelector("#routeAtlasMap"),
  list: document.querySelector("#routeAtlasList"),
  count: document.querySelector("#routeAtlasCount"),
};

function getRouteAtlasColor(index) {
  return routeAtlasColors[index % routeAtlasColors.length];
}

function createCircuitBounds(points) {
  const bounds = new google.maps.LatLngBounds();
  points.forEach((point) => bounds.extend(point));
  return bounds;
}

function fitRouteAtlasCircuit(circuitId) {
  const bounds = routeAtlasState.boundsByCircuit.get(circuitId);
  if (!routeAtlasState.map || !bounds) {
    return;
  }

  routeAtlasState.activeCircuitId = circuitId;
  routeAtlasState.map.fitBounds(bounds, {
    top: 72,
    right: 72,
    bottom: 72,
    left: 72,
  });

  routeAtlasState.linesByCircuit.forEach((line, id) => {
    line.setOptions({
      strokeOpacity: id === circuitId ? 0.98 : 0.34,
      strokeWeight: id === circuitId ? 8 : 4,
      zIndex: id === circuitId ? 5 : 1,
    });
  });

  atlasElements.list?.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.circuitId === circuitId);
  });
}

function fitRouteAtlasAll() {
  if (!routeAtlasState.map || routeAtlasCircuits.length === 0) {
    return;
  }

  const allBounds = new google.maps.LatLngBounds();
  routeAtlasCircuits.forEach((circuit) => {
    circuit.mapRoutePoints.forEach((point) => allBounds.extend(point));
  });
  routeAtlasState.map.fitBounds(allBounds, {
    top: 84,
    right: 84,
    bottom: 84,
    left: 84,
  });
}

function renderRouteAtlasList() {
  if (!atlasElements.list || !atlasElements.count) {
    return;
  }

  atlasElements.count.textContent = `${routeAtlasCircuits.length} mapas`;
  atlasElements.list.replaceChildren();

  const allButton = document.createElement("button");
  allButton.className = "route-atlas-button active";
  allButton.type = "button";
  allButton.textContent = "Ver todos los recorridos";
  allButton.addEventListener("click", () => {
    routeAtlasState.activeCircuitId = null;
    atlasElements.list?.querySelectorAll("button").forEach((button) => button.classList.remove("active"));
    allButton.classList.add("active");
    routeAtlasState.linesByCircuit.forEach((line) => {
      line.setOptions({ strokeOpacity: 0.78, strokeWeight: 5, zIndex: 2 });
    });
    fitRouteAtlasAll();
  });
  atlasElements.list.append(allButton);

  routeAtlasCircuits.forEach((circuit, index) => {
    const button = document.createElement("button");
    button.className = "route-atlas-button";
    button.type = "button";
    button.dataset.circuitId = circuit.id;
    button.innerHTML = `
      <span style="--route-color: ${getRouteAtlasColor(index)}"></span>
      <strong>${circuit.title}</strong>
    `;
    button.addEventListener("click", () => fitRouteAtlasCircuit(circuit.id));
    atlasElements.list.append(button);
  });
}

function initRouteAtlasMap() {
  if (!atlasElements.map || routeAtlasCircuits.length === 0) {
    return;
  }

  routeAtlasState.map = new google.maps.Map(atlasElements.map, {
    center: { lat: -34.6037, lng: -58.3816 },
    zoom: 12,
    mapTypeId: "roadmap",
    streetViewControl: false,
    fullscreenControl: true,
    mapTypeControl: false,
    clickableIcons: false,
  });

  routeAtlasCircuits.forEach((circuit, index) => {
    const color = getRouteAtlasColor(index);
    const bounds = createCircuitBounds(circuit.mapRoutePoints);
    const line = new google.maps.Polyline({
      path: circuit.mapRoutePoints,
      geodesic: false,
      strokeColor: color,
      strokeOpacity: 0.78,
      strokeWeight: 5,
      zIndex: 2,
      map: routeAtlasState.map,
    });

    routeAtlasState.boundsByCircuit.set(circuit.id, bounds);
    routeAtlasState.linesByCircuit.set(circuit.id, line);

    new google.maps.Marker({
      position: circuit.mapRoutePoints[0],
      map: routeAtlasState.map,
      title: circuit.title,
      label: {
        text: String(index + 1),
        color: "#ffffff",
        fontWeight: "800",
      },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: color,
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 3,
      },
    });
  });

  fitRouteAtlasAll();
}

function loadRouteAtlasGoogleMaps() {
  const apiKey = window.APP_CONFIG?.googleMapsApiKey?.trim();
  if (!apiKey || !atlasElements.map) {
    atlasElements.map.textContent = "No se pudo cargar Google Maps.";
    return;
  }

  window.initRouteAtlasMap = initRouteAtlasMap;
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&callback=initRouteAtlasMap`;
  script.async = true;
  script.defer = true;
  script.onerror = () => {
    atlasElements.map.textContent = "No se pudo cargar el mapa.";
  };
  document.head.append(script);
}

renderRouteAtlasList();
loadRouteAtlasGoogleMaps();
