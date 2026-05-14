(() => {
  const body = document.body;
  const opening = document.querySelector(".proposal-opening");
  const blocks = Array.from(document.querySelectorAll(".proposal-card-flow > .proposal-block"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!body || !opening || !blocks.length || reducedMotion.matches) {
    return;
  }

  body.classList.add("proposal-motion-ready");

  let targetY = window.scrollY;
  let currentY = targetY;
  let previousY = targetY;
  let velocity = 0;
  let ticking = false;
  let viewportH = window.innerHeight;
  let viewportW = window.innerWidth;
  let blockMetrics = [];
  let snapMetrics = [];
  let snapLock = false;
  let snapTimer = 0;
  let snapAnimationFrame = 0;
  let touchStartY = 0;
  let touchCurrentY = 0;
  let touchMoved = false;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);
  const easeOutQuint = (value) => 1 - Math.pow(1 - value, 5);
  const isSmallViewport = () => window.matchMedia("(max-width: 720px)").matches;

  const setRootVar = (name, value) => {
    body.style.setProperty(name, value);
  };

  const measure = () => {
    viewportH = window.innerHeight;
    viewportW = window.innerWidth;
    blockMetrics = blocks.map((element) => ({
      element,
      top: element.offsetTop,
      height: element.offsetHeight,
      isDemo: element.classList.contains("proposal-demo-break"),
    }));
    snapMetrics = [
      {
        element: opening,
        top: opening.offsetTop,
        height: opening.offsetHeight,
        align: "start",
      },
      ...blockMetrics.map(({ element, top, height, isDemo }) => {
        return {
          element,
          top,
          height,
          align: isDemo ? "center" : "start",
        };
      }),
    ];
  };

  const snapTopFor = ({ top, height, align }) => {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - viewportH);

    if (align === "start") {
      return clamp(top - (isSmallViewport() ? 16 : viewportH * 0.14), 0, maxScroll);
    }

    return clamp(top - (viewportH - height) / 2, 0, maxScroll);
  };

  const nearestSnapIndex = () => {
    const currentTop = window.scrollY;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    snapMetrics.forEach((metric, index) => {
      const distance = Math.abs(snapTopFor(metric) - currentTop);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  };

  const releaseSnapLock = () => {
    window.clearTimeout(snapTimer);
    snapTimer = window.setTimeout(() => {
      snapLock = false;
    }, 120);
  };

  const animateScrollTo = (destination) => {
    window.cancelAnimationFrame(snapAnimationFrame);

    const start = window.scrollY;
    const distance = destination - start;
    const duration = clamp(Math.abs(distance) * 0.62, 620, 1180);
    const startTime = performance.now();

    snapLock = true;

    const step = (now) => {
      const progress = clamp((now - startTime) / duration, 0, 1);
      const easedProgress = easeOutQuint(progress);
      const nextY = start + distance * easedProgress;

      window.scrollTo({ top: nextY, behavior: "auto" });

      if (progress < 1) {
        snapAnimationFrame = window.requestAnimationFrame(step);
        return;
      }

      window.scrollTo({ top: destination, behavior: "auto" });
      targetY = destination;
      requestRender();
      releaseSnapLock();
    };

    snapAnimationFrame = window.requestAnimationFrame(step);
  };

  const goToSnap = (direction) => {
    measure();

    const currentIndex = nearestSnapIndex();
    const nextIndex = clamp(currentIndex + direction, 0, snapMetrics.length - 1);
    if (nextIndex === currentIndex) {
      return;
    }

    animateScrollTo(snapTopFor(snapMetrics[nextIndex]));
  };

  const updateScene = () => {
    const openingProgress = easeOutCubic(clamp(currentY / (viewportH * 0.92), 0, 1));
    const incomingProgress = easeOutCubic(
      clamp((currentY - viewportH * 0.18) / (viewportH * 1.05), 0, 1)
    );
    const motionBlur = Math.min(velocity / 28, 3);
    const cloudExit = openingProgress * Math.min(viewportW * 0.72, 980);
    const cloudEntry = (1 - incomingProgress) * -Math.min(viewportW * 0.52, 760);

    setRootVar("--proposal-scene-blur", `${(openingProgress * 24 + motionBlur).toFixed(2)}px`);
    setRootVar("--proposal-scene-scale", (1 + openingProgress * 0.034).toFixed(4));
    setRootVar("--proposal-scene-dim", (openingProgress * 0.24).toFixed(3));
    setRootVar("--proposal-sky-y", `${(-openingProgress * 28).toFixed(1)}px`);
    setRootVar("--proposal-cloud-exit", `${cloudExit.toFixed(1)}px`);
    setRootVar("--proposal-cloud-entry", `${cloudEntry.toFixed(1)}px`);
    setRootVar("--proposal-cloud-in-opacity", (incomingProgress * 0.78).toFixed(3));
  };

  const updateBlocks = () => {
    const viewportCenter = currentY + viewportH * 0.55;
    const motionBlur = Math.min(velocity / 24, 4.2);

    blockMetrics.forEach(({ element, top, height, isDemo }) => {
      const center = top + height / 2;
      const distance = (center - viewportCenter) / viewportH;
      const absoluteDistance = Math.abs(distance);
      const travel = isDemo ? 72 : 112;
      const y = clamp(distance * travel, -128, 166);
      const scale = 1 - Math.min(absoluteDistance * (isDemo ? 0.018 : 0.026), 0.052);
      const opacity = clamp(1 - Math.max(absoluteDistance - 0.56, 0) * 1.2, 0.34, 1);
      const blur = Math.min(motionBlur + Math.max(absoluteDistance - 0.72, 0) * 2.4, 6);

      element.style.setProperty("--proposal-card-y", `${y.toFixed(2)}px`);
      element.style.setProperty("--proposal-card-scale", scale.toFixed(4));
      element.style.setProperty("--proposal-card-opacity", opacity.toFixed(3));
      element.style.setProperty("--proposal-card-blur", `${blur.toFixed(2)}px`);
    });
  };

  const render = () => {
    const delta = targetY - currentY;
    currentY += delta * 0.14;

    const frameDelta = Math.abs(currentY - previousY);
    previousY = currentY;
    velocity = velocity * 0.82 + frameDelta * 0.18;

    updateScene();
    updateBlocks();

    if (Math.abs(delta) > 0.12 || velocity > 0.02) {
      window.requestAnimationFrame(render);
      return;
    }

    currentY = targetY;
    previousY = currentY;
    velocity = 0;
    updateScene();
    updateBlocks();
    ticking = false;
  };

  const requestRender = () => {
    targetY = window.scrollY;
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(render);
    }
  };

  const handleResize = () => {
    measure();
    requestRender();
  };

  const handleWheel = (event) => {
    if (event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) {
      return;
    }

    event.preventDefault();

    if (snapLock || Math.abs(event.deltaY) < 8) {
      return;
    }

    goToSnap(event.deltaY > 0 ? 1 : -1);
  };

  const handleKeydown = (event) => {
    const activeTag = document.activeElement?.tagName;
    if (["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA"].includes(activeTag)) {
      return;
    }

    const forwardKeys = ["ArrowDown", "ArrowRight", "PageDown", " "];
    const backwardKeys = ["ArrowUp", "ArrowLeft", "PageUp"];

    if (forwardKeys.includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      if (!snapLock) {
        goToSnap(1);
      }
      return;
    }

    if (backwardKeys.includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      if (!snapLock) {
        goToSnap(-1);
      }
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      event.stopPropagation();
      animateScrollTo(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      event.stopPropagation();
      animateScrollTo(document.documentElement.scrollHeight - viewportH);
    }
  };

  const handleTouchStart = (event) => {
    if (event.touches.length !== 1) {
      return;
    }

    touchStartY = event.touches[0].clientY;
    touchCurrentY = touchStartY;
    touchMoved = false;
  };

  const handleTouchMove = (event) => {
    if (!touchStartY || event.touches.length !== 1) {
      return;
    }

    touchCurrentY = event.touches[0].clientY;
    if (Math.abs(touchStartY - touchCurrentY) > 10) {
      event.preventDefault();
      touchMoved = true;
    }
  };

  const handleTouchEnd = () => {
    if (!touchMoved || snapLock) {
      touchStartY = 0;
      return;
    }

    const delta = touchStartY - touchCurrentY;
    touchStartY = 0;

    if (Math.abs(delta) > 42) {
      goToSnap(delta > 0 ? 1 : -1);
    }
  };

  measure();
  updateScene();
  updateBlocks();

  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("touchstart", handleTouchStart, { passive: true });
  window.addEventListener("touchmove", handleTouchMove, { passive: false });
  window.addEventListener("touchend", handleTouchEnd);
  document.addEventListener("keydown", handleKeydown, { capture: true });
  window.addEventListener("resize", handleResize);
  window.addEventListener("load", handleResize, { once: true });
})();
