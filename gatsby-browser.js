import "katex/dist/katex.min.css" // 수학 기호 렌더링을 위한 KaTeX CSS
import mermaid from "mermaid" // Mermaid.js를 가져옴

export const onInitialClientRender = () => {
  // Mermaid.js 초기화 설정
  mermaid.initialize({
    startOnLoad: true, // 페이지 로드 시 자동으로 다이어그램을 렌더링
  })
  mermaid.init()

  // 페이지가 완전히 로드된 후 이벤트 리스너 추가
  window.addEventListener("load", () => {
    const svgs = document.querySelectorAll(".mermaid svg")

    // Mermaid.js로 렌더링된 모든 SVG에 스타일 적용
    svgs.forEach(svg => {
      svg.style.width = "100%"
      svg.style.height = "auto"
      svg.style.maxWidth = "none"
      svg.style.overflow = "visible"
    })

    // Mermaid.js 다이어그램을 다시 초기화
    mermaid.init(undefined, document.querySelectorAll(".mermaid"))
  })
}
