const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ui = {
  score: document.getElementById("score"),
  wave: document.getElementById("wave"),
  combo: document.getElementById("combo"),
  modeLabel: document.getElementById("mode-label"),
  weaponName: document.getElementById("weapon-name"),
  ammo: document.getElementById("ammo"),
  healthBar: document.getElementById("health-bar"),
  timerLabel: document.getElementById("timer-label"),
  powerupStatus: document.getElementById("powerup-status"),
  upgradeBtn: document.getElementById("upgrade-btn"),
  upgradeLevel: document.getElementById("upgrade-level"),
  leaderboard: document.getElementById("leaderboard"),
  outfitColor: document.getElementById("outfit-color"),
  hitMarker: document.getElementById("hit-marker"),
  lowHealthVignette: document.getElementById("low-health-vignette"),
  startOverlay: document.getElementById("start-overlay"),
  pauseOverlay: document.getElementById("pause-overlay"),
  gameOverOverlay: document.getElementById("gameover-overlay"),
  gameOverTitle: document.getElementById("gameover-title"),
  gameOverText: document.getElementById("gameover-text"),
  startBtn: document.getElementById("start-btn"),
  resumeBtn: document.getElementById("resume-btn"),
  restartBtn: document.getElementById("restart-btn"),
  retryBtn: document.getElementById("retry-btn"),
  musicBtn: document.getElementById("music-btn"),
  modeButtons: Array.from(document.querySelectorAll(".mode-btn")),
  difficultyButtons: Array.from(document.querySelectorAll(".difficulty-btn")),
  weaponButtons: Array.from(document.querySelectorAll(".weapon-btn")),
  bindButtons: Array.from(document.querySelectorAll(".bind-btn")),
  bindHint: document.getElementById("bind-hint"),
  resetControls: document.getElementById("reset-controls")
};

const audio = {
  music: document.getElementById("music-audio"),
  shoot: document.getElementById("shoot-audio"),
  reload: document.getElementById("reload-audio"),
  hit: document.getElementById("hit-audio"),
  explosion: document.getElementById("explosion-audio"),
  ui: document.getElementById("ui-audio")
};

const musicTracks = [
  { name: "Night Raid", src: "https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3" },
  { name: "Last Stand", src: "https://cdn.pixabay.com/audio/2022/10/25/audio_8565bb3f4d.mp3" },
  { name: "Dark Pulse", src: "https://cdn.pixabay.com/audio/2022/08/02/audio_4b9f61f9ea.mp3" },
  { name: "Cyber Hunt", src: "https://cdn.pixabay.com/audio/2021/11/25/audio_cb52cb6e6d.mp3" }
];

const world = { width: canvas.width, height: canvas.height };

const CONTROL_KEY = "neonZombie.controls";
const SCORE_KEY = "neonZombie.highscores";

const defaultControls = {
  moveUp: "w",
  moveLeft: "a",
  moveDown: "s",
  moveRight: "d",
  reload: "r",
  dodge: "space",
  pause: "escape"
};

const controlLabels = {
  moveUp: "Move Up",
  moveLeft: "Move Left",
  moveDown: "Move Down",
  moveRight: "Move Right",
  reload: "Reload",
  dodge: "Dodge",
  pause: "Pause"
};

const difficultyPresets = {
  easy: { spawnMul: 1.28, speedMul: 0.82, healthMul: 0.84, damageMul: 0.78 },
  medium: { spawnMul: 1, speedMul: 1, healthMul: 1, damageMul: 1 },
  hard: { spawnMul: 0.76, speedMul: 1.18, healthMul: 1.2, damageMul: 1.18 }
};

const modePresets = {
  survival: { label: "Survival", timed: false, hardcore: false, seconds: 0, spawnMul: 1, scoreMul: 1, waveDurationMul: 1, powerupMul: 1, maxCapMul: 1, healthMul: 1 },
  timeAttack: { label: "Time Attack", timed: true, hardcore: false, seconds: 180, spawnMul: 0.84, scoreMul: 1.3, waveDurationMul: 0.85, powerupMul: 0.9, maxCapMul: 1.2, healthMul: 1 },
  hardcore: { label: "Hardcore", timed: false, hardcore: true, seconds: 0, spawnMul: 0.92, scoreMul: 1.2, waveDurationMul: 0.92, powerupMul: 0.75, maxCapMul: 1.1, healthMul: 0.75 }
};

const weaponDefs = {
  pistol: {
    label: "Pistol",
    fireInterval: 0.12,
    bulletSpeed: 920,
    damage: 30,
    spread: 0.02,
    pellets: 1,
    magSize: 50,
    reserve: 250,
    reloadTime: 1.25,
    neon: "#7ee8ff"
  },
  shotgun: {
    label: "Shotgun",
    fireInterval: 0.64,
    bulletSpeed: 820,
    damage: 17,
    spread: 0.17,
    pellets: 6,
    magSize: 12,
    reserve: 72,
    reloadTime: 1.9,
    neon: "#ffc26a"
  },
  rifle: {
    label: "Assault Rifle",
    fireInterval: 0.075,
    bulletSpeed: 980,
    damage: 19,
    spread: 0.042,
    pellets: 1,
    magSize: 42,
    reserve: 240,
    reloadTime: 1.4,
    neon: "#88ff8f"
  },
  sniper: {
    label: "Sniper",
    fireInterval: 1.05,
    bulletSpeed: 1400,
    damage: 115,
    spread: 0.006,
    pellets: 1,
    magSize: 6,
    reserve: 48,
    reloadTime: 2.3,
    neon: "#ff89ff"
  }
};

