const STORAGE_KEY = "akatsuki-presentation"
const PRESENTATIONS = new Set(["articles", "calligraphy"])

export const normalizePresentation = (value) =>
  PRESENTATIONS.has(value) ? value : "articles"

export const readPresentation = (storage) => {
  try {
    return normalizePresentation(storage?.getItem(STORAGE_KEY))
  } catch {
    return "articles"
  }
}

export const writePresentation = (storage, value) => {
  const presentation = normalizePresentation(value)
  try {
    storage?.setItem(STORAGE_KEY, presentation)
  } catch {
    // The visual switch still works when storage is unavailable.
  }
  return presentation
}

const initializePresentationSwitches = () => {
  let storage
  try {
    storage = window.localStorage
  } catch {
    storage = undefined
  }

  document.querySelectorAll("[data-presentation-switch]").forEach((control) => {
    const stage = control.closest(".story-stage")
    if (!stage) return

    const apply = (value) => {
      const presentation = normalizePresentation(value)
      stage.dataset.presentation = presentation
      const selected = control.querySelector(`input[value="${presentation}"]`)
      if (selected) selected.checked = true
    }

    apply(readPresentation(storage))
    control.addEventListener("change", (event) => {
      if (!event.target.matches('input[type="radio"]:checked')) return
      apply(writePresentation(storage, event.target.value))
    })
  })
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initializePresentationSwitches)
}
