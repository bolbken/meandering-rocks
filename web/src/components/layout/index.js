import React from "react"
// import { Link } from "gatsby"

import Header from "../header"
import Footer from "../footer"

const Layout = ({ children }) => {
  return (
    <div className={`Layout`}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
