import React, { useState } from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'

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

  const dockState = open ? 'opened' : 'closed'
  let isScrolling = 'notScrolling'
  if (open) {
    isScrolling = 'notScrolling'
  } else if (scrolling) {
    isScrolling = 'isScrolling'
  }

  return (
    <div className={`Header__Dock-${dockState}-${isScrolling}`}>
      <div className={`Header__Dock__menu-${dockState}`}>
        <div>
          <h3>Pages</h3>
          <div className="Header__Dock__menu__pageLinks">
            <Link to="/">Home</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/about">About</Link>
          </div>
        </div>
        <div>
          <h3>Featured Posts</h3>
          <div className="Header__Dock__menu__postLinks">
            {JSON.stringify(hoverOnFeaturePost, null, 2)}
            {featuredPosts.map((post) => {
              const { slug } = post.node.fields
              return (
                <div
                  key={post.node.frontmatter.title}
                  onMouseEnter={featurePostHoverHandler(slug, true)}
                  onMouseLeave={featurePostHoverHandler(slug, false)}
                >
                  <Link to={slug}>
                    <div>{post.node.frontmatter.title}</div>
                    {hoverOnFeaturePost[slug] ? (
                      <div>{post.node.frontmatter.description}</div>
                    ) : null}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <nav className={`Header__Dock__nav Header__Dock__nav-${isScrolling}`}>
        <div className="Header__Dock__nav__wing">
          <Link
            to="/gallery"
            className={`Header__word-left Header__Dock__nav__link-${dockState}`}
          >
            Gallery
          </Link>
        </div>

        <button onClick={() => setOpen(!open)}>
          <div className={`Header__Dock__menu__icon-${dockState}`}>
            <span />
            <span />
            <span />
          </div>
        </button>
        <div className="Header__Dock__nav__wing">
          <Link
            to="/about"
            className={`Header__word-right Header__Dock__nav__link-${dockState}`}
          >
            About
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default Dock
