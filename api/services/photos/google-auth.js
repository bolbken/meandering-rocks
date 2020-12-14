import { GoogleOAuth2 } from 'serverless-headless-google-oauth'
import tokenStore from './token'
import { decryptSecret } from './aws-utils'

const oAuthConfig = {
  scope: ['https://www.googleapis.com/auth/photoslibrary.readonly'],
  oauth: {
    clientId: process.env.API_PHOTOS_SERVICE_GOOGLE_OAUTH_CLIENT_ID,
    callbackURL: process.env.IS_OFFLINE
      ? 'http://localhost:5000/dev/callback'
      : 'https://api.meandering.rocks/callback',
  },
  userCredentials: {
    email: process.env.API_PHOTOS_SERVICE_GOOGLE_OAUTH_EMAIL,
  },
  tokenCache: {
    load: tokenStore.retrieve,
    save: tokenStore.save,
  },
}

const auth = new GoogleOAuth2(oAuthConfig)

async function addSecretsToAuth() {
  // Asyncronous Configuration Values
  const clientSecret = decryptSecret(
    'API_PHOTOS_SERVICE_GOOGLE_OAUTH_CLIENT_SECRET'
  )
  const password = decryptSecret('API_PHOTOS_SERVICE_GOOGLE_OAUTH_PASSWORD')

  const secrets = await Promise.all([clientSecret, password])

  auth.oauth.clientSecret = secrets[0]
  auth.user.password = secrets[1]

  return auth
}

export { auth, addSecretsToAuth }
