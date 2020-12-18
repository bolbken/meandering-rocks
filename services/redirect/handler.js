const AWS = require('aws-sdk')
const s3 = new AWS.S3()

const { redirect } = require('./redirect')

exports.redirect = async (event, context, callback) => {
  // Credentials definition - customise to fit your needs
  const credentials = JSON.parse(process.env.SERVICE_REDIRECT_AUTH_CREDENTIALS)

  // Placeholder list which eventually holds all credential strings
  let credential_strings = []

  // Construct all credential strings and add to corresponding list
  for (let user in credentials) {
    const password = credentials[user]
    const auth_string =
      'Basic ' + new Buffer(user + ':' + password).toString('base64')
    credential_strings.push(auth_string)
  }

  // Get request and request headers
  const request = event.Records[0].cf.request
  const headers = request.headers

  // Validate Basic Authentication
  if (
    typeof headers.authorization == 'undefined' ||
    credential_strings.indexOf(headers.authorization[0].value) === -1
  ) {
    const response = {
      status: '401',
      statusDescription: 'Unauthorized',
      body: 'Unauthorized',
      headers: {
        'www-authenticate': [{ key: 'WWW-Authenticate', value: 'Basic' }],
      },
    }
    callback(null, response)
  }

  // In case Basic Authentication passed, redirect to appropriate static site content
  const bucket_name = 'dev.meandering.rocks'
  redirect(event, s3, bucket_name, callback)
}