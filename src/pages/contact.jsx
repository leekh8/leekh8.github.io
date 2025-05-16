import React from "react"
import styled from "styled-components"
import Layout from "components/Layout"
import SEO from "components/SEO"
import { siteUrl, description, links } from "../../blog-config"

const Content = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  color: ${props => props.theme.colors.text};
  line-height: 1.8;
`

const ContactPage = () => (
  <Layout>
    <SEO title="Contact" description={description} url={`${siteUrl}/contact`} />
    <Content>
      <h1>Contact</h1>
      <p>
        블로그에 대해 궁금한 점이나 의견이 있으시다면 아래 이메일로 연락 주시기
        바랍니다.
      </p>
      <p>
        📧 Email: <a href={links.email}>{links.email.replace("mailto:", "")}</a>
      </p>
      <p>
        GitHub 이슈나 PR을 통해서도 소통할 수 있습니다:
        <br />
        🔗 <a href={links.github}>{links.github}</a>
      </p>
    </Content>
  </Layout>
)

export default ContactPage
