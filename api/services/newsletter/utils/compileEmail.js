const fs = require('fs')
const juice = require('juice')

const srcPath = process.argv[2] || './src'
const outPath = process.argv[3] || '.'

const html = fs.readFileSync(`${srcPath}/index.html`).toString()
const css = fs.readFileSync(`${srcPath}/styles.css`).toString()

const compiledHtml = juice.inlineContent(html, css)

fs.writeFileSync(`${outPath}/index.html`, compiledHtml)
