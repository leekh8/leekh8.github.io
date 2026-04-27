import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"

const Nav = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
  margin-top: 12px;
  padding-bottom: 4px;
  font-size: 12px;
  color: ${props => props.theme.colors.tertiaryText};

  @media (max-width: 768px) {
    padding: 0 15px 4px;
  }
`

const Crumb = styled(Link)`
  color: ${props => props.theme.colors.tertiaryText};
  text-decoration: none;
  padding: 1px 2px;
  border-radius: 2px;
  transition: color 0.2s;

  &:hover {
    color: ${props => props.theme.colors.text};
    background: none;
  }
`

const Sep = styled.span`
  margin: 0 4px;
  color: ${props => props.theme.colors.tertiaryText};
  user-select: none;
`

const Current = styled.span`
  color: ${props => props.theme.colors.secondaryText};
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  vertical-align: bottom;
`

const Breadcrumb = ({ category, title }) => (
  <Nav aria-label="페이지 위치">
    <Crumb to="/">홈</Crumb>
    {category && (
      <>
        <Sep>›</Sep>
        <Crumb to={`/tags`}>{category}</Crumb>
      </>
    )}
    <Sep>›</Sep>
    <Current title={title}>{title}</Current>
  </Nav>
)

export default Breadcrumb
