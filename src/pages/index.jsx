import React from "react"
import _ from "lodash"
import { graphql, Link } from "gatsby"
import styled from "styled-components"

import Layout from "components/Layout"
import SEO from "components/SEO"
import Bio from "components/Bio"
import PostList from "components/PostList"
import SideTagList from "components/SideTagList"
import SideSeriesList from "components/SideSeriesList"
import Divider from "components/Divider"
import VerticalSpace from "components/VerticalSpace"

import { title, description, siteUrl } from "../../blog-config"

const FeaturedWrapper = styled.div`
  margin-bottom: 24px;

  @media (max-width: 768px) {
    padding: 0 10px;
  }
`

const FeaturedBadge = styled.span`
  display: inline-block;
  margin-bottom: 10px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-radius: 20px;
  background-color: ${props => props.theme.colors.text};
  color: ${props => props.theme.colors.bodyBackground};
`

const FeaturedCard = styled(Link)`
  display: block;
  padding: 20px 24px;
  border-radius: 10px;
  border: 1.5px solid ${props => props.theme.colors.text}44;
  background-color: ${props => props.theme.colors.tableBackground};
  text-decoration: none;
  transition: border-color 0.2s, background-color 0.2s;

  &:hover {
    border-color: ${props => props.theme.colors.text};
    background-color: ${props => props.theme.colors.nextPostButtonBackground};
    color: inherit;
    background: ${props => props.theme.colors.nextPostButtonBackground};
  }
`

const FeaturedTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  line-height: 1.35;
  margin-bottom: 10px;
`

const FeaturedDesc = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.secondaryText};
  line-height: 1.6;
  margin-bottom: 10px;
`

const FeaturedMeta = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.tertiaryText};
`

const FeaturedPost = ({ post }) => {
  if (!post) return null
  const { title: postTitle, description: postDesc, date } = post.frontmatter
  const { excerpt } = post
  const { slug } = post.fields

  return (
    <FeaturedWrapper>
      <FeaturedBadge>📌 추천 글</FeaturedBadge>
      <FeaturedCard to={slug}>
        <FeaturedTitle>{postTitle}</FeaturedTitle>
        <FeaturedDesc>{postDesc || excerpt}</FeaturedDesc>
        <FeaturedMeta>{date}</FeaturedMeta>
      </FeaturedCard>
    </FeaturedWrapper>
  )
}

const BlogIndex = ({ data }) => {
  if (!data) {
    return <p>Loading...</p>
  }

  const posts = data.allMarkdownRemark.nodes || []
  const featuredPost = data.featuredPost?.nodes?.[0] || null
  const tags = _.sortBy(data.allMarkdownRemark.group || [], [
    "totalCount",
  ]).reverse()
  const series = _.sortBy(data.seriesGroup.group || [], ["totalCount"]).reverse()

  if (posts.length === 0) {
    return (
      <p>
        No blog posts found. Add markdown posts to &quot;content/blog&quot; (or
        the directory you specified for the &quot;gatsby-source-filesystem&quot;
        plugin in gatsby-config.js).
      </p>
    )
  }

  return (
    <Layout>
      <SEO title={title} description={description} url={siteUrl} />
      <VerticalSpace size={24} />
      <Bio />
      <Divider />
      {featuredPost && (
        <>
          <FeaturedPost post={featuredPost} />
          <Divider mt="8px" mb="0px" />
        </>
      )}
      <SideSeriesList seriesList={series} />
      <SideTagList tags={tags} postCount={posts.length} />
      <PostList postList={posts} />
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    seriesGroup: allMarkdownRemark {
      group(field: { frontmatter: { series: SELECT } }) {
        fieldValue
        totalCount
      }
    }
    featuredPost: allMarkdownRemark(
      filter: { frontmatter: { featured: { eq: true } } }
      sort: { frontmatter: { date: DESC } }
      limit: 1
    ) {
      nodes {
        excerpt(pruneLength: 160, truncate: true)
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
      }
      nodes {
        excerpt(pruneLength: 200, truncate: true)
        fields {
          slug
          timeToRead
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          update(formatString: "MMM DD, YYYY")
          title
          description
          tags
        }
      }
    }
  }
`
