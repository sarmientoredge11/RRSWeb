const uiLoader = document.getElementById("ui-loader");
const slidesViewport = document.getElementById("slides-viewport");
const slides = Array.from(document.querySelectorAll(".slide"));
const dockLinks = document.querySelectorAll('.side-dock a[data-slide-link]');
const allSlideLinks = document.querySelectorAll('[data-slide-link]');
const prevSlideBtn = document.getElementById("prev-slide-btn");
const nextSlideBtn = document.getElementById("next-slide-btn");
const slideCounter = document.getElementById("slide-counter");
const copyEmailBtn = document.getElementById("copy-email-btn");
const copyEmailText = document.getElementById("copy-email-text");
const themeToggle = document.getElementById("theme-toggle");
const themeDockLabel = document.getElementById("theme-dock-label");
const toast = document.getElementById("toast");
const skillPills = document.querySelectorAll(".pill[data-skill]");
const projectCards = document.querySelectorAll(".project-card");

let toastTimeout;
let currentSlideIndex = 0;

// Animate Levitating Ultra Instinct Goku Loading Screen FX (Stars, Ki Streaks & Rising Debris)
const loaderFxCanvas = document.getElementById("ui-loader-fx");
let loaderActive = true;

if (loaderFxCanvas instanceof HTMLCanvasElement) {
  const fctx = loaderFxCanvas.getContext("2d");
  let fw = window.innerWidth;
  let fh = window.innerHeight;
  const fDpr = Math.min(window.devicePixelRatio || 1, 2);

  function sizeLoaderFx() {
    fw = window.innerWidth;
    fh = window.innerHeight;
    loaderFxCanvas.width = Math.floor(fw * fDpr);
    loaderFxCanvas.height = Math.floor(fh * fDpr);
    if (fctx) fctx.setTransform(fDpr, 0, 0, fDpr, 0, 0);
  }

  sizeLoaderFx();
  window.addEventListener("resize", sizeLoaderFx);

  // Theme-matched palettes for loader stars, ki streaks, hair bloom, and floating shards
  const loaderThemes = {
    dark: {
      bloomInner: "168, 85, 247",
      bloomOuter: "56, 189, 248",
      colors: [
        "168, 85, 247", // Cosmic Violet
        "192, 132, 252", // Orchid Glow
        "56, 189, 248", // Electric Ice Cyan
        "241, 245, 249" // Silver-White
      ],
      shard: "139, 92, 246"
    },
    light: {
      bloomInner: "14, 165, 233",
      bloomOuter: "124, 58, 237",
      colors: [
        "14, 165, 233", // Radiant Sky Cyan
        "37, 99, 235",  // Celestial Sapphire
        "124, 58, 237", // Divine Iris Violet
        "99, 102, 241"  // Luminous Indigo
      ],
      shard: "71, 85, 105"
    }
  };

  // 1. Twinkling 4-Point Theme-Colored Star Glints
  const starGlints = Array.from({ length: 38 }, (_, idx) => ({
    x: Math.random() * fw,
    y: Math.random() * (fh * 0.55),
    vy: -(0.2 + Math.random() * 0.45),
    size: 2.5 + Math.random() * 5.5,
    phase: Math.random() * Math.PI * 2,
    speed: 2.5 + Math.random() * 3.5,
    cIdx: idx % 4
  }));

  // 2. Rising Theme-Colored Ki Streaks around Goku's silhouette
  const kiStreaks = Array.from({ length: 22 }, (_, idx) => ({
    offsetX: (Math.random() - 0.5) * Math.min(240, fw * 0.38),
    y: fh * (0.18 + Math.random() * 0.56),
    len: 32 + Math.random() * 58,
    vy: -(1.2 + Math.random() * 1.8),
    alpha: 0.22 + Math.random() * 0.32,
    cIdx: idx % 4
  }));

  // 3. Slowly Levitating Shards / Sparks rising from the ground
  const debrisShards = Array.from({ length: 28 }, (_, idx) => ({
    x: fw * 0.5 + (Math.random() - 0.5) * Math.min(540, fw * 0.82),
    y: fh * (0.5 + Math.random() * 0.5),
    vy: -(0.45 + Math.random() * 0.85),
    size: 2.2 + Math.random() * 4.2,
    rot: Math.random() * Math.PI * 2,
    vRot: (Math.random() - 0.5) * 0.035,
    alpha: 0.32 + Math.random() * 0.38,
    cIdx: idx % 4
  }));

  const loaderStart = performance.now();

  function renderLoaderScene(now) {
    if (!loaderActive || !fctx) return;
    const t = (now - loaderStart) * 0.001;
    const mode =
      document.documentElement.getAttribute("data-theme") === "light"
        ? "light"
        : "dark";
    const pal = loaderThemes[mode];

    fctx.clearRect(0, 0, fw, fh);
    fctx.globalCompositeOperation = mode === "dark" ? "lighter" : "source-over";

    // Pulsing theme-colored aura halo behind Goku (hair & torso)
    const cx = fw * 0.5;
    const cy = fh * 0.34;
    const bloomRadius = Math.min(fw, fh) * 0.34;
    const bloomAlpha = 0.22 + 0.1 * Math.sin(t * 3.2);
    const bloom = fctx.createRadialGradient(cx, cy, 0, cx, cy, bloomRadius);
    bloom.addColorStop(0, `rgba(${pal.bloomInner}, ${bloomAlpha})`);
    bloom.addColorStop(0.55, `rgba(${pal.bloomOuter}, ${bloomAlpha * 0.55})`);
    bloom.addColorStop(1, `rgba(${pal.bloomOuter}, 0)`);
    fctx.fillStyle = bloom;
    fctx.beginPath();
    fctx.arc(cx, cy, bloomRadius, 0, Math.PI * 2);
    fctx.fill();

    // Draw Rising Theme-Colored Ki Streaks around center silhouette
    for (let i = 0; i < kiStreaks.length; i++) {
      const s = kiStreaks[i];
      s.y += s.vy;
      if (s.y + s.len < fh * 0.12) {
        s.y = fh * 0.78;
        s.offsetX = (Math.random() - 0.5) * Math.min(240, fw * 0.38);
      }
      const sx = cx + s.offsetX;
      const col = pal.colors[s.cIdx];
      const g = fctx.createLinearGradient(sx, s.y, sx, s.y + s.len);
      g.addColorStop(0, `rgba(${col}, 0)`);
      g.addColorStop(0.5, `rgba(${col}, ${s.alpha})`);
      g.addColorStop(1, `rgba(${col}, 0)`);
      fctx.strokeStyle = g;
      fctx.lineWidth = 1.8;
      fctx.beginPath();
      fctx.moveTo(sx, s.y);
      fctx.lineTo(sx, s.y + s.len);
      fctx.stroke();
    }

    // Draw Twinkling 4-Point Theme-Colored Star Glints
    for (let i = 0; i < starGlints.length; i++) {
      const st = starGlints[i];
      st.y += st.vy;
      if (st.y < -10) {
        st.y = fh * 0.55;
        st.x = Math.random() * fw;
      }
      const col = pal.colors[st.cIdx];
      const twinkle =
        0.3 + 0.7 * Math.pow(0.5 + 0.5 * Math.sin(t * st.speed + st.phase), 2);
      const r = st.size * (0.7 + 0.4 * twinkle);

      const glow = fctx.createRadialGradient(st.x, st.y, 0, st.x, st.y, r * 2.1);
      glow.addColorStop(
        0,
        mode === "dark"
          ? `rgba(255, 255, 255, ${twinkle})`
          : `rgba(${col}, ${twinkle})`
      );
      glow.addColorStop(0.45, `rgba(${col}, ${twinkle * 0.65})`);
      glow.addColorStop(1, `rgba(${col}, 0)`);
      fctx.fillStyle = glow;
      fctx.beginPath();
      fctx.arc(st.x, st.y, r * 2.1, 0, Math.PI * 2);
      fctx.fill();

      fctx.strokeStyle =
        mode === "dark"
          ? `rgba(248, 250, 252, ${twinkle * 0.88})`
          : `rgba(${col}, ${twinkle * 0.85})`;
      fctx.lineWidth = 1.1;
      fctx.beginPath();
      fctx.moveTo(st.x - r, st.y);
      fctx.lineTo(st.x + r, st.y);
      fctx.moveTo(st.x, st.y - r);
      fctx.lineTo(st.x, st.y + r);
      fctx.stroke();
    }

    // Draw Slowly Levitating Theme-Tinted Shards in the lower half
    for (let i = 0; i < debrisShards.length; i++) {
      const d = debrisShards[i];
      d.y += d.vy;
      d.rot += d.vRot;
      if (d.y < fh * 0.45) {
        d.y = fh + 10;
        d.x = fw * 0.5 + (Math.random() - 0.5) * Math.min(540, fw * 0.82);
      }
      const fade = Math.sin(
        Math.max(0, Math.min(1, (d.y - fh * 0.45) / (fh * 0.55))) * Math.PI
      );
      const shardCol = mode === "dark" ? pal.colors[d.cIdx] : pal.shard;
      fctx.save();
      fctx.translate(d.x, d.y);
      fctx.rotate(d.rot);
      fctx.fillStyle = `rgba(${shardCol}, ${d.alpha * fade})`;
      fctx.beginPath();
      fctx.moveTo(-d.size, d.size * 0.6);
      fctx.lineTo(0, -d.size);
      fctx.lineTo(d.size * 0.85, d.size * 0.4);
      fctx.closePath();
      fctx.fill();
      fctx.restore();
    }

    requestAnimationFrame(renderLoaderScene);
  }

  requestAnimationFrame(renderLoaderScene);
}

