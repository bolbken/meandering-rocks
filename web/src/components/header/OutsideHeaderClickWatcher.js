import React, { useRef, useEffect } from "react"

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideClickWatcher(ref, setOpen) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref])
}

/**
 * Component that alerts if you click outside of it
 */
function OutsideHeaderClickWatcher({ children, setOpen }) {
  const wrapperRef = useRef(null)
  useOutsideClickWatcher(wrapperRef, setOpen)

  return <div ref={wrapperRef}>{children}</div>
}

export default OutsideHeaderClickWatcher