const zombieTypes = {
  green: {
    label: "Basic Zombie",
    color: "#49d274",
    radius: 18,
    speed: 72,
    health: 58,
    touchDamage: 12,
    points: 12,
    kind: "basic"
  },
  red: {
    label: "Fast Zombie",
    color: "#ff4a4a",
    radius: 16,
    speed: 120,
    health: 80,
    touchDamage: 18,
    points: 20,
    kind: "fast"
  },
  purple: {
    label: "Tank Zombie",
    color: "#b874ff",
    radius: 24,
    speed: 58,
    health: 176,
    touchDamage: 26,
    points: 35,
    kind: "tank"
  },
  blue: {
    label: "Toxic Zombie",
    color: "#54a6ff",
    radius: 20,
    speed: 78,
    health: 86,
    touchDamage: 14,
    points: 24,
    kind: "toxic"
  },
  yellow: {
    label: "Electric Zombie",
    color: "#ffe356",
    radius: 18,
    speed: 88,
    health: 94,
    touchDamage: 15,
    points: 26,
    kind: "electric"
  },
  boss: {
    label: "Boss Zombie",
    color: "#101010",
    radius: 44,
    speed: 52,
    health: 760,
    touchDamage: 42,
    points: 350,
    kind: "boss"
  }
};

const powerupDefs = {
  health: { label: "Health Boost", color: "#63ff6a" },
  shield: { label: "Shield", color: "#60aeff" },
  double: { label: "Double Damage", color: "#ff6666" },
  speed: { label: "Speed Boost", color: "#ffd24f" }
};

const input = {
  keys: Object.create(null),
  mouseX: world.width / 2,
  mouseY: world.height / 2,
  mouseDown: false,
  justPressed: Object.create(null)
};

const state = {
  started: false,
  paused: true,
  gameOver: false,
  mode: "survival",
  difficulty: "easy",
  score: 0,
  wave: 1,
  waveTimer: 0,
  waveDuration: 22,
  combo: 1,
  comboTimer: 0,
  headshots: 0,
  kills: 0,
  timeLeft: modePresets.timeAttack.seconds,
  spawnTimer: 0,
  spawnInterval: 1,
  bossWaveSpawned: false,
  weatherT: 0,
  shake: 0,
  upgradeLevel: 0,
  hitMarkerTimer: 0,
  pendingRebind: null,
  musicIndex: 0
};

const player = {
  x: world.width / 2,
  y: world.height / 2,
  radius: 18,
  baseSpeed: 260,
  facing: 0,
  color: "#4ed0ff",
  maxHealth: 100,
  health: 100,
  fireCooldown: 0,
  dodgeCooldown: 0,
  dodgeTimer: 0,
  stunTimer: 0,
  invulnTimer: 0,
  reloadTimer: 0,
  reloading: false,
  shieldTimer: 0,
  doubleTimer: 0,
  speedTimer: 0,
  activeWeapon: "pistol",
  ammo: {}
};

const bullets = [];
const zombies = [];
const particles = [];
const powerups = [];
const bloodDecals = [];
const explosions = [];

let controls = loadControls();

setup();

function setup() {
  initializeAmmo();
  bindEvents();
  setMode(state.mode);
  setDifficulty(state.difficulty);
  refreshKeybindUI();
  ensureMusicTrack();
  renderLeaderboard();
  bootToStart();
  requestAnimationFrame(loop);
}

function bindEvents() {
  document.addEventListener("keydown", event => {
    const key = normalizeKey(event.key);

    if (state.pendingRebind) {
      event.preventDefault();
      controls[state.pendingRebind] = key;
      saveControls();
      state.pendingRebind = null;
      ui.bindHint.textContent = "Control updated.";
      refreshKeybindUI();
      playSfx(audio.ui, 0.3);
      return;
    }

    input.keys[key] = true;
    input.justPressed[key] = true;

    if (key === controls.pause) {
      event.preventDefault();
      togglePause();
    }

    if (key === controls.reload) {
      tryReload();
    }

    if (key === "1") switchWeapon("pistol");
    if (key === "2") switchWeapon("shotgun");
    if (key === "3") switchWeapon("rifle");
    if (key === "4") switchWeapon("sniper");
  });

  document.addEventListener("keyup", event => {
    input.keys[normalizeKey(event.key)] = false;
  });

  canvas.addEventListener("mousemove", event => {
    const rect = canvas.getBoundingClientRect();
    input.mouseX = ((event.clientX - rect.left) / rect.width) * world.width;
    input.mouseY = ((event.clientY - rect.top) / rect.height) * world.height;
  });

  canvas.addEventListener("mousedown", () => {
    input.mouseDown = true;
  });

  document.addEventListener("mouseup", () => {
    input.mouseDown = false;
  });

  ui.modeButtons.forEach(button => {
    button.addEventListener("click", () => {
      setMode(button.dataset.mode);
      playSfx(audio.ui, 0.35);
    });
  });

  ui.difficultyButtons.forEach(button => {
    button.addEventListener("click", () => {
      setDifficulty(button.dataset.difficulty);
      playSfx(audio.ui, 0.35);
    });
  });

  ui.weaponButtons.forEach(button => {
    button.addEventListener("click", () => {
      switchWeapon(button.dataset.weapon);
    });
  });

  ui.bindButtons.forEach(button => {
    button.addEventListener("click", () => {
      state.pendingRebind = button.dataset.action;
      ui.bindHint.textContent = `Press key for ${controlLabels[state.pendingRebind]}.`;
      refreshKeybindUI();
    });
  });

  ui.resetControls.addEventListener("click", () => {
    controls = { ...defaultControls };
    state.pendingRebind = null;
    saveControls();
    refreshKeybindUI();
    ui.bindHint.textContent = "Controls reset to defaults.";
  });

  ui.outfitColor.addEventListener("input", () => {
    player.color = ui.outfitColor.value;
  });

  ui.startBtn.addEventListener("click", () => {
    startGame();
  });

  ui.resumeBtn.addEventListener("click", closePause);
  ui.restartBtn.addEventListener("click", restartGame);
  ui.retryBtn.addEventListener("click", restartGame);

  ui.upgradeBtn.addEventListener("click", upgradeWeapon);

  ui.musicBtn.addEventListener("click", () => {
    cycleMusicTrack();
  });
}

