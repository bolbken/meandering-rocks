import querystring from 'querystring'

import SubscriptionTable from './subscriptions'

const contentType = { 'Content-Type': 'application/x-www-form-urlencoded' }

export async function handler(event, context) {
  let email
  try {
    email = querystring.parse(event.body).email
  } catch (err) {
    const msg =
      "Failed to delete subscription.  POST request body must be type: 'application/x-www-form-urlencoded'."
    console.error(msg)
    return {
      statusCode: 400,
      headers: { ...contentType },
      body: msg,
    }
  }

  const subs = new SubscriptionTable()

  try {
    await subs.delete(email)
    return {
      statusCode: 200,
      headers: { ...contentType },
      body: 'OK',
    }
  } catch (err) {
    console.log('Failed to delete subscription.', err)
    return {
      statusCode: 500,
      headers: { ...contentType },
      body: JSON.stringify(err, null, 2),
    }
  }
}
