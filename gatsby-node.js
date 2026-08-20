const { createFilePath } = require(`gatsby-source-filesystem`)
const _ = require("lodash")
const { LEGACY_REDIRECTS } = require("./legacy-redirects")

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage, createRedirect } = actions

  const postTemplate = require.resolve(`./src/templates/Post.jsx`)
  const redirectTemplate = require.resolve(`./src/templates/Redirect.jsx`)

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
            title
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

  // 구 URL은 meta refresh 페이지다. 통합 전까지는 검색 결과에 그대로 노출되므로
  // 제목을 대상 글 제목으로 채운다. "페이지 이동 중..."이 걸리면 순위가 높아도 눌리지 않는다.
  const slugToTitle = {}
  posts.forEach(post => {
    slugToTitle[post.fields.slug] = post.frontmatter.title
  })

  LEGACY_REDIRECTS.forEach(({ from, to }) => {
    createRedirect({ fromPath: from, toPath: to, isPermanent: true, force: true })
    createPage({
      path: from,
      component: redirectTemplate,
      context: { to, title: slugToTitle[to] || null },
    })
  })

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
