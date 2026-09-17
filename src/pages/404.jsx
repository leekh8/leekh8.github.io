import React from "react"
import styled from "styled-components"

import Layout from "components/Layout"
import SEO from "components/SEO"

import { title, description, siteUrl } from "../../blog-config"

const NotFound = styled.div`
  height: 800px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.colors.tertiaryText};

  & > h2 {
    margin-bottom: 16px;
    font-weight: bold;
    font-size: var(--fs-4xl);
  }

  & > h3 {
    font-weight: lighter;
    font-size: var(--fs-3xl);
  }

  @media (max-width: 768px) {
    height: 300px;
  }
`

const NotFoundPage = () => (
  <Layout>
    <SEO
      title={`페이지를 찾을 수 없습니다 - ${title}`}
      description="요청한 주소에 해당하는 글이 없습니다."
      url={`${siteUrl}/404/`}
      noindex
    />
    <NotFound>
      <h2>404 ERROR</h2>
      <h3>Page Not Found X(</h3>
    </NotFound>
  </Layout>
)

export default NotFoundPage