function initializeAmmo() {
  Object.entries(weaponDefs).forEach(([weaponId, weapon]) => {
    player.ammo[weaponId] = {
      mag: weapon.magSize,
      reserve: weapon.reserve
    };
  });
}

function normalizeKey(key) {
  if (!key) return "";
  if (key === " ") return "space";
  return key.toLowerCase();
}

function prettyKey(key) {
  const map = {
    escape: "Esc",
    space: "Space",
    arrowup: "↑",
    arrowdown: "↓",
    arrowleft: "←",
    arrowright: "→",
    control: "Ctrl"
  };
  if (map[key]) return map[key];
  return key.length === 1 ? key.toUpperCase() : key[0].toUpperCase() + key.slice(1);
}

function loadControls() {
  try {
    const raw = localStorage.getItem(CONTROL_KEY);
    if (!raw) return { ...defaultControls };
    return { ...defaultControls, ...JSON.parse(raw) };
  } catch {
    return { ...defaultControls };
  }
}

function saveControls() {
  localStorage.setItem(CONTROL_KEY, JSON.stringify(controls));
}

function refreshKeybindUI() {
  ui.bindButtons.forEach(button => {
    const action = button.dataset.action;
    const badge = document.getElementById(`bind-${action}`);
    if (badge) {
      badge.textContent = prettyKey(controls[action]);
    }
    button.classList.toggle("listening", state.pendingRebind === action);
  });
}

function setMode(modeId) {
  if (!modePresets[modeId]) return;
  state.mode = modeId;
  ui.modeButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.mode === modeId);
  });
  ui.modeLabel.textContent = modePresets[modeId].label;
}

function setDifficulty(difficultyId) {
  if (!difficultyPresets[difficultyId]) return;
  state.difficulty = difficultyId;
  ui.difficultyButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.difficulty === difficultyId);
  });
}

function getDifficulty() {
  return difficultyPresets[state.difficulty];
}

function getMode() {
  return modePresets[state.mode];
}

function switchWeapon(weaponId) {
  if (!weaponDefs[weaponId]) return;
  player.activeWeapon = weaponId;
  ui.weaponButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.weapon === weaponId);
  });
  playSfx(audio.ui, 0.25);
}

function playSfx(el, volume = 0.35, rate = 1, overlap = true) {
  if (!el) return;
  if (overlap) {
    const node = el.cloneNode();
    node.volume = volume;
    node.playbackRate = rate;
    node.play().catch(() => {});
    return;
  }
  el.currentTime = 0;
  el.volume = volume;
  el.playbackRate = rate;
  el.play().catch(() => {});
}