function finishLoading() {
  if (!uiLoader || uiLoader.classList.contains("is-done")) return;
  if (slidesViewport) {
    slidesViewport.scrollLeft = 0;
  }
  uiLoader.classList.add("is-done");
  setTimeout(() => {
    loaderActive = false;
  }, 650);
}

setTimeout(finishLoading, 5000);

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2400);
}

let auraSurge = 0;

function updateThemeButton(theme) {
  if (!themeToggle) return;
  const label =
    theme === "light"
      ? "Switch to Ultra Instinct Sign (Dark)"
      : "Switch to Mastered Ultra Instinct (Light)";
  themeToggle.setAttribute("aria-label", label);
  if (themeDockLabel) {
    themeDockLabel.textContent = theme === "light" ? "Dark Mode" : "Light Mode";
  }
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute("content", theme === "light" ? "#0ea5e9" : "#8b5cf6");
  }
}

const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
updateThemeButton(currentTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const active = document.documentElement.getAttribute("data-theme") || "dark";
    const nextTheme = active === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    updateThemeButton(nextTheme);
    auraSurge = 1;
    showToast(
      nextTheme === "light"
        ? "Mastered Ultra Instinct (Light)"
        : "Ultra Instinct Sign (Dark)"
    );
  });
}

// Seamless Continuous Horizontal Scroll & Shortcut Navigation Engine
let targetScrollX = 0;
let smoothScrollRaf = null;

