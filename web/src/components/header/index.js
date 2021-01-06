import React, { useState, useEffect } from 'react'

import Dock from './Dock'
import Title from './Title'
import OutsideHeaderClickWatcher from './OutsideHeaderClickWatcher'

const Header = () => {
  const [open, setOpen] = useState(false)

  const scrollBufferRuningAvgCount = 30
  const [viewTops, setViewTops] = useState(
    Array.from({ length: scrollBufferRuningAvgCount }, () => 0)
  )
  const [scrolling, setScrolling] = useState(false)

  useEffect(() => {
    const average = (arr) => {
      const sum = arr.reduce((a, b) => a + b, 0)
      return sum / arr.length || 0
    }

    const onScroll = (e) => {
      const currentViewTop = e.target.documentElement.scrollTop
      setViewTops((viewTops) => {
        viewTops.shift()
        viewTops.push(currentViewTop)
        return viewTops
      })

      setScrolling(average(viewTops) < currentViewTop)
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', onScroll)
      return () => window.removeEventListener('scroll', onScroll)
    } else {
      return
    }
  }, [viewTops, setViewTops, setScrolling])

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
