import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"

import { title } from "../../../../blog-config"

const FooterWrapper = styled.footer`
  margin-top: 32px;
  padding: 40px 0 32px;
  border-top: 1px solid ${props => props.theme.colors.divider};
  color: ${props => props.theme.colors.secondaryText};
  font-size: 13px;
`

const FooterInner = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`

const FooterLinks = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin-bottom: 24px;
`

const FooterLink = styled(Link)`
  color: ${props => props.theme.colors.tertiaryText};
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s;

  &:hover {
    color: ${props => props.theme.colors.text};
    background: none;
  }
`

const FooterExternalLink = styled.a`
  color: ${props => props.theme.colors.tertiaryText};
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s;

  &:hover {
    color: ${props => props.theme.colors.text};
    background: none;
  }
`

const FooterBottom = styled.div`
  font-size: 12px;
  font-weight: lighter;
  color: ${props => props.theme.colors.tertiaryText};
  line-height: 1.6;

  & > a {
    color: ${props => props.theme.colors.secondaryText};
    text-decoration: none;

    &:hover {
      color: ${props => props.theme.colors.text};
      background: none;
    }
  }
`

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterInner>
        <FooterLinks aria-label="사이트 링크">
          <FooterLink to="/">홈</FooterLink>
          <FooterLink to="/tags">태그</FooterLink>
          <FooterLink to="/series">시리즈</FooterLink>
          <FooterLink to="/search">검색</FooterLink>
          <FooterLink to="/about">소개</FooterLink>
          <FooterExternalLink href="/rss.xml" target="_blank" rel="noopener noreferrer">
            RSS
          </FooterExternalLink>
        </FooterLinks>
        <FooterBottom>
          © {title} · Built with{" "}
          <a
            href="https://www.gatsbyjs.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gatsby
          </a>{" "}
          ·{" "}
          <a
            href="https://github.com/devHudi/gatsby-starter-hoodie"
            target="_blank"
            rel="noopener noreferrer"
          >
            gatsby-starter-hoodie
          </a>
        </FooterBottom>
      </FooterInner>
    </FooterWrapper>
  )
}

export default Footer
