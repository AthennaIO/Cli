/**
 * @athenna/cli
 *
 * (c) Victor Tesoura Júnior <txsoura@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import chalk from 'chalk'
import Table from 'cli-table'

import { sep } from 'node:path'
import { Logger } from '@athenna/logger'
import { Folder, Path } from '@secjs/utils'

import { CliHelper } from '#src/Helpers/CliHelper'

export class New {
  /**
   * The logger instance.
   *
   * @type {Logger}
   */
  #logger

  /**
   * The path where the cli were called.
   *
   * @type {string}
   */
  #callPath

  /**
   * The repository url to clone the project.
   *
   * @type {string}
   */
  #repositoryUrl

  /**
   * Creates a new instance of New.
   *
   * @param {string} callPath
   */
  constructor(callPath) {
    this.#callPath = callPath

    this.#logger = new Logger()

    this.#repositoryUrl = 'https://github.com/AthennaIO/Scaffold.git'
  }

  /**
   * The new:project command handler.
   *
   * @param {string} projectName
   * @param {any} options
   * @return {Promise<void>}
   */
  async project(projectName, options) {
    await new Folder(Path.storage()).load()

    if (!this[options.type]) {
      this.#logger.error(
        `The project type ({yellow} "${options.type}") doesnt exist. Try running ({yellow} "athenna new:project --help") to see the available project types.`,
      )

      return
    }

    await this[options.type](projectName)

    await Folder.safeRemove(Path.storage())
  }

  /**
   * The new:project -t http command handler.
   *
   * @param {string} projectName
   * @return {Promise<void>}
   */
  async http(projectName) {
    console.log(chalk.bold.green('[ GENERATING HTTP SERVER ]\n'))

    const projectPath = Path.storage(`project/${projectName}`)
    const concretePath = `${this.#callPath}${sep}${projectName}`

    if (await Folder.exists(concretePath)) {
      this.#logger.error(
        `The directory ({yellow} "${projectName}") already exists. Try another project name.`,
      )

      return
    }

    const cdCommand = `cd ${projectPath}`
    const cloneCommand = `git clone --branch http ${
      this.#repositoryUrl
    } ${projectPath}`
    const runNpmInstallCommand = `${cdCommand} && npm install --silent`
    const rmGitAndCopyEnv = `${cdCommand} && rm -rf .git && rm -rf .github && cp .env.example .env && cp .env.example .env.test`
    const moveProjectCommand = `mv ${projectPath} ${concretePath}`

    await CliHelper.runCommand(
      cloneCommand,
      `Cloning scaffold project from ${this.#repositoryUrl} in branch http`,
    )

    await CliHelper.runCommand(
      rmGitAndCopyEnv,
      'Removing defaults and creating .env/.env.test files from .env.example',
    )

    await CliHelper.runCommand(runNpmInstallCommand, 'Installing dependencies')
    await CliHelper.runCommand(
      moveProjectCommand,
      'Moving project to your path',
    )

    console.log('\n')
    this.#logger.success(
      `Project created at ({yellow} "${projectName}") folder.`,
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

  /**
   * The new:project -t cli command handler.
   *
   * @param {string} projectName
   * @return {Promise<void>}
   */
  async cli(projectName) {
    console.log(chalk.bold.green('[ GENERATING CLI ]\n'))

    const projectPath = Path.storage(`project/${projectName}`)
    const concretePath = `${this.#callPath}${sep}${projectName}`

    if (await Folder.exists(concretePath)) {
      this.#logger.error(
        `The directory ({yellow} "${projectName}") already exists. Try another project name.`,
      )

      return
    }

    const cdCommand = `cd ${projectPath}`
    const cloneCommand = `git clone --branch cli ${
      this.#repositoryUrl
    } ${projectPath}`
    const runNpmInstallCommand = `${cdCommand} && npm install --silent`
    const rmGitAndCopyEnv = `${cdCommand} && rm -rf .git && rm -rf .github && cp .env.example .env && cp .env.example .env.test`
    const moveProjectCommand = `mv ${projectPath} ${concretePath}`

    await CliHelper.runCommand(
      cloneCommand,
      `Cloning scaffold project from ${this.#repositoryUrl} in branch cli`,
    )

    await CliHelper.runCommand(
      rmGitAndCopyEnv,
      'Removing defaults and creating .env/.env.test files from .env.example',
    )

    await CliHelper.runCommand(runNpmInstallCommand, 'Installing dependencies')
    await CliHelper.runCommand(
      moveProjectCommand,
      'Moving project to your path',
    )

    console.log('\n')
    this.#logger.success(
      `Project created at ({yellow} "${projectName}") folder.`,
    )

    const table = new Table()

    const arrow = chalk.bold.green('❯')

    table.push(
      ['    Run following commands to get started'],
      [
        `    ${arrow} cd ${projectName}\n    ${arrow} npm run test\n    ${arrow} npm run start\n    ${arrow} npm run start:dev -- --help`,
      ],
    )

    console.log(`\n${table.toString()}`)
  }
}
