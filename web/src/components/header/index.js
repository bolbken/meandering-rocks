import React, { useState, useEffect } from "react"

import Dock from "./Dock"
import Title from "./Title"
import OutsideHeaderClickWatcher from "./OutsideHeaderClickWatcher"

const Header = () => {
  const [open, setOpen] = useState(false)
  const [scrolling, setScrolling] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)
  const SCROLL_UP_BUFFER = 5

  useEffect(() => {
    const onScroll = e => {
      setScrollTop(e.target.documentElement.scrollTop)
      setScrolling(e.target.documentElement.scrollTop > scrollTop)
    }
    window.addEventListener("scroll", onScroll)

    return () => window.removeEventListener("scroll", onScroll)
  }, [scrollTop])

  // useEffect(() => {
  //   console.log(scrollTop)
  // }, [scrollTop])

  return (
    <header className={`Header`}>
      <OutsideHeaderClickWatcher setOpen={setOpen}>
        <Title open={open} scrolling={scrolling} />
        <Dock open={open} setOpen={setOpen} scrolling={scrolling} />
      </OutsideHeaderClickWatcher>
    </header>
  )
}

export default Header
