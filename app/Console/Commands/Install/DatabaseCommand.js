import { File, Path } from '@secjs/utils'
import { Command, FilePropertiesHelper } from '@athenna/artisan'

export class InstallTestCommand extends Command {
  /**
   * Resolve any dependency of the service container
   * inside the constructor.
   */
  constructor() {
    super()
  }

  /**
   * The name and signature of the console command.
   */
  get signature() {
    return 'install:database'
  }

  /**
   * The console command description.
   */
  get description() {
    return 'Install the database component in your Athenna application.'
  }

  /**
   * Set additional flags in the commander instance.
   * This method is executed when registering your command.
   *
   * @param {import('@athenna/artisan').Commander} commander
   * @return {import('@athenna/artisan').Commander}
   */
  addFlags(commander) {
    return commander
  }

  /**
   * Execute the console command.
   *
   * @param {any} options
   * @return {Promise<void>}
   */
  async handle(options) {
    this.log(this.createRainbow('Athenna'))

    this.title('INSTALLING DATABASE COMPONENT\n', 'bold', 'green')

    const projectPath = `${Env('CALL_PATH')}`

    await this.installDatabasePackage(projectPath)
    await this.createDatabaseConfigFile(projectPath)
    await this.addDatabaseProviderToAppConfig(projectPath)
    await this.addDatabaseCommandsToKernel(projectPath)

    console.log()

    this.success('Athenna database component successfully installed.')
  }

  async installDatabasePackage(projectPath) {
    const cdCommand = `cd ${projectPath}`
    const npmInstallCommand = `${cdCommand} && npm install @athenna/database`

    await this.execCommand(
      npmInstallCommand,
      `Installing @athenna/database package in your project`,
    )
  }

  async createDatabaseConfigFile(projectPath) {
    const databaseConfigFile = `${projectPath}/config/database.js`
    const message = 'Creating config/database.js file in project'

    const spinner = this.createSpinner(message)

    if (message) {
      spinner.color = 'yellow'

      spinner.start()
    }

    try {
      await new File(
        Path.resources('scaffolds/databaseComponent/config/database.js'),
      )
        .loadSync()
        .copy(databaseConfigFile)

      if (message) spinner.succeed(message)
    } catch (err) {
      if (message) spinner.fail(message)

      throw err
    }
  }

  async addDatabaseProviderToAppConfig(projectPath) {
    const appConfigPath = `${projectPath}/config/app.js`
    const message = 'Registering DatabaseProvider in config/app.js'

    const spinner = this.createSpinner(message)

    if (message) {
      spinner.color = 'yellow'

      spinner.start()
    }

    try {
      await FilePropertiesHelper.addContentToArrayProperty(
        appConfigPath,
        'providers: ',
        "import('@athenna/database/providers/DatabaseProvider')",
      )

      if (message) spinner.succeed(message)
    } catch (err) {
      if (message) spinner.fail(message)

      throw err
    }
  }

  async addDatabaseCommandsToKernel(projectPath) {
    const kernelPath = `${projectPath}/app/Console/Kernel.js`
    const message = 'Registering commands and templates in Console/Kernel.js'

    const spinner = this.createSpinner(message)

    if (message) {
      spinner.color = 'yellow'

      spinner.start()
    }

    try {
      const consoleKernel = await new File(kernelPath).load()

      await consoleKernel.prepend(
        "import { DatabaseCommandsLoader } from '@athenna/database'\n",
      )

      await FilePropertiesHelper.addContentToArrayProperty(
        kernelPath,
        'const internalCommands = ',
        '...DatabaseCommandsLoader.loadCommands()',
      )

      await FilePropertiesHelper.addContentToArrayGetter(
        kernelPath,
        'templates',
        '...DatabaseCommandsLoader.loadTemplates()',
      )

      if (message) spinner.succeed(message)
    } catch (err) {
      if (message) spinner.fail(message)

      throw err
    }
  }
}
