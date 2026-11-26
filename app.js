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

// Configuración visual de los animales en colores pastel
const ANIMALS = {
  leon: { label: "León", head: "#fcd34d", body: "#fbbf24", shirt: "#93c5fd", ear: "#f59e0b", mane: "#d97706" },
  tigre: { label: "Tigre", head: "#fdba74", body: "#fb923c", shirt: "#86efac", ear: "#ea580c", stripes: true },
  conejo: { label: "Conejo", head: "#fce7f3", body: "#fbcfe8", shirt: "#c4b5fd", ear: "#f9a8d4", longEars: true },
  zorro: { label: "Zorro", head: "#fda4af", body: "#fb7185", shirt: "#fde047", ear: "#e11d48", pointyEars: true },
  panda: { label: "Panda", head: "#ffffff", body: "#f1f5f9", shirt: "#f9a8d4", ear: "#475569", pandaEyes: true },
  koala: { label: "Koala", head: "#cbd5e1", body: "#94a3b8", shirt: "#fed7aa", ear: "#64748b", bigEars: true }
};

// Generador de personajes SVG animados (corriendo y poses del podio)
function getAnimalSVG(animalKey, pose = "idle") {
  const a = ANIMALS[animalKey] || ANIMALS.leon;

  // Orejas o melena según especie
  let headDecor = "";
  if (a.mane) {
    headDecor = `<circle cx="50" cy="33" r="24" fill="${a.mane}" />`;
  } else if (a.longEars) {
    headDecor = `
      <rect x="33" y="2" width="10" height="24" rx="5" fill="${a.head}" stroke="${a.ear}" stroke-width="2"/>
      <rect x="57" y="2" width="10" height="24" rx="5" fill="${a.head}" stroke="${a.ear}" stroke-width="2"/>
    `;
  } else if (a.bigEars) {
    headDecor = `
      <circle cx="27" cy="24" r="10" fill="${a.ear}" />
      <circle cx="73" cy="24" r="10" fill="${a.ear}" />
    `;
  } else {
    headDecor = `
      <polygon points="28,22 36,6 45,20" fill="${a.ear}" />
      <polygon points="72,22 64,6 55,20" fill="${a.ear}" />
    `;
  }

  // Corona dorada para el 1er lugar
  const crown = pose === "first"
    ? `<polygon points="36,12 42,2 50,10 58,2 64,12" fill="#facc15" stroke="#eab308" stroke-width="1.5"/>`
    : "";

  // Detalles faciales (ojos y boca según estado)
  let face = "";
  if (pose === "first") {
    // 1° lugar: súper feliz celebrando
    face = `
      <path d="M38 30 Q42 25 46 30" stroke="#334155" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M54 30 Q58 25 62 30" stroke="#334155" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M42 38 Q50 47 58 38 Z" fill="#f43f5e"/>
    `;
  } else if (pose === "second") {
    // 2° lugar: "más o menos" (sonrisa calmada / neutra)
    face = `
      <circle cx="42" cy="30" r="2.8" fill="#334155"/>
      <circle cx="58" cy="30" r="2.8" fill="#334155"/>
      <path d="M43 39 Q50 41 57 38" stroke="#334155" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    `;
  } else if (pose === "third") {
    // 3° lugar: contento aplaudiendo
    face = `
      <path d="M38 30 Q42 26 46 30" stroke="#334155" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M54 30 Q58 26 62 30" stroke="#334155" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M44 38 Q50 43 56 38" stroke="#334155" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    `;
  } else if (pose === "fourth") {
    // 4° lugar: triste con lagrimita
    face = `
      <line x1="37" y1="26" x2="45" y2="29" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
      <line x1="63" y1="26" x2="55" y2="29" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
      <circle cx="42" cy="32" r="2.6" fill="#334155"/>
      <circle cx="58" cy="32" r="2.6" fill="#334155"/>
      <path d="M43 42 Q50 36 57 42" stroke="#334155" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M64 35 Q67 41 64 44 Q61 41 64 35 Z" fill="#38bdf8"/>
    `;
  } else {
    // Corriendo o en lobby
    const pandaPatch = a.pandaEyes
      ? `<circle cx="42" cy="30" r="5.5" fill="#475569"/><circle cx="58" cy="30" r="5.5" fill="#475569"/>`
      : "";
    face = `
      ${pandaPatch}
      <circle cx="42" cy="30" r="2.8" fill="${a.pandaEyes ? '#fff' : '#334155'}"/>
      <circle cx="58" cy="30" r="2.8" fill="${a.pandaEyes ? '#fff' : '#334155'}"/>
      <path d="M44 38 Q50 43 56 38" stroke="#334155" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    `;
  }

  // Posición de los brazos según pose
  let leftArm = `<rect class="arm-left" x="23" y="52" width="10" height="22" rx="5" fill="${a.body}"/>`;
  let rightArm = `<rect class="arm-right" x="67" y="52" width="10" height="22" rx="5" fill="${a.body}"/>`;

  if (pose === "first") {
    // Brazos levantados celebrando
    leftArm = `<rect x="20" y="34" width="10" height="24" rx="5" transform="rotate(-35 25 54)" fill="${a.body}"/>`;
    rightArm = `<rect x="70" y="34" width="10" height="24" rx="5" transform="rotate(35 75 54)" fill="${a.body}"/>`;
  } else if (pose === "second") {
    // Un brazo relajado y otro saludando leve
    leftArm = `<rect x="23" y="53" width="10" height="21" rx="5" fill="${a.body}"/>`;
    rightArm = `<rect x="68" y="45" width="10" height="22" rx="5" transform="rotate(25 70 55)" fill="${a.body}"/>`;
  } else if (pose === "third") {
    // Brazos al frente aplaudiendo
    leftArm = `<rect class="arm-left" x="30" y="52" width="10" height="20" rx="5" fill="${a.body}"/>`;
    rightArm = `<rect class="arm-right" x="60" y="52" width="10" height="20" rx="5" fill="${a.body}"/>`;
  } else if (pose === "fourth") {
    // Brazos caídos de tristeza
    leftArm = `<rect x="25" y="55" width="9" height="23" rx="4.5" transform="rotate(8 29 55)" fill="${a.body}"/>`;
    rightArm = `<rect x="66" y="55" width="9" height="23" rx="4.5" transform="rotate(-8 70 55)" fill="${a.body}"/>`;
  }

  return `
    <svg viewBox="0 0 100 108" width="100%" height="100%">
      <g class="svg-body-group">
        <!-- Piernas -->
        <rect class="leg-left" x="37" y="75" width="11" height="24" rx="5.5" fill="${a.body}"/>
        <rect class="leg-right" x="52" y="75" width="11" height="24" rx="5.5" fill="${a.body}"/>

        <!-- Torso y camiseta pastel -->
        <rect x="32" y="49" width="36" height="31" rx="14" fill="${a.shirt}"/>

        <!-- Brazos -->
        ${leftArm}
        ${rightArm}

        <!-- Orejas / Melena -->
        ${headDecor}

        <!-- Cabeza -->
        <circle cx="50" cy="33" r="19" fill="${a.head}"/>

        <!-- Mejillas pastel -->
        <circle cx="37" cy="36" r="3.2" fill="#fda4af" opacity="0.65"/>
        <circle cx="63" cy="36" r="3.2" fill="#fda4af" opacity="0.65"/>

        <!-- Hocico -->
        <ellipse cx="50" cy="36" rx="7" ry="5" fill="#fff" opacity="0.8"/>
        <circle cx="50" cy="34" r="2.3" fill="#475569"/>

        <!-- Ojos y expresión -->
        ${face}
        ${crown}
      </g>
    </svg>
  `;
}

