(function () {
  "use strict";

  const storageKey = "akatsuki-theme";
  const control = document.querySelector("[data-theme-control]");
  if (!control) return;

  const documentElement = document.documentElement;
  const trigger = control.querySelector("[data-theme-trigger]");
  const menu = control.querySelector("[data-theme-menu]");
  const current = control.querySelector("[data-theme-current]");
  const icon = control.querySelector("[data-theme-icon]");
  const radios = Array.from(control.querySelectorAll('input[name="akatsuki-theme"]'));
  const media = matchMedia("(prefers-color-scheme: dark)");
  const validModes = new Set(["auto", "light", "dark"]);
  const modeIcons = { auto: "◐", light: "☀", dark: "☾" };
  let selectedMode = "auto";

  try {
    const saved = localStorage.getItem(storageKey);
    if (validModes.has(saved)) selectedMode = saved;
  } catch {}

  function selectedRadio() {
    return radios.find((radio) => radio.value === selectedMode);
  }

  function applyMode(mode) {
    const theme = mode === "auto" ? (media.matches ? "dark" : "light") : mode;
    documentElement.dataset.theme = theme;
    documentElement.style.colorScheme = theme;
  }

  function syncSelection() {
    const radio = selectedRadio();
    if (!radio) return;
    radio.checked = true;
    const label = radio.parentElement.textContent.trim();
    current.textContent = label;
    icon.textContent = modeIcons[selectedMode];
    trigger.setAttribute("aria-label", `${control.getAttribute("aria-label")}: ${label}`);
  }

  function select(mode) {
    selectedMode = mode;
    try { localStorage.setItem(storageKey, mode); } catch {}
    syncSelection();
    applyMode(mode);
  }

  function close(returnFocus) {
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    syncSelection();
    if (returnFocus) trigger.focus();
  }

  function open() {
    menu.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    syncSelection();
    selectedRadio().focus();
  }

  trigger.addEventListener("click", () => {
    if (menu.hidden) open();
    else close(true);
  });

  menu.addEventListener("change", (event) => {
    if (event.target.matches('input[name="akatsuki-theme"]')) select(event.target.value);
  });

  menu.addEventListener("keydown", (event) => {
    const radio = event.target.closest('input[name="akatsuki-theme"]');
    if (!radio) return;

    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const offset = event.key === "ArrowDown" ? 1 : -1;
      const next = radios[(radios.indexOf(radio) + offset + radios.length) % radios.length];
      select(next.value);
      next.focus();
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      select(radio.value);
    }
  });

  document.addEventListener("click", (event) => {
    if (!menu.hidden && !control.contains(event.target)) close(false);
  });

  media.addEventListener("change", () => {
    if (selectedMode === "auto") applyMode("auto");
  });

  syncSelection();
  applyMode(selectedMode);
})();
