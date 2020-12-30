import { storeJsonObjectToS3, getS3JsonAsObject } from './aws-utils'
import config from './config'
import fs from 'fs'

const { s3BucketName, s3BucketPath, s3BucketFileName } = config.googleOAuthToken
const localTokenFilePath = `/tmp/${s3BucketFileName}`

async function save(token) {
  const tokenStr = JSON.stringify(token)
  let isTokenSavedS3 = false
  try {
    const s3_response = await storeJsonObjectToS3(
      s3BucketName,
      `${s3BucketPath}/${s3BucketFileName}`,
      tokenStr
    )
    isTokenSavedS3 = true
  } catch (err) {
    console.log(
      `Failed to save token JSON file to s3 location: s3://${s3BucketName}/${s3BucketPath}/${s3BucketFileName}`
    )
    console.error(err)
    isTokenSavedS3 = false
  }

  try {
    await new Promise((resolve, reject) => {
      fs.writeFile(localTokenFilePath, tokenStr, (err) => {
        err ? reject(err) : resolve()
      })
    })
  } catch (err) {
    console.log(
      `Failed to save token JSON file to /tmp directory location: tmp/${s3BucketFileName}`
    )
    console.error(err)

    if (!isTokenSavedS3) {
      console.warn(
        'Failed to save fresh token to local or s3 location.  Future google oAuth Token may be stale.'
      )
    }

    return
  }

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
    console.error(err)

    console.log('Falling back to pull token from s3.')
    try {
      token = await getS3JsonAsObject(s3BucketName, s3BucketFileName)
    } catch (err) {
      console.log('Failed to retrieve token from s3.')
      console.error(err)

      console.error(
        'Unable to retrieve google oAuth token from all know sources.'
      )
      throw err
    }
  }

  return token
}

export default { save, retrieve }
