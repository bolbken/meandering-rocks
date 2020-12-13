import AWS from 'aws-sdk'
import config from './config'
AWS.config.update({ region: config.aws.region })

const dynamodb = new AWS.DynamoDB()
const docClient = new AWS.DynamoDB.DocumentClient()

const defaultSchema = {
  oAuthSchema: {
    TableName: 'GoogleOAuthCredentials',
    KeySchema: [
      { AttributeName: 'app', KeyType: 'HASH' }, // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'clientId', AttributeType: 'S' },
      { AttributeName: 'clientSecret', AttributeType: 'S' },
      { AttributeName: 'token', AttributeType: 'S' },
      { AttributeName: 'expiryDate', AttributeType: 'S' },
      { AttributeName: 'refreshToken', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  },
}

class OAuthKeysTable {
  constructor() {
    this.config = defaultSchema.oAuthSchema
    this.createTable()
  }

  async initialize() {
    dynamodb.createTable(this.config, (err, data) => {
      if (err) {
        console.error('Unable to create table.', JSON.stringify(err, null, 2))
      } else {
        console.log(
          'Created table. Table description: ',
          JSON.stringify(data, null, 2)
        )
      }
    })
  }

  async setOAuthCreds(appName, creds) {
    docClient.put(
      {
        TableName: this.config.TableName,
        Item: {
          ...creds,
        },
      },
      (err, data) => {
        if (err) {
          throw err
        } else {
          console.log(
            `Added item to table ${this.config.TableName}:`,
            JSON.stringify(data, null, 2)
          )
        }
      }
    )
  }

  async getOAuthCreds(app) {
    return docClient.get(
      {
        TableName: this.config.TableName,
        Key: {
          app,
        },
      },
      (err, data) => {
        if (err) {
          throw err
        } else {
          console.log(
            `Retrieved DB Item '${app}' from ${this.config.TableName} table`,
            JSON.stringify(data, null, 2)
          )
        }
      }
    )
  }

  async updateToken(app, creds) {
    docClient.update(
      {
        TableName: this.config.TableName,
        Key: {
          app,
        },
        UpdateExpression: 'set token=:t, expiryDate=:e, refreshToken=:r',
        ExpressionAttributeValues: {
          ':t': creds.token,
          ':e': creds.expiryDate,
          ':r': creds.refreshToken,
        },
        ReturnValues: 'UPDATED_NEW',
      },
      (err, data) => {
        if (err) {
          console.error(
            'Unable to update item. Error JSON:',
            JSON.stringify(err, null, 2)
          )
          throw err
        } else {
          console.log('Update Token succeeded:', JSON.stringify(data, null, 2))
        }
      }
    )
  }
}

export const OAuthKeysTable
