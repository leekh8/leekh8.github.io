import React, { useEffect, useState } from "react"
import { ThemeProvider } from "styled-components"
import styled from "styled-components"

import { useSelector, useDispatch } from "react-redux"
import { setLight, setDark } from "reducers/theme"

import { light, dark } from "assets/theme"

import GlobalStyles from "components/GlobalStyles"

import Header from "./Header"
import Body from "./Body"
import Footer from "./Footer"

const BackToTop = styled.button`
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => (props.visible ? 1 : 0)};
  pointer-events: ${props => (props.visible ? "auto" : "none")};
  transition: opacity 0.3s;
  background-color: ${props => props.theme.colors.text};
  color: ${props => props.theme.colors.bodyBackground};
  z-index: 900;

  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
`

const Layout = ({ children }) => {
  const dispatch = useDispatch()
  const { theme } = useSelector(state => state.theme)
  const [showTop, setShowTop] = useState(false)

  let isSystemDarkMode = null
  if (typeof window !== "undefined") {
    isSystemDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
  }

  let localTheme = null
  if (typeof localStorage !== "undefined") {
    localTheme = localStorage.getItem("theme")
  }

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark"
    dispatch(nextTheme === "dark" ? setDark : setLight)
    localStorage.setItem("theme", nextTheme)
  }

  useEffect(() => {
    if (isSystemDarkMode && !localTheme)
      dispatch(isSystemDarkMode ? setDark : setLight)
    else if (localTheme) dispatch(localTheme === "dark" ? setDark : setLight)
  }, [])

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <ThemeProvider theme={theme === "light" ? light : dark}>
      <GlobalStyles />
      <Header toggleTheme={toggleTheme} />
      <Body>{children}</Body>
      <Footer />
      <BackToTop
        visible={showTop}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="맨 위로"
      >
        ↑
      </BackToTop>
    </ThemeProvider>
  )
}

export default Layout
