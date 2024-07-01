const React = require("react")
import mermaid from "mermaid"

exports.onInitialClientRender = () => {
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

require("katex/dist/katex.min.css")
