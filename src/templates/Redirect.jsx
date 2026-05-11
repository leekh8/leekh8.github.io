import React, { useEffect } from "react"
import { navigate } from "gatsby"
import { Helmet } from "react-helmet"

/**
 * 구 Jekyll URL → 새 Gatsby URL 리다이렉트 템플릿
 * gatsby-node.js에서 createPage로 생성됨
 */
const RedirectTemplate = ({ pageContext }) => {
  const { to } = pageContext

  useEffect(() => {
    navigate(to, { replace: true })
  }, [to])

  return (
    <Helmet>
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <link rel="canonical" href={`https://leekh8.github.io${to}`} />
      <title>페이지 이동 중...</title>
    </Helmet>
  )
}

export default RedirectTemplate
