import chalk from 'chalk'

import { sep, isAbsolute, basename } from 'node:path'

import { Command } from '@athenna/artisan'
import { Folder, Path } from '@secjs/utils'

import { NotEmptyFolderException } from '#app/Exceptions/NotEmptyFolderException'
import { NotFoundProjectTypeException } from '#app/Exceptions/NotFoundProjectTypeException'

export class NewCommand extends Command {
  /**
   * The name and signature of the console command.
   */
  get signature() {
    return 'new <projectName>'
  }

  /**
   * The console command description.
   */
  get description() {
    return 'Scaffold a new Athenna project.'
  }

  /**
   * The repository url to clone the project.
   *
   * @type {string}
   */
  get url() {
    return 'https://github.com/AthennaIO/Scaffold.git'
  }

  /**
   * Set additional flags in the commander instance.
   * This method is executed when registering your command.
   *
   * @param {import('@athenna/artisan').Commander} commander
   * @return {import('@athenna/artisan').Commander}
   */
  addFlags(commander) {
    return commander.option(
      '-t, --type <type>',
      'Current types available: http, cli and slim.',
      'http',
    )
  }

  /**
   * Execute the console command.
   *
   * @param {string} projectName
   * @param {any} options
   * @return {Promise<void>}
   */
  async handle(projectName, options) {
    this.log(this.createRainbow('Athenna'))

    await Folder.safeRemove(Path.storage())
    await new Folder(Path.storage()).load()

    if (!this[options.type]) {
      throw new NotFoundProjectTypeException(options.type)
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
    this.title('GENERATING HTTP SERVER\n', 'bold', 'green')

    await this.cloneByBranch('http', projectName)

    const arrow = chalk.bold.green('❯')

    this.log(
      this.createTable(
        {},
        ['    Run following commands to get started'],
        [
          `    ${arrow} cd ${projectName}\n    ${arrow} npm test\n    ${arrow} npm start\n    ${arrow} npm run start:dev`,
        ],
      ),
    )
  }

  /**
   * The new:project -t cli command handler.
   *
   * @param {string} projectName
   * @return {Promise<void>}
   */
  async cli(projectName) {
    this.title('GENERATING CLI\n', 'bold', 'green')

    await this.cloneByBranch('cli', projectName)

    const arrow = chalk.bold.green('❯')

    this.log(
      this.createTable(
        {},
        ['    Run following commands to get started'],
        [
          `    ${arrow} cd ${projectName}\n    ${arrow} npm test\n    ${arrow} npm start -- --help`,
        ],
      ),
    )
  }

  /**
   * The new:project -t slim command handler.
   *
   * @param {string} projectName
   * @return {Promise<void>}
   */
  async slim(projectName) {
    this.title('GENERATING SLIM\n', 'bold', 'green')

    await this.cloneByBranch('slim', projectName)

    const arrow = chalk.bold.green('❯')

    this.log(
      this.createTable(
        {},
        ['    Run following commands to get started'],
        [`    ${arrow} cd ${projectName}\n    ${arrow} npm start -- --help`],
      ),
    )
  }

  /**
   * Clone the project by branch.
   *
   * @param branch {string}
   * @param projectName {string}
   * @return {Promise<void>}
   */
  async cloneByBranch(branch, projectName) {
    let projectPath = Path.storage(`project/${projectName}`)
    let concretePath = `${Env('CALL_PATH')}${sep}${projectName}`

    if (isAbsolute(projectName)) {
      projectPath = Path.storage(`project/${basename(projectName)}`)
      concretePath = projectName
    }

    if (await Folder.exists(concretePath)) {
      throw new NotEmptyFolderException(concretePath)
    }

    const cloneCommand = `git clone --branch ${branch} ${this.url} ${projectPath}`
    const moveProjectCommand = `mv ${projectPath} ${concretePath}`
    const runNpmInstallCommand = `cd ${concretePath} && npm install --silent`
    const rmGitAndCopyEnv = `cd ${concretePath} && rm -rf .git && rm -rf .github && cp .env.example .env && cp .env.example .env.test`

    await this.execCommand(
      cloneCommand,
      `Cloning scaffold project from ${this.url} in branch ${branch}`,
    )
    await this.execCommand(moveProjectCommand, 'Moving project to your path')
    await this.execCommand(runNpmInstallCommand, 'Installing dependencies')
    await this.execCommand(
      rmGitAndCopyEnv,
      'Removing defaults and creating .env/.env.test files from .env.example',
    )

    console.log()

    this.success(`Project created at ({yellow} "${projectName}") folder.`)
  }
}
