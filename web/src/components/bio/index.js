/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fixed(width: 72, height: 72) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author {
            name
            summary
          }
        }
      }
    }
  `)

  const { author } = data.site.siteMetadata
  return (
    <div className={`Bio`}>
      <Image
        fixed={data.avatar.childImageSharp.fixed}
        alt={author.name}
        className={`Bio__Image`}
        imgStyle={{
          borderRadius: `50%`,
        }}
      />
      <p>
        Written by {author.name}. {author.summary}
      </p>
    </div>
  )
}

export default Bio
