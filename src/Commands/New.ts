/**
 * @athenna/cli
 *
 * (c) Victor Tesoura Júnior <txsoura@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { resolve } from 'path'
import { promisify } from 'util'
import { Path } from '@secjs/utils'
import { Logger } from '@athenna/logger'

const exec = promisify(require('child_process').exec)

export class New {
  private readonly logger: Logger
  private readonly repositoryUrl: string

  public constructor() {
    this.logger = new Logger()
    this.repositoryUrl = 'https://github.com/AthennaIO/Scaffold.git'
  }

  async project(projectName): Promise<void> {
    const clientFolder = process.cwd()

    /**
     * Change all process.cwd commands to return the
     * root path where @athenna/cli is stored
     */
    process.chdir(resolve(__dirname, '..', '..'))

    const projectPath = Path.storage(`project/${projectName}`)
    const concretePath = `${clientFolder}/${projectName}`

    this.logger.success('[RUNNING TASKS]\n')

    const cdCommand = `cd ${projectPath}`
    const cloneCommand = `git clone ${this.repositoryUrl} ${projectPath}`
    const runNpmInstallCommand = `${cdCommand} && npm install --silent`
    const rmGitAndCopyEnv = `${cdCommand} && rm -rf .git && rm -rf .github && cp .env.example .env`
    const moveProjectCommand = `${cdCommand} && mv ${projectPath} ${concretePath}`

    await this.runCommand(
      cloneCommand,
      `❯ Cloning scaffold project from ${this.repositoryUrl}`,
    )

    await this.runCommand(
      rmGitAndCopyEnv,
      '❯ Removing defaults and creating .env file from .env.example',
    )

    await this.runCommand(runNpmInstallCommand, '❯ Installing dependencies')
    await this.runCommand(moveProjectCommand)

    this.logger.error(`❯ Project created at ${concretePath}`)
    this.logger.success('[DONE]\n')
  }

  private async runCommand(command: string, log?: string) {
    if (log) {
      console.log(log)
    }

    await exec(command)
  }
}
