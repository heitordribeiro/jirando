const pathName = window.location.pathname.toLowerCase();
const pageLang = pathName.includes("pt-br") ? "pt" : pathName.includes("es-es") ? "es" : "en";

function applyLanguageText(root = document) {
  root.querySelectorAll(".lang-text").forEach((node) => {
    const value = node.getAttribute(`data-${pageLang}`);
    if (value) {
      node.innerHTML = value;
    }
  });
}

async function loadPartial(targetId, filePath) {
  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  try {
    const response = await fetch(filePath, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load ${filePath} (${response.status})`);
    }

    target.innerHTML = await response.text();
    applyLanguageText(target);
  } catch (error) {
    console.error(error);
  }
}

function closeMobileMenu() {
  const menu = document.querySelector(".menu");
  const toggle = document.querySelector(".nav-toggle");
  if (!menu || !toggle) {
    return;
  }

  menu.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
}

function initMobileMenu() {
  const menu = document.querySelector(".menu");
  const toggle = document.querySelector(".nav-toggle");
  if (!menu || !toggle) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMobileMenu();
    }
  });
}

function initSmoothScroll() {
  document.addEventListener("click", (event) => {
    const anchor = event.target.closest("a[href^='#']");
    if (!anchor) {
      return;
    }

    const targetId = anchor.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    event.preventDefault();
    document.querySelectorAll(".menu > a[href^='#']").forEach((link) => {
      link.removeAttribute("aria-current");
    });
    anchor.setAttribute("aria-current", "true");

    const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
    const baseTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
    const available = window.innerHeight - headerHeight - 24;
    const shouldCenter = targetId === "contact" && target.offsetHeight < available;
    const offsetTop = shouldCenter
      ? Math.max(0, baseTop - Math.round((available - target.offsetHeight) / 2))
      : baseTop;
    window.scrollTo({ top: offsetTop, behavior: "smooth" });
  });
}

function initActiveSection() {
  const links = Array.from(document.querySelectorAll(".menu > a[href^='#']"));
  const map = new Map(
    links.map((link) => [link.getAttribute("href")?.slice(1), link]).filter(([id]) => Boolean(id))
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = map.get(entry.target.id);
        if (!link) {
          return;
        }

        if (entry.isIntersecting) {
          links.forEach((candidate) => candidate.removeAttribute("aria-current"));
          link.setAttribute("aria-current", "true");
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0.1 }
  );

  map.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) {
      observer.observe(section);
    }
  });
}

function updateYear() {
  document.querySelectorAll("#currentYear").forEach((item) => {
    item.textContent = String(new Date().getFullYear());
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadPartial("header-placeholder", "partials/header.html"),
    loadPartial("footer-placeholder", "partials/footer.html")
  ]);

  applyLanguageText();
  initMobileMenu();
  initSmoothScroll();
  initActiveSection();
  updateYear();
});
