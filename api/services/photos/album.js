import { auth } from './google-auth'
import GooglePhotos from './google-photos'
import ImageProcessor from './image-process'

const imgProcess = new ImageProcessor()

async function initGooglePhotos() {
  const token = await auth.getAccessToken()
  return new GooglePhotos(token)
}

async function listAll() {
  const googlePhotos = await initGooglePhotos()
  return await googlePhotos.listAlbums()
}

async function getAlbum(name, options) {
  const googlePhotos = await initGooglePhotos()
  let album = await googlePhotos.getAlbum(name)

  album = await injectMediaItemWebPBuffers(album)
  // check if the album mediaItems are to be resized
  if (options.maxWidthPx || options.maxHeightPx) {
    const sizeOptions = {}
    if (options.maxHeightPx) {
      sizeOptions.height = parseInt(options.maxHeightPx)
    }
    if (options.maxWidthPx) {
      sizeOptions.width = parseInt(options.maxWidthPx)
    }

    album = await resizeMediaItemBuffersToFit(album, sizeOptions)
  }

  return album
}

export default { listAll, getAlbum }

async function injectMediaItemWebPBuffers(album) {
  const promises = album.mediaItems.map(async (mediaItem) => {
    const buffer = await imgProcess.urlToWebPBuffer(mediaItem.baseUrl)
    mediaItem.buffer = buffer
    return buffer
  })

  await Promise.all(promises)

  return album
}

async function resizeMediaItemBuffersToFit(album, sizeOptions) {
  const promises = album.mediaItems.map(async (mediaItem) => {
    const buffer = await imgProcess.resizeToFit(mediaItem.buffer, sizeOptions)
    mediaItem.buffer = buffer
  })

  await Promise.all(promises)

  return album
}
