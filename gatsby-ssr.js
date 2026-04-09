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

  setHeadComponents([
    <meta key="description" name="description" content={config.description} />,
    <meta key="og-title" property="og:title" content={config.title} />,
    <meta
      key="og-description"
      property="og:description"
      content={config.description}
    />,
    <meta key="og-url" property="og:url" content={config.siteUrl} />,
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