function random(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function startGame() {
  resetRunState();
  state.started = true;
  state.paused = false;
  ui.startOverlay.classList.add("hidden");
  ui.pauseOverlay.classList.add("hidden");
  ui.gameOverOverlay.classList.add("hidden");
  audio.music.volume = 0.2;
  ensureMusicTrack();
  audio.music.play().catch(() => {});
}

function restartGame() {
  startGame();
}

function bootToStart() {
  resetRunState();
  state.started = false;
  state.paused = true;
  ui.startOverlay.classList.remove("hidden");
  ui.pauseOverlay.classList.add("hidden");
  ui.gameOverOverlay.classList.add("hidden");
}

function resetRunState() {
  const mode = getMode();
  state.gameOver = false;
  state.score = 0;
  state.wave = 1;
  state.waveTimer = 0;
  state.waveDuration = 22 * mode.waveDurationMul;
  state.combo = 1;
  state.comboTimer = 0;
  state.headshots = 0;
  state.kills = 0;
  state.timeLeft = mode.seconds;
  state.spawnTimer = 0;
  state.spawnInterval = 1;
  state.weatherT = 0;
  state.bossWaveSpawned = false;
  state.shake = 0;
  state.upgradeLevel = 0;
  state.hitMarkerTimer = 0;

  player.x = world.width / 2;
  player.y = world.height / 2;
  player.facing = 0;
  player.maxHealth = Math.round(100 * mode.healthMul);
  player.health = player.maxHealth;
  player.fireCooldown = 0;
  player.dodgeCooldown = 0;
  player.dodgeTimer = 0;
  player.stunTimer = 0;
  player.invulnTimer = 0;
  player.reloading = false;
  player.reloadTimer = 0;
  player.shieldTimer = 0;
  player.doubleTimer = 0;
  player.speedTimer = 0;
  player.activeWeapon = "pistol";

  initializeAmmo();

  bullets.length = 0;
  zombies.length = 0;
  particles.length = 0;
  powerups.length = 0;
  bloodDecals.length = 0;
  explosions.length = 0;

  ui.lowHealthVignette.style.opacity = "0";
}

function togglePause() {
  if (!state.started || state.gameOver) return;
  if (state.paused) closePause();
  else openPause();
}

function openPause() {
  state.paused = true;
  input.mouseDown = false;
  ui.pauseOverlay.classList.remove("hidden");
}

function closePause() {
  state.paused = false;
  ui.pauseOverlay.classList.add("hidden");
}

function loop(now) {
  if (!loop.last) loop.last = now;
  const dt = Math.min(0.033, (now - loop.last) / 1000);
  loop.last = now;

  if (state.started && !state.paused && !state.gameOver) {
    update(dt);
  }

  draw();
  renderHud();

  input.justPressed = Object.create(null);
  requestAnimationFrame(loop);
}

function update(dt) {
  state.weatherT += dt;

  if (getMode().timed) {
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      endGame("Time Over");
      return;
    }
  }

  player.fireCooldown = Math.max(0, player.fireCooldown - dt);
  player.dodgeCooldown = Math.max(0, player.dodgeCooldown - dt);
  player.dodgeTimer = Math.max(0, player.dodgeTimer - dt);
  player.stunTimer = Math.max(0, player.stunTimer - dt);
  player.invulnTimer = Math.max(0, player.invulnTimer - dt);
  player.shieldTimer = Math.max(0, player.shieldTimer - dt);
  player.doubleTimer = Math.max(0, player.doubleTimer - dt);
  player.speedTimer = Math.max(0, player.speedTimer - dt);

  if (player.reloading) {
    player.reloadTimer -= dt;
    if (player.reloadTimer <= 0) finishReload();
  }

  updatePlayer(dt);
  updateSpawning(dt);
  updateBullets(dt);
  updateZombies(dt);
  updatePowerups(dt);
  updateParticles(dt);
  updateExplosions(dt);

  state.comboTimer -= dt;
  if (state.comboTimer <= 0) {
    state.combo = 1;
  }

  state.hitMarkerTimer = Math.max(0, state.hitMarkerTimer - dt);
}

function updatePlayer(dt) {
  let moveX = 0;
  let moveY = 0;

  if (input.keys[controls.moveUp]) moveY -= 1;
  if (input.keys[controls.moveDown]) moveY += 1;
  if (input.keys[controls.moveLeft]) moveX -= 1;
  if (input.keys[controls.moveRight]) moveX += 1;

  const moveLen = Math.hypot(moveX, moveY) || 1;
  moveX /= moveLen;
  moveY /= moveLen;

  if (input.justPressed[controls.dodge] && player.dodgeCooldown <= 0 && (moveX !== 0 || moveY !== 0)) {
    player.dodgeTimer = 0.22;
    player.invulnTimer = 0.22;
    player.dodgeCooldown = 1.1;
  }

  const speedMul = player.speedTimer > 0 ? 1.45 : 1;
  const dodgeMul = player.dodgeTimer > 0 ? 2.5 : 1;
  const stunMul = player.stunTimer > 0 ? 0.12 : 1;
  const speed = player.baseSpeed * speedMul * dodgeMul * stunMul;

  player.x += moveX * speed * dt;
  player.y += moveY * speed * dt;

  player.x = clamp(player.x, player.radius, world.width - player.radius);
  player.y = clamp(player.y, player.radius, world.height - player.radius);

  player.facing = Math.atan2(input.mouseY - player.y, input.mouseX - player.x);

  if (input.mouseDown && player.stunTimer <= 0) {
    shootWeapon();
  }

  if (player.speedTimer > 0 && Math.random() < 0.35) {
    emitParticles(player.x, player.y, 1, "rgba(255,227,99,0.8)", 50, 0.25);
  }
}

function getWeaponStats() {
  const base = weaponDefs[player.activeWeapon];
  const levelMul = 1 + state.upgradeLevel * 0.12;
  const fireMul = Math.max(0.62, 1 - state.upgradeLevel * 0.035);
  return {
    ...base,
    damage: base.damage * levelMul * (player.doubleTimer > 0 ? 2 : 1),
    fireInterval: base.fireInterval * fireMul
  };
}

function shootWeapon() {
  if (player.fireCooldown > 0 || player.reloading) return;

  const weapon = getWeaponStats();
  const ammoState = player.ammo[player.activeWeapon];

  if (ammoState.mag <= 0) {
    tryReload();
    return;
  }

  ammoState.mag -= 1;
  player.fireCooldown = weapon.fireInterval;

  for (let i = 0; i < weapon.pellets; i++) {
    const spread = random(-weapon.spread, weapon.spread);
    const angle = player.facing + spread;
    bullets.push({
      x: player.x + Math.cos(angle) * 18,
      y: player.y + Math.sin(angle) * 18,
      vx: Math.cos(angle) * weapon.bulletSpeed,
      vy: Math.sin(angle) * weapon.bulletSpeed,
      life: 0.85,
      damage: weapon.damage,
      neon: weapon.neon
    });
  }

  emitParticles(player.x + Math.cos(player.facing) * 24, player.y + Math.sin(player.facing) * 24, 8, "rgba(255,175,59,0.9)", 220, 0.2);
  playSfx(audio.shoot, 0.32, random(0.96, 1.05));
}

