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
      <p>최종 업데이트: 2026년 4월 9일</p>
      <p>
        이 블로그(leekh8.github.io)는 방문자의 개인정보를 소중히 생각하며,
        아래 방침에 따라 운영됩니다.
      </p>

      <h2>1. 수집하는 정보 및 목적</h2>
      <p>
        본 사이트는 방문자로부터 직접적인 개인정보(이름, 주소, 전화번호 등)를
        수집하지 않습니다. 다만 아래의 제3자 서비스를 통해 비식별 통계 정보가
        자동으로 수집될 수 있습니다.
      </p>
      <ul>
        <li>
          <strong>Google Analytics</strong>: 페이지 조회수, 방문자 수, 유입
          경로 등 익명 통계 수집. 개인을 식별하지 않습니다.
        </li>
        <li>
          <strong>Google AdSense</strong>: 광고 게재를 위한 쿠키 및 웹 비콘
          사용. 관심사 기반 광고 제공에 활용될 수 있습니다.
        </li>
        <li>
          <strong>Utterances (댓글)</strong>: GitHub 계정을 통한 댓글 기능.
          댓글 작성 시 GitHub OAuth를 통해 처리됩니다.
        </li>
      </ul>

      <h2>2. 쿠키(Cookie) 사용</h2>
      <p>
        본 사이트는 아래 목적으로 쿠키를 사용하거나, 제3자 서비스가 쿠키를
        사용할 수 있습니다.
      </p>
      <ul>
        <li>사이트 이용 통계 분석 (Google Analytics)</li>
        <li>맞춤형 광고 제공 (Google AdSense)</li>
        <li>다크/라이트 모드 테마 설정 저장 (로컬 스토리지)</li>
      </ul>
      <p>
        브라우저 설정에서 쿠키를 거부하거나 삭제할 수 있습니다. 다만 일부
        기능이 정상 동작하지 않을 수 있습니다.
      </p>

      <h2>3. 광고 및 개인화 광고 거부</h2>
      <p>
        본 사이트는 Google AdSense를 통해 광고를 게재합니다. Google은 이전
        방문 기록을 기반으로 관심사 맞춤 광고를 제공할 수 있습니다.
      </p>
      <p>
        개인화 광고를 원하지 않는 경우{" "}
        <a
          href="https://www.google.com/settings/ads"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google 광고 설정
        </a>
        에서 거부하거나,{" "}
        <a
          href="https://optout.networkadvertising.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          NAI 옵트아웃
        </a>
        을 통해 제3자 광고 네트워크 전체에 대해 거부할 수 있습니다.
      </p>
      <p>
        Google의 개인정보 처리 방침은{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google 개인정보처리방침
        </a>
        에서 확인하세요.
      </p>

      <h2>4. 외부 링크</h2>
      <p>
        본 사이트에는 외부 사이트로 연결되는 링크가 포함될 수 있습니다. 해당
        외부 사이트의 개인정보 처리 방침은 본 방침과 무관하며, 본 사이트는
        외부 사이트의 내용에 대해 책임지지 않습니다.
      </p>

      <h2>5. 개인정보 보호 책임자 및 문의</h2>
      <p>개인정보 보호와 관련된 문의사항은 아래 이메일로 연락해 주세요.</p>
      <p>
        <strong>이메일</strong>:{" "}
        <a href="mailto:amysun125@gmail.com">amysun125@gmail.com</a>
      </p>

      <h2>6. 방침 변경</h2>
      <p>
        본 개인정보 처리 방침은 관련 법령 또는 서비스 변경에 따라 업데이트될
        수 있습니다. 변경 시 페이지 상단의 날짜가 갱신됩니다.
      </p>
    </Content>
  </Layout>
)

export default PrivacyPolicyPage
