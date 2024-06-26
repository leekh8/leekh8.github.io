/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/ssr-apis/
 */

// You can delete this file if you're not using it
const React = require("react")

exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <link
      key="mermaid-css"
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/mermaid/8.11.0/mermaid.min.css"
    />,
  ])
}
