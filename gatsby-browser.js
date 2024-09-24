import "katex/dist/katex.min.css"
import mermaid from "mermaid"

export const onInitialClientRender = () => {
  mermaid.initialize({
    startOnLoad: true,
  })
  mermaid.init()

  window.addEventListener("load", () => {
    const svgs = document.querySelectorAll(".mermaid svg")

    svgs.forEach(svg => {
      svg.style.width = "100%"
      svg.style.height = "auto"
      svg.style.maxWidth = "none"
      svg.style.overflow = "visible"
    })

    mermaid.init(undefined, document.querySelectorAll(".mermaid"))
  })
}