function getMaxScrollX() {
  if (!slidesViewport) return 0;
  return Math.max(0, slidesViewport.scrollWidth - slidesViewport.clientWidth);
}

function getSlideScrollTarget(index) {
  if (!slidesViewport || !slides[index]) return 0;
  if (index === 0) return 0;
  const slide = slides[index];
  const centeredOffset =
    slide.offsetLeft - Math.max(0, (slidesViewport.clientWidth - slide.offsetWidth) * 0.5);
  return Math.max(0, Math.min(getMaxScrollX(), centeredOffset));
}

function updateActiveSlideFromScroll() {
  if (!slidesViewport || slides.length === 0) return;
  const viewportCenter = slidesViewport.scrollLeft + slidesViewport.clientWidth * 0.45;
  let closestIdx = 0;
  let minDist = Infinity;

  slides.forEach((slide, idx) => {
    const slideCenter = slide.offsetLeft + slide.offsetWidth * 0.5;
    const dist = Math.abs(slideCenter - viewportCenter);
    if (dist < minDist) {
      minDist = dist;
      closestIdx = idx;
    }
  });

  syncActiveSlide(closestIdx);
}

function syncActiveSlide(index) {
  currentSlideIndex = Math.max(0, Math.min(slides.length - 1, index));
  const activeId = slides[currentSlideIndex]?.id || "bio";

  slides.forEach((slide, idx) => {
    slide.classList.toggle("is-current", idx === currentSlideIndex);
  });

  dockLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.slideLink === activeId);
  });

  if (slideCounter) {
    slideCounter.textContent = `${currentSlideIndex + 1} / ${slides.length}`;
  }
  if (prevSlideBtn) {
    prevSlideBtn.disabled = currentSlideIndex === 0;
  }
  if (nextSlideBtn) {
    nextSlideBtn.disabled = currentSlideIndex === slides.length - 1;
  }
}

