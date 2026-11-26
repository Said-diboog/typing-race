// Configuración de Firebase Realtime Database
const firebaseConfig = {
  apiKey: "AIzaSyAMY1cpw-QCSdgJAspUykPMihAPxx9Iw1M",
  authDomain: "animal-type.firebaseapp.com",
  databaseURL: "https://animal-type-default-rtdb.firebaseio.com",
  projectId: "animal-type",
  storageBucket: "animal-type.firebasestorage.app",
  messagingSenderId: "803472288217",
  appId: "1:803472288217:web:c3acaf88eb5d360aca51c8",
  measurementId: "G-NHB8QWKRXS"
};

let db = null;
try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.database();
} catch (err) {
  console.warn("Firebase no disponible, modo offline activo:", err);
}

// Banco de textos para ambos modos
const TEXT_BANK = {
  normal: [
    "La programación requiere lógica, paciencia y mucha práctica diaria para resolver problemas reales.",
    "El éxito en el desarrollo de software depende tanto del código limpio como del trabajo en equipo.",
    "La inteligencia artificial transforma la educación, permitiendo crear herramientas rápidas y creativas.",
    "Un buen algoritmo no solo funciona rápido, también es fácil de leer, mantener y escalar en el tiempo.",
    "Escribir sin mirar el teclado aumenta tu productividad y reduce errores al redactar informes técnicos.",
    "La perseverancia convierte cada pequeño error de compilación en una oportunidad para aprender algo nuevo.",
    "Organizar bien cada función facilita encontrar fallos antes de presentar el proyecto en la universidad."
  ],
  code: [
    "int suma = 0;\nfor (int i = 1; i <= 10; i++) {\n    suma += i;\n}",
    "def porcentaje(total, parte):\n    return (parte / total) * 100\nprint(porcentaje(200, 50))",
    "int n = 5, fact = 1;\nwhile (n > 1) {\n    fact *= n;\n    n--;\n}",
    "let nums = [4, 8, 15, 16];\nlet doble = nums.map(x => x * 2);\nconsole.log(doble);",
    "int a = 15, b = 27;\nint total = a + b;\nSystem.out.println(\"Suma: \" + total);",
    "for i in range(1, 6):\n    if i % 2 == 0:\n        print(i, \"es par\")"
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

function getAnimalSVG(animalKey, pose = "idle") {
  const a = ANIMALS[animalKey] || ANIMALS.leon;

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

  const crown = pose === "first"
    ? `<polygon points="36,12 42,2 50,10 58,2 64,12" fill="#facc15" stroke="#eab308" stroke-width="1.5"/>`
    : "";

  let face = "";
  if (pose === "first") {
    face = `
      <path d="M38 30 Q42 25 46 30" stroke="#334155" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M54 30 Q58 25 62 30" stroke="#334155" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M42 38 Q50 47 58 38 Z" fill="#f43f5e"/>
    `;
  } else if (pose === "second") {
    face = `
      <circle cx="42" cy="30" r="2.8" fill="#334155"/>
      <circle cx="58" cy="30" r="2.8" fill="#334155"/>
      <path d="M43 39 Q50 41 57 38" stroke="#334155" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    `;
  } else if (pose === "third") {
    face = `
      <path d="M38 30 Q42 26 46 30" stroke="#334155" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M54 30 Q58 26 62 30" stroke="#334155" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M44 38 Q50 43 56 38" stroke="#334155" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    `;
  } else if (pose === "fourth") {
    face = `
      <line x1="37" y1="26" x2="45" y2="29" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
      <line x1="63" y1="26" x2="55" y2="29" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
      <circle cx="42" cy="32" r="2.6" fill="#334155"/>
      <circle cx="58" cy="32" r="2.6" fill="#334155"/>
      <path d="M43 42 Q50 36 57 42" stroke="#334155" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M64 35 Q67 41 64 44 Q61 41 64 35 Z" fill="#38bdf8"/>
    `;
  } else {
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

  let leftArm = `<rect class="arm-left" x="23" y="52" width="10" height="22" rx="5" fill="${a.body}"/>`;
  let rightArm = `<rect class="arm-right" x="67" y="52" width="10" height="22" rx="5" fill="${a.body}"/>`;

  if (pose === "first") {
    leftArm = `<rect x="20" y="34" width="10" height="24" rx="5" transform="rotate(-35 25 54)" fill="${a.body}"/>`;
    rightArm = `<rect x="70" y="34" width="10" height="24" rx="5" transform="rotate(35 75 54)" fill="${a.body}"/>`;
  } else if (pose === "second") {
    leftArm = `<rect x="23" y="53" width="10" height="21" rx="5" fill="${a.body}"/>`;
    rightArm = `<rect x="68" y="45" width="10" height="22" rx="5" transform="rotate(25 70 55)" fill="${a.body}"/>`;
  } else if (pose === "third") {
    leftArm = `<rect class="arm-left" x="30" y="52" width="10" height="20" rx="5" fill="${a.body}"/>`;
    rightArm = `<rect class="arm-right" x="60" y="52" width="10" height="20" rx="5" fill="${a.body}"/>`;
  } else if (pose === "fourth") {
    leftArm = `<rect x="25" y="55" width="9" height="23" rx="4.5" transform="rotate(8 29 55)" fill="${a.body}"/>`;
    rightArm = `<rect x="66" y="55" width="9" height="23" rx="4.5" transform="rotate(-8 70 55)" fill="${a.body}"/>`;
  }

  return `
    <svg viewBox="0 0 100 108" width="100%" height="100%">
      <g class="svg-body-group">
        <rect class="leg-left" x="37" y="75" width="11" height="24" rx="5.5" fill="${a.body}"/>
        <rect class="leg-right" x="52" y="75" width="11" height="24" rx="5.5" fill="${a.body}"/>
        <rect x="32" y="49" width="36" height="31" rx="14" fill="${a.shirt}"/>
        ${leftArm}
        ${rightArm}
        ${headDecor}
        <circle cx="50" cy="33" r="19" fill="${a.head}"/>
        <circle cx="37" cy="36" r="3.2" fill="#fda4af" opacity="0.65"/>
        <circle cx="63" cy="36" r="3.2" fill="#fda4af" opacity="0.65"/>
        <ellipse cx="50" cy="36" rx="7" ry="5" fill="#fff" opacity="0.8"/>
        <circle cx="50" cy="34" r="2.3" fill="#475569"/>
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
let countdownTimer = null;
let typingStopTimer = null;
let totalKeystrokes = 0;
let errorKeystrokes = 0;
let currentStreak = 0;
let racers = [];

// Estado multijugador
let isOnline = false;
let isHost = false;
let currentRoomCode = null;
let myPlayerId = "p_" + Math.random().toString(36).substring(2, 9);
let roomRef = null;
let lastSyncTime = 0;
let currentScreenState = "lobby"; // lobby | waiting | racing | podium

// Elementos DOM
const lobbyScreen = document.getElementById("lobby-screen");
const waitingScreen = document.getElementById("waiting-screen");
const raceScreen = document.getElementById("race-screen");
const podiumScreen = document.getElementById("podium-screen");
const trackContainer = document.getElementById("track-container");
const textDisplay = document.getElementById("text-display");
const typingInput = document.getElementById("typing-input");
const countdownOverlay = document.getElementById("countdown-overlay");

function showOnlyScreen(screenEl) {
  lobbyScreen.classList.add("hidden");
  waitingScreen.classList.add("hidden");
  raceScreen.classList.add("hidden");
  podiumScreen.classList.add("hidden");
  screenEl.classList.remove("hidden");
}

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

// Sonidos sintetizados
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

function stopAllTimers() {
  raceActive = false;
  clearInterval(botInterval);
  clearInterval(countdownTimer);
  clearTimeout(typingStopTimer);
}

function leaveOnlineRoom() {
  if (roomRef) {
    roomRef.off();
    if (isHost) {
      roomRef.remove();
    } else {
      roomRef.child(`players/${myPlayerId}`).remove();
    }
    roomRef = null;
  }
  isOnline = false;
  isHost = false;
  currentRoomCode = null;
}

function goToLobby() {
  stopAllTimers();
  leaveOnlineRoom();
  typingInput.blur();
  currentScreenState = "lobby";
  showOnlyScreen(lobbyScreen);
}

// Selección de Animal y Modo
document.querySelectorAll(".avatar-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".avatar-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedAnimal = btn.dataset.animal;
  });
});

document.querySelectorAll(".mode-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedMode = btn.dataset.mode;
  });
});

// Botones principales
document.getElementById("start-solo-btn").addEventListener("click", setupSoloRace);
document.getElementById("create-room-btn").addEventListener("click", createOnlineRoom);
document.getElementById("join-room-btn").addEventListener("click", joinOnlineRoom);
document.getElementById("leave-room-btn").addEventListener("click", goToLobby);
document.getElementById("abort-race-btn").addEventListener("click", goToLobby);
document.getElementById("back-lobby-btn").addEventListener("click", goToLobby);

document.getElementById("new-text-btn").addEventListener("click", () => {
  if (!isOnline) setupSoloRace();
});

document.getElementById("play-again-btn").addEventListener("click", () => {
  if (!isOnline) {
    setupSoloRace();
  } else if (isHost && roomRef) {
    // El anfitrión reinicia la sala para todos
    const pool = TEXT_BANK[selectedMode];
    const nextText = pool[Math.floor(Math.random() * pool.length)];
    const resetPlayers = {};
    racers.forEach(r => {
      resetPlayers[r.id] = {
        name: r.rawName,
        animal: r.animal,
        isHost: r.isHost,
        progress: 0,
        wpm: 0,
        running: false,
        finishDuration: null
      };
    });
    roomRef.update({
      status: "waiting",
      text: nextText,
      players: resetPlayers
    });
  }
});

document.getElementById("copy-code-btn").addEventListener("click", () => {
  if (!currentRoomCode) return;
  navigator.clipboard.writeText(currentRoomCode);
  const btn = document.getElementById("copy-code-btn");
  btn.textContent = "✅ ¡Copiado!";
  setTimeout(() => { btn.textContent = "📋 Copiar"; }, 1800);
});

document.getElementById("typing-wrapper").addEventListener("click", () => {
  if (raceActive) typingInput.focus();
});

// ==========================================
// LÓGICA MULTIJUGADOR ONLINE (FIREBASE)
// ==========================================
function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function createOnlineRoom() {
  if (!db) {
    alert("No se pudo conectar con Firebase. Revisa tu conexión a internet.");
    return;
  }

  const rawName = document.getElementById("player-name").value.trim();
  playerName = rawName || ANIMALS[selectedAnimal].label;
  isOnline = true;
  isHost = true;
  currentRoomCode = generateRoomCode();

  const pool = TEXT_BANK[selectedMode];
  const initialText = pool[Math.floor(Math.random() * pool.length)];

  roomRef = db.ref(`rooms/${currentRoomCode}`);
  await roomRef.set({
    status: "waiting",
    mode: selectedMode,
    text: initialText,
    createdAt: Date.now(),
    players: {
      [myPlayerId]: {
        name: playerName,
        animal: selectedAnimal,
        isHost: true,
        progress: 0,
        wpm: 0,
        running: false,
        finishDuration: null
      }
    }
  });

  roomRef.onDisconnect().remove();
  listenToRoom();
}

async function joinOnlineRoom() {
  if (!db) {
    alert("No se pudo conectar con Firebase. Revisa tu conexión a internet.");
    return;
  }

  const codeInput = document.getElementById("room-code-input").value.trim().toUpperCase();
  if (codeInput.length !== 4) {
    alert("Escribe el código de 4 letras de la sala.");
    return;
  }

  const snap = await db.ref(`rooms/${codeInput}`).once("value");
  if (!snap.exists()) {
    alert("Esa sala no existe o ya terminó. Verifica el código.");
    return;
  }

  const roomData = snap.val();
  const currentPlayers = roomData.players ? Object.keys(roomData.players).length : 0;
  if (currentPlayers >= 5) {
    alert("La sala ya está llena (máximo 5 corredores).");
    return;
  }
  if (roomData.status !== "waiting") {
    alert("La carrera en esa sala ya comenzó. Espera a que terminen.");
    return;
  }

  const rawName = document.getElementById("player-name").value.trim();
  playerName = rawName || ANIMALS[selectedAnimal].label;
  isOnline = true;
  isHost = false;
  currentRoomCode = codeInput;
  selectedMode = roomData.mode || "normal";

  roomRef = db.ref(`rooms/${currentRoomCode}`);
  const myRef = roomRef.child(`players/${myPlayerId}`);
  await myRef.set({
    name: playerName,
    animal: selectedAnimal,
    isHost: false,
    progress: 0,
    wpm: 0,
    running: false,
    finishDuration: null
  });

  myRef.onDisconnect().remove();
  listenToRoom();
}

document.getElementById("start-online-race-btn").addEventListener("click", () => {
  if (!isOnline || !isHost || !roomRef) return;
  roomRef.update({ status: "racing" });
});

function listenToRoom() {
  roomRef.on("value", snapshot => {
    const data = snapshot.val();
    if (!data) {
      if (currentScreenState !== "lobby") {
        alert("El anfitrión cerró la sala.");
        goToLobby();
      }
      return;
    }

    selectedMode = data.mode;
    targetText = data.text;
    const playersObj = data.players || {};

    racers = Object.keys(playersObj).map(id => {
      const p = playersObj[id];
      const isMe = id === myPlayerId;
      return {
        id,
        rawName: p.name,
        name: isMe ? `${p.name} (Tú)` : p.name,
        animal: p.animal,
        isHost: !!p.isHost,
        progress: p.progress || 0,
        wpm: p.wpm || 0,
        running: !!p.running,
        finishDuration: p.finishDuration || null,
        isMe
      };
    });

    if (data.status === "waiting") {
      if (currentScreenState !== "waiting") {
        stopAllTimers();
        currentScreenState = "waiting";
        renderWaitingRoom();
        showOnlyScreen(waitingScreen);
      } else {
        renderWaitingRoom();
      }
    } else if (data.status === "racing") {
      if (currentScreenState !== "racing" && currentScreenState !== "podium") {
        currentScreenState = "racing";
        prepareRaceUI();
        startCountdown();
      } else if (currentScreenState === "racing") {
        updateTrackUI();
        // Si todos terminaron, mostrar podio
        if (racers.length > 0 && racers.every(r => r.finishDuration !== null)) {
          finishRace();
        }
      }
    }
  });
}

function renderWaitingRoom() {
  document.getElementById("display-room-code").textContent = currentRoomCode;
  document.getElementById("waiting-mode-badge").textContent =
    selectedMode === "normal" ? "🌸 Escritura Normal" : "🧩 Modo Programación";
  document.getElementById("players-count-label").textContent =
    `Corredores en la pista (${racers.length}/5):`;

  const grid = document.getElementById("waiting-players-grid");
  let html = "";

  for (let i = 0; i < 5; i++) {
    const r = racers[i];
    if (r) {
      html += `
        <div class="waiting-slot">
          <div class="waiting-avatar">${getAnimalSVG(r.animal, "idle")}</div>
          <div class="waiting-name">${escapeHtml(r.name)}</div>
          ${r.isHost ? `<span class="host-badge">👑 Anfitrión</span>` : ""}
        </div>
      `;
    } else {
      html += `
        <div class="waiting-slot empty-slot">
          <span>Esperando jugador...</span>
        </div>
      `;
    }
  }
  grid.innerHTML = html;

  if (isHost) {
    document.getElementById("host-controls").classList.remove("hidden");
    document.getElementById("guest-wait-msg").classList.add("hidden");
  } else {
    document.getElementById("host-controls").classList.add("hidden");
    document.getElementById("guest-wait-msg").classList.remove("hidden");
  }
}

function syncMyOnlineProgress(force = false) {
  if (!isOnline || !roomRef) return;
  const now = Date.now();
  if (!force && now - lastSyncTime < 140) return;
  lastSyncTime = now;

  const me = racers.find(r => r.isMe);
  if (!me) return;

  roomRef.child(`players/${myPlayerId}`).update({
    progress: me.progress,
    wpm: me.wpm,
    running: me.running,
    finishDuration: me.finishDuration || null
  });
}

// ==========================================
// LÓGICA MODO PRÁCTICA SOLO (BOTS)
// ==========================================
function setupSoloRace() {
  stopAllTimers();
  isOnline = false;
  isHost = false;
  currentRoomCode = null;
  currentScreenState = "racing";

  const rawName = document.getElementById("player-name").value.trim();
  playerName = rawName || ANIMALS[selectedAnimal].label;

  const pool = TEXT_BANK[selectedMode];
  let nextText = pool[Math.floor(Math.random() * pool.length)];
  if (pool.length > 1 && nextText === targetText) {
    nextText = pool[(pool.indexOf(targetText) + 1) % pool.length];
  }
  targetText = nextText;

  const otherAnimals = Object.keys(ANIMALS).filter(k => k !== selectedAnimal);
  racers = [
    { id: "me", rawName: playerName, name: `${playerName} (Tú)`, animal: selectedAnimal, progress: 0, wpm: 0, finishDuration: null, isMe: true, running: false },
    { id: "b1", rawName: "Bot León", name: `Bot ${ANIMALS[otherAnimals[0]].label}`, animal: otherAnimals[0], progress: 0, wpm: 0, speed: 62, finishDuration: null, isMe: false, running: false },
    { id: "b2", rawName: "Bot Tigre", name: `Bot ${ANIMALS[otherAnimals[1]].label}`, animal: otherAnimals[1], progress: 0, wpm: 0, speed: 50, finishDuration: null, isMe: false, running: false },
    { id: "b3", rawName: "Bot Conejo", name: `Bot ${ANIMALS[otherAnimals[2]].label}`, animal: otherAnimals[2], progress: 0, wpm: 0, speed: 41, finishDuration: null, isMe: false, running: false },
    { id: "b4", rawName: "Bot Zorro", name: `Bot ${ANIMALS[otherAnimals[3]].label}`, animal: otherAnimals[3], progress: 0, wpm: 0, speed: 33, finishDuration: null, isMe: false, running: false }
  ];

  prepareRaceUI();
  startCountdown();
}

// ==========================================
// MOTOR COMÚN DE CARRERA Y PODIO
// ==========================================
function prepareRaceUI() {
  totalKeystrokes = 0;
  errorKeystrokes = 0;
  currentStreak = 0;
  typingInput.value = "";

  document.getElementById("current-mode-label").textContent =
    selectedMode === "normal" ? "Texto Normal" : "Programación";
  document.getElementById("wpm-display").textContent = "0 PPM";
  document.getElementById("accuracy-display").textContent = "100%";
  document.getElementById("streak-display").textContent = "0 ✨";

  const newTextBtn = document.getElementById("new-text-btn");
  const roomTag = document.getElementById("race-room-tag");

  if (isOnline) {
    newTextBtn.classList.add("hidden");
    roomTag.textContent = `Sala: ${currentRoomCode}`;
    roomTag.classList.remove("hidden");
  } else {
    newTextBtn.classList.remove("hidden");
    roomTag.classList.add("hidden");
  }

  renderTrack();
  renderText("");
  showOnlyScreen(raceScreen);
}

function startCountdown() {
  let count = 3;
  countdownOverlay.classList.remove("hidden");
  countdownOverlay.textContent = count;
  playBeep(523, 0.15);

  countdownTimer = setInterval(() => {
    count--;
    if (count > 0) {
      countdownOverlay.textContent = count;
      playBeep(523, 0.15);
    } else {
      clearInterval(countdownTimer);
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

  if (!isOnline) {
    racers.forEach(r => { if (!r.isMe) r.running = true; });
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
          if (r.progress >= 100 && r.finishDuration === null) {
            r.finishDuration = Date.now() - startTime;
            r.running = false;
          }
        }
      });

      updateTrackUI();
      if (racers.every(r => r.finishDuration !== null)) {
        finishRace();
      }
    }, 200);
  }
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
  if (me) {
    me.progress = progress;
    me.wpm = wpm;
    me.running = true;

    clearTimeout(typingStopTimer);
    typingStopTimer = setTimeout(() => {
      me.running = false;
      updateTrackUI();
      syncMyOnlineProgress(true);
    }, 450);

    if (typed === targetText && me.finishDuration === null) {
      me.finishDuration = Date.now() - startTime;
      me.running = false;
      playBeep(987, 0.35);
      syncMyOnlineProgress(true);

      if (!isOnline || racers.every(r => r.finishDuration !== null)) {
        finishRace();
      }
    } else {
      syncMyOnlineProgress(false);
    }
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
        <span class="racer-tag">${escapeHtml(r.name)}</span>
      </div>
      <span class="lane-wpm" id="wpm-${r.id}">0 PPM</span>
      <div class="finish-line"></div>
    </div>
  `).join("");
}

function updateTrackUI() {
  // Si en online entró/salió alguien, reconstruir carriles si cambia la cantidad
  if (trackContainer.children.length !== racers.length) {
    renderTrack();
  }

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

function finishRace() {
  if (currentScreenState === "podium") return;
  stopAllTimers();
  currentScreenState = "podium";

  const sorted = [...racers].sort((a, b) => {
    if (a.finishDuration !== null && b.finishDuration !== null) return a.finishDuration - b.finishDuration;
    if (a.finishDuration !== null) return -1;
    if (b.finishDuration !== null) return 1;
    return b.progress - a.progress;
  });

  const top4 = sorted.slice(0, 4);

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
        <div class="podium-name">${escapeHtml(slot.data.name)}</div>
        <div class="podium-stats">${slot.data.wpm} PPM</div>
        <div class="podium-block ${slot.blockClass}">
          <span class="podium-rank">${slot.medal}</span>
          <span class="podium-mood">${slot.mood}</span>
        </div>
      </div>
    `;
  }).join("");

  const fifthNote = document.getElementById("fifth-place-note");
  if (sorted[4] && sorted[4].isMe) {
    fifthNote.textContent = `Quedaste en 5.º lugar (${sorted[4].wpm} PPM). ¡Inténtalo otra vez para subir al podio de los 4 mejores!`;
    fifthNote.classList.remove("hidden");
  } else {
    fifthNote.classList.add("hidden");
  }

  // Configurar botón de revancha según si es anfitrión o invitado
  const playAgainBtn = document.getElementById("play-again-btn");
  if (isOnline && !isHost) {
    playAgainBtn.classList.add("hidden");
  } else {
    playAgainBtn.classList.remove("hidden");
    playAgainBtn.textContent = isOnline ? "🔄 Nueva Ronda en la Sala" : "🔄 Correr de Nuevo";
  }

  launchConfetti();

  setTimeout(() => {
    showOnlyScreen(podiumScreen);
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
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}