---
title: "🚀 Gatsby 블로그 검색 엔진 배포"
date: 2024-04-25
update: 2024-04-25
tags:
  - GitHub Actions
  - Gatsby
  - SEO
  - Netlify
  - Code N Solve
series: "Code N Solve"
---

## Code N Solve 📘: Gatsby 블로그 배포

Netlify를 이용해 배포하는 것은 편하지만 직접 해보는 것이 더 재미있겠다고 느껴졌다.[^1]

Gatsby를 이용한 웹사이트의 배포 과정과 검색 엔진 최적화(SEO) 설정에 대해 정리해보자.

### 검색 엔진 최적화 (SEO) 설정

#### 검색 엔진 최적화 (SEO)란? 🤔

- SEO는 웹사이트가 검색 엔진에서 보다 잘 노출되도록 최적화하는 작업이다.
- 아래는 Gatsby 블로그에서 중요한 SEO 설정들이다.

  - **메타 태그 추가**: 페이지 내용을 검색 엔진에 설명해주는 메타 태그를 추가한다.
  - **SEO 플러그인 설치**: `gatsby-plugin-react-helmet` 플러그인을 사용하여 각 페이지의 `<head>` 태그 내에서 SEO 관련 설정을 관리한다.
  - **메타 데이터 관리**: GraphQL을 사용하여 페이지에 필요한 데이터를 추출하고, 페이지별로 적절히 배치한다.
  - **sitemap 생성**: `gatsby-plugin-sitemap` 플러그인을 사용하여 사이트 맵을 자동으로 생성하여 검색 엔진이 사이트를 더 쉽게 크롤링할 수 있게 한다.
  - **정적 파일 최적화**: `gatsby-image` 플러그인을 사용하여 이미지 파일을 최적화하여 로딩 시간을 단축한다.

### 검색 엔진

#### 1. Google Search Console[^2]

- **도메인 (Domain property)**: 모든 서브도메인과 프로토콜, 포트를 포함한 데이터를 볼 수 있다. DNS 레코드를 수정하여 소유권 인증이 필요하다.
- **URL 접두어 (URL-prefix property)**: 특정 URL 형식에 대해서만 데이터를 볼 수 있다. 다양한 방법(HTML 태그, Google Analytics 등)으로 소유권 인증이 가능하다.

#### 2. Naver Webmaster Tools[^3]

- 간단하게 HTML 파일을 업로드하여 소유권 인증을 진행할 수 있다.

#### GitHub Pages 배포 시 고려사항

- GitHub Pages의 도메인은 GitHub에 의해 관리되기 때문에 DNS 설정이 불가능하다.
- 따라서 URL 방식의 소유권 인증이 더 적합할 것 같다.
- root directory에 HTML 파일은 build가 안되어서 `static` directory에 넣으면 build가 가능하다.

#### Gatsby의 SEO 친화적 구조[^4]

- Gatsby는 React 기반의 정적 사이트 생성기로, 빠른 로딩 시간과 SEO 친화적 구조를 갖고 있다.[^5]

  - **속도와 성능**: Gatsby는 빌드 시간에 필요한 리소스를 최적화하고, 사전 렌더링 및 코드 분할을 자동으로 처리한다.
  - **플러그인 시스템**: Gatsby는 다양한 플러그인을 제공하여 SEO, 이미지 최적화, 사이트맵 생성 등을 간편하게 할 수 있다.
  - **데이터 관리**: Gatsby는 GraphQL을 사용하여 데이터를 관리하고 페이지에 필요한 데이터만을 추출할 수 있도록 한다.

[^1]: https://junia3.github.io/blog/search
[^2]: https://search.google.com/search-console/about
[^3]: https://searchadvisor.naver.com/console/board
[^4]: https://v3.gatsbyjs.com/docs/how-to/adding-common-features/seo/
[^5]: https://salt.agency/blog/gatsby-seo-the-good-good-and-good-step-by-step-guide/
