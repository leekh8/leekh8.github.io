import React, { useState, useEffect } from "react"
import styled, { css } from "styled-components"

import { animateScroll } from "react-scroll"

import useScroll from "hooks/useScroll"

import getElementOffset from "utils/getElmentOffset"

import RevealOnScroll from "components/RevealOnScroll"

const STICK_OFFSET = 100

const TocWrapper = styled.div`
  position: absolute;
  opacity: 1;
  left: 100%;

  & > div {
    padding-right: 20px;
    padding-left: 16px;
    margin-left: 48px;
    position: relative;
    width: 240px;
    max-height: calc(100% - 185px);
    overflow-y: auto;

    ::-webkit-scrollbar {
      width: 3px;
    }
    ::-webkit-scrollbar-track {
      background: ${props => props.theme.colors.scrollTrack};
    }

    ::-webkit-scrollbar-thumb {
      background: ${props => props.theme.colors.scrollHandle};
    }

    ${props =>
      props.stick &&
      css`
        position: fixed;
        top: ${STICK_OFFSET}px;
      `}
  }

  @media (max-width: 1300px) {
    display: none;
  }
`

const MobileTocWrapper = styled.div`
  display: none;
  margin-bottom: 32px;

  @media (max-width: 1300px) {
    display: block;
  }
`

const MobileTocToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  background: ${props => props.theme.colors.tableBackground};
  color: ${props => props.theme.colors.secondaryText};
  font-size: 13px;
  cursor: pointer;
  text-align: left;
`

const MobileTocList = styled.div`
  margin-top: 4px;
  padding: 12px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  background: ${props => props.theme.colors.tableBackground};
`

const ParagraphTitle = styled.div`
  margin-bottom: 8px;
  padding-left: ${props => (props.subtitle ? 19.2 : 0)}px;
  font-size: 14.4px;
  color: ${props => props.theme.colors.mutedText};
  line-height: 1.3;
  transition: all 0.2s;

  ${props =>
    props.active &&
    css`
      transform: translate(-11.2px, 0);
      color: ${props => props.theme.colors.secondaryText};
    `}

  &:hover {
    color: ${props => props.theme.colors.text};
    cursor: pointer;
  }
`

const Toc = ({ items, articleOffset }) => {
  const { y } = useScroll()

  const [revealAt, setRevealAt] = useState(4000)
  const [headers, setHeaders] = useState([])
  const [active, setActive] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const bioElm = document.getElementById("bio")

    setRevealAt(
      getElementOffset(bioElm).top - bioElm.getBoundingClientRect().height - 400
    )
  }, [])

  useEffect(() => {
    setHeaders(
      [
        ...document.querySelectorAll("#article-body > h2, #article-body > h3"),
      ].map(element => getElementOffset(element).top)
    )
  }, [])

  useEffect(() => {
    headers.forEach((header, i) => {
      if (header - 300 < y) {
        setActive(i)
        return
      }
    })
  }, [y])

  const handleClickTitle = index => {
    animateScroll.scrollTo(headers[index] - 100)
    setMobileOpen(false)
  }

  if (items.length === 0) return null

  return (
    <>
      <MobileTocWrapper>
        <MobileTocToggle onClick={() => setMobileOpen(prev => !prev)}>
          <span>{mobileOpen ? "▲" : "▼"}</span>
          목차 {mobileOpen ? "닫기" : "열기"}
        </MobileTocToggle>
        {mobileOpen && (
          <MobileTocList>
            {items.map((item, i) => (
              <ParagraphTitle
                key={i}
                subtitle={item.tagName === "H3"}
                active={i === active}
                onClick={() => handleClickTitle(i)}
              >
                {item.innerText}
              </ParagraphTitle>
            ))}
          </MobileTocList>
        )}
      </MobileTocWrapper>

      <RevealOnScroll revealAt={revealAt} reverse>
        <TocWrapper stick={y > articleOffset - STICK_OFFSET}>
          <div>
            {items.map((item, i) => (
              <ParagraphTitle
                key={i}
                subtitle={item.tagName === "H3"}
                active={i === active}
                onClick={() => handleClickTitle(i)}
              >
                {item.innerText}
              </ParagraphTitle>
            ))}
          </div>
        </TocWrapper>
      </RevealOnScroll>
    </>
  )
}

export default Toc
