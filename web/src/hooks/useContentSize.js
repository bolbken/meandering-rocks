import { useStaticQuery, graphql } from 'gatsby'

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

  let vw = 0
  if (typeof document !== 'undefined' || typeof window !== 'undefined') {
    vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    )
  }

  return vw > 0 && vw < maxWidth ? vw : maxWidth
}

export function useContentHeight() {
  let vh = 0
  if (typeof document !== 'undefined' || typeof window !== 'undefined') {
    vh = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    )
  }

  return vh
}