function tryReload() {
  if (player.reloading) return;
  const weapon = weaponDefs[player.activeWeapon];
  const ammoState = player.ammo[player.activeWeapon];
  if (ammoState.mag >= weapon.magSize || ammoState.reserve <= 0) return;

  player.reloading = true;
  player.reloadTimer = weapon.reloadTime;
  playSfx(audio.reload, 0.35, 1);
}

function finishReload() {
  const weapon = weaponDefs[player.activeWeapon];
  const ammoState = player.ammo[player.activeWeapon];
  const need = weapon.magSize - ammoState.mag;
  const amount = Math.min(need, ammoState.reserve);
  ammoState.mag += amount;
  ammoState.reserve -= amount;
  player.reloading = false;
}

function spawnZombie(typeId) {
  const type = zombieTypes[typeId];
  const difficulty = getDifficulty();
  const edge = Math.floor(Math.random() * 4);
  let x = 0;
  let y = 0;

  if (edge === 0) { x = random(0, world.width); y = -50; }
  if (edge === 1) { x = world.width + 50; y = random(0, world.height); }
  if (edge === 2) { x = random(0, world.width); y = world.height + 50; }
  if (edge === 3) { x = -50; y = random(0, world.height); }

  const health = type.health * difficulty.healthMul * (1 + state.wave * 0.055);
  const speed = type.speed * difficulty.speedMul * (1 + state.wave * 0.022);

  zombies.push({
    type: typeId,
    x,
    y,
    radius: type.radius,
    color: type.color,
    maxHealth: health,
    health,
    speed,
    touchDamage: type.touchDamage * difficulty.damageMul,
    points: type.points,
    aiTimer: random(0, 1),
    attackCooldown: 0,
    flash: 0,
    dashBoost: 0
  });
}

function pickZombieType() {
  const roll = Math.random();
  if (roll < 0.35) return "green";
  if (roll < 0.58) return "red";
  if (roll < 0.76) return "purple";
  if (roll < 0.9) return "blue";
  return "yellow";
}

function updateSpawning(dt) {
  const difficulty = getDifficulty();
  const mode = getMode();

  state.waveTimer += dt;
  if (state.waveTimer >= state.waveDuration) {
    state.wave += 1;
    state.waveTimer = 0;
    state.waveDuration = Math.max(13 * mode.waveDurationMul, state.waveDuration - 0.28 * mode.waveDurationMul);
    state.bossWaveSpawned = false;
  }

  if (state.wave % 5 === 0 && !state.bossWaveSpawned) {
    spawnZombie("boss");
    state.bossWaveSpawned = true;
  }

  state.spawnTimer -= dt;
  if (state.spawnTimer <= 0) {
    const cap = Math.floor((32 + state.wave * 1.8) * mode.maxCapMul);
    if (zombies.length < cap) {
      spawnZombie(pickZombieType());
    }
    const pace = Math.max(0.32, 1.25 - state.wave * 0.028);
    state.spawnInterval = random(0.5, 1.15) * pace * difficulty.spawnMul * mode.spawnMul;
    state.spawnTimer = state.spawnInterval;
  }

  if (Math.random() < dt * 0.11 * mode.powerupMul && powerups.length < 3) {
    spawnPowerup();
  }
}

function spawnPowerup() {
  const keys = Object.keys(powerupDefs);
  const type = keys[Math.floor(Math.random() * keys.length)];
  powerups.push({
    type,
    x: random(80, world.width - 80),
    y: random(80, world.height - 80),
    radius: 16,
    life: 14,
    pulse: random(0, Math.PI * 2)
  });
}

function updateBullets(dt) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    bullet.life -= dt;

    if (bullet.life <= 0 || bullet.x < -30 || bullet.x > world.width + 30 || bullet.y < -30 || bullet.y > world.height + 30) {
      bullets.splice(i, 1);
      continue;
    }

    let hit = false;

    for (let j = zombies.length - 1; j >= 0; j--) {
      const zombie = zombies[j];
      const dx = zombie.x - bullet.x;
      const dy = zombie.y - bullet.y;
      const dist = Math.hypot(dx, dy);
      if (dist > zombie.radius + 3) continue;

      hit = true;
      zombie.health -= bullet.damage;
      zombie.flash = 0.14;
      state.hitMarkerTimer = 0.1;
      playSfx(audio.hit, 0.2, random(0.95, 1.08));

      const headshot = bullet.y < zombie.y - zombie.radius * 0.2;
      if (headshot) {
        zombie.health -= bullet.damage * 0.5;
        state.headshots += 1;
      }

      emitParticles(bullet.x, bullet.y, headshot ? 14 : 8, "rgba(143, 14, 24, 0.9)", 180, 0.24);
      bloodDecals.push({ x: bullet.x, y: bullet.y, r: random(8, 16), a: random(0.18, 0.34) });
      if (bloodDecals.length > 120) bloodDecals.shift();

      if (zombie.health <= 0) {
        killZombie(zombie, headshot);
        zombies.splice(j, 1);
      }

      break;
    }

    if (hit) bullets.splice(i, 1);
  }
}

function killZombie(zombie, headshot) {
  const mode = getMode();
  state.kills += 1;
  state.combo = clamp(state.combo + 0.18, 1, 5);
  state.comboTimer = 2.2;

  const comboMul = 1 + (state.combo - 1) * 0.45;
  const headshotBonus = headshot ? 18 : 0;
  const scoreGain = Math.round((zombie.points * comboMul + headshotBonus) * mode.scoreMul);
  state.score += scoreGain;

  if (zombie.type === "blue") {
    triggerExplosion(zombie.x, zombie.y, 90, 65, "toxic");
  }

  if (zombie.type === "boss") {
    triggerExplosion(zombie.x, zombie.y, 160, 120, "boss");
    state.score += Math.round(600 * mode.scoreMul);
  }
}

