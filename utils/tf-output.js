const { promises: fs, constants: fsConstants, readFileSync } = require('fs')
const path = require('path')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const tfDir = path.resolve(__dirname, '../tf/')
const tfOutputFileName = '.tfoutput.json'

async function subDirs(parentDir) {
  const dir = await fs.readdir(parentDir, { withFileTypes: true })
  const subDirs = dir
    .filter((entity) => entity.isDirectory())
    .map((entity) => entity.name)
  return subDirs
}

async function outputFileExists(filePath) {
  let flag = true
  try {
    await fs.access(filePath, fsConstants.F_OK)
  } catch (err) {
    flag = false
  }
  return flag
}

async function readOutputFile(filePath) {
  const outputFile = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(outputFile)
}

function flattenOutputValues(output) {
  return Object.fromEntries(
    Object.entries(output).map(([key, obj]) => {
      return [key, obj.value]
    })
  )
}

async function writeOutputFile(dirPath, writePath) {
  const { stderr } = await exec(
    `terraform -chdir=${dirPath}/ output -json > ${writePath}`
  )
  if (stderr) {
    console.error('Failed to retrieve terraform output key')
    throw err
  }
  const outputFile = await readOutputFile(writePath)
  return outputFile
}

async function getTfOutputs(tfDir) {
  /*
  1. Attempt to read json files if they exist
  2. Catch by Writing the json files if they don't exist
  3. Finally read the json output files
  3. return the envs output from the file
  */

  const tfEnvs = await subDirs(tfDir)
  try {
    const outputPromises = tfEnvs.map(async (env) => {
      const tfDirPath = path.resolve(tfDir, env)
      const outputFilePath = path.resolve(
        tfDirPath.toString(),
        tfOutputFileName
      )
      let tfOutput
      try {
        tfOutput = await readOutputFile(outputFilePath)
      } catch (err) {
        try {
          tfOutput = await writeOutputFile(tfDirPath, outputFilePath)
        } catch (err) {
          throw err
        }
      }
      return [env, flattenOutputValues(tfOutput)]
    })
    let outputs = await Promise.all(outputPromises)

    return Object.fromEntries(outputs)
  } catch (err) {
    console.log(
      'tf-output: Failed to read/write terraform outputs.  Resorting to returning undefined'
    )
    console.error(err)
    return undefined
  }
}

function readOutputJsonSync(environment, outputKey) {
  try {
    const outputFilePath = path.resolve(tfDir, environment, tfOutputFileName)
    const outputFile = readFileSync(outputFilePath, 'utf-8')

    return flattenOutputValues(JSON.parse(outputFile))[outputKey]
  } catch (err) {
    console.log(
      'tf-output: Failed to read/write terraform outputs.  Resorting to returning undefined'
    )
    console.error(err)
    return undefined
  }
}

module.exports = {
  read: getTfOutputs(tfDir),
  readSync: readOutputJsonSync,
}
