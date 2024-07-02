import "katex/dist/katex.min.css"
import mermaid from "mermaid"

export const onInitialClientRender = () => {
  mermaid.initialize({
    startOnLoad: true,
  })

  window.addEventListener("load", () => {
    const svgs = document.querySelectorAll(".mermaid svg")

    svgs.forEach(svg => {
      svg.setAttribute("width", "100%")
      svg.setAttribute("height", "auto")
      svg.style.maxWidth = "none"
      svg.style.overflow = "visible"
    })

    mermaid.init(undefined, document.querySelectorAll(".mermaid"))
  })
}
