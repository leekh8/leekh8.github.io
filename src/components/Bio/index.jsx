import React from "react"
import styled from "styled-components"

import {
  ImHappy,
  ImRocket,
  FaGithub,
  FaKaggle,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  ImFileText2,
} from "react-icons/fa"

import {
  FaXTwitter,
  FaRegEnvelope,
  FaMedium,
  FaBlogger,
  FaRegFileLines,
  FaLink,
} from "react-icons/fa6"

import { siteUrl, description, author, links } from "../../../blog-config"
import mg_logo from "../../assets/images/mg_logo.png"
import tt_logo from "../../assets/images/tt_logo.png"
import sm_logo from "../../assets/images/sm_logo.png"

const BioWrapper = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`

const profileImageRoot =
  typeof window !== "undefined" && window.location.host === "localhost:8000"
    ? "http://localhost:8000"
    : siteUrl

const Profile = styled.div`
  flex: 0 0 auto;
  margin-right: 16px;
  width: 128px;
  height: 128px;
  border-radius: 999px;
  background-image: url(${profileImageRoot}/profile.png);
  background-size: cover;
  background-position: center;
`

const Author = styled.div`
  margin-bottom: 4.8px;
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`

const Description = styled.div`
  margin-bottom: 11.2px;
  line-height: 1.5;
  font-size: 16px;
  color: ${props => props.theme.colors.secondaryText};
`

const LinksWrapper = styled.div`
  & a {
    margin-right: 9.6px;
  }

  & svg {
    width: 25.6px;
    height: 25.6px;
    cursor: pointer;
  }

  & svg path {
    fill: ${props => props.theme.colors.icon};
    transition: fill 0.3s;
  }

  & a:hover svg path {
    fill: ${props => props.theme.colors.text};
  }
`

const IconImage = styled.img`
  width: 25.6px;
  height: 25.6px;
  cursor: pointer;
  border-radius: 50%;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1); // 호버 시 확대 효과
  }
`

const Link = ({ link, children }) => {
  if (!link) return null
  return (
    <a href={link} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

const Bio = () => {
  const {
    about,
    contact,
    timetrack,
    sitemapper,
    mdggu,
    github,
    kaggle,
    instagram,
    facebook,
    twitter,
    x,
    blogger,
    medium,
    linkedIn,
    email,
    resume,
    link,
  } = links

  return (
    <BioWrapper id="bio">
      <Profile />
      <div>
        <Author>@{author}</Author>
        <Description>{description}</Description>
        <LinksWrapper>
          <Link link={about}>
            <IconImage src={ImHappy} alt="about Icon" />
          </Link>
          <Link link={contact}>
            <IconImage src={ImRocket} alt="contact Icon" />
          </Link>
          <Link link={github}>
            <FaGithub />
          </Link>
          <Link link={timetrack}>
            <IconImage src={tt_logo} alt="Time Track logo" />
          </Link>
          <Link link={sitemapper}>
            <IconImage src={sm_logo} alt="Site Mapper logo" />
          </Link>
          <Link link={mdggu}>
            <IconImage src={mg_logo} alt="MD-GGU logo" />
          </Link>
          <Link link={kaggle}>
            <FaKaggle />
          </Link>
          <Link link={instagram}>
            <FaInstagram />
          </Link>
          <Link link={facebook}>
            <FaFacebook />
          </Link>
          <Link link={twitter}>
            <FaTwitter />
          </Link>
          <Link link={x}>
            <FaXTwitter />
          </Link>
          <Link link={medium}>
            <FaMedium />
          </Link>
          <Link link={blogger}>
            <FaBlogger />
          </Link>
          <Link link={linkedIn}>
            <FaLinkedin />
          </Link>
          <Link link={email}>
            <FaRegEnvelope />
          </Link>
          <Link link={resume}>
            <FaRegFileLines />
          </Link>
          <Link link={link}>
            <FaLink />
          </Link>
          <Link link={privacypolicy}>
            <IconImage src={ImFileText2} alt="privacy-policy Icon" />
          </Link>
        </LinksWrapper>
      </div>
    </BioWrapper>
  )
}

export default Bio
