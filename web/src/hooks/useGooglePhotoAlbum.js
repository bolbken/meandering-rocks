import { useState, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'

export default function useGooglePhotoAlbum(albumName, query, fillPhotos) {
  const creationTimeDecendingSort = (a, b) => {
    // Newest photos first, oldest photos last
    return b.creationTime - a.creationTime
  }
  const [photos, setPhotos] = useState(
    fillPhotos ? fillPhotos.sort(creationTimeDecendingSort) : []
  )
  const [loading, setLoading] = useState(true)

  const data = useStaticQuery(graphql`
    query UseGooglePhotosAlbumQuery {
      site {
        siteMetadata {
          api {
            key
            photos {
              baseUrl
              port
              pathPrefix
            }
          }
        }
      }
    }
  `)
  const apiKey = data.site.siteMetadata.api.key
  const { baseUrl, port, pathPrefix } = data.site.siteMetadata.api.photos
  const queryStr = Object.keys(query)
    .map(
      (key) => encodeURIComponent(key) + '=' + encodeURIComponent(query[key])
    )
    .join('&')

  useEffect(() => {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
    })

    async function fetchAlbum() {
      const res = await fetch(
        `${baseUrl}:${port}${pathPrefix}/album/${albumName}?${queryStr}`,
        {
          method: 'GET',
          headers,
        }
      )
      const json = await res.json()
      const googlePhotos = json.mediaItems
        .map((item) => {
          return {
            id: item.id,
            alt: item.description || item.filename,
            srcUrl: item.baseUrl,
            src: `data:image/jpeg;base64,${base64ArrayBuffer(
              item.buffer.data
            )}`,
            width:
              parseInt(item.mediaMetadata.width) /
              parseInt(item.mediaMetadata.height),
            height: 1,
            creationTime: new Date(item.mediaMetadata.creationTime),
          }
        })
        .sort(creationTimeDecendingSort)
      setPhotos(googlePhotos)
      setLoading(false)
    }
    fetchAlbum()
  }, [])

  return [photos, loading]
}

function base64ArrayBuffer(arrayBuffer) {
  let base64 = ''
  const encodings =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  const bytes = new Uint8Array(arrayBuffer)
  const byteLength = bytes.byteLength
  const byteRemainder = byteLength % 3
  const mainLength = byteLength - byteRemainder

  let a
  let b
  let c
  let d
  let chunk

  // Main loop deals with bytes in chunks of 3
  for (let i = 0; i < mainLength; i += 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63 // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder === 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4 // 3   = 2^2 - 1

    base64 += `${encodings[a]}${encodings[b]}==`
  } else if (byteRemainder === 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2 // 15    = 2^4 - 1

    base64 += `${encodings[a]}${encodings[b]}${encodings[c]}=`
  }

  return base64
}
