const control = document.querySelector(".back-to-top")

if (control) {
  const privacyTrigger = document.querySelector("[data-open-privacy]")

  const update = () => {
    control.hidden = window.scrollY <= window.innerHeight
    if (!control.hidden && document.querySelector(".br-consent-panel:not([hidden])")) {
      control.hidden = true
    }
    if (!control.hidden && privacyTrigger) {
      const triggerRect = privacyTrigger.getBoundingClientRect()
      control.hidden = triggerRect.top < window.innerHeight && triggerRect.bottom > 0
    }
  }

  control.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    })
  })

  window.addEventListener("scroll", update, { passive: true })
  window.addEventListener("resize", update)
  window.addEventListener("akatsuki:privacychange", update)
  update()
}
