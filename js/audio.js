(() => {
  let context = null;
  let master = null;
  let musicOn = false;
  let melodyTimer = 0;
  const button = document.getElementById("melaAudioToggle");

  function ensureAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;
    if (!context) {
      context = new AudioContext();
      master = context.createGain();
      master.gain.value = 0;
      master.connect(context.destination);
    }
    if (context.state === "suspended") context.resume();
    return true;
  }

  function tone(frequency, duration, volume, type = "sine") {
    if (!ensureAudio()) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    gain.gain.setValueAtTime(volume, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + duration);
    oscillator.connect(gain); gain.connect(master);
    oscillator.start(); oscillator.stop(context.currentTime + duration);
  }

  function toggle() {
    if (!musicOn) {
      if (!ensureAudio()) {
        button.querySelector(".mela-audio-label").textContent = "Unavailable";
        return;
      }
      musicOn = true;
      master.gain.setTargetAtTime(.08, context.currentTime, .35);
      melodyTimer = window.setInterval(() => {
        if (musicOn) tone([440, 523.25, 659.25, 587.33][Math.floor(Math.random() * 4)], .72, .12, "triangle");
      }, 2200);
    } else {
      musicOn = false;
      if (context && master) master.gain.setTargetAtTime(0, context.currentTime, .2);
      window.clearInterval(melodyTimer);
    }
    button.setAttribute("aria-pressed", String(musicOn));
    button.setAttribute("aria-label", `Turn festival music ${musicOn ? "off" : "on"}`);
    button.querySelector(".mela-audio-label").textContent = musicOn ? "Sound on" : "Sound off";
  }

  button.addEventListener("click", toggle);
  window.MelaAudio = {
    playBell() { tone(880, .28, .22, "sine"); tone(1318.5, .42, .08, "triangle"); },
    playDhol() { tone(110, .16, .26, "triangle"); },
    get enabled() { return musicOn; }
  };
})();
