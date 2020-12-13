import config from './config'
import AWS from 'aws-sdk'
AWS.config.update({ region: config.aws.region })

// Decryption using the Key Management Store
const kms = new AWS.KMS()
const decrypted = {}
export async function decryptSecret(secretName) {
  if (decrypted[secretName]) {
    console.log('returning cached ' + secretName)
    return decrypted[secretName]
  }
  console.log('decrypting ' + secretName)
  try {
    const req = {
      CiphertextBlob: Buffer.from(process.env[secretName], 'base64'),
    }
    const data = await kms.decrypt(req).promise()
    const decryptedVal = data.Plaintext.toString('utf-8')
    decrypted[secretName] = decryptedVal
    return decryptedVal
  } catch (err) {
    console.log('decrypt error:', err)
    throw err
  }
}

const s3 = new AWS.S3()
export async function getS3JsonAsObject(bucket, bucketFileName) {
  let params = {
    Bucket: bucket,
    Key: bucketFileName,
  }

  const data = await s3.getObject(params).promise()
  return JSON.parse(data.Body.toString('utf-8'))
}

export async function storeJsonObjectToS3(bucket, bucketFileName, jsonString) {
  let params = {
    Bucket: bucket,
    Key: bucketFileName,
    Body: jsonString,
  }
  return new Promise((resolve, reject) => {
    s3.putObject(params, (error, data) => {
      if (error) {
        return reject(error)
      }

      return resolve(data)
    })
  })
}
