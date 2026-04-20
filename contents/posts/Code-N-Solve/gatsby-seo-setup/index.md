---
title: "🚀 Gatsby 블로그 검색 엔진 배포"
description: "Gatsby와 Github Actions를 사용한 블로그의 배포를 위한 검색 엔진 설정 방법"
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

Gatsby를 이용한 웹사이트의 배포 과정과 검색 엔진 최적화(SEO) 설정에 대해 정리해보자. 이 글은 이미 Gatsby 블로그를 GitHub Pages나 Netlify에 배포한 상태를 전제로 한다. 배포까지는 완료됐는데 구글에 내 블로그가 보이지 않는 상황이라면, 이 글이 도움이 될 것이다.

---

## 1. SEO란? — 검색 엔진의 동작 원리부터

### 1-1. SEO의 정의

SEO(Search Engine Optimization)는 웹사이트가 구글, 네이버 같은 검색 엔진에서 더 잘 노출되도록 최적화하는 작업이다. 단순히 키워드를 많이 넣는 기술이 아니라, 검색 엔진이 사이트를 올바르게 이해하고 신뢰할 수 있도록 돕는 전반적인 작업을 말한다.

### 1-2. 검색 엔진의 세 가지 단계

검색 엔진이 내 블로그를 검색 결과에 보여주기까지 세 단계를 거친다.

**1단계: 크롤링(Crawling)**

검색 엔진은 "크롤러(Crawler)" 혹은 "봇(Bot)"이라 불리는 프로그램을 통해 인터넷을 탐색한다. 구글의 크롤러는 "Googlebot"이라고 불린다. 크롤러는 링크를 따라 페이지를 방문하고 페이지 내용을 수집한다.

크롤링이 잘 되려면:
- 사이트 구조가 명확해야 한다 (링크가 잘 연결돼 있어야 함)
- `robots.txt`로 크롤러 접근을 허용해야 한다
- `sitemap.xml`을 제공해 크롤러가 페이지 목록을 한눈에 파악할 수 있어야 한다

**2단계: 인덱싱(Indexing)**

크롤러가 수집한 페이지 내용을 분석해 검색 엔진 데이터베이스에 저장하는 과정이다. 페이지 제목, 본문, 메타 태그, 이미지 등을 분석해 해당 페이지가 어떤 주제를 다루는지 파악한다.

인덱싱이 잘 되려면:
- 메타 태그(`title`, `description`)가 명확해야 한다
- 페이지 내용이 충분히 풍부해야 한다
- 중복 콘텐츠가 없어야 한다

**3단계: 랭킹(Ranking)**

사용자가 검색어를 입력했을 때 어떤 페이지를 몇 번째에 보여줄지 결정하는 과정이다. 구글은 200개 이상의 랭킹 신호를 사용한다고 알려져 있다. 대표적인 요소는 다음과 같다.

- **콘텐츠 관련성**: 검색어와 페이지 내용이 얼마나 일치하는가
- **페이지 품질**: 내용이 충분하고 신뢰할 수 있는가
- **페이지 경험**: 로딩 속도, 모바일 친화성, Core Web Vitals
- **백링크**: 다른 사이트에서 얼마나 많이 링크하는가

### 1-3. 왜 Gatsby는 SEO에 유리한가?

React 기반 SPA(Single Page Application)는 JavaScript가 실행되어야 콘텐츠가 렌더링된다. 과거 구글봇은 JavaScript 실행 능력이 제한적이었기 때문에 SPA는 SEO에 불리했다.

Gatsby는 **정적 사이트 생성기(Static Site Generator)**로, 빌드 시점에 HTML 파일을 미리 생성한다. 이를 **사전 렌더링(Pre-rendering)** 또는 **SSG(Static Site Generation)**라고 한다.

