const blogConfig = require("./blog-config")
const { legacyPaths } = require("./legacy-redirects")
const { title, description, author, siteUrl } = blogConfig

module.exports = {
  // pathPrefix: "/haiblog",
  siteMetadata: {
    title: title,
    description: description,
    author: author,
    siteUrl: siteUrl,
  },
  plugins: [
    `gatsby-plugin-catch-links`,
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        host: siteUrl,
        sitemap: `${siteUrl}/sitemap-index.xml`,
        policy: [{ userAgent: "*", allow: "/" }],
      },
    },
    {
      resolve: `gatsby-plugin-react-redux`,
      options: {
        pathToCreateStoreModule: "./src/reducers/createStore",
        serialize: {
          space: 0,
          isJSON: true,
          unsafe: false,
          ignoreFunction: true,
        },
        cleanupOnClient: true,
        windowKey: "__PRELOADED_STATE__",
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          // 900은 코드베이스 어디서도 쓰지 않아 제거 (로드 무게만 차지)
          `noto sans kr:300,400,500,700`,
          `source code pro:700`, // you can also specify font weights and styles
        ],
        display: "swap",
      },
    },
    "gatsby-plugin-styled-components",
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: title,
        short_name: title,
        description: description,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#ced4da`,
        display: `standalone`,
        icon: `static/favicon.png`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `${__dirname}/contents/posts`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        footnotes: true,
        gfm: true,
        plugins: [
          {
            resolve: `gatsby-remark-mermaid`,
            options: {
              mermaidConfig: {
                theme: "neutral",
              },
            },
          },
          // {
          //   resolve: `gatsby-remark-jsonld`,
          //   options: {
          //     context: siteUrl, // JSON-LD의 @context 값
          //     type: "BlogPosting", // JSON-LD의 @type 값
          //     generateSchema: node => {
          //       return {
          //         "@context": "https://schema.org",
          //         "@type": "BlogPosting",
          //         headline: node.frontmatter.title,
          //         description: node.frontmatter.description || node.excerpt,
          //         datePublished: node.frontmatter.date,
          //         author: {
          //           "@type": "Person",
          //           name: author,
          //         },
          //         mainEntityOfPage: {
          //           "@type": "WebPage",
          //           "@id": `${siteUrl}${node.fields.slug}`,
          //         },
          //       }
          //     },
          //   },
          // },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 680,
              loading: "lazy",
              wrapperStyle: "margin-bottom: 16px;",
              quality: 100,
              showCaptions: true,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
              languageExtensions: [
                {
                  language: "superscript",
                  extend: "javascript",
                  definition: {
                    superscript_types: /(SuperType)/,
                  },
                  insertBefore: {
                    function: {
                      superscript_keywords: /(superif|superelse)/,
                    },
                  },
                },
              ],
              prompt: {
                user: "root",
                host: "localhost",
                global: false,
              },
              escapeEntities: {},
            },
          },
          {
            resolve: `gatsby-remark-katex`,
            options: {
              strict: `ignore`,
            },
          },
          {
            resolve: "gatsby-remark-static-images",
          },
        ],
      },
    },
    `gatsby-plugin-resolve-src`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        // 구 URL(meta refresh 페이지)은 sitemap에서 뺀다.
        // 실려 있으면 "색인해도 되는 페이지"로 읽혀, canonical이 새 URL을 가리켜도
        // 구·신 URL이 함께 색인된 채 순위 신호가 갈라진다.
        excludes: legacyPaths,

        // lastmod를 직접 넣는다. 2026-09-14 GSC 진단 결과 반영.
        // 기본 출력은 changefreq와 priority만 실었는데 Google은 그 둘을 무시한다고
        // 명시하고 재크롤링 판단에는 lastmod만 쓴다. 74개 URL 전부 lastmod가 없어
        // "언제 바뀌었는지 알 수 없는 사이트맵"이 됐고, 크롤링 목적 비율이
        // 새로고침 98% 대 발견 2%로 굳었다.
        query: `
          {
            allSitePage {
              nodes {
                path
              }
            }
            allMarkdownRemark {
              nodes {
                fields {
                  slug
                }
                frontmatter {
                  date(formatString: "YYYY-MM-DD")
                  update(formatString: "YYYY-MM-DD")
                }
              }
            }
          }
        `,
        resolveSiteUrl: () => siteUrl,
        resolvePages: ({ allSitePage, allMarkdownRemark }) => {
          const lastmodBySlug = {}
          allMarkdownRemark.nodes.forEach(({ fields, frontmatter }) => {
            if (!fields || !fields.slug) return
            // update가 없는 글이 6편 있다. 그때는 발행일이 마지막 수정일이다.
            lastmodBySlug[fields.slug] = frontmatter.update || frontmatter.date
          })

          // 홈, 태그, 시리즈 같은 목록 페이지는 새 글이 올라올 때 같이 바뀐다.
          // 최신 글 날짜를 그대로 쓰는 것이 사실에 가장 가깝다.
          const newest = Object.values(lastmodBySlug).sort().pop() || null

          return allSitePage.nodes.map(({ path }) => ({
            path,
            lastmod: lastmodBySlug[path] || newest,
          }))
        },
        serialize: ({ path, lastmod }) => ({ url: path, lastmod }),
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: `/rss.xml`,
            title: `RSS Feed of ${title}`,
            match: "^/blog/",
          },
        ],
      },
    },
    `gatsby-plugin-react-helmet`,
  ],
}
