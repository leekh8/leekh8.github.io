import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"

const Wrapper = styled.aside`
  position: absolute;
  right: 112%;
  top: 0px;
  width: 160px;
  font-size: 13px;

  @media (max-width: 1300px) {
    display: none;
  }
`

const Title = styled.div`
  margin-bottom: 20px;
  font-weight: bold;
  color: ${props => props.theme.colors.secondaryText};
`

const SeriesItem = styled.li`
  margin-bottom: 12px;
  color: ${props => props.theme.colors.tertiaryText};
  cursor: pointer;
  line-height: 1.4;
  transition: color 0.3s;

  &:hover {
    color: ${props => props.theme.colors.text};
  }

  & > a {
    color: inherit;
    text-decoration: none;
  }
`

const SideSeriesList = ({ seriesList }) => {
  if (!seriesList || seriesList.length === 0) return null

  return (
    <Wrapper>
      <Title>SERIES</Title>
      <ul>
        {seriesList.map(series => (
          <SeriesItem key={series.fieldValue}>
            <Link to={`/series?q=${encodeURIComponent(series.fieldValue)}`}>
              {series.fieldValue}
              <br />
              <span style={{ fontSize: "11px", opacity: 0.7 }}>
                {series.totalCount}편
              </span>
            </Link>
          </SeriesItem>
        ))}
      </ul>
    </Wrapper>
  )
}

export default SideSeriesList