```
일반 React SPA:
브라우저 → JavaScript 다운로드 → React 실행 → HTML 생성 → 화면 출력

Gatsby:
빌드 시점에 HTML 미리 생성 → 브라우저에 바로 HTML 전달 → 화면 출력
```

HTML이 이미 만들어져 있으므로 구글봇이 JavaScript 실행 없이도 바로 콘텐츠를 읽을 수 있다. SEO에 유리하고, 초기 로딩 속도도 빠르다.

---

## 2. Gatsby SEO 플러그인 설정

Gatsby는 플러그인 생태계가 풍부하다. SEO에 필요한 플러그인을 설치하고 설정하자.

### 2-1. 필요한 플러그인 목록

```bash
npm install gatsby-plugin-sitemap gatsby-plugin-robots-txt gatsby-plugin-react-helmet react-helmet
```

| 플러그인 | 역할 |
|----------|------|
| `gatsby-plugin-sitemap` | sitemap.xml 자동 생성 |
| `gatsby-plugin-robots-txt` | robots.txt 자동 생성 |
| `gatsby-plugin-react-helmet` | `<head>` 태그 메타데이터 관리 |
| `react-helmet` | gatsby-plugin-react-helmet의 의존성 |

### 2-2. gatsby-config.js 설정

```javascript
// gatsby-config.js
module.exports = {
  siteMetadata: {
    title: `내 블로그`,
    description: `개발 공부 기록 블로그`,
    author: `leekh8`,
    siteUrl: `https://leekh8.github.io`,  // 반드시 실제 URL로
  },
  plugins: [
    // React Helmet: <head> 태그 관리
    `gatsby-plugin-react-helmet`,

    // Sitemap 생성
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/sitemap.xml`,
        // 특정 페이지 제외 예시
        excludes: [
          `/dev-404-page`,
          `/404`,
          `/404.html`,
        ],
      },
    },

    // robots.txt 생성
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        host: `https://leekh8.github.io`,
        sitemap: `https://leekh8.github.io/sitemap.xml`,
        policy: [
          { userAgent: `*`, allow: `/` },
        ],
      },
    },
  ],
};
```

`siteUrl`은 반드시 실제 배포 도메인으로 설정해야 한다. sitemap.xml에 들어가는 URL이 이 값을 기준으로 생성된다.

### 2-3. SEO 컴포넌트 만들기

각 페이지마다 메타 태그를 일관성 있게 관리하기 위해 SEO 컴포넌트를 만든다.

```jsx
// src/components/SEO.jsx
import React from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

const SEO = ({ title, description, image, pathname }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          author
          siteUrl
        }
      }
    }
  `);

  const siteMetadata = data.site.siteMetadata;
  const metaTitle = title || siteMetadata.title;
  const metaDescription = description || siteMetadata.description;
  const metaImage = image
    ? `${siteMetadata.siteUrl}${image}`
    : `${siteMetadata.siteUrl}/og-image.png`;
  const metaUrl = pathname
    ? `${siteMetadata.siteUrl}${pathname}`
    : siteMetadata.siteUrl;

  return (
    <Helmet>
      {/* 기본 메타 태그 */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />

      {/* Open Graph 메타 태그 (SNS 공유용) */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteMetadata.title} />

      {/* Twitter Card 메타 태그 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* 기타 */}
      <link rel="canonical" href={metaUrl} />
    </Helmet>
  );
};

export default SEO;
```

이 컴포넌트를 각 페이지 컴포넌트에서 불러와 사용한다.

```jsx
// 블로그 포스트 템플릿 예시
const BlogPost = ({ data }) => {
  const post = data.markdownRemark;
  return (
    <>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description}
        pathname={`/posts/${post.fields.slug}`}
      />
      <article>
        <h1>{post.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </>
  );
};
```

---

## 3. robots.txt 설정

### 3-1. robots.txt란?

