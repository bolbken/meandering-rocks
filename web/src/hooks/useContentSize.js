import { useStaticQuery, graphql } from "gatsby"

export function useContentWidth() {
  const data = useStaticQuery(graphql`
    query ContentWidthQuery {
      site {
        siteMetadata {
          size {
            maxWidth
          }
        }
      }
    }
  `)

  const { maxWidth } = data.site.siteMetadata.size

  const vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  )

  return vw > maxWidth ? maxWidth : vw
}

export function useContentHeight() {
  return Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  )
}
