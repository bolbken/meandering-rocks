import express from 'serverless-express/express'
import bodyParser from 'body-parser'
import { auth, addSecretsToAuth } from './google-auth'
import Album from './album'

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Initialize google auth
app.use(async (req, res, next) => {
  await addSecretsToAuth()
  next()
})

// Connect generic OAuth callback router to express app
app.use('/callback', auth.expressOAuthRouter(express))

app.get('/album', async (req, res) => {
  res.send(await Album.listAll())
})

app.get('/album/:name', async (req, res) => {
  const { name } = req.params
  const album = await Album.getAlbum(name, req.query)
  res.send(album)
})

export default app
