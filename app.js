// Banco de textos para ambos modos
const TEXT_BANK = {
  normal: [
    "La programación requiere lógica, paciencia y mucha práctica diaria para resolver problemas reales.",
    "El éxito en el desarrollo de software depende tanto del código limpio como del trabajo en equipo.",
    "La inteligencia artificial transforma la educación, permitiendo crear herramientas rápidas y creativas.",
    "Un buen algoritmo no solo funciona rápido, también es fácil de leer, mantener y escalar en el tiempo.",
    "Escribir sin mirar el teclado aumenta tu productividad y reduce errores al redactar informes técnicos."
  ],
  code: [
    "int suma = 0;\nfor (int i = 1; i <= 10; i++) {\n    suma += i;\n}",
    "def porcentaje(total, parte):\n    return (parte / total) * 100\nprint(porcentaje(200, 50))",
    "int n = 5, fact = 1;\nwhile (n > 1) {\n    fact *= n;\n    n--;\n}",
    "let nums = [4, 8, 15, 16];\nlet doble = nums.map(x => x * 2);\nconsole.log(doble);"
  ]
};

// Estado del juego
let selectedAvatar = "🚀";
let selectedMode = "normal";
let playerName = "Tú";
let targetText = "";
let startTime = null;
let raceActive = false;
let botInterval = null;
let totalKeystrokes = 0;
let errorKeystrokes = 0;
let currentStreak = 0;
let racers = [];

// Elementos DOM
const lobbyScreen = document.getElementById("lobby-screen");
const raceScreen = document.getElementById("race-screen");
const podiumScreen = document.getElementById("podium-screen");
const trackContainer = document.getElementById("track-container");
const textDisplay = document.getElementById("text-display");
const typingInput = document.getElementById("typing-input");
const countdownOverlay = document.getElementById("countdown-overlay");

// Sonidos sintetizados (sin archivos MP3 externos)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playBeep(freq, duration, type = "sine") {
  if (audioCtx.state === "suspended") audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

// Selección de Avatar
document.querySelectorAll(".avatar-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".avatar-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedAvatar = btn.dataset.avatar;
  });
});

// Selección de Modo
document.querySelectorAll(".mode-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedMode = btn.dataset.mode;
  });
});

// Iniciar carrera
document.getElementById("start-btn").addEventListener("click", setupRace);
document.getElementById("play-again-btn").addEventListener("click", setupRace);
document.getElementById("back-lobby-btn").addEventListener("click", () => {
  clearInterval(botInterval);
  podiumScreen.classList.add("hidden");
  raceScreen.classList.add("hidden");
  lobbyScreen.classList.remove("hidden");
});

document.getElementById("typing-wrapper").addEventListener("click", () => {
  if (raceActive) typingInput.focus();
});

function setupRace() {
  clearInterval(botInterval);
  const rawName = document.getElementById("player-name").value.trim();
  playerName = rawName || "Jugador 1";

  // Elegir texto aleatorio del modo seleccionado
  const pool = TEXT_BANK[selectedMode];
  targetText = pool[Math.floor(Math.random() * pool.length)];

  // Resetear métricas
  totalKeystrokes = 0;
  errorKeystrokes = 0;
  currentStreak = 0;
  raceActive = false;
  typingInput.value = "";
  document.getElementById("current-mode-label").textContent =
    selectedMode === "normal" ? "Texto Normal" : "Programación";
  document.getElementById("wpm-display").textContent = "0 PPM";
  document.getElementById("accuracy-display").textContent = "100%";
  document.getElementById("streak-display").textContent = "0 🔥";

  // Configurar 5 corredores (Tú + 4 Bots de prueba)
  racers = [
    { id: "me", name: `${playerName} (Tú)`, avatar: selectedAvatar, progress: 0, wpm: 0, finishedAt: null, isMe: true },
    { id: "b1", name: "Bot Senior", avatar: "🤖", progress: 0, wpm: 0, speed: 68, finishedAt: null, isMe: false },
    { id: "b2", name: "Bot FullStack", avatar: "🐱", progress: 0, wpm: 0, speed: 52, finishedAt: null, isMe: false },
    { id: "b3", name: "Bot Junior", avatar: "👾", progress: 0, wpm: 0, speed: 38, finishedAt: null, isMe: false },
    { id: "b4", name: "Bot Turbo", avatar: "⚡", progress: 0, wpm: 0, speed: 60, finishedAt: null, isMe: false }
  ];

  renderTrack();
  renderText("");

  lobbyScreen.classList.add("hidden");
  podiumScreen.classList.add("hidden");
  raceScreen.classList.remove("hidden");

  // Cuenta regresiva 3, 2, 1
  let count = 3;
  countdownOverlay.classList.remove("hidden");
  countdownOverlay.textContent = count;
  playBeep(440, 0.15);

  const timer = setInterval(() => {
    count--;
    if (count > 0) {
      countdownOverlay.textContent = count;
      playBeep(440, 0.15);
    } else {
      clearInterval(timer);
      countdownOverlay.classList.add("hidden");
      playBeep(880, 0.25);
      startRace();
    }
  }, 800);
}

