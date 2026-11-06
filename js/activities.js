(() => {
  const prizes = [
    "A box of warm kaju katli", "A tiny brass diya", "A lantern for your doorway",
    "A sweet wish for the year ahead", "A little good fortune", "A fresh marigold garland"
  ];
  const colors = ["#f1bd4f", "#e76f51", "#69a781", "#78a6c4", "#bc77a9", "#f0e2bf"];
  const patterns = ["Lotus", "Star", "Petals"];
  const modal = document.getElementById("gameModal");
  const content = document.getElementById("modalContent");
  const closeButtons = modal.querySelectorAll("[data-close-modal]");
  const memory = { rangoli: [], rangoliColor: colors[0], pattern: patterns[0], diyaColor: "#e76f51", bestRingScore: 0 };
  let returnFocus = null;
  let ringScore = 0, ringThrows = 0, aimX = 0;
  let diyaIsLit = false;
  let wheelTimer = 0;

  function openShell(title, intro, eyebrow = "A LITTLE FESTIVE MAGIC") {
    returnFocus = document.activeElement;
    content.replaceChildren();
    const eyebrowNode = document.createElement("p");
    eyebrowNode.className = "modal-eyebrow";
    eyebrowNode.textContent = eyebrow;
    const heading = document.createElement("h2");
    heading.id = "modalTitle";
    heading.textContent = title;
    const description = document.createElement("p");
    description.className = "modal-intro";
    description.textContent = intro;
    content.append(eyebrowNode, heading, description);
    modal.hidden = false;
    modal.querySelector(".modal-close").focus();
    document.body.classList.add("activity-open");
  }

  function addStatus(text) {
    let status = content.querySelector(".modal-status");
    if (!status) {
      status = document.createElement("p");
      status.className = "modal-status";
      status.setAttribute("aria-live", "polite");
      content.append(status);
    }
    status.textContent = text;
  }

  function addButton(label, callback, secondary = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `modal-button${secondary ? " secondary" : ""}`;
    button.textContent = label;
    button.addEventListener("click", callback);
    return button;
  }

  function openVisit(place) {
    const category = place.kind === "food" ? "A TASTE OF THE MELA" : place.kind === "performance" ? "LIVE AT THE MELA" : "MEET THE MAKERS";
    openShell(place.name, place.detail, category);
    const actions = document.createElement("div");
    actions.className = "modal-actions";
    actions.append(addButton(place.kind === "food" ? "Stop for a treat" : "Spend a little time", () => {
      window.MelaGame.visit(place);
      close();
    }));
    content.append(actions);
    addStatus("Walk nearby and press E to visit a stall or performance.");
  }

  function openRangoli() {
    openShell("Make a rangoli.", "Choose a pattern and colour, then tap or draw in the courtyard.");
    const board = document.createElement("canvas");
    board.className = "rangoli-board";
    board.width = 480; board.height = 480;
    board.setAttribute("aria-label", "Interactive rangoli drawing canvas");
    content.append(board);
    const ctx = board.getContext("2d");
    const drawing = { active: false };
    const selected = { color: memory.rangoliColor, pattern: memory.pattern };

    function render() {
      ctx.fillStyle = "#291a1b"; ctx.fillRect(0, 0, board.width, board.height);
      ctx.strokeStyle = "rgba(241, 220, 181, .19)"; ctx.lineWidth = 1;
      for (let radius = 35; radius <= 210; radius += 35) {
        ctx.beginPath(); ctx.arc(240, 240, radius, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.strokeStyle = "rgba(241, 220, 181, .12)";
      for (let i = 0; i < 12; i++) {
        const angle = i * Math.PI / 6;
        ctx.beginPath(); ctx.moveTo(240, 240); ctx.lineTo(240 + Math.cos(angle) * 218, 240 + Math.sin(angle) * 218); ctx.stroke();
      }
      memory.rangoli.forEach(mark => paintMark(ctx, mark.x, mark.y, mark.color, mark.pattern, mark.size));
    }
    function paintMark(target, x, y, color, pattern, size = 1) {
      target.save(); target.translate(x, y); target.fillStyle = color; target.strokeStyle = "#f4e3b1";
      if (pattern === "Star") {
        target.beginPath();
        for (let i = 0; i < 10; i++) {
          const angle = -Math.PI / 2 + i * Math.PI / 5;
          const radius = (i % 2 ? 9 : 22) * size;
          target.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
        target.closePath(); target.fill(); target.stroke();
      } else {
        const petals = pattern === "Lotus" ? 8 : 6;
        for (let i = 0; i < petals; i++) {
          target.save(); target.rotate(i * Math.PI * 2 / petals);
          target.beginPath(); target.ellipse(0, -10 * size, 6 * size, 12 * size, 0, 0, Math.PI * 2);
          target.fill(); target.stroke(); target.restore();
        }
        target.fillStyle = "#f3d37e"; target.beginPath(); target.arc(0, 0, 3 * size, 0, Math.PI * 2); target.fill();
      }
      target.restore();
    }
    render();

    const patternsRow = document.createElement("div");
    patternsRow.className = "activity-options";
    patterns.forEach(pattern => {
      const option = document.createElement("button");
      option.type = "button"; option.className = "option-button";
      option.textContent = pattern; option.setAttribute("aria-pressed", String(pattern === selected.pattern));
      option.addEventListener("click", () => {
        selected.pattern = pattern; memory.pattern = pattern;
        patternsRow.querySelectorAll("button").forEach(button => button.setAttribute("aria-pressed", String(button === option)));
      });
      patternsRow.append(option);
    });
    content.append(patternsRow);
    const palette = document.createElement("div");
    palette.className = "color-swatches";
    colors.forEach(color => {
      const swatch = document.createElement("button");
      swatch.type = "button"; swatch.className = "color-swatch";
      swatch.style.backgroundColor = color; swatch.setAttribute("aria-label", `Choose ${color}`);
      swatch.setAttribute("aria-pressed", String(color === selected.color));
      swatch.addEventListener("click", () => {
        selected.color = color; memory.rangoliColor = color;
        palette.querySelectorAll("button").forEach(button => button.setAttribute("aria-pressed", String(button === swatch)));
      });
      palette.append(swatch);
    });
    content.append(palette);
    const status = document.createElement("p");
    status.className = "modal-status"; status.setAttribute("aria-live", "polite");
    status.textContent = `${memory.rangoli.length} flourishes in your rangoli.`;
    content.append(status);
    const clear = addButton("Clear rangoli", () => {
      memory.rangoli = []; render(); status.textContent = "The courtyard is ready for a new design.";
      window.MelaGame.saveProgress("rangoli", memory.rangoli);
    }, true);
    content.append(clear);

    function placeMark(event) {
      const rect = board.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width * board.width;
      const y = (event.clientY - rect.top) / rect.height * board.height;
      const mark = { x, y, color: selected.color, pattern: selected.pattern, size: .8 + Math.random() * .45 };
      memory.rangoli.push(mark);
      if (memory.rangoli.length > 100) memory.rangoli.shift();
      paintMark(ctx, x, y, mark.color, mark.pattern, mark.size);
      status.textContent = `${memory.rangoli.length} flourishes in your rangoli.`;
      window.MelaGame.saveProgress("rangoli", memory.rangoli);
    }
    board.addEventListener("pointerdown", event => {
      event.preventDefault(); drawing.active = true; board.setPointerCapture(event.pointerId); placeMark(event);
    });
    board.addEventListener("pointermove", event => {
      if (drawing.active) placeMark(event);
    });
    board.addEventListener("pointerup", () => { drawing.active = false; });
    board.addEventListener("pointercancel", () => { drawing.active = false; });
  }

  function openDiya() {
    openShell("Dress a little diya.", "Choose a glaze, add a tiny flame and send a wish into the night.");
    const colorsRow = document.createElement("div");
    colorsRow.className = "color-swatches";
    colors.forEach(color => {
      const button = document.createElement("button");
      button.type = "button"; button.className = "color-swatch";
      button.style.backgroundColor = color; button.setAttribute("aria-label", `Choose ${color}`);
      button.setAttribute("aria-pressed", String(color === memory.diyaColor));
      button.addEventListener("click", () => {
        memory.diyaColor = color;
        content.querySelector(".decor-diya").style.background = `linear-gradient(180deg, #f1bb60, ${color})`;
        colorsRow.querySelectorAll("button").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
        window.MelaGame.saveProgress("diyaColor", color);
      });
      colorsRow.append(button);
    });
    const preview = document.createElement("div");
    preview.className = "diya-decor-preview";
    const diya = document.createElement("div");
    diya.className = `decor-diya${diyaIsLit ? " lit" : ""}`;
    diya.style.background = `linear-gradient(180deg, #f1bb60, ${memory.diyaColor})`;
    preview.append(diya);
    content.append(colorsRow, preview);
    const actions = document.createElement("div");
    actions.className = "modal-actions";
    const lightButton = addButton(diyaIsLit ? "Diya is glowing" : "Light the diya", () => {
      diyaIsLit = true; diya.classList.add("lit"); lightButton.textContent = "A wish is glowing";
      window.MelaGame.saveProgress("decoratedDiya", true);
      window.MelaGame.festivalBurst();
      window.MelaAudio.playBell();
      addStatus("A little light, made just by you. Shubh Deepawali!");
    });
    actions.append(lightButton);
    content.append(actions);
    addStatus(diyaIsLit ? "Your decorated diya is already glowing." : "Your glaze colour is saved on this device.");
  }

  function openWheel() {
    openShell("Spin for a little luck.", "Give the mela wheel a turn and see what the evening brings.");
    const wheel = document.createElement("div");
    wheel.className = "lucky-wheel"; wheel.setAttribute("aria-label", "Festive lucky wheel");
    const centre = document.createElement("span"); centre.textContent = "✦"; wheel.append(centre);
    content.append(wheel);
    const actions = document.createElement("div");
    actions.className = "modal-actions";
    const spinButton = addButton("Spin the wheel", () => {
      if (spinButton.disabled) return;
      spinButton.disabled = true;
      const prizeIndex = Math.floor(Math.random() * prizes.length);
      const turns = 5 + Math.floor(Math.random() * 4);
      wheel.style.transform = `rotate(${turns * 360 + (prizeIndex + .5) * 60}deg)`;
      window.MelaAudio.playBell();
      wheelTimer = window.setTimeout(() => {
        wheelTimer = 0;
        spinButton.disabled = false;
        addStatus(`Your mela surprise: ${prizes[prizeIndex]}.`);
        window.MelaGame.saveProgress("wheelSpins", window.MelaGame.progress.wheelSpins + 1);
        window.MelaGame.toast(`The lucky wheel brings you ${prizes[prizeIndex].toLowerCase()}.`);
      }, 3300);
    });
    actions.append(spinButton);
    content.append(actions);
    addStatus("Ready when you are.");
  }

  function openRingToss() {
    openShell("Ring toss.", "Aim with the arrows or tap the game field, then try to hook a peg.");
    const board = document.createElement("canvas");
    board.className = "ring-game"; board.width = 860; board.height = 380;
    board.setAttribute("aria-label", "Ring toss game. Tap to aim, then throw a ring.");
    content.append(board);
    const ctx = board.getContext("2d");
    const status = document.createElement("p");
    status.className = "modal-status"; status.setAttribute("aria-live", "polite");
    status.textContent = "Aim for a peg. Three rings per round.";
    content.append(status);
    const controls = document.createElement("div");
    controls.className = "modal-actions";
    let throwButton;
    controls.append(
      addButton("← Aim left", () => { aimX = Math.max(50, aimX - 30); draw(); }, true),
      addButton("Aim right →", () => { aimX = Math.min(board.width - 50, aimX + 30); draw(); }, true)
    );
    throwButton = addButton("Throw a ring", throwRing);
    controls.append(throwButton);
    content.append(controls);

    function draw(ringX = null, ringY = null, landed = false) {
      const w = board.width, h = board.height;
      ctx.fillStyle = "#274b3a"; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#b59056"; ctx.fillRect(0, 300, w, 80);
      ctx.fillStyle = "#d7ba82"; ctx.fillRect(0, 295, w, 9);
      const pegs = [w * .25, w * .5, w * .75];
      pegs.forEach((x, i) => {
        ctx.fillStyle = "#7e4c31"; ctx.fillRect(x - 5, 194, 10, 104);
        ctx.fillStyle = ["#dfcb8d", "#cd7458", "#e4c167"][i];
        ctx.beginPath(); ctx.arc(x, 183, 15, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#f3dca9"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.ellipse(x, 247, 26, 13, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = "#f0e1bd"; ctx.font = "20px 'DM Sans', sans-serif"; ctx.textAlign = "center";
        ctx.fillText(String(i + 1), x, 350);
      });
      ctx.strokeStyle = "rgba(255, 227, 159, .25)"; ctx.lineWidth = 2;
      ctx.setLineDash([6, 8]); ctx.beginPath(); ctx.moveTo(aimX, 75); ctx.lineTo(aimX, 292); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#f1d184"; ctx.beginPath(); ctx.arc(aimX, 110, 8, 0, Math.PI * 2); ctx.fill();
      if (ringX !== null) {
        ctx.strokeStyle = landed ? "#f5d477" : "#f7e6be"; ctx.lineWidth = 7;
        ctx.beginPath(); ctx.ellipse(ringX, ringY, 20, 10, 0, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.fillStyle = "#fff0ce"; ctx.font = "16px 'DM Sans', sans-serif"; ctx.textAlign = "left";
      ctx.fillText(`Score ${ringScore}`, 22, 32);
    }

    function throwRing() {
      if (ringThrows >= 3) {
        ringThrows = 0; ringScore = 0; status.textContent = "New round. Three rings. Have another go.";
        throwButton.disabled = false; draw(); return;
      }
      ringThrows++;
      const pegs = [board.width * .25, board.width * .5, board.width * .75];
      const nearest = Math.min(...pegs.map(x => Math.abs(x - aimX)));
      const landed = nearest < 39;
      if (landed) ringScore += nearest < 16 ? 3 : nearest < 27 ? 2 : 1;
      draw(aimX, landed ? 240 : 270, landed);
      const left = 3 - ringThrows;
      status.textContent = landed
        ? `A ring found its peg! ${left} ${left === 1 ? "ring" : "rings"} left.`
        : `Just missed. ${left} ${left === 1 ? "ring" : "rings"} left.`;
      window.MelaAudio.playBell();
      if (left === 0) {
        throwButton.textContent = "Play another round";
        throwButton.disabled = false;
        status.textContent += ` Round score: ${ringScore}. Best: ${Math.max(memory.bestRingScore, ringScore)}.`;
        memory.bestRingScore = Math.max(memory.bestRingScore, ringScore);
        window.MelaGame.saveProgress("bestRingScore", memory.bestRingScore);
      }
    }
    board.addEventListener("pointerdown", event => {
      const rect = board.getBoundingClientRect();
      aimX = (event.clientX - rect.left) / rect.width * board.width;
      draw();
    });
    ringScore = 0; ringThrows = 0; aimX = board.width / 2;
    draw();
  }

  function close() {
    if (modal.hidden) return;
    window.clearTimeout(wheelTimer);
    wheelTimer = 0;
    modal.hidden = true;
    document.body.classList.remove("activity-open");
    if (returnFocus && typeof returnFocus.focus === "function") returnFocus.focus();
  }

  closeButtons.forEach(button => button.addEventListener("click", close));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modal.hidden) close();
  });

  window.MelaActivities = {
    open(name, place) {
      if (name === "visit" && place) openVisit(place);
      else if (name === "rangoli") openRangoli();
      else if (name === "diya") openDiya();
      else if (name === "wheel") openWheel();
      else if (name === "ring") openRingToss();
    },
    close,
    restore(progress) {
      memory.rangoli = Array.isArray(progress.rangoli) ? progress.rangoli : [];
      memory.rangoliColor = colors.includes(progress.rangoliColor) ? progress.rangoliColor : colors[0];
      memory.diyaColor = colors.includes(progress.diyaColor) ? progress.diyaColor : "#e76f51";
      memory.bestRingScore = Number(progress.bestRingScore) || 0;
      diyaIsLit = Boolean(progress.decoratedDiya);
    }
  };
})();
