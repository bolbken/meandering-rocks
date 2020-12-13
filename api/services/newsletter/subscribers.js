import AWS from 'aws-sdk'
import config from './config'
import SubscriptionTable from './subscriptions'

AWS.config.update({ region: config.aws.region })

export async function handler() {
  const subs = new SubscriptionTable()
  const subscribers = await subs.list()
  return {
    statusCode: 200,
    body: JSON.stringify(subscribers, null, 2),
  }
}
