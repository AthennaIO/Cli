/**
 * @athenna/cli
 *
 * (c) Victor Tesoura Júnior <txsoura@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ora from 'ora'
import chalk from 'chalk'
import Table from 'cli-table'
import { resolve, sep } from 'path'
import { existsSync } from 'fs'
import { promisify } from 'util'
import { Logger } from '../Utils/Logger'
import { Folder, Path } from '@secjs/utils'
import { NodeExecException } from '../Exceptions/NodeExecException'

const exec = promisify(require('child_process').exec)

export class New {
  private readonly logger: Logger
  private readonly clientFolder: string
  private readonly repositoryUrl: string

  public constructor() {
    this.clientFolder = process.cwd()
    this.logger = new Logger()

    /**
     * Change all process.cwd commands to return the
     * root path where @athenna/cli is stored
     */
    process.chdir(resolve(__dirname, '..', '..'))

    this.repositoryUrl = 'https://github.com/AthennaIO/Scaffold.git'
  }

  async project(projectName): Promise<void> {
    this.logger.success.bold.log('[ RUNNING TASKS ]\n')

    await Folder.safeRemove(Path.storage())
    await new Folder(Path.storage()).create()

    const projectPath = Path.storage(`project/${projectName}`)
    const concretePath = `${this.clientFolder}${sep}${projectName}`

    if (existsSync(concretePath)) {
      console.log(
        `${chalk.bold.red(
          '[ error ]',
        )} The folder ${projectName} already exists. Try another project name`,
      )

      return
    }

    const cdCommand = `cd ${projectPath}`
    const cloneCommand = `git clone ${this.repositoryUrl} ${projectPath}`
    const runNpmInstallCommand = `${cdCommand} && npm install --silent`
    const rmGitAndCopyEnv = `${cdCommand} && rm -rf .git && rm -rf .github && cp .env.example .env`
    const moveProjectCommand = `${
      sep === '/' ? 'mv' : 'move'
    } ${projectPath} ${concretePath}`

    await this.runCommand(
      cloneCommand,
      `Cloning scaffold project from ${this.repositoryUrl}`,
    )

    await this.runCommand(
      rmGitAndCopyEnv,
      'Removing defaults and creating .env file from .env.example',
    )

    await this.runCommand(runNpmInstallCommand, 'Installing dependencies')
    await this.runCommand(moveProjectCommand, 'Moving project to your path')

    console.log(
      `\n${chalk.bold.green(
        '[ success ]',
      )} Project created at ${projectName} folder`,
    )

    const table = new Table()

    const arrow = chalk.bold.green('❯')

    table.push(
      ['    Run following commands to get started'],
      [
        `    ${arrow} cd ${projectName}\n    ${arrow} npm run test\n    ${arrow} npm run start\n    ${arrow} npm run start:dev`,
      ],
    )

    console.log(`\n${table.toString()}`)
  }

  private async runCommand(command: string, log?: string) {
    const spinner = ora(log)

    if (log) {
      spinner.color = 'yellow'

      spinner.start()
    }

    try {
      await exec(command)

      spinner.succeed(log)
    } catch (err) {
      console.log(err.name)
      console.log(err.message)
      console.log(err.stack)
      spinner.fail(log)

      throw new NodeExecException(command)
    }
  }
}
