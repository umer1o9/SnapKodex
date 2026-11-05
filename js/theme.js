(function () {
  const THEME_KEY = "sk-theme";
  const THEME_COLORS = { dark: "#06070a", light: "#eef6ff" };

  const LOGO_PATHS = {
    snapkodex: {
      dark: "/snapkodex logo full dark.svg",
      light: "/snapkodex logo full light.svg",
    },
    snaprytr: {
      dark: "/snaprytr logo full - dark.svg",
      light: "/snaprytr logo full - light.svg",
    },
    "snap-projects": {
      dark: "/snap projects logo dark.svg",
      light: "/snap projects logo light.svg",
    },
  };

  const THEME_IMAGE_PATHS = {
    "taaweel-logo": {
      dark: "/assets/taaweel-logo-dark.svg",
      light: "/assets/taaweel-logo-light.svg",
    },
    "hero-header": {
      dark: "/assets/services/header home.png",
      light: "/assets/services/home header light.png",
    },
    "services-intro": {
      dark: "/assets/services-intro.png",
      light: "/assets/services-intro white.png",
    },
    "service-web-development": {
      dark: "/assets/services/web development.png",
      light: "/assets/services/web development light.png",
    },
    "service-agentic-ai": {
      dark: "/assets/services/agentic-ai.png",
      light: "/assets/services/agentic-ai light.png",
    },
    "service-saas": {
      dark: "/assets/services/saas.png",
      light: "/assets/services/saas light.png",
    },
    "service-custom-solutions": {
      dark: "/assets/services/custom-solutions.png",
      light: "/assets/services/custom-solutions light.png",
    },
    "service-automation": {
      dark: "/assets/services/automation.png",
      light: "/assets/services/automation light.png",
    },
    "service-chatbot": {
      dark: "/assets/services/chatbot.png",
      light: "/assets/services/chatbot light.png",
    },
    "service-sales-agent": {
      dark: "/assets/services/sales-agent.png",
      light: "/assets/services/sales-agent light.png",
    },
    "service-customer-service": {
      dark: "/assets/services/customer-service.png",
      light: "/assets/services/customert-service light.png",
    },
    "service-ecommerce": {
      dark: "/assets/services/ecommerce.png",
      light: "/assets/services/ecommerce light.png",
    },
    "product-snaprytr": {
      dark: "/assets/product-snaprytr.svg",
      light: "/assets/product-snaprytr-light.svg",
    },
    "product-snap-projects": {
      dark: "/assets/product-snap-projects.svg",
      light: "/assets/product-snap-projects-light.svg",
    },
    "product-slm": {
      dark: "/assets/product-slm.svg",
      light: "/assets/product-slm-light.svg",
    },
    "product-taaweel": {
      dark: "/assets/product-taaweel.svg",
      light: "/assets/product-taaweel-light.svg",
    },
    "product-homeschooling": {
      dark: "/assets/product-homeschooling.svg",
      light: "/assets/product-homeschooling-light.svg",
    },
    "partners-ambient": {
      dark: "/assets/partners-ambient.svg",
      light: "/assets/partners-ambient-light.svg",
    },
    "ecosystem-blend": {
      dark: "/assets/ecosystem-blend.svg",
      light: "/assets/ecosystem-blend-light.svg",
    },
    "section-wave": {
      dark: "/assets/section-wave.svg",
      light: "/assets/section-wave-light.svg",
    },
  };

  function getTheme() {
    return localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
  }

  function setTheme(theme) {
    const next = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem(THEME_KEY, next);
    updateMetaThemeColor(next);
    updateLogos(next);
    updateThemeImages(next);
    updateToggleButtons(next);
  }

  function updateMetaThemeColor(theme) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEME_COLORS[theme]);
  }

  function updateLogos(theme) {
    document.querySelectorAll("[data-logo]").forEach(function (img) {
      const key = img.dataset.logo;
      const paths = LOGO_PATHS[key];
      if (!paths) return;
      var logoPath = paths[theme];
      if (window.location.protocol === "file:") logoPath = logoPath.replace(/^\/+/, "");
      img.src = logoPath;
    });
  }

  function updatePictureSource(source, theme, paths) {
    if (!source) return;
    var mobileSrcset = source.dataset.themeSrcsetMobile;
    if (mobileSrcset) {
      source.srcset = mobileSrcset;
      return;
    }
    if (theme === "light") {
      source.srcset = paths.light;
      return;
    }
    var darkSrcset = source.dataset.themeSrcsetDark;
    if (darkSrcset) source.srcset = darkSrcset;
  }

  function updateThemeImages(theme) {
    document.querySelectorAll("[data-theme-img]").forEach(function (img) {
      var key = img.dataset.themeImg;
      var paths = THEME_IMAGE_PATHS[key];
      if (!paths) return;
      var picture = img.closest("picture");
      var source =
        picture && picture.querySelector("source[data-theme-srcset-mobile]");
      if (source) {
        source.srcset = source.dataset.themeSrcsetMobile;
        if (window.matchMedia(source.media).matches) {
          img.src = source.dataset.themeSrcsetMobile;
          return;
        }
      }
      img.src = paths[theme];
      updatePictureSource(
        picture && picture.querySelector("source"),
        theme,
        paths
      );
    });
  }

  function initResponsiveThemeImages() {
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        updateThemeImages(getTheme());
      }, 150);
    });
  }

  function updateToggleButtons(theme) {
    var isLight = theme === "light";
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", isLight ? "true" : "false");
      btn.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
      var icon = btn.querySelector(".material-symbols-rounded");
      if (icon) icon.textContent = isLight ? "dark_mode" : "light_mode";
    });
  }

  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setTheme(getTheme() === "light" ? "dark" : "light");
      });
    });
  }

  function initTheme() {
    if (window.location.protocol !== "file:") {
      document.querySelectorAll("[data-blog-link]").forEach(function (link) {
        link.href = "/blog";
      });
    }
    setTheme(getTheme());
    initThemeToggle();
    initResponsiveThemeImages();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTheme);
  } else {
    initTheme();
  }
})();
