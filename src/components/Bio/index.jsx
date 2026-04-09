import React from "react"
import styled from "styled-components"

import {
  FaChild,
  FaMarker,
  FaGithub,
  FaKaggle,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaCheck,
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

const Link = ({ link, title, children }) => {
  if (!link) return null

  const isExternal = /^https?:\/\//.test(link)
  const fixedLink = isExternal ? link : `/${link.replace(/^\/?/, "")}`

  return (
    <a
      href={fixedLink}
      target={isExternal ? "_blank" : "_self"}
      rel={isExternal ? "noreferrer" : undefined}
      title={title}
      aria-label={title}
    >
      {children}
    </a>
  )
}

const Bio = () => {
  const {
    about,
    contact,
    privacypolicy,
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
          <Link link={about} title="About">
            <FaChild />
          </Link>
          <Link link={contact} title="Contact">
            <FaMarker />
          </Link>
          <Link link={github} title="GitHub">
            <FaGithub />
          </Link>
          <Link link={timetrack} title="Time Track">
            <IconImage src={tt_logo} alt="Time Track logo" />
          </Link>
          <Link link={sitemapper} title="Site Mapper">
            <IconImage src={sm_logo} alt="Site Mapper logo" />
          </Link>
          <Link link={mdggu} title="MD-GGU">
            <IconImage src={mg_logo} alt="MD-GGU logo" />
          </Link>
          <Link link={kaggle} title="Kaggle">
            <FaKaggle />
          </Link>
          <Link link={instagram} title="Instagram">
            <FaInstagram />
          </Link>
          <Link link={facebook} title="Facebook">
            <FaFacebook />
          </Link>
          <Link link={twitter} title="Twitter">
            <FaTwitter />
          </Link>
          <Link link={x} title="X (Twitter)">
            <FaXTwitter />
          </Link>
          <Link link={medium} title="Medium">
            <FaMedium />
          </Link>
          <Link link={blogger} title="Blogger">
            <FaBlogger />
          </Link>
          <Link link={linkedIn} title="LinkedIn">
            <FaLinkedin />
          </Link>
          <Link link={email} title="Email">
            <FaRegEnvelope />
          </Link>
          <Link link={resume} title="Resume">
            <FaRegFileLines />
          </Link>
          <Link link={link} title="Website">
            <FaLink />
          </Link>
          <Link link={privacypolicy} title="Privacy Policy">
            <FaCheck />
          </Link>
        </LinksWrapper>
      </div>
    </BioWrapper>
  )
}

export default Bio
