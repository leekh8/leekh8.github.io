import { createGlobalStyle } from "styled-components"
import reset from "styled-reset"

const GlobalStyles = createGlobalStyle`
  ${reset}

  html {
    font-size: 14px;
  }

  body {
    font-family: 'Noto Sans KR', sans-serif;
    background: ${props => props.theme.colors.bodyBackground};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* ===== Print CSS ===== */
  @media print {
    header,
    footer,
    nav[aria-label="페이지 위치"],
    [class*="SideTag"],
    [class*="SideSeries"],
    [class*="ShareWrapper"],
    [class*="BackToTop"],
    [class*="CommentWrapper"],
    [class*="ArticleButtonContainer"],
    [class*="Bar"],
    [class*="RelatedPosts"],
    [class*="copy-button"] {
      display: none !important;
    }

    body {
      background: #fff !important;
      color: #000 !important;
      font-size: 12pt;
    }

    a {
      color: #000;
      text-decoration: underline;
    }

    a[href^="http"]::after {
      content: " (" attr(href) ")";
      font-size: 9pt;
      color: #555;
    }

    a[href^="/"]:after,
    a[href^="#"]:after {
      content: "";
    }

    pre, code {
      border: 1px solid #ccc;
      page-break-inside: avoid;
      white-space: pre-wrap;
    }

    h2, h3, h4 {
      page-break-after: avoid;
    }

    img {
      max-width: 100% !important;
    }

    @page {
      margin: 2cm;
    }
  }
`

export default GlobalStyles
