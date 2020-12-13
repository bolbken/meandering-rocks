import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import MasonryGallery from "../components/gallery/MasonryGallery"
import { gatsbySVGtoFillPhoto } from "../utils/gatsbySVGtoFillPhoto"

const Gallery = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const fillPhotos = gatsbySVGtoFillPhoto(data.googlePhotosAlbum.photos)
  const albumName = "meandering_rocks_web__gallery"

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Gallery" />
      <MasonryGallery albumName={albumName} fillPhotos={fillPhotos} />
    </Layout>
  )
}

export default Gallery

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    googlePhotosAlbum(title: { eq: "meandering_rocks_web__gallery" }) {
      photos {
        id
        filename
        description
        mediaMetadata {
          creationTime
          width
          height
        }
        photo {
          childImageSharp {
            fluid {
              tracedSVG
            }
          }
        }
      }
    }
  }
`
