import React from 'react'
import { Link } from 'gatsby'

const Dock = ({ open, setOpen, scrolling }) => {
  const dockState = open ? 'opened' : 'closed'
  let isScrolling = 'notScrolling'
  if (open) {
    isScrolling = 'notScrolling'
  } else if (scrolling) {
    isScrolling = 'isScrolling'
  }

  return (
    <div className={`Header__Dock-${dockState}-${isScrolling}`}>
      <div className={`Header__Dock__menu-${dockState}`}>
        <Link to="/">Home</Link>
        <br />
        <Link to="/gallery">Gallery</Link>
        <br />
        <Link to="/about">About</Link>
      </div>
      <nav className={`Header__Dock__nav Header__Dock__nav-${isScrolling}`}>
        <Link
          to="/gallery"
          className={`Header__word-left Header__Dock__nav__link-${dockState}`}
        >
          Gallery
        </Link>
        <button
          className={`Header__Dock__menu__button-${dockState}`}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
        <Link
          to="/about"
          className={`Header__word-right Header__Dock__nav__link-${dockState}`}
        >
          About
        </Link>
      </nav>
    </div>
  )
}

export default Dock
