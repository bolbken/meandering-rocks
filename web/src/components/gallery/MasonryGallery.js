import React, { useState, useCallback } from 'react'
import Gallery from 'react-photo-gallery'
import Carousel, { Modal, ModalGateway } from 'react-images'

import useGooglePhotoAlbum from '../../hooks/useGooglePhotoAlbum'
import { useContentWidth } from '../../hooks/useContentSize'
import HoverTiltImage from './HoverTiltImage'
import styles from '../../styles/main.scss'

const MasonryGallery = ({ albumName, fillPhotos }) => {
  const [photos, loading] = useGooglePhotoAlbum(
    albumName,
    {
      maxWidthPx: useContentWidth(),
    },
    fillPhotos
  )

  const [currentImage, setCurrentImage] = useState(0)
  const [viewerIsOpen, setViewerIsOpen] = useState(false)
  const loadingAnimationRepeatCount = parseInt(
    styles.masonryGalleryLoadingAnimationRepeatCount
  )

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index)
    setViewerIsOpen(true)
  }, [])

  const closeLightbox = () => {
    setCurrentImage(0)
    setViewerIsOpen(false)
  }

  const imageRenderer = useCallback(
    ({ index, left, top, key, photo }) => {
      const image = (
        <HoverTiltImage
          index={index}
          key={key}
          index={index}
          photo={photo}
          left={left}
          top={top}
          onClick={openLightbox}
          className={
            loading ? 'HoverTiltImage-loading' : 'HoverTiltImage-loaded'
          }
        />
      )
      return image
    },
    [loading]
  )

  return (
    <div className={`MasonryGallery`}>
      <Gallery photos={photos} renderImage={imageRenderer} />
      <ModalGateway>
        {viewerIsOpen ? (
          <Modal onClose={closeLightbox}>
            <Carousel
              currentIndex={currentImage}
              views={
                typeof photos !== 'undefined'
                  ? photos.map((x) => ({
                      source: x.srcUrl || x.src,
                      caption: x.alt,
                    }))
                  : null
              }
            />
          </Modal>
        ) : null}
      </ModalGateway>
    </div>
  )
}

export default MasonryGallery
