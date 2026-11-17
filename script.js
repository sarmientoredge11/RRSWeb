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
