import "katex/dist/katex.min.css"
import mermaid from "mermaid"

export const onInitialClientRender = () => {
  mermaid.initialize({
    startOnLoad: true,
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
    },
    themeCSS: `
      .label foreignObject {
        overflow: visible !important;
        font-size: 90% !important;
      }
      .node rect {
        width: auto !important;
        height: auto !important;
        min-width: 150px;
      }
      .node text {
        white-space: pre-wrap !important;
      }
    `,
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
