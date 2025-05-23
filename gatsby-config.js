const blogConfig = require("./blog-config")
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
        sitemap: `${siteUrl}sitemap-index.xml`,
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
          `noto sans kr:300,400,500,700,900`,
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
    `gatsby-plugin-sitemap`,
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
