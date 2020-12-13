import "./src/styles/main.scss"

import React from "react"
import { ParallaxProvider } from "react-scroll-parallax"

export const wrapRootElement = ({ element }) => {
  return <ParallaxProvider>{element}</ParallaxProvider>
}