function triggerExplosion(x, y, radius, damage, kind) {
  explosions.push({ x, y, radius, life: 0.35, maxLife: 0.35, kind });
  emitParticles(x, y, 35, kind === "boss" ? "rgba(255,66,66,0.95)" : "rgba(255,138,72,0.95)", 280, 0.36);
  state.shake = Math.max(state.shake, kind === "boss" ? 20 : 10);
  playSfx(audio.explosion, 0.4, random(0.92, 1.08));

  const dx = player.x - x;
  const dy = player.y - y;
  const dist = Math.hypot(dx, dy);
  if (dist < radius && player.invulnTimer <= 0) {
    applyDamageToPlayer(damage * (1 - dist / radius));
  }
}

function updateZombies(dt) {
  for (let i = zombies.length - 1; i >= 0; i--) {
    const zombie = zombies[i];
    zombie.flash = Math.max(0, zombie.flash - dt);
    zombie.attackCooldown = Math.max(0, zombie.attackCooldown - dt);
    zombie.aiTimer -= dt;

    let speedBoost = 1;

    if (zombie.type === "red" && zombie.aiTimer <= 0) {
      zombie.aiTimer = random(1.2, 2.1);
      zombie.dashBoost = random(0.25, 0.5);
    }

    zombie.dashBoost = Math.max(0, zombie.dashBoost - dt);
    if (zombie.dashBoost > 0) speedBoost = 1.7;

    const toPlayerX = player.x - zombie.x;
    const toPlayerY = player.y - zombie.y;
    const dist = Math.max(0.001, Math.hypot(toPlayerX, toPlayerY));

    let sepX = 0;
    let sepY = 0;
    for (let j = 0; j < zombies.length; j++) {
      if (i === j) continue;
      const other = zombies[j];
      const ox = zombie.x - other.x;
      const oy = zombie.y - other.y;
      const d = Math.hypot(ox, oy);
      if (d > 0 && d < zombie.radius + other.radius + 18) {
        sepX += ox / d;
        sepY += oy / d;
      }
    }

    const moveX = toPlayerX / dist + sepX * 0.45;
    const moveY = toPlayerY / dist + sepY * 0.45;
    const moveLen = Math.hypot(moveX, moveY) || 1;

    zombie.x += (moveX / moveLen) * zombie.speed * speedBoost * dt;
    zombie.y += (moveY / moveLen) * zombie.speed * speedBoost * dt;

    if (dist < zombie.radius + player.radius + 2 && zombie.attackCooldown <= 0) {
      zombie.attackCooldown = zombie.type === "boss" ? 0.42 : 0.72;
      applyDamageToPlayer(zombie.touchDamage);

      if (zombie.type === "yellow") {
        player.stunTimer = Math.max(player.stunTimer, 0.6);
        emitParticles(player.x, player.y, 16, "rgba(120,171,255,0.9)", 200, 0.26);
      }

      if (zombie.type === "purple") {
        state.shake = Math.max(state.shake, 8);
      }
    }
  }
}

function applyDamageToPlayer(amount) {
  if (player.invulnTimer > 0) return;

  let finalDamage = amount;
  if (player.shieldTimer > 0) finalDamage *= 0.45;
  if (getMode().hardcore) finalDamage *= 1.18;

  player.health -= finalDamage;
  state.shake = Math.max(state.shake, 6);
  ui.lowHealthVignette.style.opacity = String(clamp(1 - player.health / player.maxHealth, 0, 0.8));

  if (player.health <= 0) {
    player.health = 0;
    endGame("You Were Overrun");
  }
}

function updatePowerups(dt) {
  for (let i = powerups.length - 1; i >= 0; i--) {
    const power = powerups[i];
    power.life -= dt;
    power.pulse += dt * 4;

    if (power.life <= 0) {
      powerups.splice(i, 1);
      continue;
    }

    const dx = player.x - power.x;
    const dy = player.y - power.y;
    const dist = Math.hypot(dx, dy);

    if (dist < player.radius + power.radius) {
      applyPowerup(power.type);
      powerups.splice(i, 1);
      playSfx(audio.ui, 0.3, 1.1);
    }
  }
}

