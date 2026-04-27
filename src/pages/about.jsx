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

const Intro = styled.div`
  margin-bottom: 2.4rem;
`

const Role = styled.p`
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${props => props.theme.colors.tertiaryText};
  margin-bottom: 0.6rem;
`

const Section = styled.section`
  margin-bottom: 2.4rem;
`

const SectionTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  padding-bottom: 0.4rem;
  border-bottom: 2px solid ${props => props.theme.colors.text}22;
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

const StackGroup = styled.div`
  margin-bottom: 1rem;
`

const StackLabel = styled.p`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${props => props.theme.colors.tertiaryText};
  margin-bottom: 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

const TopicList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`

const TopicItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  font-size: 0.95rem;
  line-height: 1.6;
`

const TopicIcon = styled.span`
  font-size: 1.1rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
`

const TopicText = styled.span`
  color: ${props => props.theme.colors.secondaryText};

  strong {
    color: ${props => props.theme.colors.text};
    font-weight: 600;
  }
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
      description={`${author}의 블로그 — 보안 자동화, 웹 보안, Python, 웹 개발을 다룹니다.`}
      author={author}
      url={`${siteUrl}/about`}
    />
    <Content>
      <Intro>
        <Role>Security Engineer · Developer</Role>
        <h1 style={{ marginBottom: "1.2rem" }}>About Me</h1>
        <p>
          안녕하세요, <strong>{author}</strong>입니다.
          IT 보안 분야에서 일하며 보안 자동화와 취약점 분석을 주로 다루고
          있어요.
        </p>
        <p>
          보안 업무를 하다 보면 반복되는 작업이 생각보다 많습니다. 로그
          분석, 취약점 티켓 처리, 알림 대응... 그 반복을 줄이려고 스크립트를
          짜고 자동화 도구를 붙이다 보니 어느새 개발도 같이 하게 됐어요.
        </p>
        <p>
          이 블로그는 그 과정에서 쌓인 기록들입니다. 공식 문서엔 잘 안 나오는
          실제 오류 상황, 삽질한 설정, 직접 구현하면서 이해한 보안 개념들을
          남겨두려고 씁니다. 같은 문제로 막혀있는 누군가에게 닿을 수 있으면
          좋겠어요.
        </p>
      </Intro>

      <Section>
        <SectionTitle>관심 분야</SectionTitle>
        <TagList>
          <Tag>보안 자동화 (SOAR)</Tag>
          <Tag>취약점 분석</Tag>
          <Tag>웹 보안 (OWASP)</Tag>
          <Tag>인시던트 대응</Tag>
          <Tag>DevSecOps</Tag>
          <Tag>Python 자동화</Tag>
          <Tag>웹 개발</Tag>
          <Tag>CI/CD</Tag>
        </TagList>
      </Section>

      <Section>
        <SectionTitle>기술 스택</SectionTitle>
        <StackGroup>
          <StackLabel>보안 / 인프라</StackLabel>
          <TagList>
            <Tag>FortiSOAR</Tag>
            <Tag>OWASP ZAP</Tag>
            <Tag>Linux</Tag>
            <Tag>Docker</Tag>
            <Tag>GitHub Actions</Tag>
          </TagList>
        </StackGroup>
        <StackGroup>
          <StackLabel>언어</StackLabel>
          <TagList>
            <Tag>Python</Tag>
            <Tag>JavaScript</Tag>
            <Tag>TypeScript</Tag>
            <Tag>Java</Tag>
            <Tag>Bash</Tag>
          </TagList>
        </StackGroup>
        <StackGroup>
          <StackLabel>웹 / 프레임워크</StackLabel>
          <TagList>
            <Tag>React</Tag>
            <Tag>Gatsby</Tag>
            <Tag>Node.js</Tag>
            <Tag>Spring Boot</Tag>
            <Tag>Playwright</Tag>
          </TagList>
        </StackGroup>
      </Section>

      <Section>
        <SectionTitle>이 블로그에서 다루는 것들</SectionTitle>
        <TopicList>
          <TopicItem>
            <TopicIcon>🔐</TopicIcon>
            <TopicText>
              <strong>웹 보안</strong> — OWASP Top 10, API 보안, 취약점 분석
              개념과 실습. 이론보다 실제로 어떻게 악용되고 어떻게 막는지에
              집중합니다.
            </TopicText>
          </TopicItem>
          <TopicItem>
            <TopicIcon>⚙️</TopicIcon>
            <TopicText>
              <strong>보안 자동화</strong> — SOAR 플레이북, 스크립트 기반 자동화,
              반복 업무를 코드로 줄이는 방법들을 정리합니다.
            </TopicText>
          </TopicItem>
          <TopicItem>
            <TopicIcon>🛠️</TopicIcon>
            <TopicText>
              <strong>개발 / 트러블슈팅</strong> — Python, React, Docker, CI/CD
              설정하다가 막힌 것들. 공식 문서에 없는 실제 오류 해결 과정을
              기록합니다.
            </TopicText>
          </TopicItem>
          <TopicItem>
            <TopicIcon>🌐</TopicIcon>
            <TopicText>
              <strong>네트워크 / 인프라</strong> — NAT, OSI 7계층, Linux 권한 관리
              등 보안 업무에서 자주 마주치는 네트워크·시스템 개념들을 다룹니다.
            </TopicText>
          </TopicItem>
        </TopicList>
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
        <SectionTitle>Contact</SectionTitle>
        <p>
          틀린 내용이 있거나 더 좋은 방법을 알고 계시면 편하게 연락주세요.
        </p>
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
