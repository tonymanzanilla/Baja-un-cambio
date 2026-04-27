const sceneRoot = document.getElementById("entryScene");
const fallbackImage = document.getElementById("entrySceneFallback");
const statusNode = document.getElementById("entrySceneStatus");
const modelViewer = document.getElementById("entrySceneModel");

if (sceneRoot && statusNode) {
  statusNode.textContent = "3D iniciando...";
}

if (modelViewer) {
  const setStatus = (text) => {
    if (statusNode) {
      statusNode.textContent = text;
    }
  };

  const markLoaded = () => {
    sceneRoot?.classList.add("is-loaded");
    fallbackImage?.setAttribute("aria-hidden", "true");
    setStatus("3D listo");
  };

  setStatus("3D cargando...");

  modelViewer.addEventListener("load", markLoaded, { once: true });
  modelViewer.addEventListener("error", (event) => {
    console.error("No pude cargar el model-viewer del home:", event);
    setStatus("Error 3D");
  });

  window.setTimeout(() => {
    if (!sceneRoot?.classList.contains("is-loaded")) {
      setStatus("3D cargando...");
    }
  }, 1200);
}