function startRace() {
  raceActive = true;
  startTime = Date.now();
  typingInput.focus();

  // Simular avance de los 4 bots
  botInterval = setInterval(() => {
    if (!raceActive) return;
    const elapsedMin = (Date.now() - startTime) / 60000;

    racers.forEach(r => {
      if (!r.isMe && r.progress < 100) {
        const charsPerSec = (r.speed * 5) / 60;
        const jitter = 0.7 + Math.random() * 0.6;
        const deltaPercent = ((charsPerSec * 0.2 * jitter) / targetText.length) * 100;
        r.progress = Math.min(100, r.progress + deltaPercent);
        r.wpm = Math.round(((r.progress / 100) * targetText.length / 5) / Math.max(elapsedMin, 0.01));
        if (r.progress >= 100 && !r.finishedAt) {
          r.finishedAt = Date.now();
        }
      }
    });

    updateTrackUI();
    checkAllFinished();
  }, 200);
}

// Permitir tecla Tab en modo código
typingInput.addEventListener("keydown", e => {
  if (!raceActive) return;
  if (e.key === "Tab") {
    e.preventDefault();
    typingInput.value += "    ";
    typingInput.dispatchEvent(new Event("input"));
  }
});

// Control principal de escritura
typingInput.addEventListener("input", () => {
  if (!raceActive) return;
  const typed = typingInput.value;
  totalKeystrokes++;

  let correctPrefix = 0;
  let hasError = false;

  for (let i = 0; i < typed.length; i++) {
    if (!hasError && typed[i] === targetText[i]) {
      correctPrefix++;
    } else {
      hasError = true;
    }
  }

  const lastIdx = typed.length - 1;
  if (lastIdx >= 0) {
    if (typed[lastIdx] === targetText[lastIdx] && !hasError) {
      currentStreak++;
      playBeep(600 + Math.min(currentStreak * 8, 300), 0.04);
    } else {
      errorKeystrokes++;
      currentStreak = 0;
      playBeep(180, 0.1, "sawtooth");
    }
  }

  renderText(typed);

  // Actualizar métricas del jugador
  const elapsedMin = Math.max((Date.now() - startTime) / 60000, 0.01);
  const wpm = Math.round((correctPrefix / 5) / elapsedMin);
  const accuracy = totalKeystrokes > 0
    ? Math.max(0, Math.round(((totalKeystrokes - errorKeystrokes) / totalKeystrokes) * 100))
    : 100;
  const progress = Math.min(100, (correctPrefix / targetText.length) * 100);

  document.getElementById("wpm-display").textContent = `${wpm} PPM`;
  document.getElementById("accuracy-display").textContent = `${accuracy}%`;
  document.getElementById("streak-display").textContent = `${currentStreak} 🔥`;

  const me = racers.find(r => r.isMe);
  me.progress = progress;
  me.wpm = wpm;
  me.accuracy = accuracy;

  if (typed === targetText && !me.finishedAt) {
    me.finishedAt = Date.now();
    playBeep(1046, 0.35);
    finishRace();
  }

  updateTrackUI();
});

function renderText(typed) {
  let html = "";
  for (let i = 0; i < targetText.length; i++) {
    const ch = targetText[i];
    const displayChar = ch === "\n" ? "↵\n" : ch;
    let cls = "";

    if (i < typed.length) {
      cls = typed[i] === ch ? "correct" : "incorrect";
    } else if (i === typed.length) {
      cls = "current";
    }
    html += `<span class="${cls}">${escapeHtml(displayChar)}</span>`;
  }
  textDisplay.innerHTML = html;
}

function renderTrack() {
  trackContainer.innerHTML = racers.map(r => `
    <div class="lane ${r.isMe ? "is-me" : ""}" id="lane-${r.id}">
      <div class="racer" id="racer-${r.id}">
        <span class="racer-avatar">${r.avatar}</span>
        <span class="racer-tag">${r.name}</span>
      </div>
      <span class="lane-wpm" id="wpm-${r.id}">0 PPM</span>
      <div class="finish-line"></div>
    </div>
  `).join("");
}

function updateTrackUI() {
  racers.forEach(r => {
    const racerEl = document.getElementById(`racer-${r.id}`);
    const wpmEl = document.getElementById(`wpm-${r.id}`);
    if (!racerEl) return;

    const maxLeft = 82; // porcentaje máximo antes de la meta
    racerEl.style.left = `calc(10px + ${(r.progress / 100) * maxLeft}%)`;
    wpmEl.textContent = `${r.wpm} PPM`;

    if (r.isMe && currentStreak >= 12) {
      racerEl.classList.add("on-fire");
    } else {
      racerEl.classList.remove("on-fire");
    }
  });
}

function checkAllFinished() {
  if (racers.every(r => r.finishedAt !== null)) {
    finishRace();
  }
}

function finishRace() {
  raceActive = false;
  clearInterval(botInterval);

  const sorted = [...racers].sort((a, b) => {
    if (a.finishedAt && b.finishedAt) return a.finishedAt - b.finishedAt;
    if (a.finishedAt) return -1;
    if (b.finishedAt) return 1;
    return b.progress - a.progress;
  });

  const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
  document.getElementById("podium-list").innerHTML = sorted.map((r, idx) => `
    <div class="podium-row ${idx === 0 ? "first-place" : ""}">
      <div>
        <strong>${medals[idx]} ${r.avatar} ${r.name}</strong>
      </div>
      <div>
        <span>${r.wpm} PPM</span> • <span>${Math.round(r.progress)}% completado</span>
      </div>
    </div>
  `).join("");

  setTimeout(() => {
    raceScreen.classList.add("hidden");
    podiumScreen.classList.remove("hidden");
  }, 600);
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}