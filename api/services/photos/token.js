import { storeJsonObjectToS3, getS3JsonAsObject } from './aws-utils'
import config from './config'
import fs from 'fs'

const { s3BucketName, s3BucketFileName } = config.googleOAuthToken
const localTokenFilePath = `/tmp/${s3BucketFileName}`

async function save(token) {
  const tokenStr = JSON.stringify(token)
  const s3_response = await storeJsonObjectToS3(
    s3BucketName,
    s3BucketFileName,
    tokenStr
  )

  await new Promise((resolve, reject) => {
    fs.writeFile(localTokenFilePath, tokenStr, (err) => {
      if (err) {
        console.log('Failed to save token JSON file to /tmp directory.')
        console.log('ERR:  ', err)
      }
      resolve()
    })
  })

  return s3_response
}

async function retrieve() {
  let token
  try {
    token = await new Promise((resolve, reject) => {
      fs.readFile(localTokenFilePath, 'utf8', (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(JSON.parse(data))
        }
      })
    })
  } catch (err) {
    console.log('Failed to retrieve token from local cache.')
    console.log('ERR:  ', err)

    console.log('Falling back to pull token from s3.')
    try {
      token = await getS3JsonAsObject(s3BucketName, s3BucketFileName)
    } catch (err) {
      console.log('Failed to retrieve token from s3.')
      console.log('ERR:  ', err)
      throw err
    }
  }

  return token
}

export default { save, retrieve }
