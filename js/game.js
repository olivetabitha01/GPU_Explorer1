// ============================================================
//  GPU EXPLORER — Shared Game State & Utilities
//  game.js  (plain script, no module)
// ============================================================

// ---- TEAM DATA ----
const TEAMS = [
  { id: "team1", name: "Team 1 — Alpha Core",   color: "#00f7ff", emoji: "⚡" },
  { id: "team2", name: "Team 2 — Beta Shader",  color: "#a855f7", emoji: "🔮" },
  { id: "team3", name: "Team 3 — Gamma VRAM",   color: "#00ff88", emoji: "🟢" },
  { id: "team4", name: "Team 4 — Delta CUDA",   color: "#ffd700", emoji: "⭐" },
  { id: "team5", name: "Team 5 — Epsilon Ray",  color: "#ff4060", emoji: "🔴" },
  { id: "team6", name: "Team 6 — Zeta PCIe",    color: "#ff9500", emoji: "🔶" }
];
window.TEAMS = TEAMS;

// ---- ROLES ----
const ROLES = [
  { role: "Leader",     icon: "👑", desc: "Confirms final team answer" },
  { role: "Analyst",    icon: "🔍", desc: "Reads & explains the question" },
  { role: "Tech Lead",  icon: "🛠️", desc: "Handles drag-drop in Level 2" },
  { role: "Timekeeper", icon: "⏱️", desc: "Watches the timer & paces team" },
  { role: "Scribe",     icon: "📋", desc: "Tracks score & notes answers" },
  { role: "Challenger", icon: "⚔️", desc: "Questions & debates choices" }
];
window.ROLES = ROLES;

// ============================================================
//  LEVEL 1 — 10 QUESTIONS (CPU vs GPU)
// ============================================================
const QUESTIONS = [
  {
    task: "Open MS Word and type a letter",
    icon: "📄",
    answer: "cpu",
    hint: "This is a simple, sequential task — one instruction at a time.",
    explanation: "The CPU handles general-purpose sequential tasks like running office apps and processing text."
  },
  {
    task: "Watch a 4K Ultra HD movie on Netflix",
    icon: "🎬",
    answer: "gpu",
    hint: "Think about how many pixels need to be decoded every single second.",
    explanation: "GPUs decode and render millions of pixels in parallel, making them ideal for high-resolution video."
  },
  {
    task: "Play GTA V or Valorant at high settings",
    icon: "🎮",
    answer: "gpu",
    hint: "Real-time 3D rendering requires massive parallel computation.",
    explanation: "A GPU has thousands of cores working simultaneously to render complex 3D game graphics in real time."
  },
  {
    task: "Compile a C++ program",
    icon: "💻",
    answer: "cpu",
    hint: "Compilation is a logical, step-by-step sequential operation.",
    explanation: "The CPU executes compiling instructions sequentially — it is a logic-heavy, ordered job."
  },
  {
    task: "Train an AI image recognition model",
    icon: "🤖",
    answer: "gpu",
    hint: "AI training involves millions of matrix multiplications simultaneously.",
    explanation: "GPU parallel architecture handles the massive matrix operations required in AI/ML training perfectly."
  },
  {
    task: "Browse websites and check email",
    icon: "🌐",
    answer: "cpu",
    hint: "This is lightweight and doesn't need parallel processing power.",
    explanation: "The CPU manages general-purpose tasks like running browsers and handling network requests."
  },
  {
    task: "Edit a video timeline in Premiere Pro",
    icon: "🎞️",
    answer: "gpu",
    hint: "Rendering each frame of video requires huge parallel computation.",
    explanation: "GPUs accelerate video rendering by processing many frames and visual effects simultaneously."
  },
  {
    task: "Run an antivirus full system scan",
    icon: "🛡️",
    answer: "cpu",
    hint: "Scanning files is a logic-heavy, sequential checking process.",
    explanation: "Antivirus scanning is sequential — the CPU checks files one by one using logical comparisons."
  },
  {
    task: "Apply filters and effects in Photoshop",
    icon: "🎨",
    answer: "gpu",
    hint: "Image filters must be applied to every single pixel at once.",
    explanation: "GPUs process thousands of pixels in parallel, making image filters and effects extremely fast."
  },
  {
    task: "Run complex Excel formulas across 10,000 rows",
    icon: "📊",
    answer: "cpu",
    hint: "Formula calculations follow a strict row-by-row logical order.",
    explanation: "The CPU is optimized for sequential, logic-based spreadsheet calculations and number crunching."
  }
];
window.QUESTIONS = QUESTIONS;

