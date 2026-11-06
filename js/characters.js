(() => {
  const palettes = [
    ["#a9463b", "#e7bd77", "#59362b"], ["#315c45", "#d9aa52", "#322b30"],
    ["#813b58", "#e0a857", "#452b29"], ["#3c6481", "#d8bc82", "#342c28"],
    ["#bd6838", "#eed190", "#53362b"], ["#75533e", "#d89c61", "#30282a"],
    ["#a13e39", "#d7c084", "#473331"], ["#457563", "#e5ba65", "#392d2b"],
    ["#80528a", "#d6ac6c", "#342b30"], ["#d0a151", "#5a4938", "#392d2a"],
    ["#45708b", "#d8ad62", "#322a2d"], ["#9f4b51", "#c79d67", "#3b302b"]
  ];
  const names = ["Meera", "Kabir", "Tara", "Aarav", "Nisha", "Dev", "Ira", "Vikram", "Leela", "Arjun", "Maya", "Rohan"];
  const random = (min, max) => min + Math.random() * (max - min);

  function makeCrowd(count) {
    return Array.from({ length: count }, (_, index) => {
      const palette = palettes[index % palettes.length];
      return {
        id: index,
        name: names[index % names.length],
        x: random(835, 1165),
        y: random(670, 1100),
        speed: random(30, 48),
        scale: random(.87, 1.13),
        shirt: palette[index % 2],
        trim: palette[1],
        hair: palette[2],
        skirt: index % 4 === 0,
        state: "WALKING",
        goal: null,
        timer: random(1, 4),
        phase: random(0, Math.PI * 2),
        direction: 1
      };
    });
  }

  function chooseDestination(character) {
    const points = window.MelaWorld.pointsOfInterest;
    let destination = points[Math.floor(Math.random() * points.length)];
    if (character.goal && points.length > 1 && destination.id === character.goal.id) {
      destination = points[(points.indexOf(destination) + 2) % points.length];
    }
    character.goal = destination;
    character.state = "WALKING";
  }

  function updateCrowd(crowd, dt, elapsed) {
    const points = window.MelaWorld.pointsOfInterest;
    crowd.forEach((character, index) => {
      character.phase += dt * (character.state === "WALKING" ? 9 : 2);
      if (!character.goal || character.timer <= 0) chooseDestination(character);
      if (character.state !== "WALKING") {
        character.timer -= dt;
        if (character.timer <= 0) chooseDestination(character);
        return;
      }

      const target = character.goal;
      let dx = target.accessX - character.x;
      let dy = target.accessY - character.y;
      const distance = Math.hypot(dx, dy) || 1;
      if (distance < 15) {
        if (target.kind === "food") character.state = "EATING";
        else if (target.kind === "shop") character.state = "SHOPPING";
        else if (target.kind === "performance") character.state = "WATCHING";
        else if (Math.random() < .24) character.state = "CELEBRATING";
        else character.state = "IDLE";
        character.timer = random(2, 6);
        return;
      }

      dx /= distance; dy /= distance;
      let nextX = character.x + dx * character.speed * dt;
      let nextY = character.y + dy * character.speed * dt;

      crowd.forEach((other, otherIndex) => {
        if (index === otherIndex) return;
        const awayX = character.x - other.x, awayY = character.y - other.y;
        const separation = Math.hypot(awayX, awayY);
        if (separation > 0 && separation < 23) {
          nextX += awayX / separation * 13 * dt;
          nextY += awayY / separation * 13 * dt;
        }
      });

      if (window.MelaMovement.isBlocked(nextX, nextY, 8)) {
        const side = Math.random() < .5 ? 1 : -1;
        const alternateX = character.x + -dy * character.speed * dt * side;
        const alternateY = character.y + dx * character.speed * dt * side;
        if (!window.MelaMovement.isBlocked(alternateX, alternateY, 8)) {
          nextX = alternateX; nextY = alternateY;
        } else {
          character.timer = .1;
          character.goal = null;
          return;
        }
      }
      character.direction = dx < 0 ? -1 : 1;
      character.x = Math.max(34, Math.min(1966, nextX));
      character.y = Math.max(36, Math.min(1365, nextY));
    });

    if (Math.floor(elapsed / 24) % 2 === 1 && crowd.length > 0 && Math.random() < .001) {
      const guest = crowd[Math.floor(Math.random() * crowd.length)];
      guest.state = "TALKING";
      guest.timer = 3;
    }
  }

  function drawPerson(ctx, person, time, isPlayer) {
    const walking = person.state === "WALKING";
    const step = walking ? Math.sin(person.phase) * 3 : Math.sin(time * 2 + person.phase) * 1.2;
    const size = person.scale || 1;
    ctx.save();
    ctx.translate(person.x, person.y);
    ctx.scale(size, size);
    ctx.fillStyle = "rgba(10, 12, 10, .3)";
    ctx.beginPath(); ctx.ellipse(0, 3, 10, 5, 0, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#34241e";
    ctx.fillRect(-6 + step, -3, 5, 9);
    ctx.fillRect(2 - step, -3, 5, 9);
    ctx.fillStyle = person.skirt ? person.trim : "#44312a";
    if (person.skirt) {
      ctx.beginPath(); ctx.moveTo(-8, -9); ctx.lineTo(8, -9); ctx.lineTo(10, 1); ctx.lineTo(-10, 1); ctx.closePath(); ctx.fill();
    } else ctx.fillRect(-6, -8, 12, 9);

    ctx.fillStyle = person.shirt;
    ctx.beginPath(); ctx.ellipse(0, -13, 9, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = person.trim;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-7, -13); ctx.lineTo(7, -13); ctx.stroke();
    ctx.fillStyle = "#c98f68";
    ctx.beginPath(); ctx.arc(0, -28, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = person.hair;
    ctx.beginPath(); ctx.arc(0, -30, 7, Math.PI, Math.PI * 2); ctx.fill();
    ctx.fillRect(-7, -30, 3, 8);
    ctx.fillStyle = "#2d211f";
    ctx.beginPath(); ctx.arc(person.direction < 0 ? -2 : 2, -28, 1, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = person.shirt;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-7, -20); ctx.lineTo(-11, -13 - step);
    ctx.moveTo(7, -20); ctx.lineTo(11, -13 + step);
    ctx.stroke();

    if (person.state === "CELEBRATING" || isPlayer) {
      ctx.strokeStyle = "#f3d37d";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, -34); ctx.lineTo(0, -43); ctx.stroke();
      ctx.fillStyle = "#f6d37c";
      ctx.beginPath(); ctx.arc(0, -46, 2.5, 0, Math.PI * 2); ctx.fill();
    }
    if (person.state === "TALKING" || person.state === "WATCHING") {
      ctx.fillStyle = "#f5db9a";
      ctx.beginPath(); ctx.arc(10, -38, 2, 0, Math.PI * 2); ctx.arc(15, -43, 1.4, 0, Math.PI * 2); ctx.fill();
    }
    if (isPlayer) {
      ctx.strokeStyle = "rgba(255, 224, 153, .75)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(0, 3, 13, 7, 0, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }

  window.MelaCharacters = { makeCrowd, updateCrowd, drawPerson };
})();
