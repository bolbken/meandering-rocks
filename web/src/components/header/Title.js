import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

const Title = ({ open, scrolling }) => {
  const data = useStaticQuery(graphql`
    {
      siteLogo: file(absolutePath: { regex: "/assets/site-logo.svg/" }) {
        publicURL
      }
    }
  `)

  let isScrolling = "notScrolling"
  if (open) {
    isScrolling = "notScrolling"
  } else if (scrolling) {
    isScrolling = "isScrolling"
  }

  return (
    <div className={`Header__Title`}>
      <div className={`Header__word-left Header__word-${isScrolling}`}>
        Meandering
      </div>
      <Link to={`/`}>
        <img
          className={`Header__logo-${isScrolling}`}
          src={data.siteLogo.publicURL}
          alt={"Meandering Rocks"}
        />
      </Link>
      <div className={`Header__word-right Header__word-${isScrolling}`}>
        Rocks
      </div>
    </div>
  )
}

export default Title
