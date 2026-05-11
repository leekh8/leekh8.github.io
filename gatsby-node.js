const { createFilePath } = require(`gatsby-source-filesystem`)
const _ = require("lodash")

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage, createRedirect } = actions

  const postTemplate = require.resolve(`./src/templates/Post.jsx`)
  const redirectTemplate = require.resolve(`./src/templates/Redirect.jsx`)

  // 구 Jekyll URL → 새 Gatsby URL 리다이렉트
  const LEGACY_REDIRECTS = [
    { from: '/Playwright-install/', to: '/playwright-cicd-troubleshooting/' },
    { from: '/Playwright-browserType-launch-Error/', to: '/playwright-browsertype-launch-error/' },
    { from: '/Vite-Develop-Error/', to: '/vite-deploy-error/' },
    { from: '/Importance-and-Fundamental-Princilpes-of-Web-Accessibility/', to: '/web-accessibility-fundamentals/' },
    { from: '/Context-API-VS-Redux-VS-Zustand/', to: '/react-state-management-comparison/' },
    { from: '/Github-actions-trouble-shooting/', to: '/github-actions-troubleshooting/' },
    { from: '/Google-Colab-Tranformers-Model-Train-Error/', to: '/google-colab-transformers-error/' },
    { from: '/1.3-비기능적-요구사항/', to: '/' },
    { from: '/5.1.1-프로젝트-빌드/', to: '/' },
  ]

  LEGACY_REDIRECTS.forEach(({ from, to }) => {
    createRedirect({ fromPath: from, toPath: to, isPermanent: true, force: true })
    createPage({ path: from, component: redirectTemplate, context: { to } })
  })

  const seriesTemplate = require.resolve(`./src/templates/Series.jsx`)

  const result = await graphql(`
    {
      postsRemark: allMarkdownRemark(
        sort: { frontmatter: { date: ASC } }
        limit: 1000
      ) {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            series
          }
        }
      }
      tagsGroup: allMarkdownRemark(limit: 2000) {
        group(field: { frontmatter: { tags: SELECT } }) {
          fieldValue
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.postsRemark.nodes
  const series = _.reduce(
    posts,
    (acc, cur) => {
      const seriesName = cur.frontmatter.series
      if (seriesName && !_.includes(acc, seriesName))
        return [...acc, seriesName]
      return acc
    },
    []
  )

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

      createPage({
        path: post.fields.slug,
        component: postTemplate,
        context: {
          id: post.id,
          series: post.frontmatter.series,
          previousPostId,
          nextPostId,
        },
      })
    })
  }

  if (series.length > 0) {
    series.forEach(singleSeries => {
      const path = `/series/${_.replace(singleSeries, /\s/g, "-")}`
      createPage({
        path,
        component: seriesTemplate,
        context: {
          series: singleSeries,
        },
      })
    })
  }
}

exports.onCreateNode = ({ node, actions, getNode, loadNodeContent }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode })
    const newSlug = `/${slug.split("/").reverse()[1]}/`

    createNodeField({
      node,
      name: `slug`,
      value: newSlug,
    })

    loadNodeContent(node).then(content => {
      const wordCount = content.split(/\s+/g).length
      const readingTime = Math.ceil(wordCount / 200)

      createNodeField({ node, name: "timeToRead", value: readingTime })

      if (!node.frontmatter.tags) {
        createNodeField({ node, name: "tags", value: [] })
      }
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
  type MarkdownRemark implements Node {
    frontmatter: Frontmatter!
  }
  type Frontmatter {
    title: String!
    description: String
    tags: [String!]!
    series: String
  }
  `
  createTypes(typeDefs)
}
