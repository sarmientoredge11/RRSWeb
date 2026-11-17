const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const copyEmailBtn = document.getElementById("copy-email-btn");
const copyEmailText = document.getElementById("copy-email-text");
const themeToggle = document.getElementById("theme-toggle");
const backToTopBtn = document.getElementById("back-to-top");
const toast = document.getElementById("toast");
const filterButtons = document.querySelectorAll(".filter-btn");
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
        copyEmailText.textContent = "Copied to Clipboard ✓";
        setTimeout(() => {
          copyEmailText.textContent = `Copy ${email}`;
        }, 2200);
      }
      showToast(`Copied ${email} to clipboard`);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  });
}

// Project Category Filters
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    filterButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
    skillPills.forEach((p) => p.classList.remove("is-active"));

    projectCards.forEach((card) => {
      card.classList.remove("is-highlighted");
      const matches = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !matches);
    });
  });
});

// Interactive Skill Pills -> Highlight Matching Projects
skillPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    const skill = pill.dataset.skill || "";
    const wasActive = pill.classList.contains("is-active");

    skillPills.forEach((p) => p.classList.remove("is-active"));
    filterButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.filter === "all"));
    projectCards.forEach((card) => card.classList.remove("is-hidden", "is-highlighted"));

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

