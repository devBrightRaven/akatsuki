const control = document.querySelector(".back-to-top")

if (control) {
  const update = () => {
    control.hidden = window.scrollY <= window.innerHeight
  }

  window.addEventListener("scroll", update, { passive: true })
  window.addEventListener("resize", update)
  update()
}
