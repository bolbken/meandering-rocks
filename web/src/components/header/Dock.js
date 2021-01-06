import React, { useState } from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import { useContentWidth } from '../../hooks/useContentSize'

const Dock = ({ open, setOpen, scrolling }) => {
  const data = useStaticQuery(graphql`
    query DockQuery {
      allMarkdownRemark(
        filter: { frontmatter: { featured: { eq: true } }, children: {} }
        sort: { fields: frontmatter___date, order: DESC }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              date(formatString: "MMMM DD, YYYY")
              title
              description
            }
          }
        }
      }
      site {
        siteMetadata {
          size {
            maxWidth
          }
        }
      }
    }
  `)

  const featuredPosts = data.allMarkdownRemark.edges
  const [hoverOnFeaturePost, setHoverOnFeaturePost] = useState(
    Object.fromEntries(
      featuredPosts.map((post) => {
        return [post.node.fields.slug, false]
      })
    )
  )
  const featurePostHoverHandler = (slug, isHovering) => {
    const handler = () => {
      setHoverOnFeaturePost((prevState) => {
        console.log(`Set hover status: ${slug}  to:  ${isHovering}`)
        prevState[slug] = isHovering
        console.log(JSON.stringify(prevState))
        return { ...prevState }
      })
    }
    return handler
  }
  const isWidthForFeaturePostDescription =
    useContentWidth() >= data.site.siteMetadata.size.maxWidth

  const dockState = open ? 'opened' : 'closed'
  let navState = 'notScrolling'
  if (open) {
    navState = 'opened'
  } else if (scrolling) {
    navState = 'isScrolling'
  }

  return (
    <div className={`Header__Dock-${navState}`}>
      <div className={`Header__Dock__menu-${dockState}`}>
        <div className="Header__Dock__menu__pages">
          <div className="Header__Dock__menu__pageList">
            <Link to="/">Home</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/about">About</Link>
          </div>
        </div>
        <div className="Header__Dock__menu__posts">
          <h3>Featured Posts</h3>
          <div className="Header__Dock__menu__postList">
            {featuredPosts.map((post) => {
              const { slug } = post.node.fields
              return (
                <div
                  key={post.node.frontmatter.title}
                  className="Header__Dock__menu__postLink"
                >
                  <Link to={slug}>
                    <div
                      className="Header__Dock__menu__postLink__title"
                      onMouseEnter={featurePostHoverHandler(slug, true)}
                      onMouseLeave={featurePostHoverHandler(slug, false)}
                    >
                      {post.node.frontmatter.title}
                    </div>
                    {hoverOnFeaturePost[slug] &&
                    isWidthForFeaturePostDescription ? (
                      <div className="Header__Dock__menu__postLink__description">
                        {post.node.frontmatter.description}
                      </div>
                    ) : null}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <nav className={`Header__Dock__nav`}>
        <div className={`Header__Dock__nav__wing-${navState}`}>
          <Link to="/gallery" className="Header__word-left">
            Gallery
          </Link>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className={`Header__Dock__menu__button-${navState}`}
        >
          <div className={`Header__Dock__menu__icon-${dockState}`}>
            <span />
            <span />
            <span />
          </div>
        </button>
        <div className={`Header__Dock__nav__wing-${navState}`}>
          <Link to="/about" className="Header__word-right">
            About
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default Dock