function stepSmoothScroll() {
  if (!slidesViewport) {
    smoothScrollRaf = null;
    return;
  }
  const current = slidesViewport.scrollLeft;
  const diff = targetScrollX - current;

  if (Math.abs(diff) < 0.6) {
    slidesViewport.scrollLeft = targetScrollX;
    smoothScrollRaf = null;
    updateActiveSlideFromScroll();
    return;
  }

  slidesViewport.scrollLeft = current + diff * 0.14;
  updateActiveSlideFromScroll();
  smoothScrollRaf = requestAnimationFrame(stepSmoothScroll);
}

function startSmoothGlide(nextTargetX) {
  targetScrollX = Math.max(0, Math.min(getMaxScrollX(), nextTargetX));
  if (!smoothScrollRaf) {
    smoothScrollRaf = requestAnimationFrame(stepSmoothScroll);
  }
}

function goToSlideByIndex(index) {
  if (!slidesViewport || slides.length === 0) return;
  const clamped = Math.max(0, Math.min(slides.length - 1, index));
  syncActiveSlide(clamped);
  startSmoothGlide(getSlideScrollTarget(clamped));
}

function goToSlideById(id) {
  const idx = slides.findIndex((s) => s.id === id);
  if (idx !== -1) {
    goToSlideByIndex(idx);
  }
}

allSlideLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("data-slide-link");
    if (targetId) {
      e.preventDefault();
      goToSlideById(targetId);
    }
  });
});

if (prevSlideBtn) {
  prevSlideBtn.addEventListener("click", () => goToSlideByIndex(currentSlideIndex - 1));
}

if (nextSlideBtn) {
  nextSlideBtn.addEventListener("click", () => goToSlideByIndex(currentSlideIndex + 1));
}

// Buttery-smooth continuous wheel-to-horizontal inertia (zero snap walls or locks)
if (slidesViewport) {
  slidesViewport.addEventListener(
    "wheel",
    (e) => {
      // Normalize wheel delta across mouse wheels (lines) and trackpads (pixels)
      const factor = e.deltaMode === 1 ? 36 : e.deltaMode === 2 ? window.innerWidth : 1;
      const dx = e.deltaX * factor;
      const dy = e.deltaY * factor;

      // If scrolling horizontally on a trackpad, let native momentum work seamlessly
      if (Math.abs(dx) > Math.abs(dy)) {
        if (smoothScrollRaf) {
          cancelAnimationFrame(smoothScrollRaf);
          smoothScrollRaf = null;
        }
        targetScrollX = slidesViewport.scrollLeft;
        return;
      }

      e.preventDefault();
      if (!smoothScrollRaf) {
        targetScrollX = slidesViewport.scrollLeft;
      }
      startSmoothGlide(targetScrollX + dy * 1.15);
    },
    { passive: false }
  );

  slidesViewport.addEventListener(
    "touchstart",
    () => {
      if (smoothScrollRaf) {
        cancelAnimationFrame(smoothScrollRaf);
        smoothScrollRaf = null;
      }
    },
    { passive: true }
  );

  slidesViewport.addEventListener(
    "scroll",
    () => {
      if (!smoothScrollRaf) {
        targetScrollX = slidesViewport.scrollLeft;
      }
      updateActiveSlideFromScroll();
    },
    { passive: true }
  );
}

// Left / Right Arrow Key Navigation (unless typing in an input)
window.addEventListener("keydown", (e) => {
  const tag = document.activeElement?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;
  if (e.key === "ArrowRight") {
    e.preventDefault();
    goToSlideByIndex(currentSlideIndex + 1);
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    goToSlideByIndex(currentSlideIndex - 1);
  }
});

if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", async () => {
    const email = copyEmailBtn.dataset.email;
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
      if (copyEmailText) {
        const originalText = copyEmailText.textContent;
        copyEmailText.textContent = "Copied ✓";
        setTimeout(() => {
          copyEmailText.textContent = originalText;
        }, 2200);
      }
      showToast(`Copied ${email}`);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  });
}

