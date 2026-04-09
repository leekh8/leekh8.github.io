import React, { useState, useEffect } from "react"
import styled from "styled-components"

import useOffsetTop from "hooks/useOffsetTop"

import Toc from "./Toc"
import StyledMarkdown from "./StyledMarkdown"
import PrismTheme from "./PrismTheme"

const Wrapper = styled.div`
  position: relative;
  margin-bottom: 112px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`

const Body = ({ html }) => {
  const [toc, setToc] = useState([])

  const [ref, offsetTop] = useOffsetTop()

  useEffect(() => {
    setToc(
      Array.from(
        document.querySelectorAll("#article-body > h2, #article-body > h3")
      )
    )
  }, [])

  useEffect(() => {
    const codeBlocks = document.querySelectorAll("#article-body pre")
    codeBlocks.forEach(pre => {
      if (pre.querySelector(".copy-button")) return
      const button = document.createElement("button")
      button.className = "copy-button"
      button.textContent = "copy"
      button.addEventListener("click", () => {
        const code = pre.querySelector("code")
        navigator.clipboard.writeText(code ? code.innerText : pre.innerText)
        button.textContent = "copied!"
        button.classList.add("copied")
        setTimeout(() => {
          button.textContent = "copy"
          button.classList.remove("copied")
        }, 2000)
      })
      pre.appendChild(button)
    })
  }, [html])

  return (
    <Wrapper>
      <Toc items={toc} articleOffset={offsetTop} />

      <PrismTheme />

      <StyledMarkdown
        id="article-body"
        dangerouslySetInnerHTML={{ __html: html }}
        itemProp="articleBody"
        ref={ref}
      />
    </Wrapper>
  )
}

export default Body
