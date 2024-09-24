/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/ssr-apis/
 */

// You can delete this file if you're not using it
const React = require("react")
const config = require("./blog-config")

exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <title key="title">{config.title}</title>, // 페이지의 <title> 태그 설정
    <meta key="description" name="description" content={config.description} />, // 페이지 설명 설정
    <meta key="og-title" property="og:title" content={config.title} />, // Open Graph 타이틀 설정
    <meta
      key="og-description"
      property="og:description"
      content={config.description}
    />, // Open Graph 설명 설정
    <meta key="og-url" property="og:url" content={config.siteUrl} />, // Open Graph URL 설정

    // Mermaid.js의 CSS 파일을 외부 CDN에서 불러옴
    <link
      key="mermaid-css"
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/mermaid/8.11.0/mermaid.min.css"
    />,

    // <!-- Google AdSense Script -->
    // eslint-disable-next-line react/jsx-key
    <script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3742032449453805"
      crossOrigin="anonymous"
    ></script>,
  ])
}

exports.onRenderBody = ({ setPostBodyComponents }) => {
  if (typeof window !== "undefined") {
    setPostBodyComponents([
      <script
        key="mermaid"
        src="https://unpkg.com/mermaid/dist/mermaid.min.js"
      ></script>,
    ])
  }
}
