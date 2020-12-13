import React from "react"
import { useStaticQuery, graphql } from "gatsby"

import LinkedImage from "../linkedImage"

const Footer = () => {
  const data = useStaticQuery(graphql`
    {
      benProfPic: file(absolutePath: { regex: "/ben-icon-0.jpg/" }) {
        childImageSharp {
          fixed(width: 60, height: 60) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      briProfPic: file(absolutePath: { regex: "/bri-icon-0.jpg/" }) {
        childImageSharp {
          fixed(width: 60, height: 60) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      instagramIcon: file(absolutePath: { regex: "/Instagram_1.png/" }) {
        childImageSharp {
          fixed(width: 36, height: 36) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      youtubeIcon: file(absolutePath: { regex: "/Youtube_1.png/" }) {
        childImageSharp {
          fixed(width: 36, height: 36) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      githubIcon: file(absolutePath: { regex: "/Github_1.png/" }) {
        childImageSharp {
          fixed(width: 36, height: 36) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)

  return (
    <footer>
      <div className={`Footer`}>
        <div className={`Footer__left`}>
          <LinkedImage
            link={{
              to: "mailto:ben@meandering.rocks",
              className: `Footer__LinkedImage-socialIcon`,
            }}
            image={{
              fixed: data.benProfPic.childImageSharp.fixed,
              alt: "ben-icon-0",
              className: `imageProfilePictureCircle`,
              imgStyle: {
                borderRadius: `50%`,
              },
            }}
          />
          <LinkedImage
            link={{
              to: "https://www.instagram.com/bolbken/",
              className: `Footer__LinkedImage-socialIcon`,
            }}
            image={{
              fixed: data.instagramIcon.childImageSharp.fixed,
              alt: "instagram-icon",
            }}
          />
          <LinkedImage
            link={{
              to: "https://github.com/bolbken",
              className: `Footer__LinkedImage-socialIcon`,
            }}
            image={{
              fixed: data.githubIcon.childImageSharp.fixed,
              alt: "github-icon",
            }}
          />
        </div>
        <div className={`Footer__right`}>
          <LinkedImage
            link={{
              to: "https://www.instagram.com/notthecheesebri/",
              className: `Footer__LinkedImage-socialIcon`,
            }}
            image={{
              fixed: data.instagramIcon.childImageSharp.fixed,
              alt: "instagram-icon",
            }}
          />
          <LinkedImage
            link={{
              to: "mailto:bri@meandering.rocks",
              className: `Footer__LinkedImage-socialIcon`,
            }}
            image={{
              fixed: data.briProfPic.childImageSharp.fixed,
              alt: "bri-icon",
              className: `imageProfilePictureCircle`,
              imgStyle: {
                borderRadius: `50%`,
              },
            }}
          />
        </div>
      </div>
      <div>
        <small> © {new Date().getFullYear()} Meandering Rocks</small>
      </div>
    </footer>
  )
}

export default Footer
