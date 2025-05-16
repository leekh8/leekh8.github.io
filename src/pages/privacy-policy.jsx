import React from "react"
import styled from "styled-components"
import Layout from "components/Layout"
import SEO from "components/SEO"
import { siteUrl, description } from "../../blog-config"

const Content = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  color: ${props => props.theme.colors.text};
  line-height: 1.8;
  font-size: 15.5px;
`

const PrivacyPolicyPage = () => (
  <Layout>
    <SEO
      title="Privacy Policy"
      description={description}
      url={`${siteUrl}/privacy-policy`}
    />
    <Content>
      <h1>Privacy Policy</h1>
      <p>
        이 블로그는 방문자의 개인정보를 소중히 생각하며, 다음과 같은 방침을
        따릅니다.
      </p>
      <h2>1. Google AdSense</h2>
      <p>
        이 사이트는 Google AdSense를 사용하여 광고를 게재합니다. Google은 쿠키를
        사용하여 사용자의 관심사에 기반한 광고를 제공합니다.
      </p>
      <p>
        자세한 사항은 Google의{" "}
        <a
          href="https://policies.google.com/technologies/ads"
          target="_blank"
          rel="noopener noreferrer"
        >
          광고 정책
        </a>
        을 참고해 주세요.
      </p>
      <h2>2. 수집하는 정보</h2>
      <p>
        본 사이트는 사용자로부터 직접적인 개인정보를 수집하지 않으며, Google
        Analytics 및 광고 쿠키를 통해 비식별 정보를 수집할 수 있습니다.
      </p>
      <h2>3. 외부 링크</h2>
      <p>
        본 사이트는 외부 사이트로 연결되는 링크를 포함할 수 있으며, 해당
        사이트의 개인정보 방침과는 무관합니다.
      </p>
      <h2>4. 문의</h2>
      <p>
        개인정보 보호와 관련된 문의사항은 contact 페이지를 통해 전달해 주세요.
      </p>
    </Content>
  </Layout>
)

export default PrivacyPolicyPage
