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

const TermsPage = () => (
  <Layout>
    <SEO
      title="Terms of Use"
      description={description}
      url={`${siteUrl}/terms`}
    />
    <Content>
      <h1>Terms of Use</h1>
      <p>
        본 웹사이트에 접근하거나 사용하는 경우, 다음의 이용 약관에 동의하는
        것으로 간주합니다.
      </p>

      <h2>1. 저작권</h2>
      <p>
        블로그에 게시된 모든 콘텐츠(텍스트, 이미지, 코드 등)는 작성자에게
        저작권이 있으며, 사전 동의 없이 무단 복제, 배포, 수정, 상업적 사용을
        금합니다.
      </p>

      <h2>2. 면책 조항</h2>
      <p>
        이 블로그에 게시된 정보는 정확성을 보장하기 위해 노력하고 있으나, 어떠한
        법적 책임도 지지 않습니다. 사용자는 해당 정보를 자신의 책임 하에
        사용해야 합니다.
      </p>

      <h2>3. 외부 링크</h2>
      <p>
        블로그 내의 외부 링크는 정보 제공을 목적으로 하며, 외부 사이트의
        정확성이나 신뢰성에 대해 책임지지 않습니다.
      </p>

      <h2>4. 약관 변경</h2>
      <p>
        본 약관은 예고 없이 변경될 수 있으며, 변경 사항은 본 페이지에
        업데이트됩니다. 이용자는 정기적으로 확인해야 합니다.
      </p>

      <h2>5. 문의</h2>
      <p>
        약관 관련 문의는 <a href="/contact">Contact</a> 페이지를 통해 전달해
        주세요.
      </p>
    </Content>
  </Layout>
)

export default TermsPage
