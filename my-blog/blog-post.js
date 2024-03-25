import React from "react"
import { graphql, useStaticQuery } from "gatsby"

const BlogPost = () => {
  const data = useStaticQuery(graphql`
    query NotionBlogPostQuery {
      # Adapt query name
      allNotionFeelyBlog {
        edges {
          node {
            title
            slug # if i have a slug field
            date
            content # Assuming a rich-text field
          }
        }
      }
    }
  `)

  return (
    <div>
      {data.allNotionFeelyBlog.edges.map(({ node }) => (
        <article key={node.slug}>
          <h1>{node.title}</h1>
          <p>{node.date}</p>
          {/* Rendering 'content' might require additional work */}
          <div dangerouslySetInnerHTML={{ __html: node.content }} />
        </article>
      ))}
    </div>
  )
}
