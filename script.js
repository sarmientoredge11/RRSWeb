const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const copyEmailBtn = document.getElementById("copy-email-btn");
const copyEmailText = document.getElementById("copy-email-text");
const themeToggle = document.getElementById("theme-toggle");
const backToTopBtn = document.getElementById("back-to-top");
const toast = document.getElementById("toast");
const skillPills = document.querySelectorAll(".pill[data-skill]");
const projectCards = document.querySelectorAll(".project-card");
const sections = document.querySelectorAll("main section[id]");

let toastTimeout;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2400);
}

function updateThemeButton(theme) {
  if (!themeToggle) return;
  const label = theme === "light" ? "Switch to dark mode" : "Switch to light mode";
  themeToggle.setAttribute("aria-label", label);
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
    showToast(`Switched to ${nextTheme} mode`);
  });
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

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

// Interactive Skill Pills -> Highlight Matching Projects
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
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      showToast(`Highlighted ${matchCount} project${matchCount > 1 ? "s" : ""} using ${skill}`);
    } else {
      showToast(`Core skill: ${skill}`);
    }
  });
});

// Back to Top & Active Section Highlighting
window.addEventListener("scroll", () => {
  if (backToTopBtn) {
    backToTopBtn.classList.toggle("is-visible", window.scrollY > 320);
  }
});

if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if ("IntersectionObserver" in window && navLinks) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.querySelectorAll("a").forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-35% 0px -55% 0px" }
  );

  sections.forEach((sec) => observer.observe(sec));
}

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


