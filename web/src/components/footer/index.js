import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'
import { IoLogoGithub } from '@react-icons/all-files/io5/IoLogoGithub'
import { IoLogoInstagram } from '@react-icons/all-files/io5/IoLogoInstagram'

import LinkedImage from '../linkedImage'

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
    }
  `)

  return (
    <footer>
      <div className="Footer">
        <div className="Footer__left">
          <a href="mailto:ben@meandering.rocks">
            <Image
              fixed={data.benProfPic.childImageSharp.fixed}
              alt="ben-icon"
              className="Footer__img-profilePic"
              style={{
                borderRadius: `50%`,
              }}
            />
          </a>
          <a
            href="https://www.instagram.com/bolbken/"
            className="Footer__a-socialIcon"
          >
            <div>
              <IoLogoInstagram
                alt="instagram-icon"
                className="Footer__svg-icon"
              />
            </div>
          </a>
          <a href="https://github.com/bolbken">
            <IoLogoGithub alt="github-icon" className="Footer__svg-icon" />
          </a>
        </div>
        <div className="Footer__right">
          <a href="https://www.instagram.com/notthecheesebri/">
            <IoLogoInstagram
              alt="instagram-icon"
              className="Footer__svg-icon"
            />
          </a>
          <a href="mailto:bri@meandering.rocks">
            <Image
              fixed={data.briProfPic.childImageSharp.fixed}
              alt="bri-icon"
              className="Footer__img-profilePic"
              style={{
                borderRadius: `50%`,
              }}
            />
          </a>
        </div>
      </div>
      <div>
        <small> © {new Date().getFullYear()} Meandering Rocks</small>
      </div>
    </footer>
  )
}

export default Footer
