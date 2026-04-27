import React, { useState, useEffect } from "react"
import styled from "styled-components"

const Bar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: ${props => props.$progress}%;
  height: 3px;
  background: linear-gradient(
    to right,
    ${props => props.theme.colors.text}88,
    ${props => props.theme.colors.text}
  );
  z-index: 1002;
  transition: width 0.15s ease-out;
  pointer-events: none;
`

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement
      const total = scrollHeight - clientHeight
      if (total <= 0) return
      setProgress(Math.min((scrollTop / total) * 100, 100))
    }

    window.addEventListener("scroll", updateProgress, { passive: true })
    updateProgress()

    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  return <Bar $progress={progress} />
}

export default ReadingProgress
