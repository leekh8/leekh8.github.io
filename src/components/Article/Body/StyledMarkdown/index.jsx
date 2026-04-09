import styled from "styled-components"

const StyledMarkdown = styled.div`
  & {
    font-size: 15.5px;
    color: ${props => props.theme.colors.text};
    line-height: 1.68;
    overflow: hidden;
  }

  & h1:first-child,
  & h2:first-child,
  & h3:first-child,
  & h4:first-child {
    margin-top: 0;
  }

  & > p,
  & > ul,
  & > ol,
  & table,
  & blockquote,
  & pre,
  & img,
  & .katex-display {
    margin-top: 0;
    margin-bottom: 24px;
  }

  & p {
    overflow-x: scroll;
    word-break: break-all;

    ::-webkit-scrollbar {
      display: none;
    }
  }

  & h2,
  & h3,
  & h4,
  & h5,
  & h6 {
    margin: 11.2px 0 4.8px 0;
    font-weight: 700;
  }

  & h2 {
    margin-top: 60px;
    margin-bottom: 16px;
    font-size: 24px;
  }

  & h3 {
    margin-top: 44px;
    margin-bottom: 12px;
    font-size: 19.5px;
  }

  & h4 {
    margin-top: 36px;
    margin-bottom: 10px;
    font-size: 16.5px;
  }

  & h5 {
    font-size: 16px;
  }

  & h6 {
    font-size: 14.4px;
  }

  & strong {
    font-weight: 700;
  }

  & em {
    font-style: italic;
  }

  & blockquote {
    padding: 18px 24px;
    border-left: 4px solid ${props => props.theme.colors.blockQuoteBorder};
    background-color: ${props => props.theme.colors.blockQuoteBackground};

    & *:last-child {
      margin-bottom: 0;
    }
  }

  & blockquote blockquote {
    margin-top: 24px;
  }

  & blockquote > p > code.language-text {
    background-color: ${props => props.theme.colors.inlineCodeBackgroundDarker};
  }

  & table {
    border-collapse: collapse;
  }

  & th {
    border-bottom: 2px solid ${props => props.theme.colors.border};
    font-weight: 700;
  }

  & td {
    border-top: 1px solid ${props => props.theme.colors.border};
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  & td,
  th {
    padding: 8px;
  }

  & tr:first-child td {
    border-top: none;
  }

  & tr:nth-child(even) {
    background-color: ${props => props.theme.colors.tableBackground};
  }

  & tr:last-child td {
    border-bottom: none;
  }

  & *:not(pre) > code.language-text,
  & table code.language-text {
    position: relative;
    top: -1px;
    margin-right: 3px;
    padding: 3px 5px 3px 5px;
    font-size: 13px;
    background-color: ${props => props.theme.colors.inlineCodeBackground};
    font-weight: bold;
    color: ${props => props.theme.colors.text};
  }

  & h2 > code.language-text,
  & h3 > code.language-text,
  & h4 > code.language-text {
    font-size: inherit;
  }

  & tr:nth-child(even) code.language-text {
    background-color: ${props => props.theme.colors.inlineCodeBackgroundDarker};
  }

  & ul,
  & ol {
    padding-left: 25px;
  }

  & ol {
    list-style: decimal;
  }

  & ul {
    list-style: disc;
  }

  & ul ul {
    list-style: circle;
  }

  & ul ul ul {
    list-style: square;
  }

  & li {
    margin-bottom: 8px;
  }

  & li p {
    margin: 8px 0;
  }

  & pre {
    position: relative;

    ::-webkit-scrollbar {
      height: 10px;
    }
    ::-webkit-scrollbar-track {
      background: ${props => props.theme.colors.scrollTrack};
    }

    ::-webkit-scrollbar-thumb {
      background: ${props => props.theme.colors.scrollHandle};
    }
  }

  & .copy-button {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 4px 10px;
    font-size: 11px;
    font-family: inherit;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s, background-color 0.2s;
    background: rgba(0, 0, 0, 0.45);
    color: #e8e8e8;
    z-index: 1;
  }

  & pre:hover .copy-button {
    opacity: 1;
  }

  & .copy-button:hover {
    background: rgba(0, 0, 0, 0.65);
  }

  & .copy-button.copied {
    background: #27ae60;
    border-color: #27ae60;
    color: #fff;
    opacity: 1;
  }

  & code[class*="language-"],
  & pre[class*="language-"] {
    font-size: 13.5px;
  }

  & img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    max-width: 100%;
  }

  & figcaption {
    margin-top: 5px;
    text-align: center;
    color: #868e96;
    font-size: 12px;
    font-style: italic;
  }

  & hr {
    border: none;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  & a {
    padding: 1.6px 0;
    color: ${props => props.theme.colors.text};
  }

  & a:hover {
    background-color: ${props => props.theme.colors.text};
    color: ${props => props.theme.colors.hoveredLinkText};
  }
`

export default StyledMarkdown
