import handler from 'serverless-express/handler'
import app from './app'

const api = handler(app)

export { api }
