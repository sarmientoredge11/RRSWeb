const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const copyEmailBtn = document.getElementById("copy-email-btn");
const themeToggle = document.getElementById("theme-toggle");

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
      const originalText = copyEmailBtn.textContent;
      copyEmailBtn.textContent = "Copied!";
      setTimeout(() => {
        copyEmailBtn.textContent = originalText;
      }, 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  });
}
