const React = require("react")

exports.onRenderBody = ({ setPostBodyComponents }) => {
  setPostBodyComponents([
    <script
      key="mermaid-js"
      src="https://cdnjs.cloudflare.com/ajax/libs/mermaid/8.11.0/mermaid.min.js"
      onLoad={() => {
        if (window.mermaid) {
          window.mermaid.initialize({ startOnLoad: true })
        }
      }}
    />,
  ])
}

require("katex/dist/katex.min.css")