// Estado del juego
let selectedAnimal = "leon";
let selectedMode = "normal";
let playerName = "Tú";
let targetText = "";
let startTime = null;
let raceActive = false;
let botInterval = null;
let typingStopTimer = null;
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

// Pintar los 6 avatares animales en el lobby
document.querySelectorAll(".avatar-preview").forEach(box => {
  const key = box.dataset.preview;
  box.innerHTML = getAnimalSVG(key, "idle");
});

// Llenar la tribuna con afición alentando
function renderCrowd() {
  const crowdRow = document.getElementById("crowd-row");
  const colors = ["#93c5fd", "#fde047", "#86efac", "#c4b5fd", "#fdba74", "#f9a8d4"];
  const flags = ["🚩", "🎉", "⭐", "🏁", "✨", "🎈"];
  let html = "";
  for (let i = 0; i < 16; i++) {
    const c = colors[i % colors.length];
    const f = flags[i % flags.length];
    const delay = (i * 0.11).toFixed(2);
    html += `
      <div class="spectator" style="animation-delay: ${delay}s">
        <span class="spec-flag" style="animation-delay: ${delay}s">${f}</span>
        <div class="spec-head" style="background: ${c}"></div>
        <div class="spec-body" style="background: ${c}"></div>
      </div>
    `;
  }
  crowdRow.innerHTML = html;
}
renderCrowd();