// Interactive Skill Pills -> Highlight Matching Projects & Slide to Projects
skillPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    const skill = pill.dataset.skill || "";
    const wasActive = pill.classList.contains("is-active");

    skillPills.forEach((p) => p.classList.remove("is-active"));
    projectCards.forEach((card) => card.classList.remove("is-highlighted"));

    if (wasActive) return;

    pill.classList.add("is-active");
    let matchCount = 0;

    projectCards.forEach((card) => {
      const techList = (card.dataset.tech || "").toLowerCase();
      if (techList.includes(skill.toLowerCase())) {
        card.classList.add("is-highlighted");
        matchCount++;
      }
    });

    if (matchCount > 0) {
      goToSlideById("projects");
      showToast(`Highlighted ${matchCount} project${matchCount > 1 ? "s" : ""} using ${skill}`);
    } else {
      showToast(`Core skill: ${skill}`);
    }
  });
});

syncActiveSlide(0);

// Randomly Cycling Slanted Background Words (matched-size pools prevent layout shift)
const wordPools = {
  banner: {
    sm: ["RRDS", "JAVA", "SQL", "HTML", "CSS3", "HCI", "DAA"],
    md: [
      "DATABASE SYSTEMS",
      "ORACLE CERTIFIED",
      "DATA STRUCTURES",
      "SEARCH OPTIMIZER",
      "HOPE ERP PLATFORM",
      "NEW ERA UNIVERSITY"
    ],
    lg: [
      "REDGE RAINIER D. SARMIENTO",
      "COMPUTER SCIENCE & ALGORITHMS",
      "SOFTWARE DEVELOPMENT & QA",
      "HUMAN-COMPUTER INTERACTION",
      "CONTINUOUS LEARNING & CODE",
      "EFFICIENT SOFTWARE DESIGN"
    ]
  },
  sub: {
    md: [
      "RRDS // REDGE SARMIENTO",
      "NEW ERA UNIVERSITY",
      "JAVA & JAVASCRIPT",
      "TRIE PREFIX TREE",
      "REACT & TYPESCRIPT",
      "SUPABASE POSTGRES",
      "SEARCH OPTIMIZER",
      "HOPE ERP PLATFORM",
      "PYTHON & NUMPY",
      "CLEAN ARCHITECTURE",
      "LUCIDCHART & ECLIPSE"
    ],
    lg: [
      "3RD YEAR BS COMPUTER SCIENCE",
      "RELATIONAL DATABASES SQL",
      "BAI PASSPORT SYSTEM PORTAL",
      "AI FOUNDATIONS ASSOCIATE",
      "ORACLE DATA PLATFORM 2025",
      "IBM SQL & DATABASES 101"
    ]
  }
};

const bgTracks = document.querySelectorAll(".bg-flow-track");

if (bgTracks.length > 0) {
  setInterval(() => {
    const track = bgTracks[Math.floor(Math.random() * bgTracks.length)];
    const groups = track.querySelectorAll(".bg-flow-group");
    if (groups.length < 2) return;

    const firstGroupWords = groups[0].querySelectorAll(".bg-word");
    const secondGroupWords = groups[1].querySelectorAll(".bg-word");
    if (firstGroupWords.length === 0) return;

    const idx = Math.floor(Math.random() * firstGroupWords.length);
    const targetA = firstGroupWords[idx];
    const targetB = secondGroupWords[idx];
    if (!targetA || !targetB) return;

    const poolType = targetA.dataset.pool === "sub" ? "sub" : "banner";
    const sizeKey = targetA.dataset.size || "md";
    const pool = wordPools[poolType][sizeKey] || wordPools[poolType].md;
    const currentText = targetA.textContent;
    const candidates = pool.filter((w) => w !== currentText);
    if (candidates.length === 0) return;

    const nextWord = candidates[Math.floor(Math.random() * candidates.length)];

    targetA.classList.add("is-cycling");
    targetB.classList.add("is-cycling");

    setTimeout(() => {
      targetA.textContent = nextWord;
      targetB.textContent = nextWord;
    }, 150);

    setTimeout(() => {
      targetA.classList.remove("is-cycling");
      targetB.classList.remove("is-cycling");
    }, 450);
  }, 950);
}

// Mini Interactive Trie Auto-Complete Demo
class TrieNode {
  constructor() {
    this.children = {};
    this.endOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
    this.wordCount = 0;
  }