function applyPowerup(type) {
  if (getMode().hardcore && type === "health") {
    state.score += 20;
    return;
  }

  if (type === "health") {
    player.health = clamp(player.health + 30, 0, player.maxHealth);
  }
  if (type === "shield") {
    player.shieldTimer = Math.max(player.shieldTimer, 8);
  }
  if (type === "double") {
    player.doubleTimer = Math.max(player.doubleTimer, 8);
  }
  if (type === "speed") {
    player.speedTimer = Math.max(player.speedTimer, 8);
  }
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= 0.93;
    p.vy *= 0.93;
    p.life -= dt;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function updateExplosions(dt) {
  for (let i = explosions.length - 1; i >= 0; i--) {
    const exp = explosions[i];
    exp.life -= dt;
    if (exp.life <= 0) explosions.splice(i, 1);
  }
}

function emitParticles(x, y, count, color, speed, life) {
  for (let i = 0; i < count; i++) {
    const a = random(0, Math.PI * 2);
    particles.push({
      x,
      y,
      vx: Math.cos(a) * random(speed * 0.3, speed),
      vy: Math.sin(a) * random(speed * 0.3, speed),
      life: random(life * 0.6, life),
      maxLife: life,
      color,
      size: random(1.6, 3.8)
    });
  }
}

function upgradeWeapon() {
  const cost = 500 * (state.upgradeLevel + 1);
  if (state.score < cost) {
    ui.bindHint.textContent = `Need ${cost} score for upgrade.`;
    return;
  }

  state.score -= cost;
  state.upgradeLevel += 1;
  ui.bindHint.textContent = "Weapon upgraded.";
  playSfx(audio.ui, 0.35, 1.1);
}

function endGame(title) {
  if (state.gameOver) return;
  state.gameOver = true;
  state.paused = false;

  const mode = getMode().label;
  saveHighScore({ score: state.score, wave: state.wave, mode });
  renderLeaderboard();

  ui.gameOverTitle.textContent = title;
  ui.gameOverText.textContent = `Score ${state.score} · Wave ${state.wave} · Headshots ${state.headshots}`;
  ui.gameOverOverlay.classList.remove("hidden");
}

function saveHighScore(entry) {
  const list = loadHighScores();
  list.push({ ...entry, date: new Date().toISOString().slice(0, 10) });
  list.sort((a, b) => b.score - a.score);
  localStorage.setItem(SCORE_KEY, JSON.stringify(list.slice(0, 10)));
}

function loadHighScores() {
  try {
    const raw = localStorage.getItem(SCORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function renderLeaderboard() {
  const list = loadHighScores();
  if (list.length === 0) {
    ui.leaderboard.innerHTML = "<li>No records yet</li>";
    return;
  }

  ui.leaderboard.innerHTML = list
    .map(item => `<li>${item.score} · ${item.mode} · W${item.wave}</li>`)
    .join("");
}

function renderHud() {
  const weapon = weaponDefs[player.activeWeapon];
  const ammoState = player.ammo[player.activeWeapon];
  const comboDisplay = state.comboTimer > 0 ? state.combo.toFixed(1) : "1.0";
  const cost = 500 * (state.upgradeLevel + 1);

  ui.score.textContent = String(state.score);
  ui.wave.textContent = `Wave ${state.wave}`;
  ui.combo.textContent = `Combo x${comboDisplay}`;
  ui.modeLabel.textContent = getMode().label;
  ui.weaponName.textContent = weapon.label;
  ui.ammo.textContent = player.reloading
    ? `Reloading ${(player.reloadTimer / weapon.reloadTime * 100).toFixed(0)}%`
    : `${ammoState.mag} / ${ammoState.reserve}`;

  const hp = clamp((player.health / player.maxHealth) * 100, 0, 100);
  ui.healthBar.style.width = `${hp}%`;
  ui.healthBar.style.filter = hp < 30 ? "saturate(1.4) brightness(1.15)" : "none";

  ui.hitMarker.classList.toggle("hidden", state.hitMarkerTimer <= 0);

  const buffs = [];
  if (player.shieldTimer > 0) buffs.push(`Shield ${player.shieldTimer.toFixed(1)}s`);
  if (player.doubleTimer > 0) buffs.push(`Double ${player.doubleTimer.toFixed(1)}s`);
  if (player.speedTimer > 0) buffs.push(`Speed ${player.speedTimer.toFixed(1)}s`);
  ui.powerupStatus.textContent = buffs.length > 0 ? buffs.join(" · ") : "No active buffs";

  ui.timerLabel.textContent = getMode().timed ? `Time: ${state.timeLeft.toFixed(1)}s` : "Time: ∞";
  ui.upgradeBtn.textContent = `Upgrade Weapon (${cost})`;
  ui.upgradeLevel.textContent = `Upgrade Level: ${state.upgradeLevel}`;
}

function draw() {
  ctx.save();
  if (state.shake > 0) {
    ctx.translate(random(-state.shake, state.shake), random(-state.shake, state.shake));
    state.shake = Math.max(0, state.shake - 1.2);
  }

  drawBackground();
  drawBloodDecals();
  drawPowerups();
  drawBullets();
  drawZombies();
  drawPlayer();
  drawExplosions();
  drawParticles();
  drawCrosshair();
  drawMiniMap();

  ctx.restore();
}

function drawBackground() {
  const glow = (Math.sin(state.weatherT * 0.4) + 1) * 0.5;
  const grad = ctx.createLinearGradient(0, 0, 0, world.height);
  grad.addColorStop(0, glow > 0.5 ? "#10192a" : "#0d1424");
  grad.addColorStop(1, "#070d16");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, world.width, world.height);

  ctx.globalAlpha = 0.1;
  ctx.strokeStyle = "#47b7ff";
  for (let x = 0; x < world.width; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, world.height);
    ctx.stroke();
  }
  for (let y = 0; y < world.height; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(world.width, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  for (let i = 0; i < 120; i++) {
    const x = (i * 47 + state.weatherT * 220) % (world.width + 20) - 10;
    const y = (i * 29 + state.weatherT * 430) % (world.height + 20) - 10;
    ctx.strokeStyle = "rgba(118,170,220,0.2)";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 3, y + 11);
    ctx.stroke();
  }
}

function drawBloodDecals() {
  bloodDecals.forEach(decal => {
    ctx.fillStyle = `rgba(96, 14, 26, ${decal.a})`;
    ctx.beginPath();
    ctx.arc(decal.x, decal.y, decal.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawPlayer() {
  const weapon = getWeaponStats();
  const glow = ctx.createRadialGradient(player.x, player.y, 3, player.x, player.y, 30);
  glow.addColorStop(0, player.color + "aa");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(player.x, player.y, 30, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.facing);
  ctx.fillStyle = weapon.neon;
  ctx.fillRect(0, -4, 30, 8);
  ctx.restore();
}

function drawBullets() {
  bullets.forEach(bullet => {
    ctx.strokeStyle = bullet.neon;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bullet.x, bullet.y);
    ctx.lineTo(bullet.x - bullet.vx * 0.012, bullet.y - bullet.vy * 0.012);
    ctx.stroke();
  });
}

function drawZombies() {
  zombies.forEach(zombie => {
    ctx.save();
    ctx.translate(zombie.x, zombie.y);

    const color = zombie.flash > 0 ? "#ffffff" : zombie.color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, zombie.radius, 0, Math.PI * 2);
    ctx.fill();

    if (zombie.type === "boss") {
      ctx.fillStyle = "#ff3e3e";
      ctx.beginPath();
      ctx.arc(-12, -8, 4, 0, Math.PI * 2);
      ctx.arc(12, -8, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    const hp = clamp(zombie.health / zombie.maxHealth, 0, 1);
    ctx.fillStyle = "#273248";
    ctx.fillRect(-zombie.radius, zombie.radius + 8, zombie.radius * 2, 5);
    ctx.fillStyle = "#ff5a5a";
    ctx.fillRect(-zombie.radius, zombie.radius + 8, zombie.radius * 2 * hp, 5);

    ctx.restore();
  });
}

function drawPowerups() {
  powerups.forEach(power => {
    const info = powerupDefs[power.type];
    const pulse = 0.8 + Math.sin(power.pulse) * 0.2;
    const glow = ctx.createRadialGradient(power.x, power.y, 4, power.x, power.y, 28 * pulse);
    glow.addColorStop(0, info.color + "dd");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(power.x, power.y, 28 * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = info.color;
    ctx.beginPath();
    ctx.arc(power.x, power.y, power.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawExplosions() {
  explosions.forEach(exp => {
    const ratio = exp.life / exp.maxLife;
    const radius = exp.radius * (1 - ratio * 0.4);
    const color = exp.kind === "boss" ? "255,42,42" : "255,132,72";
    const grad = ctx.createRadialGradient(exp.x, exp.y, 4, exp.x, exp.y, radius);
    grad.addColorStop(0, `rgba(${color}, 0.9)`);
    grad.addColorStop(1, `rgba(${color}, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(exp.x, exp.y, radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawParticles() {
  particles.forEach(p => {
    const a = clamp(p.life / p.maxLife, 0, 1);
    ctx.fillStyle = p.color.replace("0.9", a.toFixed(2)).replace("0.8", a.toFixed(2)).replace("0.95", a.toFixed(2));
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawCrosshair() {
  if (!state.started || state.paused || state.gameOver) return;
  const x = input.mouseX;
  const y = input.mouseY;
  ctx.strokeStyle = "rgba(228,241,255,0.85)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(x - 9, y);
  ctx.lineTo(x - 2, y);
  ctx.moveTo(x + 2, y);
  ctx.lineTo(x + 9, y);
  ctx.moveTo(x, y - 9);
  ctx.lineTo(x, y - 2);
  ctx.moveTo(x, y + 2);
  ctx.lineTo(x, y + 9);
  ctx.stroke();
}

function drawMiniMap() {
  const mapW = 170;
  const mapH = 110;
  const x0 = world.width - mapW - 14;
  const y0 = 14;

  ctx.fillStyle = "rgba(8, 14, 26, 0.72)";
  ctx.fillRect(x0, y0, mapW, mapH);
  ctx.strokeStyle = "rgba(95, 140, 220, 0.8)";
  ctx.strokeRect(x0, y0, mapW, mapH);

  const px = x0 + (player.x / world.width) * mapW;
  const py = y0 + (player.y / world.height) * mapH;
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(px, py, 3, 0, Math.PI * 2);
  ctx.fill();

  zombies.forEach(zombie => {
    const zx = x0 + (zombie.x / world.width) * mapW;
    const zy = y0 + (zombie.y / world.height) * mapH;
    ctx.fillStyle = zombie.color;
    ctx.fillRect(zx - 1.5, zy - 1.5, 3, 3);
  });
}

function ensureMusicTrack() {
  const track = musicTracks[state.musicIndex] || musicTracks[0];
  if (!audio.music.src.includes(track.src)) {
    audio.music.src = track.src;
    audio.music.load();
  }
  updateMusicButton();
}

function cycleMusicTrack() {
  state.musicIndex = (state.musicIndex + 1) % musicTracks.length;
  const shouldPlay = state.started && !state.paused && !state.gameOver;
  audio.music.src = musicTracks[state.musicIndex].src;
  audio.music.load();
  if (shouldPlay) {
    audio.music.volume = 0.2;
    audio.music.play().catch(() => {});
  }
  updateMusicButton();
  playSfx(audio.ui, 0.25, 1.15);
}

function updateMusicButton() {
  if (!ui.musicBtn) return;
  const track = musicTracks[state.musicIndex] || musicTracks[0];
  const trackNumber = state.musicIndex + 1;
  ui.musicBtn.title = `Change music (${trackNumber}/${musicTracks.length}): ${track.name}`;
  ui.musicBtn.setAttribute("aria-label", `Change music track ${trackNumber}: ${track.name}`);
}
