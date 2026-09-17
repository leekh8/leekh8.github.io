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
        policy: [
          {
            userAgent: "*",
            allow: "/",
            // 태그와 검색 필터는 쿼리스트링으로만 동작하고 결과는 브라우저에서 그린다.
            // 그래서 ?q= 가 붙은 URL은 전부 같은 HTML을 돌려준다. 실측(2026-09-17):
            // /tags/, /tags/?q=CVE, /tags/?q=React 세 응답의 MD5가 전부 동일했고,
            // 그 HTML 안에 글 링크는 0개였다. 그런 URL이 171개 크롤 가능하게 열려 있었다.
            //
            // 글이 50편인 사이트에서 내용 없는 중복 URL 171개를 같이 기어다니면
            // 크롤 예산이 그쪽으로 새고 중복 비율이 77%로 잡힌다. 글로 가는 길은
            // 홈과 /series/{이름}/ 이 이미 제공하므로 이걸 막아도 잃는 경로가 없다.
            disallow: ["/*?q="],
          },
        ],
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

          const newest = Object.values(lastmodBySlug).sort().pop() || null

          // 목록 페이지를 두 갈래로 나눈다.
          //
          // 홈과 시리즈 목록은 새 글이 올라오면 내용이 실제로 바뀌므로 최신 글 날짜를 쓴다.
          // 반면 about, contact, 약관, 개인정보처럼 글과 무관한 페이지는 새 글이 올라와도
          // 한 글자도 안 바뀐다. 그런데 전부 newest를 쓰면 글 하나 올릴 때마다 25개
          // 페이지의 lastmod가 같이 밀려서, 바뀐 것이 없는 페이지를 다시 기어오게 만든다.
          // 크롤 예산이 제한된 사이트에서는 그게 그대로 새 글 크롤링을 밀어낸다.
          //
          // 고정 문서는 저장소 기준으로 손이 간 적 없으므로 사이트 개설 시점을 쓴다.
          const STATIC_PAGES = {
            "/about/": "2023-03-01",
            "/contact/": "2023-03-01",
            "/privacy-policy/": "2023-03-01",
            "/terms/": "2023-03-01",
          }

          return allSitePage.nodes.map(({ path }) => ({
            path,
            lastmod: lastmodBySlug[path] || STATIC_PAGES[path] || newest,
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
            // match를 두면 그 정규식에 걸리는 페이지에만 <link rel="alternate">가 붙는다.
            // 이 블로그의 글 주소는 /글이름/ 형태라 "^/blog/"에 걸리는 페이지가 하나도 없고,
            // 결과적으로 어느 페이지에도 RSS 자동 검색 링크가 안 붙어 있었다(실측 0건).
            // rss.xml 자체는 정상 생성되므로, match를 빼서 전 페이지에 붙게 한다.
          },
        ],
      },
    },
    `gatsby-plugin-react-helmet`,
  ],
}
