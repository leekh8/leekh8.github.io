const React = require("react")

exports.onInitialClientRender = () => {
  const script = document.createElement("script")
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/mermaid/8.11.0/mermaid.min.js"
  script.onload = () => {
    if (window.mermaid) {
      window.mermaid.initialize({ startOnLoad: true })
    }
  }
  document.body.appendChild(script)
}

require("katex/dist/katex.min.css")
