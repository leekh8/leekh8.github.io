import React from "react"
import styled from "styled-components"
import Layout from "components/Layout"
import SEO from "components/SEO"
import { author, siteUrl, links } from "../../blog-config"

const Content = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  color: ${props => props.theme.colors.text};
  line-height: 1.8;
`

const Section = styled.section`
  margin-bottom: 2.4rem;
`

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  padding-bottom: 0.4rem;
  border-bottom: 2px solid ${props => props.theme.colors.text};
  color: ${props => props.theme.colors.text};
`

const TagList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
`

const Tag = styled.li`
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${props => props.theme.colors.tagBackground};
  color: ${props => props.theme.colors.text};
`

const ContactLink = styled.a`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;

  &:hover {
    opacity: 0.7;
  }
`

const AboutPage = () => (
  <Layout>
    <SEO
      title="About"
      description={`${author}의 블로그 — 보안 자동화, FortiSOAR, Python, 웹 개발을 다룹니다.`}
      author={author}
      url={`${siteUrl}/about`}
    />
    <Content>
      <h1>About Me</h1>

      <Section>
        <p>
          안녕하세요, <strong>{author}</strong>입니다.
        </p>
        <p>
          IT 보안 엔지니어로 일하고 있습니다. 주된 업무는 SOAR(보안 자동화
          및 오케스트레이션) 플랫폼 구축과 운영이고, 취약점 진단 도구 개발과
          보안 자동화 스크립트 작성도 함께 하고 있어요.
        </p>
        <p>
          기술을 다루다 보면 "이걸 좀 더 자동화할 수 없을까?"라는 생각을 자주
          해요. 반복되는 보안 업무를 플레이북으로 만들고, 스크립트로
          자동화하고, 그 결과를 코드로 남기는 것에 관심이 많습니다.
        </p>
      </Section>

      <Section>
        <SectionTitle>관심 분야</SectionTitle>
        <TagList>
          <Tag>보안 자동화 (SOAR)</Tag>
          <Tag>FortiSOAR</Tag>
          <Tag>인시던트 대응</Tag>
          <Tag>취약점 분석</Tag>
          <Tag>Python</Tag>
          <Tag>웹 개발</Tag>
          <Tag>CI/CD</Tag>
          <Tag>DevSecOps</Tag>
        </TagList>
      </Section>

      <Section>
        <SectionTitle>이 블로그에 대해</SectionTitle>
        <p>
          블로그를 시작한 이유는 단순해요. 공부하면서 정리한 내용이 나만 보기엔
          아깝고, 어딘가 같은 문제를 겪고 있을 누군가에게 도움이 될 수도 있다는
          생각에서였어요.
        </p>
        <p>
          주로 보안 자동화, FortiSOAR, Python, 웹 개발 관련 글을 씁니다.
          개념 정리부터 실제 트러블슈팅 경험까지, 읽고 나서 뭔가 하나라도
          가져갈 수 있는 글을 쓰려고 노력하고 있어요.
        </p>
        <p>
          틀린 내용이 있거나 더 좋은 방법을 알고 계시면 언제든지 댓글이나
          메일로 알려주세요.
        </p>
      </Section>

      <Section>
        <SectionTitle>Contact</SectionTitle>
        <p>
          GitHub:{" "}
          <ContactLink
            href={links.github}
            target="_blank"
            rel="noreferrer"
          >
            {links.github}
          </ContactLink>
        </p>
        <p>
          Email:{" "}
          <ContactLink href={links.email}>
            {links.email.replace("mailto:", "")}
          </ContactLink>
        </p>
      </Section>
    </Content>
  </Layout>
)

export default AboutPage
