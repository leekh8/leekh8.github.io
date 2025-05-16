import React from "react"
import styled from "styled-components"
import Layout from "components/Layout"
import SEO from "components/SEO"
import { title, author, siteUrl } from "../../blog-config"

const Content = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  color: ${props => props.theme.colors.text};
  line-height: 1.8;
`

const AboutPage = () => (
  <Layout>
    <SEO title="About" author={author} url={`${siteUrl}/about`} />
    <Content>
      <h1>About Me</h1>
      <p>
        안녕하세요. 저는 <strong>{title}</strong>를 운영하고 있는 {author}
        입니다. 주로 컴퓨터 사이언스, 개발 환경, 기술 문서화에 대한 내용을
        공유하고 있습니다.
      </p>
      <p>
        이 블로그는 개인적인 학습 기록과 함께, 다른 개발자들에게도 도움이 될 수
        있는 정보 제공을 목표로 합니다.
      </p>
      <p>기술 블로그를 통해 성장하는 개발자로 나아가겠습니다. 감사합니다!</p>
    </Content>
  </Layout>
)

export default AboutPage
