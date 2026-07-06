import React from "react"
import SEO from "components/SEO"
import { graphql } from "gatsby"

import Layout from "components/Layout"
import Article from "components/Article"
import ReadingProgress from "components/ReadingProgress"
import Breadcrumb from "components/Breadcrumb"
import RelatedPosts from "components/RelatedPosts"

import { siteUrl, author } from "../../blog-config"

const Post = ({ data }) => {
  const post = data.markdownRemark
  const { previous, next, seriesList, allPosts } = data

  const { title, date, update, rawDate, rawUpdate, tags, series, category } =
    post.frontmatter
  const { excerpt } = post
  const { timeToRead, slug } = post.fields

  let filteredSeries = []
  if (series !== null) {
    filteredSeries = seriesList.edges.map(seriesPost => {
      if (seriesPost.node.id === post.id) {
        return {
          ...seriesPost.node,
          currentPost: true,
        }
      } else {
        return {
          ...seriesPost.node,
          currentPost: false,
        }
      }
    })
  }

  const allPostNodes = allPosts?.nodes || []

  return (
    <Layout>
      <ReadingProgress />
      <SEO
        title={title}
        description={post.frontmatter.description || excerpt}
        url={`${siteUrl}${slug}`}
        author={author}
        date={rawDate}
        update={rawUpdate}
      />
      <Breadcrumb category={category} title={title} />
      <Article>
        <Article.Header
          title={title}
          date={date}
          update={update}
          tags={tags}
          minToRead={timeToRead}
        />
        {filteredSeries.length > 0 && (
          <Article.Series header={series} series={filteredSeries} />
        )}
        <Article.Body html={post.html} />
        <RelatedPosts
          currentId={post.id}
          currentTags={tags}
          posts={allPostNodes}
        />
        <Article.Footer
          previous={previous}
          next={next}
          title={title}
          slug={slug}
        />
      </Article>
    </Layout>
  )
}

export default Post

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $series: String
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 200, truncate: true)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        update(formatString: "MMMM DD, YYYY")
        rawDate: date
        rawUpdate: update
        tags
        series
        category
      }
      fields {
        slug
        timeToRead
      }
    }
    seriesList: allMarkdownRemark(
      sort: { frontmatter: { date: ASC } }
      filter: { frontmatter: { series: { eq: $series } } }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
    allPosts: allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        id
        fields {
          slug
        }
        frontmatter {
          title
          date(formatString: "MMMM DD, YYYY")
          tags
        }
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