// Sonidos suaves sintetizados
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playBeep(freq, duration, type = "sine") {
  if (audioCtx.state === "suspended") audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

// Selección de Animal
document.querySelectorAll(".avatar-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".avatar-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedAnimal = btn.dataset.animal;
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
  playerName = rawName || ANIMALS[selectedAnimal].label;

  const pool = TEXT_BANK[selectedMode];
  targetText = pool[Math.floor(Math.random() * pool.length)];

  totalKeystrokes = 0;
  errorKeystrokes = 0;
  currentStreak = 0;
  raceActive = false;
  typingInput.value = "";

  document.getElementById("current-mode-label").textContent =
    selectedMode === "normal" ? "Texto Normal" : "Programación";
  document.getElementById("wpm-display").textContent = "0 PPM";
  document.getElementById("accuracy-display").textContent = "100%";
  document.getElementById("streak-display").textContent = "0 ✨";

  // Elegir 4 animales rivales distintos al del jugador
  const otherAnimals = Object.keys(ANIMALS).filter(k => k !== selectedAnimal);
  racers = [
    { id: "me", name: `${playerName} (Tú)`, animal: selectedAnimal, progress: 0, wpm: 0, finishedAt: null, isMe: true, running: false },
    { id: "b1", name: `Bot ${ANIMALS[otherAnimals[0]].label}`, animal: otherAnimals[0], progress: 0, wpm: 0, speed: 62, finishedAt: null, isMe: false, running: false },
    { id: "b2", name: `Bot ${ANIMALS[otherAnimals[1]].label}`, animal: otherAnimals[1], progress: 0, wpm: 0, speed: 50, finishedAt: null, isMe: false, running: false },
    { id: "b3", name: `Bot ${ANIMALS[otherAnimals[2]].label}`, animal: otherAnimals[2], progress: 0, wpm: 0, speed: 41, finishedAt: null, isMe: false, running: false },
    { id: "b4", name: `Bot ${ANIMALS[otherAnimals[3]].label}`, animal: otherAnimals[3], progress: 0, wpm: 0, speed: 33, finishedAt: null, isMe: false, running: false }
  ];

  renderTrack();
  renderText("");

  lobbyScreen.classList.add("hidden");
  podiumScreen.classList.add("hidden");
  raceScreen.classList.remove("hidden");

  let count = 3;
  countdownOverlay.classList.remove("hidden");
  countdownOverlay.textContent = count;
  playBeep(523, 0.15);

  const timer = setInterval(() => {
    count--;
    if (count > 0) {
      countdownOverlay.textContent = count;
      playBeep(523, 0.15);
    } else {
      clearInterval(timer);
      countdownOverlay.classList.add("hidden");
      playBeep(784, 0.25);
      startRace();
    }
  }, 800);
}

function startRace() {
  raceActive = true;
  startTime = Date.now();
  typingInput.focus();

  // Los bots empiezan a correr
  racers.forEach(r => {
    if (!r.isMe) r.running = true;
  });

  botInterval = setInterval(() => {
    if (!raceActive) return;
    const elapsedMin = (Date.now() - startTime) / 60000;

    racers.forEach(r => {
      if (!r.isMe && r.progress < 100) {
        const charsPerSec = (r.speed * 5) / 60;
        const jitter = 0.75 + Math.random() * 0.5;
        const deltaPercent = ((charsPerSec * 0.2 * jitter) / targetText.length) * 100;
        r.progress = Math.min(100, r.progress + deltaPercent);
        r.wpm = Math.round(((r.progress / 100) * targetText.length / 5) / Math.max(elapsedMin, 0.01));
        if (r.progress >= 100 && !r.finishedAt) {
          r.finishedAt = Date.now();
          r.running = false;
        }
      }
    });

    updateTrackUI();
    checkAllFinished();
  }, 200);
}

typingInput.addEventListener("keydown", e => {
  if (!raceActive) return;
  if (e.key === "Tab") {
    e.preventDefault();
    typingInput.value += "    ";
    typingInput.dispatchEvent(new Event("input"));
  }
});

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
      playBeep(580 + Math.min(currentStreak * 6, 260), 0.04);
    } else {
      errorKeystrokes++;
      currentStreak = 0;
      playBeep(210, 0.09, "triangle");
    }
  }

  renderText(typed);

  const elapsedMin = Math.max((Date.now() - startTime) / 60000, 0.01);
  const wpm = Math.round((correctPrefix / 5) / elapsedMin);
  const accuracy = totalKeystrokes > 0
    ? Math.max(0, Math.round(((totalKeystrokes - errorKeystrokes) / totalKeystrokes) * 100))
    : 100;
  const progress = Math.min(100, (correctPrefix / targetText.length) * 100);

  document.getElementById("wpm-display").textContent = `${wpm} PPM`;
  document.getElementById("accuracy-display").textContent = `${accuracy}%`;
  document.getElementById("streak-display").textContent = `${currentStreak} ✨`;

  const me = racers.find(r => r.isMe);
  me.progress = progress;
  me.wpm = wpm;
  me.running = true;

  // Si deja de teclear por 450ms, detiene la animación de patitas
  clearTimeout(typingStopTimer);
  typingStopTimer = setTimeout(() => {
    me.running = false;
    updateTrackUI();
  }, 450);

  if (typed === targetText && !me.finishedAt) {
    me.finishedAt = Date.now();
    me.running = false;
    playBeep(987, 0.35);
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
        <span class="dust-puff">💨</span>
        <div class="racer-sprite">${getAnimalSVG(r.animal, "running")}</div>
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

    const maxLeft = 80;
    racerEl.style.left = `calc(8px + ${(r.progress / 100) * maxLeft}%)`;
    wpmEl.textContent = `${r.wpm} PPM`;

    if (r.running) {
      racerEl.classList.add("is-running");
    } else {
      racerEl.classList.remove("is-running");
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

  // Tomar SOLO los 4 primeros lugares para el podio
  const top4 = sorted.slice(0, 4);

  // Orden visual clásico de podio: 2° a la izquierda, 1° al centro-izq, 3° centro-der, 4° derecha
  const stageOrder = [
    { place: 2, data: top4[1], pose: "second", cssClass: "pose-second", blockClass: "block-2", medal: "🥈 2.º", mood: "Más o menos 🙂" },
    { place: 1, data: top4[0], pose: "first",  cssClass: "pose-first",  blockClass: "block-1", medal: "🥇 1.º", mood: "¡Festejando! 🎉" },
    { place: 3, data: top4[2], pose: "third",  cssClass: "pose-third",  blockClass: "block-3", medal: "🥉 3.º", mood: "Aplaudiendo 👏" },
    { place: 4, data: top4[3], pose: "fourth", cssClass: "pose-fourth", blockClass: "block-4", medal: "4.º",    mood: "Triste 😢" }
  ];

  const podiumStage = document.getElementById("podium-stage");
  podiumStage.innerHTML = stageOrder.map(slot => {
    if (!slot.data) return "";
    return `
      <div class="podium-slot">
        <div class="podium-character ${slot.cssClass}">
          ${getAnimalSVG(slot.data.animal, slot.pose)}
        </div>
        <div class="podium-name">${slot.data.name}</div>
        <div class="podium-stats">${slot.data.wpm} PPM</div>
        <div class="podium-block ${slot.blockClass}">
          <span class="podium-rank">${slot.medal}</span>
          <span class="podium-mood">${slot.mood}</span>
        </div>
      </div>
    `;
  }).join("");

  // Aviso si el jugador quedó en 5to lugar fuera del podio
  const fifthNote = document.getElementById("fifth-place-note");
  if (sorted[4] && sorted[4].isMe) {
    fifthNote.textContent = `Quedaste en 5.º lugar (${sorted[4].wpm} PPM). ¡Inténtalo otra vez para subir al podio de los 4 mejores!`;
    fifthNote.classList.remove("hidden");
  } else {
    fifthNote.classList.add("hidden");
  }

  launchConfetti();

  setTimeout(() => {
    raceScreen.classList.add("hidden");
    podiumScreen.classList.remove("hidden");
  }, 550);
}

function launchConfetti() {
  const container = document.getElementById("confetti-container");
  const colors = ["#ffb5c2", "#fde047", "#b8f2e6", "#bde0fe", "#dcd6f7"];
  let html = "";
  for (let i = 0; i < 28; i++) {
    const left = Math.random() * 100;
    const delay = (Math.random() * 1.8).toFixed(2);
    const color = colors[i % colors.length];
    html += `<div class="confetti-piece" style="left:${left}%; background:${color}; animation-delay:${delay}s;"></div>`;
  }
  container.innerHTML = html;
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}