(() => {
  const keys = new Set();
  const player = {
    x: 1000, y: 1155, speed: 155, radius: 9, phase: 0,
    shirt: "#b64337", trim: "#e5c27b", hair: "#34251f",
    scale: 1.12, state: "IDLE", direction: 1, skirt: true
  };
  let enabled = true;
  let activityTimer = 0;
  let activityState = "IDLE";
  const blockedKeys = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "e", "E"]);
  const keyDirections = {
    ArrowUp: [0, -1], w: [0, -1], W: [0, -1],
    ArrowDown: [0, 1], s: [0, 1], S: [0, 1],
    ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0],
    ArrowRight: [1, 0], d: [1, 0], D: [1, 0]
  };

  window.addEventListener("keydown", event => {
    if (blockedKeys.has(event.key) && !event.target.matches("input, textarea, select, [contenteditable=true]")) event.preventDefault();
    if (event.key === "e" || event.key === "E") {
      if (enabled && window.MelaGame && document.getElementById("gameModal").hidden) window.MelaGame.interact();
    }
    keys.add(event.key);
  });
  window.addEventListener("keyup", event => keys.delete(event.key));
  window.addEventListener("blur", () => keys.clear());

  function bindTouchControls() {
    document.querySelectorAll(".touch-controls [data-direction]").forEach(button => {
      const direction = button.dataset.direction;
      const key = { up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight" }[direction];
      button.addEventListener("pointerdown", event => {
        event.preventDefault();
        button.setPointerCapture(event.pointerId);
        keys.add(key);
      });
      const release = () => keys.delete(key);
      button.addEventListener("pointerup", release);
      button.addEventListener("pointercancel", release);
      button.addEventListener("lostpointercapture", release);
    });
  }

  function isBlocked(x, y, radius) {
    if (x < 30 + radius || x > 1970 - radius || y < 28 + radius || y > 1370 - radius) return true;
    return window.MelaWorld.buildings.some(rect =>
      x + radius > rect.x && x - radius < rect.x + rect.w &&
      y + radius > rect.y && y - radius < rect.y + rect.h
    );
  }

  function update(dt, mode) {
    if (activityTimer > 0) {
      activityTimer = Math.max(0, activityTimer - dt);
      player.state = activityState;
      player.phase += dt * 2;
      return;
    }
    const shouldMove = enabled && mode === "explore";
    const direction = [0, 0];
    if (shouldMove) {
      keys.forEach(key => {
        const step = keyDirections[key];
        if (step) { direction[0] += step[0]; direction[1] += step[1]; }
      });
    }
    const magnitude = Math.hypot(direction[0], direction[1]);
    if (!magnitude) {
      player.state = "IDLE";
      player.phase += dt * 2;
      return;
    }

    direction[0] /= magnitude; direction[1] /= magnitude;
    const nextX = player.x + direction[0] * player.speed * dt;
    const nextY = player.y + direction[1] * player.speed * dt;
    if (!isBlocked(nextX, player.y, player.radius)) player.x = nextX;
    if (!isBlocked(player.x, nextY, player.radius)) player.y = nextY;
    player.direction = direction[0] < -.1 ? -1 : direction[0] > .1 ? 1 : player.direction;
    player.state = "WALKING";
    player.phase += dt * 10;
  }

  bindTouchControls();
  window.MelaMovement = {
    player,
    isBlocked,
    update,
    setEnabled(value) {
      enabled = value;
      if (!value) keys.clear();
    },
    setActivity(state, duration) {
      activityState = state;
      activityTimer = duration;
      keys.clear();
    }
  };
})();
