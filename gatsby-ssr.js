/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/ssr-apis/
 */

const React = require("react")
const config = require("./blog-config")

exports.onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  // html lang 설정 (Accessibility + SEO)
  setHtmlAttributes({ lang: "ko" })

  // 사이트 공통 description/og 태그는 여기서 넣지 않는다.
  //
  // 여기서 넣으면 페이지별 SEO 컴포넌트(react-helmet)의 태그와 함께 둘 다 출력된다.
  // helmet은 자기가 만든 태그끼리만 중복을 정리하므로 setHeadComponents로 넣은 것은
  // 남는다. 실측(2026-09-17): 글 페이지 하나에 name="description"이 2개였고 둘째는
  // 50편 전부 같은 사이트 설명이었다. og:url도 2개였고 둘째는 모든 글에서 홈 주소였다.
  // 크롤러가 보면 한 페이지가 자기 정체를 두 번 다르게 말하는 모양이 된다.
  //
  // 페이지와 템플릿은 Redirect.jsx를 빼고 전부 SEO 컴포넌트를 쓰므로 폴백이 필요 없다.
  // (Redirect.jsx는 meta refresh + canonical을 자체로 넣는다.)
  setHeadComponents([
    // Google Analytics (GA4)
    <script
      key="ga4-async"
      async
      src={`https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}`}
    />,
    <script
      key="ga4-init"
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${config.googleAnalyticsId}');
        `,
      }}
    />,
    // Google AdSense
    <script
      key="adsense"
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3742032449453805"
      crossOrigin="anonymous"
    />,
  ])
}
