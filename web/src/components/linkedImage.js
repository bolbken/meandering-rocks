import React from "react"
import { Link } from "gatsby"
import Image from "gatsby-image"

const LinkedImage = props => {
  return (
    <Link {...props.link}>
      <Image {...props.image} />
    </Link>
  )
}

export default LinkedImage