`robots.txt`는 크롤러(봇)에게 어떤 페이지를 크롤링해도 되고, 어떤 페이지는 하지 말아야 하는지 알려주는 파일이다. 사이트 루트에 위치해야 한다 (`https://yourdomain.com/robots.txt`).

### 3-2. robots.txt 문법

```
# 모든 크롤러에게 모든 경로 허용
User-agent: *
Allow: /

# Googlebot에게만 특정 경로 비허용
User-agent: Googlebot
Disallow: /private/

# 사이트맵 위치 알려주기
Sitemap: https://leekh8.github.io/sitemap.xml
```

| 디렉티브 | 설명 |
|----------|------|
| `User-agent` | 어떤 봇에 적용할지 (`*`는 모든 봇) |
| `Allow` | 접근 허용 경로 |
| `Disallow` | 접근 금지 경로 |
| `Sitemap` | 사이트맵 위치 |

### 3-3. 개인 블로그에서 권장하는 설정

```
User-agent: *
Allow: /
Sitemap: https://leekh8.github.io/sitemap.xml
```

개인 블로그는 대부분 모든 페이지를 노출시키고 싶으므로 전체 허용이 기본이다. 관리자 페이지나 비공개 페이지가 있다면 `Disallow`를 추가한다.

### 3-4. GitHub Pages에서 static 폴더 활용

`gatsby-plugin-robots-txt`를 사용하면 빌드 시 자동으로 생성된다. 수동으로 관리하려면 `static` 폴더에 파일을 넣으면 Gatsby가 빌드 시 `public` 폴더로 복사한다.

```
프로젝트 구조:
/static/robots.txt  →  빌드 시 /public/robots.txt로 복사됨
```

`/static` 폴더에 있는 파일은 변환 없이 그대로 `public`으로 복사된다. HTML 파일을 이용한 소유권 인증 파일도 이 방법으로 처리한다.

---

## 4. sitemap.xml 생성 및 확인

### 4-1. sitemap.xml이란?

`sitemap.xml`은 사이트 내의 모든 페이지 URL 목록을 XML 형식으로 제공하는 파일이다. 크롤러가 이 파일을 보고 어떤 페이지가 있는지 빠르게 파악한다.

```xml
<!-- sitemap.xml 예시 -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://leekh8.github.io/</loc>
    <lastmod>2024-04-25</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://leekh8.github.io/posts/my-first-post/</loc>
    <lastmod>2024-04-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

| 태그 | 설명 |
|------|------|
| `<loc>` | 페이지 URL (필수) |
| `<lastmod>` | 마지막 수정일 |
| `<changefreq>` | 변경 빈도 (always, hourly, daily, weekly, monthly, yearly, never) |
| `<priority>` | 우선순위 (0.0 ~ 1.0, 기본값 0.5) |

### 4-2. gatsby-plugin-sitemap으로 자동 생성

`gatsby build` 후 `public/sitemap.xml` 파일이 생성된다. 배포 후 `https://yourdomain.com/sitemap.xml`로 접근해 확인할 수 있다.

### 4-3. sitemap.xml 유효성 검사

생성된 sitemap이 올바른지 확인하는 방법:

1. 브라우저에서 `https://yourdomain.com/sitemap.xml` 직접 열기
2. [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)에서 URL 입력
3. Google Search Console의 Sitemap 섹션에 제출 후 오류 확인

---

## 5. Google Search Console 등록 전체 과정

### 5-1. Google Search Console이란?

Google Search Console(이하 GSC)은 구글이 무료로 제공하는 도구다. 내 사이트가 구글 검색에 어떻게 노출되는지, 어떤 키워드로 유입되는지, 크롤링 오류는 없는지 등을 확인할 수 있다.

### 5-2. 속성 유형 선택

GSC에 사이트를 등록할 때 두 가지 속성 유형 중 하나를 선택한다.

