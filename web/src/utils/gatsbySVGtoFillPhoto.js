export function gatsbySVGtoFillPhoto(gatsbySVGs) {
  return gatsbySVGs.map(photo => {
    const { id, filename, description } = photo
    const { creationTime, height, width } = photo.mediaMetadata
    const src = photo.photo.childImageSharp.fluid.tracedSVG
    return {
      id,
      alt: description || filename,
      creationTime: new Date(creationTime),
      width: parseInt(width) / parseInt(height),
      height: 1,
      src,
    }
  })
}
