import React, { useState, useCallback } from "react"
import styled from "styled-components"
import SEO from "components/SEO"
import { graphql, Link } from "gatsby"

import Layout from "components/Layout"
import TextField from "components/TextField"
import Title from "components/Title"
import VerticalSpace from "components/VerticalSpace"
import TagList from "components/TagList"
import Divider from "components/Divider"

import { title, description, siteUrl } from "../../blog-config"

const SearchWrapper = styled.div`
  margin-top: 20px;
  @media (max-width: 768px) {
    padding: 0 15px;
  }
`

const ResultsWrapper = styled.div`
  @media (max-width: 768px) {
    padding: 0 10px;
  }
`

const PostWrapper = styled.div`
  padding: 12px 0 8px;
`

const PostTitle = styled.div`
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
  color: ${props => props.theme.colors.text};

  & a {
    text-decoration: none;
    color: inherit;
  }

  & mark {
    background-color: ${props => props.theme.colors.text}33;
    color: ${props => props.theme.colors.text};
    border-radius: 2px;
    padding: 0 2px;
  }
`

const PostMeta = styled.p`
  margin-bottom: 10px;
  font-size: 13px;
  color: ${props => props.theme.colors.tertiaryText};
`

const PostExcerpt = styled.p`
  margin-bottom: 14px;
  line-height: 1.65;
  font-size: 14.5px;
  color: ${props => props.theme.colors.secondaryText};
  word-break: break-all;

  & mark {
    background-color: ${props => props.theme.colors.text}22;
    color: ${props => props.theme.colors.text};
    border-radius: 2px;
    padding: 0 2px;
  }
`

const NoResults = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
`

const NoResultsIcon = styled.div`
  font-size: 40px;
  margin-bottom: 16px;
`

const NoResultsText = styled.p`
  font-size: 15px;
  margin-bottom: 8px;
  color: ${props => props.theme.colors.secondaryText};
`

const NoResultsHint = styled.p`
  font-size: 13px;
  color: ${props => props.theme.colors.tertiaryText};
`

// 검색어 하이라이팅 헬퍼
const highlight = (text, query) => {
  if (!query || !text) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const regex = new RegExp(`(${escaped})`, "gi")
  return text.replace(regex, "<mark>$1</mark>")
}

const SearchResult = ({ post, query }) => {
  const { title: postTitle, description: postDesc, date, tags } = post.frontmatter
  const { excerpt } = post
  const { slug, timeToRead } = post.fields

  const displayText = postDesc || excerpt
  const highlightedTitle = highlight(postTitle, query)
  const highlightedExcerpt = highlight(displayText, query)

  return (
    <PostWrapper>
      <PostTitle>
        <Link to={slug} dangerouslySetInnerHTML={{ __html: highlightedTitle }} />
      </PostTitle>
      <PostMeta>
        {date}
        {timeToRead && <span> · {timeToRead} min read</span>}
      </PostMeta>
      <PostExcerpt dangerouslySetInnerHTML={{ __html: highlightedExcerpt }} />
      <TagList tagList={tags} />
    </PostWrapper>
  )
}

const Search = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes

  const [query, setQuery] = useState("")

  const filteredPosts = useCallback(
    posts.filter(post => {
      const { frontmatter, rawMarkdownBody } = post
      const { title: postTitle } = frontmatter
      const lowerQuery = query.toLocaleLowerCase()

      if (!lowerQuery) return true
      if (rawMarkdownBody.toLocaleLowerCase().includes(lowerQuery)) return true
      return postTitle.toLocaleLowerCase().includes(lowerQuery)
    }),
    [query]
  )

  return (
    <Layout>
      <SEO title={title} description={description} url={siteUrl} />
      <SearchWrapper>
        <Title size="sm">
          {query
            ? `"${query}" 검색 결과 — ${filteredPosts.length}개`
            : `전체 글 ${posts.length}개`}
        </Title>
        <TextField
          onChange={e => setQuery(e.target.value)}
          placeholder="제목 또는 내용으로 검색"
          value={query}
        />
      </SearchWrapper>
      <VerticalSpace size={48} />

      <ResultsWrapper>
        {filteredPosts.length === 0 ? (
          <NoResults>
            <NoResultsIcon>🔍</NoResultsIcon>
            <NoResultsText>
              &ldquo;{query}&rdquo;에 대한 검색 결과가 없습니다.
            </NoResultsText>
            <NoResultsHint>다른 키워드로 검색해 보세요.</NoResultsHint>
          </NoResults>
        ) : (
          filteredPosts.map((post, i) => (
            <React.Fragment key={post.fields.slug}>
              <SearchResult post={post} query={query} />
              {i < filteredPosts.length - 1 && (
                <Divider mt="16px" mb="12px" />
              )}
            </React.Fragment>
          ))
        )}
      </ResultsWrapper>
    </Layout>
  )
}

export default Search

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt(pruneLength: 200, truncate: true)
        fields {
          slug
          timeToRead
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          tags
          description
        }
        rawMarkdownBody
      }
    }
  }
`
