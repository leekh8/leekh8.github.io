import { createGlobalStyle } from "styled-components"
import reset from "styled-reset"

const GlobalStyles = createGlobalStyle`
  ${reset}

  html {
    font-size: 14px;
  }

  /*
   * 타입 스케일.
   * html이 14px로 고정돼 있어 rem이 16px 기준과 어긋나던 탓에,
   * 그동안 16px 기준으로 계산한 소수점 px(14.4 / 15.5 / 17.6 / 44.8 …)이
   * 컴포넌트마다 직접 박혀 고유값 34종이 났다. 여기서 한 벌로 정리한다.
   * 컴포넌트는 var(--fs-*)만 쓰고 px를 직접 적지 않는다.
   */
  :root {
    --fs-xs:   11px;  /* 태그, 각주 번호 */
    --fs-sm:   12px;  /* 캡션, 날짜, 메타 */
    --fs-base: 13px;  /* UI 기본 */
    --fs-md:   14px;  /* UI 강조 */
    --fs-lg:   16px;  /* 본문, h4 */
    --fs-xl:   18px;  /* h3 */
    --fs-2xl:  22px;  /* h2 */
    --fs-3xl:  28px;  /* h1, 포스트 제목 */
    --fs-4xl:  40px;  /* 대형 타이틀 */
  }

  body {
    font-family: 'Noto Sans KR', sans-serif;
    background: ${props => props.theme.colors.bodyBackground};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* 키보드 사용자에게 초점을 보여준다 (이전엔 정의가 없었다) */
  :focus-visible {
    outline: 2px solid ${props => props.theme.colors.activatedBorder};
    outline-offset: 2px;
    border-radius: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
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
