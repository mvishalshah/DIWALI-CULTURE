(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const particles = [];
  let night = .13, nightTarget = .13, festival = false, nextFirework = 9;
  const random = (min, max) => min + Math.random() * (max - min);

  function burst(x, y, size = 42) {
    const count = reduceMotion ? 0 : 52;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = random(32, 132);
      particles.push({
        x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        life: random(.75, 1.5), maxLife: 1.5,
        size: random(1.2, 3.2), color: ["#ffe29a", "#f5ab63", "#ef6f57", "#eddaab"][i % 4]
      });
    }
  }

  function update(dt, width, height, elapsed) {
    night += (nightTarget - night) * Math.min(1, dt * .7);
    nextFirework -= dt;
    if (!reduceMotion && nextFirework <= 0) {
      burst(random(width * .18, width * .83), random(height * .14, height * .48), 42);
      nextFirework = random(festival ? 5 : 11, festival ? 9 : 20);
    }
    particles.forEach(particle => {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += 34 * dt;
      particle.life -= dt;
    });
    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].life <= 0) particles.splice(i, 1);
    }
    if (particles.length > 260) particles.splice(0, particles.length - 260);
  }

  function draw(ctx, width, height, time) {
    if (night > 0) {
      ctx.fillStyle = `rgba(15, 9, 20, ${night})`;
      ctx.fillRect(0, 0, width, height);
    }
    if (reduceMotion) return;
    for (let i = 0; i < 10; i++) {
      const x = ((i * 193 + time * (8 + i % 3)) % (width + 20)) - 10;
      const y = height * (.2 + ((i * 71) % 65) / 100) + Math.sin(time * .6 + i) * 8;
      ctx.fillStyle = "rgba(250, 209, 128, .56)";
      ctx.beginPath(); ctx.arc(x, y, 1.3, 0, Math.PI * 2); ctx.fill();
    }
    particles.forEach(particle => {
      ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
      ctx.fillStyle = particle.color;
      ctx.shadowBlur = 10; ctx.shadowColor = particle.color;
      ctx.beginPath(); ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  }

  window.MelaEffects = {
    update,
    draw,
    burst,
    toggleFestival() {
      festival = !festival;
      nightTarget = festival ? .34 : .13;
      if (festival) burst(window.innerWidth * .5, window.innerHeight * .3, 42);
      return festival;
    },
    get festival() { return festival; }
  };
})();
