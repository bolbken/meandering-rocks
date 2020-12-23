import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import MasonryGallery from '../components/gallery/MasonryGallery'

const GalleryTest = ({ data, location }) => {
  const { fillPhotos } = data.googlePhotosAlbum

  return (
    <Layout location={location}>
      <SEO title="Gallery" />
      <h1>GalleryTest</h1>
      {typeof fillPhotos !== 'undefined'
        ? fillPhotos.map((photo) => {
            return (
              <div id={photo.id}>
                <h1>{photo.filename}</h1>
                <img
                  src={photo.photo.childImageSharp.fluid.tracedSVG}
                  alt={photo.description || photo.filename}
                />
              </div>
            )
          })
        : null}
    </Layout>
  )
}

export default GalleryTest

export const pageQuery = graphql`
  query GalleryTest {
    googlePhotosAlbum(
      title: { eq: "meandering_rocks_web__post__welcome-we-did-it" }
    ) {
      photos {
        id
        filename
        description
        mediaMetadata {
          creationTime
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
