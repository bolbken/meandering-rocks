// Environment setup
const activeEnv = process.env.BUILD_ENV || process.env.NODE_ENV || 'development'
console.log(`Gatsby configuring for stage: '${activeEnv}'`)
require('dotenv').config({
  // env file is at root of monorepo
  path: `../.env.${activeEnv}`,
})
const apiPathPrefix =
  process.env.BUILD_ENV !== 'development' ? '' : `/${activeEnv}`
const tfOutput = require('../utils/tf-output')

// Config variables
const targetAddress = new URL(
  process.env.WEB_TARGET_ADDRESS || `http://localhost`
)
const maxContentWidthPx = 590

module.exports = {
  siteMetadata: {
    title: `Meandering Rocks`,
    author: {
      name: `Ben Kolb & Brianna Knaggs`,
      summary: `Pebble pulling 20-somethings who love the outdoors.`,
      email: `contact@meandering.rocks`,
    },
    description: `Pictures and stories accross the USA.`,
    siteUrl: targetAddress.toString(),
    size: {
      maxWidth: maxContentWidthPx,
    },
    api: {
      key: `${
        tfOutput.readSync(activeEnv, 'api_key_web') ||
        process.env.API_KEY ||
        '12345'
      }`,
      photos: {
        baseUrl: process.env.API_BASE_URL || 'http://localhost',
        port: process.env.API_PHOTOS_SERVICE_OFFLINE_HTTP_PORT || '443',
        pathPrefix: apiPathPrefix,
      },
      newsletter: {
        baseUrl: process.env.API_BASE_URL || 'http://localhost',
        port: process.env.API_NEWSLETTER_SERVICE_OFFLINE_HTTP_PORT || '443',
        pathPrefix: apiPathPrefix,
      },
    },
  },

  plugins: [
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [process.env.WEB_GOOGLE_ANALYTICS_TRACKING_ID || ''],
        // This object is used for configuration specific to this plugin
        pluginConfig: {
          head: true,
          respectDNT: true,
          // Avoids sending pageview hits from custom paths
          // exclude: ['/preview/**', '/do-not-track/me/too/'],
        },
      },
    },
    {
      resolve: `gatsby-plugin-hotjar`,
      options: {
        includeInDevelopment: false,
        id: process.env.WEB_HOTJAR_ANALYTICS_ID || '',
        sv: process.env.WEB_HOTJAR_ANALYTICS_SNIPPET_VERSION || 6,
      },
    },
    'gatsby-source-google-photos',
    'gatsby-remark-embed-video',
    {
      resolve: `gatsby-plugin-s3`,
      options: {
        bucketName:
          tfOutput.readSync(activeEnv, 'web_target_bucket_name') ||
          'fake-bucket',
        region: process.env.AWS_REGION || 'us-east-1',
        protocol: targetAddress.protocol.slice(0, -1),
        hostname: targetAddress.hostname,
        acl: null,
        params: {
          // In case you want to add any custom content types: https://github.com/jariz/gatsby-plugin-s3/blob/master/recipes/custom-content-type.md
        },
      },
    },
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: targetAddress.href.slice(0, -1),
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: maxContentWidthPx,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: 'gatsby-remark-embed-video',
            options: {
              width: maxContentWidthPx,
              ratio: 1.77, // Optional: Defaults to 16/9 = 1.77
              //height: 400, // Optional: Overrides optional.ratio
              related: false, //Optional: Will remove related videos from the end of an embedded YouTube video.
              noIframeBorder: true, //Optional: Disable insertion of <style> border: 0
              urlOverrides: [
                {
                  id: 'youtube',
                  embedURL: (videoId) =>
                    `https://www.youtube-nocookie.com/embed/${videoId}`,
                },
              ], //Optional: Override URL of a service provider, e.g to enable youtube-nocookie support
              containerClass: 'embedVideo-container', //Optional: Custom CSS class for iframe container, for multiple classes separate them by space
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        //trackingId: `ADD YOUR TRACKING ID HERE`,
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Meandering Rocks Blog`,
        short_name: `Meandering Rocks`,
        start_url: `/`,
        // background_color: `#ffffff`,
        // theme_color: `#663399`,
        // display: `minimal-ui`,
        icon: `content/assets/site-logo.svg`,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        includePaths: ['src/styles'],
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