  insert(rawWord) {
    const word = rawWord.trim().toLowerCase();
    if (!word) return false;
    let current = this.root;
    for (const char of word) {
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char];
    }
    if (!current.endOfWord) {
      current.endOfWord = true;
      this.wordCount++;
      return true;
    }
    return false;
  }

  queryPrefix(rawPrefix) {
    const prefix = rawPrefix.trim().toLowerCase();
    let current = this.root;
    const path = [];
    let missingChar = null;

    for (const char of prefix) {
      if (!current.children[char]) {
        missingChar = char;
        break;
      }
      current = current.children[char];
      path.push({ char: char.toUpperCase(), isEnd: current.endOfWord });
    }

    const suggestions = [];
    let dfsNodesVisited = 0;

    if (!missingChar && prefix.length > 0) {
      const dfs = (node, word) => {
        dfsNodesVisited++;
        if (node.endOfWord) {
          suggestions.push(word);
        }
        const keys = Object.keys(node.children).sort();
        for (const ch of keys) {
          dfs(node.children[ch], word + ch);
        }
      };
      dfs(current, prefix);
    }

    return {
      prefix,
      path,
      missingChar: missingChar ? missingChar.toUpperCase() : null,
      suggestions,
      dfsNodesVisited
    };
  }
}

const initialWords = [
  // Words from Redge's DAA Trie Paper trace ("cat", "car", "card", "care", "bat") + extensions
  "cat", "car", "card", "care", "cart", "carbon", "career", "cargo", "bat", "batch",
  // Data & Databases
  "data", "database", "datastructure", "datalist", "datasheet", "dataflow", "db2",
  // Algorithms & CS
  "algorithm", "algebra", "alignment", "allocation", "alphanumeric", "autocomplete",
  // Oracle & Cloud
  "oracle", "orchestration", "origin", "orbital", "optimization", "optimizer",
  // Programming & Projects
  "program", "programming", "programmer", "project", "prototype", "protocol", "promise",
  // Supabase & Systems
  "supabase", "superadmin", "support", "system", "syntax", "synchronize", "syslog",
  // Languages & Tools
  "java", "javascript", "python", "prefix", "tree", "trie", "typescript", "tailwind"
];

const demoTrie = new Trie();
initialWords.forEach((w) => demoTrie.insert(w));

const trieSearchInput = document.getElementById("trie-search-input");
const trieInsertInput = document.getElementById("trie-insert-input");
const trieInsertBtn = document.getElementById("trie-insert-btn");
const triePathEl = document.getElementById("trie-path");
const trieResultsEl = document.getElementById("trie-results");
const trieDictSizeEl = document.getElementById("trie-dict-size");
const triePrefixLenEl = document.getElementById("trie-prefix-len");
const trieMatchCountEl = document.getElementById("trie-match-count");
const trieNodesVisitedEl = document.getElementById("trie-nodes-visited");
const trieBfScannedEl = document.getElementById("trie-bf-scanned");
const triePresetBtns = document.querySelectorAll(".trie-preset-btn");

