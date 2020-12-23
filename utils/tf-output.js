const util = require('util')
const fs = require('fs')
const path = require('path')
const exec = util.promisify(require('child_process').exec)

const outputFileName = '.tfoutput.json'

function outputFileExists(filePath) {
  let flag = true
  try {
    fs.accessSync(filePath, fs.constants.F_OK)
  } catch (err) {
    flag = false
  }
  return flag
}

function readOutputFile(filePath) {
  const outputFile = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(outputFile)
}

async function writeOutputFile(dirPath, writePath) {
  const { stdout, stderr } = await exec(
    `terraform -chdir=${dirPath}/ output -json > ${writePath}`
  )
  if (stderr) {
    console.error('Failed to retrieve terraform output key')
    throw err
  }
}

async function terraform_output(environment, key) {
  const dirPath = path.resolve(__dirname, '../tf', environment)
  const filePath = path.resolve(dirPath, outputFileName)
  if (!outputFileExists()) {
    await writeOutputFile(dirPath, filePath)
  }
  const output = readOutputFile(filePath)
  return output[key]
}

module.exports.api_gateway_id = terraform_output('common', 'api_gateway_id')
module.exports.api_gateway_resource_id = terraform_output(
  'common',
  'api_gateway_resource_id'
)
module.exports.photos_service_lambda_role_arn = terraform_output(
  'common',
  'photos_service_lambda_role_arn'
)
module.exports.newsletter_service_lambda_role_arn = terraform_output(
  'common',
  'newsletter_service_lambda_role_arn'
)
module.exports.kms_arn = terraform_output('common', 'kms_arn')
