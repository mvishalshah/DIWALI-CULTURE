(() => {
  const canvas = document.getElementById("melaCanvas");
  const ctx = canvas.getContext("2d");
  const game = document.getElementById("melaGame");
  const message = document.getElementById("melaToast");
  const nearbyCard = document.getElementById("nearbyCard");
  const nearbyButton = document.getElementById("nearbyButton");
  const modeMessage = document.getElementById("modeStatus");
  const collectedCount = document.getElementById("diyaCount");
  const progressBar = document.getElementById("diyaProgress");
  const activityModal = document.getElementById("gameModal");
  const mobile = window.matchMedia("(max-width: 700px)");
  const storeKey = "deepotsav-mela-progress-v1";
  const defaults = {
    collectedDiyas: [], visited: {}, rangoli: [], rangoliColor: "#f1bd4f",
    diyaColor: "#e76f51", decoratedDiya: false, bestRingScore: 0, wheelSpins: 0
  };
  let progress = { ...defaults };
  let mode = "explore";
  let crowd = [];
  let width = 0, height = 0, dpr = 1;
  let cameraX = 1000, cameraY = 1155;
  let elapsed = 0, previousTime = 0, raf = 0, toastTimer = 0;
  let nearest = null;
  let festivalButton = document.getElementById("festivalButton");

  function loadProgress() {
    try {
      const saved = window.localStorage.getItem(storeKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          progress = { ...defaults, ...parsed };
          if (!Array.isArray(progress.collectedDiyas)) progress.collectedDiyas = [];
          progress.collectedDiyas = [...new Set(progress.collectedDiyas.filter(index =>
            Number.isInteger(index) && index >= 0 && index < window.MelaWorld.goldenDiyas.length
          ))];
          if (!Array.isArray(progress.rangoli)) progress.rangoli = [];
          if (!progress.visited || typeof progress.visited !== "object" || Array.isArray(progress.visited)) progress.visited = {};
        }
      }
    } catch (error) {
      console.warn("Mela progress could not be loaded from local storage; this visit will remain temporary.", error);
    }
    updateProgressHud();
  }

  function saveProgress(key, value) {
    progress[key] = value;
    try {
      window.localStorage.setItem(storeKey, JSON.stringify(progress));
    } catch (error) {
      console.warn("Mela progress could not be saved to local storage.", error);
      toast("Progress is only available until this page is closed.");
    }
    updateProgressHud();
  }

  function updateProgressHud() {
    collectedCount.textContent = String(progress.collectedDiyas.length);
    progressBar.style.width = `${Math.min(100, progress.collectedDiyas.length * 20)}%`;
  }

  function toast(text) {
    message.textContent = text;
    message.classList.add("visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => message.classList.remove("visible"), 3300);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    if (!width || !height) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function worldToScreen(x, y) {
    return { x: x - cameraX + width / 2, y: y - cameraY + height / 2 };
  }

  function nearestPlace() {
    const player = window.MelaMovement.player;
    let best = null, bestDistance = 112;
    window.MelaWorld.pointsOfInterest.forEach(place => {
      const distance = Math.hypot(place.accessX - player.x, place.accessY - player.y);
      if (distance < bestDistance) { best = place; bestDistance = distance; }
    });
    return best;
  }

  function updateNearby() {
    nearest = mode === "watch" ? null : nearestPlace();
    if (!nearest || !activityModal.hidden) {
      nearbyCard.hidden = true;
      return;
    }
    nearbyCard.hidden = false;
    document.getElementById("nearbyTitle").textContent = nearest.name;
    document.getElementById("nearbyDescription").textContent = "Press E or tap to explore.";
    nearbyButton.innerHTML = `${nearest.kind === "food" ? "Taste" : "Visit"} <span>↗</span>`;
  }

  function collectNearbyDiya() {
    const player = window.MelaMovement.player;
    const index = window.MelaWorld.goldenDiyas.findIndex((diya, i) =>
      !progress.collectedDiyas.includes(i) && Math.hypot(diya.x - player.x, diya.y - player.y) < 33
    );
    if (index < 0) return false;
    const collected = [...progress.collectedDiyas, index];
    saveProgress("collectedDiyas", collected);
    const screen = worldToScreen(window.MelaWorld.goldenDiyas[index].x, window.MelaWorld.goldenDiyas[index].y);
    window.MelaEffects.burst(screen.x, screen.y);
    window.MelaAudio.playBell();
    toast(collected.length === 5
      ? "All five golden diyas found. Shubh Deepawali!"
      : `You found a golden diya. ${5 - collected.length} still hidden.`);
    return true;
  }

  function interact() {
    if (collectNearbyDiya()) return;
    const place = nearestPlace();
    if (!place) {
      toast("Wander closer to a stall, performance or fairground attraction.");
      return;
    }
    window.MelaActivities.open("visit", place);
  }

  function visit(place) {
    const counts = { ...progress.visited };
    counts[place.id] = (counts[place.id] || 0) + 1;
    saveProgress("visited", counts);
    const activityState = place.kind === "food" ? "EATING" : place.kind === "performance" ? "WATCHING" : place.kind === "shop" ? "SHOPPING" : "CELEBRATING";
    window.MelaMovement.setActivity(activityState, 3.2);
    const visitor = crowd[Math.floor(Math.random() * crowd.length)];
    if (visitor) {
      visitor.state = place.kind === "food" ? "EATING" : place.kind === "performance" ? "WATCHING" : "SHOPPING";
      visitor.timer = 3.2;
    }
    window.MelaAudio.playDhol();
    toast(place.kind === "food" ? `A little taste of ${place.name}.` : `You spend a moment at ${place.name}.`);
  }

  function setMode(nextMode) {
    mode = nextMode;
    window.MelaMovement.setEnabled(nextMode !== "watch");
    document.querySelectorAll("[data-mode]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.mode === mode));
    });
    modeMessage.textContent = mode === "watch" ? "Watch the mela visitors wander"
      : mode === "photographer" ? "Wander, then capture a scene"
        : "Move with WASD or arrow keys";
    updateNearby();
  }

  function followCamera(dt) {
    const player = window.MelaMovement.player;
    let targetX = player.x, targetY = player.y;
    if (mode === "watch" && crowd.length) {
      targetX = crowd.reduce((sum, character) => sum + character.x, 0) / crowd.length;
      targetY = crowd.reduce((sum, character) => sum + character.y, 0) / crowd.length;
    }
    const maxX = Math.max(width / 2, 2000 - width / 2);
    const maxY = Math.max(height / 2, 1400 - height / 2);
    targetX = Math.min(maxX, Math.max(Math.min(width / 2, 2000 / 2), targetX));
    targetY = Math.min(maxY, Math.max(Math.min(height / 2, 1400 / 2), targetY));
    const ease = 1 - Math.exp(-Math.min(dt, .05) * 4.5);
    cameraX += (targetX - cameraX) * ease;
    cameraY += (targetY - cameraY) * ease;
  }

  function render() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2 - cameraX, height / 2 - cameraY);
    window.MelaWorld.drawWorld(ctx, elapsed, progress.collectedDiyas);
    crowd.sort((a, b) => a.y - b.y);
    const player = window.MelaMovement.player;
    let playerDrawn = mode === "watch";
    crowd.forEach(character => {
      if (!playerDrawn && player.y < character.y) {
        window.MelaCharacters.drawPerson(ctx, player, elapsed, true);
        playerDrawn = true;
      }
      window.MelaCharacters.drawPerson(ctx, character, elapsed, false);
    });
    if (!playerDrawn) window.MelaCharacters.drawPerson(ctx, player, elapsed, true);
    ctx.restore();
    window.MelaEffects.draw(ctx, width, height, elapsed);
  }

  function frame(now) {
    if (document.hidden) { raf = 0; return; }
    const dt = previousTime ? Math.min((now - previousTime) / 1000, .05) : 0;
    previousTime = now;
    elapsed += dt;
    window.MelaMovement.update(dt, mode);
    window.MelaCharacters.updateCrowd(crowd, dt, elapsed);
    followCamera(dt);
    window.MelaEffects.update(dt, width, height, elapsed);
    if (Math.floor(elapsed * 3) % 2 === 0) updateNearby();
    render();
    raf = window.requestAnimationFrame(frame);
  }

  function captureScene() {
    const link = document.createElement("a");
    const finishPhoto = blob => {
      if (!blob) {
        toast("This browser could not capture the scene. Try a current desktop browser.");
        return;
      }
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `deepotsav-mela-${new Date().toISOString().slice(0, 10)}.png`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      document.getElementById("photoFlash").classList.remove("flash");
      void document.getElementById("photoFlash").offsetWidth;
      document.getElementById("photoFlash").classList.add("flash");
      toast("Scene captured. Your mela photograph has been downloaded.");
    };
    if (typeof canvas.toBlob === "function") canvas.toBlob(finishPhoto, "image/png");
    else {
      const data = canvas.toDataURL("image/png");
      link.href = data;
      link.download = `deepotsav-mela-${new Date().toISOString().slice(0, 10)}.png`;
      link.click();
      toast("Scene captured. Your mela photograph has been downloaded.");
    }
  }

  function bindControls() {
    document.querySelectorAll("[data-mode]").forEach(button => button.addEventListener("click", () => setMode(button.dataset.mode)));
    document.querySelectorAll("[data-activity]").forEach(button => button.addEventListener("click", () => {
      window.MelaActivities.open(button.dataset.activity);
    }));
    nearbyButton.addEventListener("click", interact);
    festivalButton.addEventListener("click", () => {
      const active = window.MelaEffects.toggleFestival();
      festivalButton.setAttribute("aria-pressed", String(active));
      toast(active ? "The fairground glows brighter. Shubh Deepawali!" : "The mela settles into its evening glow.");
      if (active) window.MelaAudio.playDhol();
    });
    document.getElementById("photoButton").addEventListener("click", captureScene);
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        previousTime = performance.now();
        raf = window.requestAnimationFrame(frame);
      }
    });
  }

  function boot() {
    if (!ctx) {
      toast("Canvas is unavailable in this browser. Please use a current browser to enter the mela.");
      return;
    }
    loadProgress();
    window.MelaActivities.restore(progress);
    resize();
    const count = mobile.matches ? 12 : 24;
    crowd = window.MelaCharacters.makeCrowd(count);
    document.getElementById("visitorCount").textContent = `${count} visitors exploring`;
    bindControls();
    setMode("explore");
    if (progress.collectedDiyas.length) toast(`Welcome back. ${progress.collectedDiyas.length} golden diya${progress.collectedDiyas.length === 1 ? "" : "s"} found.`);
    raf = window.requestAnimationFrame(frame);
  }

  window.MelaGame = {
    get progress() { return progress; },
    toast,
    interact,
    visit,
    festivalBurst() { window.MelaEffects.burst(width / 2, height / 2); },
    saveProgress
  };
  boot();
})();
