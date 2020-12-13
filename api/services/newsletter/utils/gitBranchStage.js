import { exec } from 'child_process'
import config from '../../../config.json'

export default function gitBranchStage() {
  let branch
  exec('git branch --show-current', (err, stdout, stderr) => {
    if (err) {
      console.log('Cannot retrieve git branch.  ', err)
    }
    branch = stdout
  })

  if (config.git_branch_stage[branch]) {
    return config.git_branch_stage[branch]
  } else {
    return config.git_branch_stage.dev
  }
}
