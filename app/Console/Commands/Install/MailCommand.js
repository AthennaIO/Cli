/**
 * @athenna/cli
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { File, Path } from '@athenna/common'
import { Command, FilePropertiesHelper } from '@athenna/artisan'

export class InstallMailCommand extends Command {
  /**
   * The name and signature of the console command.
   */
  get signature() {
    return 'install:mail'
  }

  /**
   * The console command description.
   */
  get description() {
    return 'Install the mail component in your Athenna application.'
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
      '--no-lint',
      'Do not run eslint in the command.',
      true,
    )
  }

  /**
   * Execute the console command.
   *
   * @param {any} options
   * @return {Promise<void>}
   */
  async handle(options) {
    this.log(this.createRainbow('Athenna'))

    this.title('INSTALLING MAIL COMPONENT\n', 'bold', 'green')

    const projectPath = `${Env('CALL_PATH')}`

    await this.installAthennaMailPackage(projectPath)
    await this.createMailConfigFile(projectPath)
    await this.addMailProviderToAppConfig(projectPath)
    await this.addEnvVarsToEnvFile(projectPath)

    if (options.lint) {
      await this.lintProject(projectPath)
    }

    console.log()

    this.success('Athenna mail component successfully installed.')
  }

  async installAthennaMailPackage(projectPath) {
    const cdCommand = `cd ${projectPath}`
    const npmInstallCommand = `${cdCommand} && npm install @athenna/mail --production=false`

    await this.execCommand(
      npmInstallCommand,
      `Installing @athenna/mail package in your project`,
    )
  }

  async createMailConfigFile(projectPath) {
    const mailConfigFile = `${projectPath}/config/mail.${Path.ext()}`
    const message = `Creating config/mail.${Path.ext()} file in project`

    const spinner = this.createSpinner(message)

    if (message) {
      spinner.color = 'yellow'

      spinner.start()
    }

    try {
      await new File(
        Path.resources(`scaffolds/mailComponent/config/mail.${Path.ext()}`),
      )
        .loadSync()
        .copy(mailConfigFile)

      if (message) spinner.succeed(message)
    } catch (err) {
      if (message) spinner.fail(message)

      throw err
    }
  }

  async addMailProviderToAppConfig(projectPath) {
    const appConfigPath = `${projectPath}/config/app.${Path.ext()}`
    const message = `Registering MailProvider in config/app.${Path.ext()}`

    const spinner = this.createSpinner(message)

    if (message) {
      spinner.color = 'yellow'

      spinner.start()
    }

    try {
      await FilePropertiesHelper.addContentToArrayProperty(
        appConfigPath,
        'providers: ',
        "import('@athenna/mail/providers/MailProvider')",
      )

      if (message) spinner.succeed(message)
    } catch (err) {
      if (message) spinner.fail(message)

      throw err
    }
  }

  async addEnvVarsToEnvFile(projectPath) {
    const envFilePath = `${projectPath}/.env`
    const envTestFilePath = `${projectPath}/.env.test`
    const envExampleFilePath = `${projectPath}/.env.example`
    const message =
      'Registering env variables in .env, .env.test and .env.example files.'

    const spinner = this.createSpinner(message)

    if (message) {
      spinner.color = 'yellow'

      spinner.start()
    }

    const envVars =
      '\nMAIL_MAILER=smtp\n' +
      'MAIL_HOST=127.0.0.1\n' +
      'MAIL_PORT=587\n' +
      'MAIL_USERNAME=\n' +
      'MAIL_PASSWORD=\n'

    try {
      await (await new File(envFilePath).load()).append(envVars)
      await (await new File(envTestFilePath).load()).append(envVars)
      await (await new File(envExampleFilePath).load()).append(envVars)

      if (message) spinner.succeed(message)
    } catch (err) {
      if (message) spinner.fail(message)

      throw err
    }
  }

  async lintProject(projectPath) {
    const message = 'Linting project'

    const spinner = this.createSpinner(message)

    if (message) {
      spinner.color = 'yellow'

      spinner.start()
    }

    try {
      await this.execCommand(
        `cd ${projectPath} && npm run lint:fix --silent -- --quiet`,
      )

      if (message) spinner.succeed(message)
    } catch (err) {
      if (message) spinner.fail(message)

      throw err
    }
  }
}
