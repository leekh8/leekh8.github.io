import React from "react"
import { Helmet } from "react-helmet"
import { siteUrl, author as defaultAuthor } from "../../../blog-config"

// date/update가 주어지면 글(BlogPosting)로, 없으면 일반 페이지(WebSite)로 처리한다.
// 과거에는 datePublished/dateModified를 항상 오늘로 넣어 모든 글이 "오늘 발행"으로
// 보였고, Post 템플릿의 JSON-LD와 중복 출력됐다. 이 컴포넌트로 일원화한다.
const SEO = ({
  title,
  description,
  url,
  author,
  date,
  update,
  image,
  noindex,
}) => {
  const ogImage = image || `${siteUrl}/og-image.png`
  const isArticle = Boolean(date)

  const structuredData = isArticle
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        headline: title,
        description: description,
        author: { "@type": "Person", name: author || defaultAuthor },
        publisher: {
          "@type": "Organization",
          name: "leekh8's Blog",
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/profile.png`,
          },
        },
        image: ogImage,
        url: url,
        datePublished: date,
        dateModified: update || date,
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: title,
        url: url,
        description: description,
      }

  return (
    <Helmet>
      <title>{title}</title>
      {/* canonical은 반드시 그 페이지 자신을 가리켜야 한다.
          홈 주소를 넣으면 "이 페이지는 홈의 복제본"이라는 선언이 되어 색인에서 접히고,
          그 페이지에 걸린 링크도 함께 힘을 잃는다. 실측(2026-09-17): 시리즈 페이지 18개와
          /tags/, /series/, /search/ 가 전부 홈을 가리키고 있었고, 홈에 안 걸린 글 40편으로
          가는 길이 전부 그 페이지들을 지나고 있었다. */}
      <link rel="canonical" href={url} />
      {/* 색인에 넣을 이유가 없는 페이지(404 등). 링크 추적은 계속 허용한다. */}
      {noindex && <meta name="robots" content="noindex, follow" />}
      <meta property="og:type" content={isArticle ? "article" : "website"} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={ogImage} />
      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}
      {isArticle && <meta property="article:published_time" content={date} />}
      {isArticle && update && (
        <meta property="article:modified_time" content={update} />
      )}

      {/* Twitter/X 카드 — 공유 시 리치 프리뷰 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD structured data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  )
}

export default SEO
