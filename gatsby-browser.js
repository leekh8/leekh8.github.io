import React from "react"
import mermaid from "mermaid"
import "katex/dist/katex.min.css"

export const onInitialClientRender = () => {
  mermaid.initialize({
    startOnLoad: true,
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
      diagramPadding: 10,
    },
  })

  window.addEventListener("load", () => {
    mermaid.init(undefined, document.querySelectorAll(".mermaid"))
  })
}