// ============================================================
//  LEVEL 2 — 5 MCQ QUESTIONS (drag-drop first, then these)
// ============================================================
const L2_QUESTIONS = [
  {
    question: "Which component is primarily responsible for rendering game graphics?",
    icon: "🎮",
    options: [
      { label: "CPU — Central Processing Unit",  correct: false, explanation: "The CPU manages game logic but cannot render thousands of polygons per frame fast enough." },
      { label: "GPU — Graphics Processing Unit", correct: true,  explanation: "The GPU has thousands of shader cores designed specifically to render 3D graphics in real time." },
      { label: "RAM — System Memory",            correct: false, explanation: "RAM stores data temporarily but has zero processing power for rendering." }
    ]
  },
  {
    question: "Why is a GPU preferred over a CPU for training AI models?",
    icon: "🤖",
    options: [
      { label: "GPU runs hotter so it works harder",               correct: false, explanation: "Heat is a problem to manage, not an advantage." },
      { label: "GPU performs thousands of operations in parallel",  correct: true,  explanation: "AI training needs millions of simultaneous matrix multiplications — GPUs handle this natively." },
      { label: "CPU cannot do any math at all",                    correct: false, explanation: "CPUs can do math — they are just much slower at parallel matrix operations." }
    ]
  },
  {
    question: "Which part of the GPU stores textures, frame buffers, and render data?",
    icon: "🧠",
    options: [
      { label: "Cooling Fan",       correct: false, explanation: "The cooling fan dissipates heat — it cannot store any data." },
      { label: "VRAM (Video RAM)",  correct: true,  explanation: "VRAM is dedicated high-speed GPU memory that stores all graphical data needed for rendering frames." },
      { label: "CPU L2 Cache",      correct: false, explanation: "L2 Cache belongs to the CPU and is not accessible by the GPU." }
    ]
  },
  {
    question: "Which processor handles multitasking across different types of applications better?",
    icon: "⚙️",
    options: [
      { label: "CPU — few powerful cores for varied tasks", correct: true,  explanation: "CPUs have fewer but highly capable cores designed for managing diverse, sequential workloads." },
      { label: "GPU — thousands of cores for everything",  correct: false, explanation: "GPU cores are specialized for parallel math — not suitable for general multitasking." },
      { label: "Monitor — it shows all the apps at once",  correct: false, explanation: "The monitor is an output device with zero processing power." }
    ]
  },
  {
    question: "What hardware component directly determines how many frames per second (FPS) a game renders?",
    icon: "🚀",
    options: [
      { label: "Keyboard polling rate",  correct: false, explanation: "Keyboard rate affects input latency only — not rendering speed." },
      { label: "GPU processing speed",   correct: true,  explanation: "FPS is directly limited by how fast the GPU can render each frame. A stronger GPU = higher FPS." },
      { label: "Monitor screen size",    correct: false, explanation: "Monitor size affects your view — it does not change how fast frames are rendered by the GPU." }
    ]
  }
];
window.L2_QUESTIONS = L2_QUESTIONS;

// ============================================================
//  LEVEL 2 — QUESTION 6: REAL-WORLD CASE STUDY
//  True / False sub-questions
// ============================================================
const CASE_STUDY = {
  title: "Case Study: Tesla Autopilot & the GPU Thermal Crisis (2016)",

  story: [
    "In 2016, Tesla's Autopilot system relied on NVIDIA's Drive PX GPU platform to process live camera feeds and make real-time driving decisions.",
    "During extended highway driving, the GPU began thermal throttling — automatically reducing its clock speed by up to 30% to prevent overheating.",
    "This caused delayed lane-change decisions and slower obstacle detection, placing vehicles in a borderline unsafe condition.",
    "Engineers identified the root cause: the same GPU was handling both neural network inference AND sensor fusion together with no task separation.",
    "Tesla resolved this in 2019 by designing their own FSD (Full Self-Driving) chip with dual redundant GPUs and separate dedicated processors per task — restoring full safety and response speed."
  ],

  whyItMatters: "This case proves that GPU architecture choices, thermal management, and task specialization are life-critical in AI systems — not just raw processing power. A throttled GPU in a self-driving car is a safety failure.",

  questions: [
    {
      q: "Tesla's early Autopilot used a GPU to process real-time camera data.",
      answer: true,
      explanation: "TRUE — NVIDIA's Drive PX GPU was used to process live camera feeds for lane detection and obstacle recognition."
    },
    {
      q: "The system failed because the CPU was too slow to handle map routing.",
      answer: false,
      explanation: "FALSE — The failure was GPU thermal throttling, not CPU map processing. The GPU slowed itself to prevent damage from overheating."
    },
    {
      q: "Thermal throttling reduces GPU speed automatically to prevent overheating.",
      answer: true,
      explanation: "TRUE — When temperatures exceed safe limits, the GPU lowers its clock speed (throttles) to cool down, reducing processing performance."
    },
    {
      q: "Tesla's FSD chip used one single GPU to handle all driving tasks.",
      answer: false,
      explanation: "FALSE — The FSD chip used dual redundant GPUs with separate processors for different tasks, giving both higher performance and fail-safe redundancy."
    },
    {
      q: "Separating AI inference from sensor fusion onto different processors improved safety.",
      answer: true,
      explanation: "TRUE — Task separation ensures that an overloaded inference process cannot delay the critical sensor fusion needed for braking decisions."
    }
  ]
};
window.CASE_STUDY = CASE_STUDY;