**도메인 속성 (Domain property)**
- 모든 서브도메인과 프로토콜(http/https)을 포함해 통합 관리
- DNS TXT 레코드를 추가하는 방법으로만 인증 가능
- GitHub Pages는 GitHub 측에서 DNS를 관리하므로 DNS 레코드 수정이 불가능 → 사용 불가

**URL 접두어 속성 (URL-prefix property)**
- 특정 URL 형식에 대한 데이터만 수집
- HTML 파일 업로드, HTML 메타 태그 삽입 등 다양한 방법으로 인증 가능
- GitHub Pages 사용자에게 적합한 방식

### 5-3. HTML 파일 방식으로 소유권 인증

1. [Google Search Console](https://search.google.com/search-console)에 접속
2. 속성 추가 → "URL 접두어" 선택 → 자신의 GitHub Pages URL 입력 (예: `https://leekh8.github.io`)
3. "HTML 파일" 방법 선택 → `googleXXXXXXXXXXXXXXXX.html` 파일 다운로드
4. 다운로드한 파일을 Gatsby 프로젝트의 `/static` 폴더에 넣기

```
project/
├── static/
│   └── googleXXXXXXXXXXXXXXXX.html  ← 여기에 넣기
├── src/
└── gatsby-config.js
```

5. `gatsby build` → GitHub에 푸시 → GitHub Actions 배포 완료 후
6. GSC로 돌아와 "확인" 버튼 클릭

> `static` 폴더에 파일을 넣으면 Gatsby 빌드 시 `public` 폴더로 그대로 복사된다. 따라서 배포 후 `https://leekh8.github.io/googleXXXXXXXXXXXXXXXX.html`로 접근이 가능해진다.

### 5-4. HTML 메타 태그 방식으로 소유권 인증

메타 태그 방식은 파일을 따로 배포하지 않아도 된다. SEO 컴포넌트에 태그 하나를 추가하면 된다.

```jsx
// src/components/SEO.jsx 에 추가
<Helmet>
  {/* Google Search Console 소유권 인증 태그 */}
  <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
  
  {/* 기존 메타 태그들... */}
</Helmet>
```

단, 이 방법은 SEO 컴포넌트가 모든 페이지에 렌더링되도록 설정돼 있어야 한다.

### 5-5. sitemap 제출

소유권 인증 후, sitemap을 GSC에 제출하면 구글이 더 빠르게 페이지를 발견할 수 있다.

1. GSC 좌측 메뉴 → "Sitemaps"
2. "새 사이트맵 추가" 입력란에 `sitemap.xml` 입력
3. "제출" 클릭

제출 후 "성공"으로 표시되면 된다. 처리에는 몇 시간에서 며칠이 걸릴 수 있다.

### 5-6. GSC에서 확인할 수 있는 정보

- **실적(Performance)**: 검색 노출 수, 클릭 수, 평균 순위, CTR
- **URL 검사**: 특정 URL의 색인 상태 확인 및 색인 요청
- **색인생성(Index)**: 전체 페이지 색인 상태, 오류 목록
- **경험(Experience)**: Core Web Vitals, 모바일 사용성
- **링크**: 외부 링크, 내부 링크 현황

---

## 6. Naver Webmaster Tools 등록 전체 과정

### 6-1. 네이버 웹마스터 도구란?

네이버는 자체 검색 엔진을 가지고 있다. 국내 사용자를 타겟으로 한다면 네이버 검색에도 노출되어야 한다. 네이버 웹마스터 도구([searchadvisor.naver.com](https://searchadvisor.naver.com))에서 등록한다.

### 6-2. 사이트 등록 과정

1. 네이버 계정으로 로그인 후 [웹마스터 도구 콘솔](https://searchadvisor.naver.com/console/board) 접속
2. 사이트 추가 → URL 입력 (예: `https://leekh8.github.io`)
3. 소유확인 방법 선택

**HTML 파일 방식:**
1. `naverXXXXXXXXXXXXXXXX.html` 파일 다운로드
2. Gatsby 프로젝트 `/static` 폴더에 복사
3. 빌드 → 배포 → "소유확인" 클릭

**HTML 태그 방식:**
```jsx
// SEO 컴포넌트에 추가
<meta name="naver-site-verification" content="YOUR_NAVER_CODE" />
```

### 6-3. 네이버 sitemap 제출

1. 웹마스터 도구 → 요청 → 사이트맵 제출
2. `https://leekh8.github.io/sitemap.xml` 입력 → 확인

### 6-4. RSS 제출 (선택)

네이버 웹마스터 도구는 RSS도 지원한다. Gatsby에서 RSS를 생성하려면 `gatsby-plugin-feed`를 추가로 설치하면 된다.

```bash
npm install gatsby-plugin-feed
```

```javascript
// gatsby-config.js
{
  resolve: `gatsby-plugin-feed`,
  options: {
    query: `
      {
        site {
          siteMetadata {
            title
            description
            siteUrl
          }
        }
      }
    `,
    feeds: [
      {
        serialize: ({ query: { site, allMarkdownRemark } }) => {
          return allMarkdownRemark.nodes.map(node => ({
            title: node.frontmatter.title,
            description: node.excerpt,
            date: node.frontmatter.date,
            url: site.siteMetadata.siteUrl + node.fields.slug,
            guid: site.siteMetadata.siteUrl + node.fields.slug,
          }));
        },
        query: `
          {
            allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
              nodes {
                excerpt
                fields { slug }
                frontmatter {
                  title
                  date
                }
              }
            }
          }
        `,
        output: `/rss.xml`,
        title: `내 블로그 RSS`,
      },
    ],
  },
},
```

---

## 7. Open Graph 메타 태그 설정

### 7-1. Open Graph란?

Open Graph(OG)는 Facebook이 만든 프로토콜로, 웹 페이지가 소셜 미디어에서 공유될 때 어떻게 표시될지를 제어한다. 카카오톡, 슬랙, 트위터 등 대부분의 메신저와 SNS가 OG 태그를 지원한다.

OG 태그가 없으면 공유 시 URL만 나오거나 잘못된 미리보기가 생성된다. OG 태그가 잘 설정돼 있으면 제목, 설명, 대표 이미지가 예쁘게 표시된다.

### 7-2. 필수 OG 태그

```html
<!-- 필수 4개 -->
<meta property="og:title" content="페이지 제목" />
<meta property="og:description" content="페이지 설명" />
<meta property="og:image" content="https://yourdomain.com/og-image.png" />
<meta property="og:url" content="https://yourdomain.com/this-page" />

<!-- 권장 추가 태그 -->
<meta property="og:type" content="article" />  <!-- 블로그 포스트는 article -->
<meta property="og:site_name" content="내 블로그" />
<meta property="og:locale" content="ko_KR" />
```

### 7-3. 블로그 포스트용 OG 태그 심화

```jsx
// 블로그 포스트 SEO 컴포넌트
const PostSEO = ({ post }) => (
  <Helmet>
    <meta property="og:type" content="article" />
    <meta property="og:title" content={post.frontmatter.title} />
    <meta property="og:description" content={post.frontmatter.description} />
    <meta property="article:published_time" content={post.frontmatter.date} />
    <meta property="article:modified_time" content={post.frontmatter.update} />
    <meta property="article:author" content="leekh8" />
    {post.frontmatter.tags.map(tag => (
      <meta property="article:tag" content={tag} key={tag} />
    ))}
  </Helmet>
);
```

### 7-4. OG 이미지 권장 사양

- 크기: **1200 × 630px** (Facebook 권장 사이즈)
- 비율: 1.91:1
- 파일 형식: JPG, PNG
- 파일 크기: 8MB 이하
- 텍스트가 이미지 중앙에 있어야 함 (가장자리는 잘릴 수 있음)

### 7-5. Twitter Card 메타 태그

트위터(현 X)는 OG 태그와 별도로 자체 Card 형식을 사용한다.

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@leekh8" />
<meta name="twitter:title" content="페이지 제목" />
<meta name="twitter:description" content="페이지 설명" />
<meta name="twitter:image" content="https://yourdomain.com/og-image.png" />
```

`summary_large_image`는 큰 이미지를 포함한 카드 형태다. `summary`는 작은 썸네일 형태다.

### 7-6. OG 태그 확인 도구

- Facebook Sharing Debugger: [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/)
- Twitter Card Validator: [cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator)
- LinkedIn Post Inspector: [linkedin.com/post-inspector](https://www.linkedin.com/post-inspector/)
- Open Graph Checker: [opengraph.xyz](https://opengraph.xyz/)

---

## 8. 구조화 데이터 (JSON-LD) 설정

### 8-1. 구조화 데이터란?

구조화 데이터(Structured Data)는 검색 엔진이 페이지 내용을 더 잘 이해할 수 있도록 표준화된 형식으로 정보를 제공하는 방법이다. Schema.org에서 정의한 스키마를 사용하며, JSON-LD 형식으로 `<head>` 태그 안에 삽입한다.

구조화 데이터를 올바르게 설정하면 구글 검색 결과에서 **리치 스니펫(Rich Snippet)**이 나타날 수 있다. 예를 들어 레시피 페이지라면 요리 시간, 별점이 표시되고, 블로그 포스트라면 작성자와 날짜가 강조 표시될 수 있다.

### 8-2. 블로그 포스트용 JSON-LD

```jsx
// 블로그 포스트 구조화 데이터
const BlogPostSchema = ({ post, siteUrl }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.frontmatter.title,
    "description": post.frontmatter.description,
    "image": `${siteUrl}/og-image.png`,
    "datePublished": post.frontmatter.date,
    "dateModified": post.frontmatter.update || post.frontmatter.date,
    "author": {
      "@type": "Person",
      "name": "leekh8",
      "url": siteUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "leekh8 블로그",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}${post.fields.slug}`
    },
    "keywords": post.frontmatter.tags.join(", ")
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
```

### 8-3. 웹사이트 전체 스키마

```jsx
// 사이트 전체에 적용할 WebSite 스키마
const WebSiteSchema = ({ siteUrl, siteName }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
```

### 8-4. 구조화 데이터 검증

구조화 데이터가 올바르게 설정됐는지 검증하는 도구:

- **Google 리치 결과 테스트**: [search.google.com/test/rich-results](https://search.google.com/test/rich-results)
- **Schema.org 검증기**: [validator.schema.org](https://validator.schema.org/)

---

## 9. Lighthouse SEO 점수 확인

### 9-1. Lighthouse란?

Lighthouse는 구글이 만든 오픈소스 성능 측정 도구다. Chrome 개발자 도구에 내장돼 있어 별도 설치 없이 사용할 수 있다.

다음 다섯 가지 항목을 측정한다:

| 항목 | 설명 |
|------|------|
| Performance | 페이지 로딩 속도, Core Web Vitals |
| Accessibility | 접근성 (대체 텍스트, 색상 대비 등) |
| Best Practices | 보안, 최신 API 사용 여부 |
| SEO | 검색 엔진 최적화 설정 |
| PWA | Progressive Web App 준수 여부 |

### 9-2. Lighthouse 실행 방법

**Chrome 개발자 도구 사용:**
1. 분석하려는 페이지 열기
2. F12 (개발자 도구 열기)
3. "Lighthouse" 탭 선택
4. 분석 카테고리 선택 후 "Analyze page load" 클릭

**CLI 사용:**
```bash
npm install -g lighthouse
lighthouse https://leekh8.github.io --output html --output-path ./report.html
```

### 9-3. SEO 점수 올리는 체크리스트

Lighthouse SEO 검사 항목:

- `<title>` 태그 존재 여부
- `<meta name="description">` 태그 존재 여부
- 모든 링크에 설명 텍스트 존재 여부
- `robots.txt` 파일 유효성
- 이미지에 `alt` 속성 존재 여부
- 페이지가 크롤링 가능한지 여부
- hreflang 태그 (다국어 지원 시)
- canonical URL 설정 여부

100점에 가까울수록 SEO 기초가 잘 갖춰진 것이다.

---

## 10. 구글 검색 결과 노출까지 걸리는 시간

### 10-1. 인덱싱 타임라인

GSC에 사이트를 등록하고 sitemap을 제출한다고 해서 바로 구글에 노출되지는 않는다. 일반적인 타임라인은 다음과 같다.

| 기간 | 상태 |
|------|------|
| 1-3일 | Googlebot이 크롤링 시작 |
| 1-2주 | 주요 페이지 색인 시작 |
| 1-3개월 | 검색 결과 순위 안정화 |
| 3-6개월 | 꾸준히 게시할 경우 노출 증가 |

새 사이트는 "구글이 신뢰를 쌓는 시간(Sandbox period)"이 필요하다고 알려져 있다. 특히 처음 3개월은 노출이 적더라도 꾸준히 콘텐츠를 작성하는 것이 중요하다.

### 10-2. 색인이 안 될 때 확인사항

**GSC > URL 검사 도구** 활용:

1. GSC 좌측 상단 검색바에 확인하고 싶은 URL 입력
2. "URL이 Google에 등록되어 있지 않음" → 색인 안 됨
3. "색인 생성 요청" 버튼 클릭

색인 요청 후 수일 내에 처리된다. 하지만 요청이 검색 결과 노출을 보장하지는 않는다.

**자주 확인해야 할 색인 실패 원인:**
- `robots.txt`에서 해당 URL을 차단하고 있는 경우
- `<meta name="robots" content="noindex">` 태그가 있는 경우
- 페이지 내용이 너무 얇거나 중복 콘텐츠인 경우
- 서버 오류(5xx), 리다이렉트 오류(3xx)가 있는 경우
- 페이지 로딩 속도가 너무 느린 경우

---

## 11. 색인 요청 방법 — URL 검사 도구 활용

### 11-1. 새 글 발행 후 즉시 색인 요청

새 포스트를 발행하면 Googlebot이 발견하기까지 시간이 걸린다. GSC의 URL 검사 도구로 직접 색인을 요청할 수 있다.

1. GSC 접속 → 상단 검색바에 새 포스트 URL 입력
2. "URL이 Google에 등록되어 있지 않음" 또는 현재 색인 상태 표시
3. "색인 생성 요청" 버튼 클릭
4. "테스트 라이브 URL" → 페이지가 정상 렌더링되는지 확인
5. "색인 생성 요청" 최종 확인

하루에 색인 요청할 수 있는 횟수에 제한이 있다. 정확한 수치는 공개되지 않았지만 하루 10-15회 정도가 일반적으로 언급된다.

### 11-2. Bing Webmaster Tools도 함께

마이크로소프트 Bing도 국내에서 사용자가 있다. [Bing Webmaster Tools](https://www.bing.com/webmasters)에도 사이트를 등록해 두는 것이 좋다. GSC와 연동 기능이 있어 GSC 데이터를 그대로 가져올 수 있다.

---

## 12. 자주 하는 SEO 실수

### 12-1. `<title>` 태그 중복

모든 페이지가 동일한 `<title>` 태그를 가지면 구글이 페이지를 구분하지 못한다. 각 페이지별로 고유한 제목을 설정해야 한다.

```jsx
// 잘못된 예: 모든 페이지가 같은 제목
<title>내 블로그</title>

// 올바른 예: 페이지별 고유 제목
<title>SQL Basic - 1. 소개 및 기본 개념 | 내 블로그</title>
```

### 12-2. `<meta name="description">` 없거나 중복

description이 없으면 구글이 임의로 본문에서 발췌해 표시한다. 이 경우 검색 결과 미리보기가 어색하게 나타날 수 있다. 페이지마다 고유한 description을 작성하자.

- 권장 길이: **120-160자** (모바일 기준 ~120자)
- 너무 짧아도 (50자 미만), 너무 길어도 잘릴 수 있어 좋지 않다

### 12-3. 이미지 alt 속성 누락

```html
<!-- 나쁜 예 -->
<img src="diagram.png" />

<!-- 좋은 예 -->
<img src="diagram.png" alt="SQL SELECT 문 실행 흐름도" />
```

`alt` 속성은 접근성을 위한 것이기도 하지만, 구글 이미지 검색에서도 활용된다.

### 12-4. noindex 태그 실수

개발 환경에서 사용하는 `noindex` 태그를 프로덕션에 그대로 올리는 실수가 종종 발생한다.

```html
<!-- 이 태그가 있으면 구글이 색인하지 않음 -->
<meta name="robots" content="noindex" />
```

GSC에서 색인이 안 된다는 오류가 나오면 이 태그를 확인해 보자.

### 12-5. canonical URL 미설정

같은 내용이 여러 URL로 접근 가능할 때(예: `http`/`https`, www 유무, 후행 슬래시 유무) 구글이 어떤 URL이 대표인지 모를 수 있다.

```html
<!-- 각 페이지에 canonical URL 명시 -->
<link rel="canonical" href="https://leekh8.github.io/posts/my-post/" />
```

### 12-6. 페이지 속도 무시

구글은 페이지 로딩 속도를 랭킹 요소로 사용한다. Gatsby는 기본적으로 최적화가 잘 돼 있지만, 외부 폰트, 과도한 이미지 등이 성능을 떨어뜨릴 수 있다.

Lighthouse Performance 점수가 90점 미만이라면 개선이 필요하다. `gatsby-plugin-image`로 이미지를 최적화하는 것만으로도 점수가 크게 오를 수 있다.

### 12-7. 모바일 최적화 미흡

구글은 **모바일 우선 색인(Mobile-first Indexing)**을 적용한다. 즉, 모바일 버전의 콘텐츠를 기준으로 색인한다. 반응형 디자인이 적용돼 있는지 확인하자.

```html
<!-- viewport 메타 태그 필수 -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

---

## 마무리

SEO는 단기간에 효과가 나타나지 않는다. 설정을 완료한 후 꾸준히 콘텐츠를 작성하면서 GSC 데이터를 보며 개선해 나가는 과정이다.

**체크리스트 정리:**

- [ ] `gatsby-plugin-sitemap` 설정 및 sitemap.xml 제출
- [ ] `gatsby-plugin-robots-txt` 설정 및 robots.txt 확인
- [ ] 각 페이지에 고유한 `<title>`, `<meta description>` 설정
- [ ] Open Graph 태그 설정 (og:title, og:description, og:image, og:url)
- [ ] Google Search Console 등록 및 sitemap 제출
- [ ] Naver Webmaster Tools 등록 및 sitemap 제출
- [ ] 구조화 데이터 (JSON-LD) 추가
- [ ] 이미지 alt 속성 확인
- [ ] Lighthouse SEO 점수 90점 이상 달성
- [ ] 모바일 반응형 확인

한 번 세팅해 두면 이후에는 좋은 콘텐츠를 꾸준히 쓰는 것이 가장 강력한 SEO 전략이다.

---

[^1]: https://junia3.github.io/blog/search
[^2]: https://search.google.com/search-console/about
[^3]: https://searchadvisor.naver.com/console/board
[^4]: https://v3.gatsbyjs.com/docs/how-to/adding-common-features/seo/
[^5]: https://salt.agency/blog/gatsby-seo-the-good-good-and-good-step-by-step-guide/
