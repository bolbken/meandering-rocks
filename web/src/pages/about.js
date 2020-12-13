import React, { useEffect, useState } from "react"
import { graphql } from "gatsby"
import Image from "gatsby-image"
import { Parallax } from "react-scroll-parallax"
import classNames from "classnames"

import sassVar from "../styles/main.scss"
import Layout from "../components/layout"
import SEO from "../components/seo"

const About = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  // State and Consts to cycle the icon sets in the use effect.
  const ICON_SET_COUNT = 3
  const ICON_CYCLE_MILLI = 3000
  const [currentIcon, setCurrentIcon] = useState(0)
  const [previousIcon, setPreviousIcon] = useState(0)
  const iconActiveClassnamesAtIndex = index => {
    return classNames({
      "About__Hero__icon-current": index === currentIcon,
      "About__Hero__icon-previous": index === previousIcon,
      "About__Hero__icon-hidden":
        index !== currentIcon && index !== previousIcon,
    })
  }
  // An effect to cycle the icons every specified milliseconds
  useEffect(() => {
    const cycleIcon = () => {
      setPreviousIcon(currentIcon)
      setCurrentIcon((currentIcon + 1) % ICON_SET_COUNT)
    }

    const iconCycleInterval = setInterval(() => {
      cycleIcon()
    }, ICON_CYCLE_MILLI)
    return () => {
      clearInterval(iconCycleInterval)
    }
  }, [currentIcon, previousIcon])

  // Code pertaining to the switch to parallax scrolling
  const MIN_WIDTH_PX_PARALLAX = parseInt(sassVar.breakpointMinWidthPxLarge)
  const enableParallax = window.innerWidth > MIN_WIDTH_PX_PARALLAX
  const parallaxProps = {
    aboutBlurb: {
      bri: {
        y: [-80, -800],
      },
      ben: {
        y: [-80, -800],
      },
      cali: {
        y: [-80, -700],
      },
      tes: {
        y: [-200, -400],
      },
      dwayne: {
        y: [-100, -400],
      },
      celeste: {
        y: [-250, -600],
      },
    },
  }
  const parallaxEnabledProps = blurbSubject => {
    if (enableParallax) {
      return parallaxProps.aboutBlurb[blurbSubject]
    } else {
      return {}
    }
  }

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="About" />
      <div className={`About__Hero`}>
        <div className={`About__Hero__text`}>
          <h1>
            <em>Meandering...</em>
          </h1>
        </div>
        <div className={`About__Hero__icon`}>
          <div
            className={`About__Hero__icon-questionMark ${iconActiveClassnamesAtIndex(
              0
            )}`}
          >
            <Image
              fluid={data.questionMarkIcon.childImageSharp.fluid}
              alt="question-mark-icon"
              imgStyle={{ objectFit: "contain" }}
            />
          </div>
          <div
            className={`About__Hero__icon-handThinking ${iconActiveClassnamesAtIndex(
              1
            )}`}
          >
            <Image
              fluid={data.rockHandIcon.childImageSharp.fluid}
              alt="rock-hand-emoji"
              imgStyle={{ objectFit: "contain" }}
            />
            <Image
              fluid={data.thinkingFaceIcon.childImageSharp.fluid}
              alt="thinking-face-emoji"
              imgStyle={{ objectFit: "contain" }}
            />
          </div>
          <div
            className={`About__Hero__icon-rockCheck ${iconActiveClassnamesAtIndex(
              2
            )}`}
          >
            <Image
              fluid={data.rockIcon.childImageSharp.fluid}
              alt="rock-emoji"
              imgStyle={{ objectFit: "contain" }}
            />
            <Image
              fluid={data.greenCheckIcon.childImageSharp.fluid}
              alt="green-check-emoji"
              imgStyle={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
      <div className={`About__blurb-summary `}>
        <p>This project is a shared, hodge-podge blog full of...</p>
        <ul className={`About__blurb-summary__list`}>
          <li>Climbing Trips</li>
          <li>Outdoor Adventures</li>
          <li>...etc</li>
        </ul>
        <p>
          We, <a href={"#bri-about"}>Bri</a> and <a href={"#ben-about"}>Ben</a>,
          hope this project will serve as a life journal to look back on, stay
          in touch with our friends and family and, if luck with have it, make
          some new friends along the way.
        </p>
      </div>
      <div id={"bri-about"} className={`About__beforePhoto`} />
      <Image
        fluid={data.briAboutPhoto.childImageSharp.fluid}
        alt={"bri-about"}
        className={`About__photo-left${enableParallax ? "-parallax" : ""}`}
        // imgStyle={enableParallax ? { objectFit: "contain" } : null}
      />
      <Parallax {...parallaxEnabledProps("bri")}>
        <div
          className={`About__blurb ${
            enableParallax ? "About__blurb-parallax-right" : ""
          }`}
        >
          <p>
            <em>Bri</em> born in Charleston, SC but grew up all over the USA,
            primarily in Richmond, VA. She blitzed her way through an
            engineering bachelors and masters.
            <br />
            <br />
            She is a whiz at most things she does, especially tugging her way up
            an over-hanging rock wall.
          </p>
        </div>
      </Parallax>
      <div id={"ben-about"} className={`About__beforePhoto`} />
      <Image
        fluid={data.benAboutPhoto.childImageSharp.fluid}
        alt={"ben-about"}
        className={`About__photo-right${enableParallax ? "-parallax" : ""}`}
        // imgStyle={enableParallax ? { objectFit: "contain" } : null}
      />
      <Parallax {...parallaxEnabledProps("ben")}>
        <div
          className={`About__blurb ${
            enableParallax ? "About__blurb-parallax-left" : ""
          }`}
        >
          <p>
            <em>Ben</em> born and raised in a small town in Southwest Virginia,
            named Salem. They say there is a Salem in every state, and I'm the
            kind of guy you would expect from a normal small town, certified
            average joe.
            <br />
            <br />
            He grew up doing every team and extreme sport he could make time
            for, took a gruelling stab at triathlons, and now primarily enjoys
            running and rock climbing.
          </p>
        </div>
      </Parallax>
      <div id={"cats-about"} className={`About__beforePhoto`} />
      <Image
        fluid={data.catsAboutPhoto.childImageSharp.fluid}
        alt="tes-and-cali-about"
        className={`About__photo-center${enableParallax ? "-parallax" : ""}`}
      />
      <Parallax {...parallaxEnabledProps("cali")}>
        <div
          className={`About__blurb ${
            enableParallax ? "About__blurb-parallax-right" : ""
          }`}
        >
          <p>
            <em>
              Cali <small>Top</small>
            </em>
            is the diva everyone needs in their life. She may also be the
            epitome of why some people are scared of cats, purring and growing
            all at once. <br />
            <br />
            Despite her attitude she is the softest cat you'll ever touch, and
            she knows it somehow.
          </p>
        </div>
      </Parallax>
      <Parallax {...parallaxEnabledProps("tes")}>
        <div
          className={`About__blurb ${
            enableParallax ? "About__blurb-parallax-left" : ""
          }`}
        >
          <p>
            <em>
              Tes <small>Bottom</small>
            </em>{" "}
            is the cat that wants to be your friend, especially if you have
            cheddar cheese. She is a american shorthair with siamese coloring
            and couldn't be more of a clutz. <br />
            <br />
            No open box is safe when when she is around.
          </p>
        </div>
      </Parallax>
      <div id={"vehicles-about"} className={`About__beforePhoto`} />
      <Image
        fluid={data.vehiclesAboutPhoto.childImageSharp.fluid}
        alt="dwayne-and-celeste-about"
        className={`About__photo-center${enableParallax ? "-parallax" : ""}`}
      />
      <Parallax {...parallaxEnabledProps("dwayne")}>
        <div
          className={`About__blurb ${
            enableParallax ? "About__blurb-parallax-right" : ""
          }`}
        >
          <p>
            <em>
              "Dwayne The Rock Taco" <small>Right</small>
            </em>
            is a 2018 Toyota Tacoma TRDOffroad Doublecab with a capped extended
            bed.
            <br />
            <br />
            We purchased it as a salvaged wreck sight-unseen and we're
            lucky/handy enough to be able to rebuild it to its previous glory!
          </p>
        </div>
      </Parallax>
      <Parallax {...parallaxEnabledProps("celeste")}>
        <div
          className={`About__blurb ${
            enableParallax ? "About__blurb-parallax-left" : ""
          }`}
        >
          <p>
            <em>
              "Celeste" <small>Left</small>
            </em>
            is a 6x12 foot V-nose cargo trailer that has undergone a DIY camper
            conversion.
            <br />
            <br />
            It's every bit of a home away from home.
          </p>
        </div>
      </Parallax>
    </Layout>
  )
}

export default About

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    benAboutPhoto: file(absolutePath: { regex: "/ben-about.jpg/" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
    briAboutPhoto: file(absolutePath: { regex: "/bri-about.jpg/" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
    catsAboutPhoto: file(absolutePath: { regex: "/cats-about.jpg/" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
    vehiclesAboutPhoto: file(absolutePath: { regex: "/vehicles-about.jpg/" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
    questionMarkIcon: file(absolutePath: { regex: "/question-mark-0.png/" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    thinkingFaceIcon: file(absolutePath: { regex: "/thinking-face-0.png/" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    rockHandIcon: file(absolutePath: { regex: "/rock-hand-0.png/" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    rockIcon: file(absolutePath: { regex: "/rock-2.png/" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    greenCheckIcon: file(absolutePath: { regex: "/green-check-0.png/" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
`
