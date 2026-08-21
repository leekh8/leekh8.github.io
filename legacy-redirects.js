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
 *
 * 목록 출처는 GSC 실적이 아니라 git rename 이력이다.
 *   git log --all --diff-filter=RD --name-status -- "contents/posts/*"
 * 2026-08-20에는 GSC에 노출이 잡힌 구 URL만 넣어 8건을 빠뜨렸다. 노출이 없어도
 * 색인은 남아 있을 수 있으므로 rename 이력 전체가 기준이다.
 */
const LEGACY_REDIRECTS = [
  // e38afe4 (2026-04-20) — 슬러그 kebab-case 통일
  { from: "/Playwright-install/", to: "/playwright-cicd-troubleshooting/" },
  { from: "/Playwright-browserType-launch-Error/", to: "/playwright-browsertype-launch-error/" },
  { from: "/Vite-Develop-Error/", to: "/vite-deploy-error/" },
  { from: "/Importance-and-Fundamental-Princilpes-of-Web-Accessibility/", to: "/web-accessibility-fundamentals/" },
  { from: "/Context-API-VS-Redux-VS-Zustand/", to: "/react-state-management-comparison/" },
  { from: "/Github-actions-trouble-shooting/", to: "/github-actions-troubleshooting/" },
  { from: "/Google-Colab-Tranformers-Model-Train-Error/", to: "/google-colab-transformers-error/" },
  { from: "/Java-Spring-Authentication/", to: "/java-spring-authentication/" },
  { from: "/Spring-Boot-Render-Error/", to: "/spring-boot-render-error/" },
  { from: "/Expose-Blog/", to: "/gatsby-seo-setup/" },
  { from: "/React-1-SPA-Component-State-CRA/", to: "/react-1-spa-component/" },
  { from: "/React-2-Props-State/", to: "/react-2-props-state/" },
  { from: "/React-VS-Vue-VS-Angular/", to: "/react-vs-vue-vs-angular/" },
  { from: "/SQL/", to: "/sql-basic-1/" },

  // beefca8 (2026-04-20) — Props-State 자리에 Hooks 글이 들어감
  { from: "/React-3-Props-State/", to: "/React-3-Hooks/" },

  // 454fffb (2026-04-03) — MD-GGU 문서형 글 삭제. 대상 글이 없어 홈으로 보낸다
  { from: "/1.2-기능-명세/", to: "/" },
  { from: "/1.3-비기능적-요구사항/", to: "/" },
  { from: "/2.1-아키텍처-설계/", to: "/" },
  { from: "/5.1.1-프로젝트-빌드/", to: "/" },
  { from: "/5.3.1-프로그램-동작-구현/", to: "/" },
]

module.exports = {
  LEGACY_REDIRECTS,
  legacyPaths: LEGACY_REDIRECTS.map(({ from }) => from),
}
