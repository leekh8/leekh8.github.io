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

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
`

const ProjectCard = styled.a`
  display: block;
  padding: 1rem 1.2rem;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  transition: border-color 0.2s, transform 0.2s;

  &:hover {
    border-color: ${props => props.theme.colors.text};
    transform: translateY(-2px);
    background-color: transparent;
    color: ${props => props.theme.colors.text};
  }
`

const ProjectName = styled.div`
  font-weight: 700;
  margin-bottom: 0.3rem;
  font-size: 0.95rem;
`

const ProjectDesc = styled.div`
  font-size: 0.82rem;
  color: ${props => props.theme.colors.tertiaryText};
  line-height: 1.5;
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
          보안과 개발 사이 어딘가에서 일하고 있어요. 보안 자동화, Python
          스크립트, 웹 개발을 주로 다루고, 공부한 것들을 이 블로그에 정리하고
          있습니다.
        </p>
        <p>
          기술을 다루다 보면 "이걸 좀 더 자동화할 수 없을까?"라는 생각을 자주
          해요. 반복되는 작업을 코드로 해결하는 것에 관심이 많습니다.
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
        <SectionTitle>기술 스택</SectionTitle>
        <p style={{ marginBottom: "0.6rem", fontSize: "0.9rem" }}>
          <strong>언어</strong>
        </p>
        <TagList style={{ marginBottom: "0.8rem" }}>
          <Tag>Python</Tag>
          <Tag>JavaScript</Tag>
          <Tag>TypeScript</Tag>
          <Tag>Java</Tag>
          <Tag>Bash</Tag>
        </TagList>
        <p style={{ marginBottom: "0.6rem", fontSize: "0.9rem" }}>
          <strong>보안 / 인프라</strong>
        </p>
        <TagList style={{ marginBottom: "0.8rem" }}>
          <Tag>FortiSOAR</Tag>
          <Tag>OWASP ZAP</Tag>
          <Tag>Linux</Tag>
          <Tag>Docker</Tag>
          <Tag>GitHub Actions</Tag>
        </TagList>
        <p style={{ marginBottom: "0.6rem", fontSize: "0.9rem" }}>
          <strong>웹 / 프레임워크</strong>
        </p>
        <TagList>
          <Tag>React</Tag>
          <Tag>Gatsby</Tag>
          <Tag>Node.js</Tag>
          <Tag>Spring Boot</Tag>
          <Tag>Playwright</Tag>
        </TagList>
      </Section>

      <Section>
        <SectionTitle>프로젝트</SectionTitle>
        <ProjectGrid>
          <ProjectCard
            href={links.sitemapper}
            target="_blank"
            rel="noreferrer"
          >
            <ProjectName>🌐 Site Mapper</ProjectName>
            <ProjectDesc>
              사이트 구조 기반 sitemap 자동 생성기. Playwright + Node.js
            </ProjectDesc>
          </ProjectCard>
          <ProjectCard
            href={links.timetrack}
            target="_blank"
            rel="noreferrer"
          >
            <ProjectName>⏱ Time Track</ProjectName>
            <ProjectDesc>
              작업 시간 기록 및 통계 도구. React + Vercel 배포
            </ProjectDesc>
          </ProjectCard>
          <ProjectCard
            href={links.mdggu}
            target="_blank"
            rel="noreferrer"
          >
            <ProjectName>📝 MD-GGU</ProjectName>
            <ProjectDesc>
              마크다운 문서 최적화 및 변환 도구. Spring Boot + React
            </ProjectDesc>
          </ProjectCard>
          <ProjectCard
            href={links.github}
            target="_blank"
            rel="noreferrer"
          >
            <ProjectName>🐙 GitHub</ProjectName>
            <ProjectDesc>
              그 외 모든 프로젝트는 GitHub에서 확인하세요
            </ProjectDesc>
          </ProjectCard>
        </ProjectGrid>
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
          <ContactLink href={links.github} target="_blank" rel="noreferrer">
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
