import React from "react"
import Tilt from "react-tilt"

const cont = {
  backgroundColor: "#eee",
  cursor: "pointer",
  overflow: "hidden",
  position: "relative",
}

const HoverTiltImage = ({
  index,
  photo,
  direction,
  top,
  left,
  onClick,
  className
}) => {
  if (direction === "column") {
    cont.position = "absolute"
    cont.left = left
    cont.top = top
  }

  const handleOnClick = event => {
    onClick(event, { photo, index })
  }

  return (
    <Tilt
      className={`HoverTiltImage ${className}`}
      options={{ max: 15, scale: 1 }}
      style={{ height: photo.height, width: photo.width }}
    >
      <img
        alt={photo.title}
        {...photo}
        onClick={handleOnClick}
      />
    </Tilt>
  )
}

export default HoverTiltImage