// ============================================================
//  STORAGE HELPERS
// ============================================================
const S = {
  set: (k, v) => localStorage.setItem(`gpu_${k}`, JSON.stringify(v)),
  get: (k)    => { try { return JSON.parse(localStorage.getItem(`gpu_${k}`)); } catch { return null; } },
  clear: ()   => { Object.keys(localStorage).filter(k => k.startsWith('gpu_')).forEach(k => localStorage.removeItem(k)); }
};
window.S = S;

// ---- FORMAT TIME ----
function formatTime(ms) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}m ${s.toString().padStart(2,'0')}s`;
}
window.formatTime = formatTime;

// ---- TOAST NOTIFICATION ----
function showToast(message, type = 'info', duration = 3000) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const colors = {
    success: 'var(--green)',
    error:   'var(--red)',
    info:    'var(--cyan)',
    warning: 'var(--gold)'
  };
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icons[type]}</span> <span>${message}</span>`;
  toast.style.cssText = `
    position: fixed; top: 24px; right: 24px;
    background: var(--bg-card); border: 1px solid ${colors[type]};
    color: var(--white); padding: 14px 20px; border-radius: 10px;
    font-family: var(--font-body); font-size: 0.95rem; font-weight: 600;
    display: flex; align-items: center; gap: 10px;
    box-shadow: 0 0 30px ${colors[type]}44, 0 10px 30px rgba(0,0,0,0.5);
    z-index: 9999; animation: fadeInUp 0.4s ease; max-width: 360px;
    transition: opacity 0.4s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.style.opacity = '0', duration - 400);
  setTimeout(() => toast.remove(), duration);
}
window.showToast = showToast;

// ---- SHOW MODAL ----
function showModal({ icon, title, subtitle, body, actions }) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'active-modal';
  overlay.innerHTML = `
    <div class="modal">
      ${icon     ? `<span class="modal-icon">${icon}</span>` : ''}
      ${title    ? `<h2 class="title-md center mb-4">${title}</h2>` : ''}
      ${subtitle ? `<p class="subtitle center mb-4">${subtitle}</p>` : ''}
      ${body  || ''}
      ${actions  ? `<div class="flex gap-4 justify-center mt-6">${actions}</div>` : ''}
    </div>
  `;
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.body.appendChild(overlay);
}
window.showModal = showModal;

function closeModal() {
  const m = document.getElementById('active-modal');
  if (m) { m.style.opacity = '0'; setTimeout(() => m.remove(), 300); }
}
window.closeModal = closeModal;

// ---- SCANLINE ----
function addScanline() {
  const sl = document.createElement('div');
  sl.className = 'scanline';
  document.body.appendChild(sl);
}
window.addScanline = addScanline;

// ---- PARTICLES ----
function spawnParticles(color = '#00f7ff', count = 20) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const drift = (Math.random() - 0.5) * 300;
    p.style.cssText = `
      position: fixed; bottom: 0;
      left: ${Math.random() * 100}vw;
      width: ${Math.random() * 6 + 2}px; height: ${Math.random() * 6 + 2}px;
      border-radius: 50%; background: ${color}; box-shadow: 0 0 6px ${color};
      --drift: ${drift}px;
      animation: particle-float ${Math.random() * 3 + 2}s ease ${Math.random() * 0.5}s forwards;
      pointer-events: none; z-index: 9998;
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 6000);
  }
}
window.spawnParticles = spawnParticles;

// ---- GAME TIMER ----
class GameTimer {
  constructor(limitMs, onTick, onExpire) {
    this.limitMs  = limitMs;
    this.onTick   = onTick;
    this.onExpire = onExpire;
    this.startTs  = null;
    this.interval = null;
  }

  start() {
    this.startTs = Date.now();
    S.set('startTime', this.startTs);
    this._tick();
    this.interval = setInterval(() => this._tick(), 500);
  }

  _tick() {
    const elapsed   = Date.now() - this.startTs;
    const remaining = this.limitMs - elapsed;
    this.onTick(remaining, elapsed);
    if (remaining <= 0) { this.stop(); this.onExpire(); }
  }

  stop() { clearInterval(this.interval); }
  getElapsed() { return Date.now() - this.startTs; }
}
window.GameTimer = GameTimer;

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => { addScanline(); });
