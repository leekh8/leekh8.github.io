import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"

import Divider from "components/Divider"

const Wrapper = styled.div`
  margin-bottom: 48px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`

const SectionTitle = styled.h3`
  margin-bottom: 16px;
  font-size: 15px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
`

const Card = styled(Link)`
  display: block;
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.divider};
  text-decoration: none;
  transition: border-color 0.2s, background-color 0.2s;

  &:hover {
    border-color: ${props => props.theme.colors.text};
    background-color: ${props => props.theme.colors.tableBackground};
    color: inherit;
    background: ${props => props.theme.colors.tableBackground};
  }
`

const CardTitle = styled.div`
  font-size: 13.5px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  line-height: 1.4;
  margin-bottom: 6px;
`

const CardDate = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.tertiaryText};
`

const RelatedPosts = ({ currentId, currentTags, posts }) => {
  if (!currentTags || !posts || posts.length === 0) return null

  const related = posts
    .filter(post => {
      if (post.id === currentId) return false
      const postTags = post.frontmatter.tags || []
      return postTags.some(tag => currentTags.includes(tag))
    })
    .slice(0, 3)

  if (related.length === 0) return null

  return (
    <>
      <Divider mt="0px" mb="24px" />
      <Wrapper>
        <SectionTitle>관련 글</SectionTitle>
        <Grid>
          {related.map(post => (
            <Card key={post.fields.slug} to={post.fields.slug}>
              <CardTitle>{post.frontmatter.title}</CardTitle>
              <CardDate>{post.frontmatter.date}</CardDate>
            </Card>
          ))}
        </Grid>
      </Wrapper>
    </>
  )
}

export default RelatedPosts
