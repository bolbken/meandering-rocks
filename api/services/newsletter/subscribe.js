import querystring from 'querystring'

import SubscriptionTable from './subscriptions'

const contentType = { 'Content-Type': 'application/x-www-form-urlencoded' }

export async function handler(event, context) {
  let subscription
  try {
    subscription = querystring.parse(event.body)
  } catch (err) {
    const msg =
      "Failed to create subscription.  POST request body must be type: 'application/x-www-form-urlencoded'."
    console.error(msg)
    return {
      statusCode: 400,
      headers: { ...contentType },
      body: msg,
    }
  }

  const subs = new SubscriptionTable()

  try {
    await subs.put({
      ...subscription,
      createdDate: new Date().toUTCString(),
    })
    return {
      statusCode: 201,
      headers: { ...contentType },
      body: 'OK',
    }
  } catch (err) {
    console.log('Failed to create new subscription.', err)
    return {
      statusCode: 500,
      headers: { ...contentType },
      body: JSON.stringify(err, null, 2),
    }
  }
}
