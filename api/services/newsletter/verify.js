import querystring from 'querystring'
import SubscriptionTable from './subscriptions'
import AWS from 'aws-sdk'
import fs from 'fs'
import handlebars from 'handlebars'
import config from './config'
AWS.config.update({ region: config.aws.region })

const contentType = { 'Content-Type': 'application/x-www-form-urlencoded' }

const ses = new AWS.SES()

export async function handler(event) {
  let email
  let name
  try {
    const data = querystring.parse(event.body)
    email = data.email
    name = data.name
  } catch (err) {
    const msg =
      "Failed to verify subscription.  POST request body must be type: 'application/x-www-form-urlencoded'."
    console.error(msg)
    return {
      statusCode: 400,
      headers: { ...contentType },
      body: msg,
    }
  }

  const subs = new SubscriptionTable()
  try {
    const subscriber = await subs.get(email)
    if (subscriber) {
      throw new Error(`Subscription already exists for email: ${email}.`)
    }
  } catch (err) {
    return {
      statusCode: 400,
      headers: { ...contentType },
      body: JSON.stringify(err, null, 2),
    }
  }

  const bodyTemplate = handlebars.compile(
    fs.readFileSync('./templates/verify/index.html').toString()
  )

  const body = bodyTemplate({ name: name || 'Hello' })

  // TODO: email addres needs to be verified in SES or something
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: { Data: body },
      },
      Subject: {
        Data: 'testing!',
      },
    },
    Source: 'newsletter@meandering.rocks',
  }

  try {
    await ses.sendEmail(params).promise()
    return {
      statusCode: 200,
      body: 'Email sent!',
    }
  } catch (e) {
    console.error(e)
    return {
      statusCode: 400,
      body: 'Sending failed',
    }
  }
}