function renderTrieDemo(rawQuery) {
  if (!triePathEl || !trieResultsEl) return;

  const res = demoTrie.queryPrefix(rawQuery);
  triePathEl.innerHTML = "";
  trieResultsEl.innerHTML = "";

  // Render Root node
  const rootBadge = document.createElement("span");
  rootBadge.className = "trie-node is-root";
  rootBadge.textContent = "ROOT";
  triePathEl.appendChild(rootBadge);

  res.path.forEach((step, index) => {
    const arrow = document.createElement("span");
    arrow.className = "trie-arrow";
    arrow.textContent = "→";
    triePathEl.appendChild(arrow);

    const nodeBadge = document.createElement("span");
    const isLast = index === res.path.length - 1 && !res.missingChar;
    nodeBadge.className = `trie-node${isLast ? " is-endpoint" : ""}`;
    nodeBadge.textContent = step.isEnd ? `${step.char} ✓` : step.char;
    triePathEl.appendChild(nodeBadge);
  });

  if (res.missingChar) {
    const arrow = document.createElement("span");
    arrow.className = "trie-arrow";
    arrow.textContent = "→";
    triePathEl.appendChild(arrow);

    const missingBadge = document.createElement("span");
    missingBadge.className = "trie-node is-missing";
    missingBadge.textContent = `${res.missingChar} (✕ not in Trie)`;
    triePathEl.appendChild(missingBadge);
  }

  // Render Suggestions
  if (!res.prefix) {
    const emptyMsg = document.createElement("span");
    emptyMsg.className = "trie-empty";
    emptyMsg.textContent = "Type a prefix above to traverse the Trie...";
    trieResultsEl.appendChild(emptyMsg);
  } else if (res.suggestions.length === 0) {
    const emptyMsg = document.createElement("span");
    emptyMsg.className = "trie-empty";
    emptyMsg.textContent = `No completions found for "${res.prefix}" (O(p) early exit)`;
    trieResultsEl.appendChild(emptyMsg);
  } else {
    res.suggestions.forEach((word) => {
      const chip = document.createElement("span");
      chip.className = "trie-match-chip";
      const matchedPart = word.slice(0, res.prefix.length);
      const restPart = word.slice(res.prefix.length);
      chip.innerHTML = `<strong>${matchedPart}</strong>${restPart}`;
      trieResultsEl.appendChild(chip);
    });
  }

  // Update Metrics
  if (trieDictSizeEl) trieDictSizeEl.textContent = String(demoTrie.wordCount);
  if (triePrefixLenEl) triePrefixLenEl.textContent = String(res.prefix.length);
  if (trieMatchCountEl) trieMatchCountEl.textContent = String(res.suggestions.length);
  if (trieNodesVisitedEl) trieNodesVisitedEl.textContent = String(res.path.length + res.dfsNodesVisited);
  if (trieBfScannedEl) trieBfScannedEl.textContent = String(demoTrie.wordCount);

  triePresetBtns.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.prefix === res.prefix);
  });
}

if (trieSearchInput) {
  renderTrieDemo(trieSearchInput.value);

  trieSearchInput.addEventListener("input", () => {
    renderTrieDemo(trieSearchInput.value);
  });
}

triePresetBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const prefix = btn.dataset.prefix || "";
    if (trieSearchInput) {
      trieSearchInput.value = prefix;
      renderTrieDemo(prefix);
    }
  });
});

function handleTrieInsert() {
  if (!trieInsertInput) return;
  const word = trieInsertInput.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  if (!word) {
    showToast("Enter a word to insert into the Trie");
    return;
  }
  const added = demoTrie.insert(word);
  trieInsertInput.value = "";
  const prefix = word.slice(0, Math.min(3, word.length));
  if (trieSearchInput) {
    trieSearchInput.value = prefix;
    renderTrieDemo(prefix);
  }
  showToast(added ? `Inserted "${word}" into Trie (${demoTrie.wordCount} words)` : `"${word}" is already in the Trie`);
}

if (trieInsertBtn) {
  trieInsertBtn.addEventListener("click", handleTrieInsert);
}

if (trieInsertInput) {
  trieInsertInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTrieInsert();
    }
  });
}

// Ultra Instinct Rising Aura & Particle System
const uiCanvas = document.getElementById("ui-particles");

