const fs = require("fs")
const path = require("path")
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
    createRedirect({
      fromPath: from,
      toPath: to,
      isPermanent: true,
      force: true,
    })
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
          // 템플릿이 canonical을 자기 주소로 찍으려면 경로를 알아야 한다.
          // 여기서 만든 값을 그대로 넘긴다. 템플릿이 다시 조립하면 규칙이 두 군데가 되고
          // 한쪽만 바뀌는 순간 canonical이 존재하지 않는 주소를 가리키게 된다.
          seriesPath: path,
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

// react-dom 18.3.1 서버 렌더러가 HTML에 NUL 바이트를 끼워 넣는다. 지운다.
//
// 렌더러는 2048바이트 버퍼에 UTF-8을 채워 내보낸다. 3바이트 한글이 남은 1~2바이트
// 칸에 안 들어가면 버퍼를 비우는데, 채운 만큼(subarray(0, writtenBytes))이 아니라
// 버퍼 전체를 내보낸다. 남은 칸이 0으로 찬 채 나가고, 한글은 다음 버퍼에 온전히
// 들어간다(react-dom-server.node 의 writeStringChunk). development, production
// 빌드 모두 같고, Gatsby 5는 React 18에 묶여 있으며 18.3.1이 18의 마지막 판이다.
//
// 실측(2026-10-13): 배포본 html 99개 중 29개에 NUL 57개. 11개는 태그 링크 주소
// 안에 있어서 `/tags/?q=<NUL>보안 헤더` 처럼 눌러도 태그가 안 걸렸다.
//
// 덧붙은 것은 패딩 0뿐이고 글자는 빠지지 않으므로, 0x00을 지우면 원래 나왔어야 할
// 출력과 바이트 단위로 같다. UTF-8에서 0x00은 U+0000 말고는 나오지 않고, HTML에서
// U+0000은 쓸 일이 없다. scripts/verify-build-seo.js 가 CI에서 0건인지 다시 본다.
function stripNulBytes(dir) {
  let files = 0
  let bytes = 0
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      const sub = stripNulBytes(full)
      files += sub.files
      bytes += sub.bytes
    } else if (entry.name.endsWith(".html")) {
      const buf = fs.readFileSync(full)
      if (!buf.includes(0)) continue
      const clean = buf.filter(b => b !== 0)
      fs.writeFileSync(full, clean)
      files += 1
      bytes += buf.length - clean.length
    }
  }
  return { files, bytes }
}

exports.onPostBuild = ({ reporter }) => {
  const { files, bytes } = stripNulBytes(path.join(__dirname, "public"))
  reporter.info(`NUL 바이트 제거: html ${files}개에서 ${bytes}바이트`)
}
