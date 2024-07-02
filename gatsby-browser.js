import "katex/dist/katex.min.css"
import mermaid from "mermaid"

export const onInitialClientRender = () => {
  mermaid.initialize({
    startOnLoad: true,
    // flowchart: {
    //   useMaxWidth: true,
    //   diagramPadding: 10, // 다이어그램 외부 여백
    //   nodeSpacing: 100, // 노드 간의 간격
    //   rankSpacing: 100, // 랭크 간의 간격
    //   padding: 20, // 노드 내부 여백
    // },
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
