import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import MasonryGallery from "../components/gallery/MasonryGallery"
import { gatsbySVGtoFillPhoto } from "../utils/gatsbySVGtoFillPhoto"

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const { previous, next } = pageContext
  const fillPhotos = gatsbySVGtoFillPhoto(data.googlePhotosAlbum.photos)
  const { albumName } = post.frontmatter

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article className={`BlogPost__article`}>
        <header className={`BlogPost__article__header`}>
          <h1>{post.frontmatter.title}</h1>
          <small>{post.frontmatter.date}</small>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>

      <nav className={`BlogPost__nav`}>
        <ul>
          <li>
            {previous && (
              <Link to={"/" + previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={"/" + next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
      <div className={`BlogPost__Gallery`}>
        <MasonryGallery albumName={albumName} fillPhotos={fillPhotos} />
      </div>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlugWithAlbum($slug: String!, $albumName: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        albumName
      }
    }
    googlePhotosAlbum(title: { eq: $albumName }) {
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
