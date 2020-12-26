import AWS from 'aws-sdk'
import config from './config'
import branchToStage from '../../../utils/branch-to-stage'

let dbConfig = {
  region: process.env.IS_OFFLINE ? 'localhost' : config.aws.region,
}
if (process.env.IS_OFFLINE) {
  dbConfig.endpoint = `http://localhost:${process.env.API_NEWSLETTER_SERVICE_DYNAMODB_PORT}`
}

const dynamodb = new AWS.DynamoDB(dbConfig)
const docClient = new AWS.DynamoDB.DocumentClient(dbConfig)

const defaultSchema = {
  subscriptionSchema: {
    TableName: `${
      process.env.API_NEWSLETTER_SERVICE_DYNAMODB_TABLE_NAME
    }-${branchToStage()}`,
    KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'email', AttributeType: 'S' }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  },
}

class SubscriptionTable {
  constructor() {
    this.config = defaultSchema.subscriptionSchema
    this.dynamodb = dynamodb
    this.docClient = docClient
  }

  async initialize() {
    const { TableName } = this.config
    try {
      // Check if the table already exists... return true if so
      const data = await dynamodb
        .waitFor('tableExists', { TableName })
        .promise()
      console.log('Found subscriber table: ', data)
      return true
    } catch (err) {
      console.log('Failed to find table: ', err)
      try {
        // Table doesn't exist attempt to create it...
        dynamodb.createTable(this.config, (err, data) => {
          if (err) {
            console.error(
              'Unable to create subscriber table.',
              JSON.stringify(err, null, 2)
            )
          } else {
            console.log(
              'Created subscriber table. Description: ',
              JSON.stringify(data, null, 2)
            )
          }
        })
        // wait for it...
        await dynamodb.waitFor('tableExists', { TableName }).promise()
        return true
      } catch (err) {
        console.log(
          `Failed to initialize SubscriberTable with name ${TableName}`,
          err
        )
        throw err
      }
    }
  }

  async get(email) {
    const { TableName } = this.config
    try {
      const { Item } = await docClient
        .get({
          TableName,
          Key: {
            email,
          },
        })
        .promise()

      console.log(
        `Retrieved subscriber: ${email} from table: ${TableName} :: `,
        JSON.stringify(Item, null, 2)
      )
      return Item
    } catch (err) {
      console.log(
        `Failed to retrieve subscriber: ${email} from table: ${TableName}`,
        err
      )
      throw err
    }
  }

  async list() {
    const { TableName } = this.config
    try {
      const data = await docClient
        .scan({
          TableName,
        })
        .promise()

      return data.Items
    } catch (err) {
      throw err
    }
  }

  async put({ email, ...subscription }) {
    const { TableName } = this.config
    if (!email) {
      throw new Error('Email must be provided for subscription to be created.')
    }

    try {
      const data = await docClient
        .put({
          TableName,
          Item: {
            email,
            ...subscription,
          },
        })
        .promise()

      console.log(
        `Added subscription for email: ${email} to table: ${TableName}`
      )
      return
    } catch (err) {
      console.log(
        `Failed to add subscription for: ${email} to table: ${TableName}`,
        err
      )
      throw err
    }
  }

  async delete(email) {
    const { TableName } = this.config
    if (!email) {
      throw new Error('Email must be provided for subscription to be created.')
    }

    try {
      const data = await docClient
        .delete({
          TableName,
          Key: {
            email,
          },
        })
        .promise()

      console.log(
        `Deleted subscription for email: ${email} in table: ${TableName}`
      )
      return
    } catch (err) {
      console.log(
        `Failed to delete subscription for: ${email} in table: ${TableName}`,
        err
      )
      throw err
    }
  }
}

export default SubscriptionTable
