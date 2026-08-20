/**
 * 구 URL → 현 URL 리다이렉트 목록.
 *
 * 2026-04-20 커밋에서 포스트 디렉토리명을 소문자 kebab-case로 통일하면서 슬러그가 바뀌었다.
 * GitHub Pages는 서버 301을 지원하지 않으므로 meta refresh 페이지(src/templates/Redirect.jsx)로
 * 대신한다.
 *
 * gatsby-node.js(페이지 생성)와 gatsby-config.js(sitemap 제외)가 같은 목록을 봐야 하므로
 * 여기 한 곳에서만 관리한다. 한쪽에만 추가하면 구 URL이 다시 sitemap에 실려
 * 색인이 갈라진다.
 */
const LEGACY_REDIRECTS = [
  { from: "/Playwright-install/", to: "/playwright-cicd-troubleshooting/" },
  { from: "/Playwright-browserType-launch-Error/", to: "/playwright-browsertype-launch-error/" },
  { from: "/Vite-Develop-Error/", to: "/vite-deploy-error/" },
  { from: "/Importance-and-Fundamental-Princilpes-of-Web-Accessibility/", to: "/web-accessibility-fundamentals/" },
  { from: "/Context-API-VS-Redux-VS-Zustand/", to: "/react-state-management-comparison/" },
  { from: "/Github-actions-trouble-shooting/", to: "/github-actions-troubleshooting/" },
  { from: "/Google-Colab-Tranformers-Model-Train-Error/", to: "/google-colab-transformers-error/" },
  { from: "/1.3-비기능적-요구사항/", to: "/" },
  { from: "/5.1.1-프로젝트-빌드/", to: "/" },
]

module.exports = {
  LEGACY_REDIRECTS,
  legacyPaths: LEGACY_REDIRECTS.map(({ from }) => from),
}
