// Interactive Diwali experience — no external libraries required.
const courtyard = document.getElementById("diyaCourtyard");
const lamps = [...document.querySelectorAll(".courtyard-diya")];
const message = document.getElementById("diyaMessage");
const lightAllButton = document.getElementById("lightAllButton");
const resetButton = document.getElementById("resetDiyas");
const musicToggle = document.getElementById("musicToggle");
const shareButton = document.getElementById("shareWish");
const menuToggle = document.getElementById("menuToggle");
const nav = document.querySelector(".desktop-nav");

const wishes = [
  "A little more light, a little more hope.",
  "May your home glow with happiness.",
  "Every diya carries a beautiful wish.",
  "May peace and prosperity find you.",
  "Your light makes the world a little brighter."
];

function toggleLamp(lamp) {
  const isLit = lamp.classList.toggle("lit");
  lamp.setAttribute("aria-pressed", String(isLit));
  const count = lamps.filter(item => item.classList.contains("lit")).length;
  message.textContent = count === 0 ? "Your light makes the world a little brighter."
    : count === lamps.length ? "All five diyas are glowing. Shubh Deepawali! ✨"
    : `${count} ${count === 1 ? "diya is" : "diyas are"} glowing. ${wishes[count - 1]}`;
  if (isLit) burst(lamp.getBoundingClientRect());
}
lamps.forEach(lamp => {
  lamp.addEventListener("click", () => toggleLamp(lamp));
  lamp.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggleLamp(lamp); }
  });
});
lightAllButton.addEventListener("click", () => {
  lamps.forEach(lamp => { lamp.classList.add("lit"); lamp.setAttribute("aria-pressed", "true"); });
  message.textContent = "All five diyas are glowing. Shubh Deepawali! ✨";
  burst({left: innerWidth / 2, top: innerHeight * .72, width: 1, height: 1});
  document.getElementById("celebrate").scrollIntoView({behavior:"smooth"});
});
resetButton.addEventListener("click", () => {
  lamps.forEach(lamp => { lamp.classList.remove("lit"); lamp.setAttribute("aria-pressed", "false"); });
  message.textContent = "Your light makes the world a little brighter.";
});

// Lightweight original ambient drone made with Web Audio API; starts only after user interaction.
let audioContext = null, masterGain = null, musicOn = false, oscillators = [];
function startMusic() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) { musicToggle.querySelector(".music-label").textContent = "Unavailable"; return; }
  audioContext = audioContext || new AudioCtx();
  if (audioContext.state === "suspended") audioContext.resume();
  masterGain = audioContext.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(audioContext.destination);
  [110, 164.81, 220].forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = index === 1 ? "sine" : "triangle";
    oscillator.frequency.value = frequency;
    gain.gain.value = [0.24, 0.12, 0.07][index];
    oscillator.connect(gain); gain.connect(masterGain); oscillator.start();
    oscillators.push(oscillator);
  });
  masterGain.gain.setTargetAtTime(0.045, audioContext.currentTime, 1.2);
  musicOn = true;
  musicToggle.setAttribute("aria-pressed", "true");
  musicToggle.setAttribute("aria-label", "Turn ambient music off");
  musicToggle.querySelector(".music-label").textContent = "Music on";
}
function stopMusic() {
  if (masterGain && audioContext) masterGain.gain.setTargetAtTime(0, audioContext.currentTime, .35);
  musicOn = false;
  musicToggle.setAttribute("aria-pressed", "false");
  musicToggle.setAttribute("aria-label", "Turn ambient music on");
  musicToggle.querySelector(".music-label").textContent = "Music off";
}
musicToggle.addEventListener("click", () => musicOn ? stopMusic() : startMusic());

shareButton.addEventListener("click", async () => {
  const text = "🪔 शुभ दीपावली! May your home glow with happiness, prosperity and peace. Wishing you and your loved ones a beautiful Diwali!";
  try {
    if (navigator.share) await navigator.share({title:"Shubh Deepawali", text});
    else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      shareButton.innerHTML = "Wishes copied ✓";
      setTimeout(() => shareButton.innerHTML = 'Share festive wishes <span>↗</span>', 2200);
    } else window.prompt("Copy your Diwali wishes:", text);
  } catch (error) { if (error.name !== "AbortError") window.prompt("Copy your Diwali wishes:", text); }
});
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false");
}));

// Subtle festive sparkles, with a small canvas footprint.
const canvas = document.getElementById("sparkCanvas");
const ctx = canvas.getContext("2d");
let particles = [], width = 0, height = 0, dpr = 1;
function resizeCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth; height = window.innerHeight;
  canvas.width = width * dpr; canvas.height = height * dpr;
  canvas.style.width = width + "px"; canvas.style.height = height + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resizeCanvas); resizeCanvas();
function burst(rect) {
  const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
  for (let i = 0; i < 18; i++) {
    const angle = Math.random() * Math.PI * 2, speed = 0.5 + Math.random() * 2.2;
    particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:1,size:1+Math.random()*2});
  }
}
function animate() {
  ctx.clearRect(0,0,width,height);
  if (Math.random() < .16) particles.push({x:Math.random()*width,y:height+5,vx:(Math.random()-.5)*.25,vy:-.35-Math.random()*.55,life:.5+Math.random()*.5,size:.7+Math.random()*1.4});
  particles = particles.filter(p => p.life > .02 && p.y > -10);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.life -= .0025;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fillStyle = `rgba(244,190,98,${p.life*.6})`; ctx.fill();
  });
  requestAnimationFrame(animate);
}
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) animate();