if (uiCanvas instanceof HTMLCanvasElement) {
  const ctx = uiCanvas.getContext("2d");
  let width = 0;
  let height = 0;
  let dpr = 1;

  // Color palettes inspired by UI Sign (Dark) & Mastered UI (Light)
  const uiPalettes = {
    dark: [
      { r: 168, g: 85, b: 247 },  // Cosmic Violet
      { r: 192, g: 132, b: 252 }, // Orchid Glow
      { r: 56, g: 189, b: 248 },  // Electric Ice Cyan
      { r: 99, g: 102, b: 241 },  // Deep Indigo
      { r: 241, g: 245, b: 249 }  // Silver-White Spark
    ],
    light: [
      { r: 14, g: 165, b: 233 },  // Radiant Sky Cyan
      { r: 37, g: 99, b: 235 },   // Celestial Sapphire
      { r: 124, g: 58, b: 237 },  // Divine Iris Violet
      { r: 139, g: 92, b: 246 },  // Luminous Amethyst
      { r: 100, g: 116, b: 139 }  // Metallic Silver-Slate
    ]
  };

  const sparks = [];
  const wisps = [];

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    uiCanvas.width = Math.floor(width * dpr);
    uiCanvas.height = Math.floor(height * dpr);
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createSpark(randomY = false) {
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : height + Math.random() * 40,
      radius: 1.2 + Math.random() * 2.8,
      vy: -(0.45 + Math.random() * 1.15),
      swayAmp: 0.25 + Math.random() * 0.65,
      swayFreq: 0.008 + Math.random() * 0.016,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.25 + Math.random() * 0.65,
      colorIndex: Math.floor(Math.random() * 5),
      isStar: Math.random() < 0.22
    };
  }

  function createWisp(randomY = false) {
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : height + 60 + Math.random() * 80,
      len: 28 + Math.random() * 58,
      thickness: 1.2 + Math.random() * 2.2,
      vy: -(0.85 + Math.random() * 1.6),
      drift: (Math.random() - 0.5) * 0.25,
      alpha: 0.08 + Math.random() * 0.16,
      colorIndex: Math.floor(Math.random() * 4)
    };
  }

  resizeCanvas();

  const sparkCount = Math.min(75, Math.max(42, Math.floor(width / 22)));
  const wispCount = Math.min(22, Math.max(12, Math.floor(width / 75)));

  for (let i = 0; i < sparkCount; i++) sparks.push(createSpark(true));
  for (let i = 0; i < wispCount; i++) wisps.push(createWisp(true));

  window.addEventListener("resize", resizeCanvas);

  let tick = 0;

  function drawFrame() {
    if (!ctx) return;
    tick++;

    const theme = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    const palette = uiPalettes[theme];

    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = theme === "dark" ? "lighter" : "source-over";

    if (auraSurge > 0.01) {
      auraSurge *= 0.94;
    } else {
      auraSurge = 0;
    }

    const speedMultiplier = 1 + auraSurge * 3.2;

    // 1. Rising Ultra Instinct Energy Wisps
    for (let i = 0; i < wisps.length; i++) {
      const w = wisps[i];
      w.y += w.vy * speedMultiplier;
      w.x += w.drift;

      if (w.y + w.len < -20) {
        Object.assign(w, createWisp(false));
      }

      const c = palette[w.colorIndex % palette.length];
      const grad = ctx.createLinearGradient(w.x, w.y, w.x, w.y + w.len);
      const peakAlpha = Math.min(0.45, w.alpha * (1 + auraSurge * 1.4));
      grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);
      grad.addColorStop(0.45, `rgba(${c.r}, ${c.g}, ${c.b}, ${peakAlpha})`);
      grad.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = w.thickness;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(w.x, w.y);
      ctx.lineTo(w.x, w.y + w.len);
      ctx.stroke();
    }

    // 2. Rising Luminous Ki Orbs & Star Glints
    for (let i = 0; i < sparks.length; i++) {
      const p = sparks[i];
      p.y += p.vy * speedMultiplier;
      p.x += Math.sin(tick * p.swayFreq + p.phase) * p.swayAmp;

      if (p.y < -20) {
        Object.assign(p, createSpark(false));
      }
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;

      const c = palette[p.colorIndex % palette.length];
      const twinkle = 0.65 + 0.35 * Math.sin(tick * 0.045 + p.phase);
      const a = Math.min(0.95, p.alpha * twinkle * (1 + auraSurge * 0.6));
      const glowRadius = p.radius * 3.6;

      // Outer Aura Halo
      const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
      halo.addColorStop(0, theme === "dark" ? `rgba(255, 255, 255, ${a})` : `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`);
      halo.addColorStop(0.35, `rgba(${c.r}, ${c.g}, ${c.b}, ${a * 0.65})`);
      halo.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);

      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // Optional 4-Point Crystalline Glint Cross
      if (p.isStar && twinkle > 0.78) {
        const arm = p.radius * 3.2;
        ctx.strokeStyle =
          theme === "dark"
            ? `rgba(248, 250, 252, ${a * 0.75})`
            : `rgba(${c.r}, ${c.g}, ${c.b}, ${a * 0.7})`;
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(p.x - arm, p.y);
        ctx.lineTo(p.x + arm, p.y);
        ctx.moveTo(p.x, p.y - arm);
        ctx.lineTo(p.x, p.y + arm);
        ctx.stroke();
      }
    }

    requestAnimationFrame(drawFrame);
  }

  requestAnimationFrame(drawFrame);
}



