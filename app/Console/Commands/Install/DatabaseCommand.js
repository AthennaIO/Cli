import { File, Path } from '@athenna/common'
import { Command, FilePropertiesHelper } from '@athenna/artisan'
import { NotFoundDatabaseException } from '#app/Exceptions/NotFoundDatabaseException'

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
      .option('--no-lint', 'Do not run eslint in the command.', true)
      .option(
        '--db <db>',
        'Set the database to be configured in project. Current databases available: mysql and postgres.',
        'postgres',
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

    this.title('INSTALLING DATABASE COMPONENT\n', 'bold', 'green')

    const availableDatabases = ['mysql', 'postgres']

    if (!availableDatabases.includes(options.db)) {
      throw new NotFoundDatabaseException(options.db)
    }

    const projectPath = `${Env('CALL_PATH')}`

    await this.installDatabasePackage(projectPath, options.db)
    await this.installAthennaDBPackage(projectPath)
    await this.createDatabaseConfigFile(projectPath, options.db)
    await this.addDatabaseProviderToAppConfig(projectPath)
    await this.addDatabaseCommandsToKernel(projectPath)
    await this.addEnvVarsToEnvFile(projectPath, options.db)
    await this.createDockerComposeFile(projectPath, options.db)

    if (options.lint) {
      await this.lintProject(projectPath)
    }

    console.log()

    this.success('Athenna database component successfully installed.')
  }

  async installDatabasePackage(projectPath, db) {
    const dictionary = {
      mysql: 'mysql2',
      postgres: 'pg',
    }

    const cdCommand = `cd ${projectPath}`
    const npmInstallCommand = `${cdCommand} && npm install ${dictionary[db]} --production=false`

    await this.execCommand(
      npmInstallCommand,
      `Installing ${dictionary[db]} package in your project`,
    )
  }

  async installAthennaDBPackage(projectPath) {
    const cdCommand = `cd ${projectPath}`
    const npmInstallCommand = `${cdCommand} && npm install @athenna/database --production=false`

    await this.execCommand(
      npmInstallCommand,
      `Installing @athenna/database package in your project`,
    )
  }

  async createDatabaseConfigFile(projectPath, db) {
    const databaseConfigFile = `${projectPath}/config/database.js`
    const message = 'Creating config/database.js file in project'

    const spinner = this.createSpinner(message)

    if (message) {
      spinner.color = 'yellow'

      spinner.start()
    }

    try {
      await new File(
        Path.resources(`scaffolds/databaseComponent/${db}/config/database.js`),
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
        "import { DatabaseLoader } from '@athenna/database'\n",
      )

      await FilePropertiesHelper.addContentToArrayProperty(
        kernelPath,
        'const internalCommands = ',
        '...DatabaseLoader.loadCommands()',
      )

      await FilePropertiesHelper.addContentToArrayGetter(
        kernelPath,
        'templates',
        '...DatabaseLoader.loadTemplates()',
      )

      if (message) spinner.succeed(message)
    } catch (err) {
      if (message) spinner.fail(message)

      throw err
    }
  }

  async addEnvVarsToEnvFile(projectPath, db) {
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

    const dbPort = {
      mysql: '(3306)',
      postgres: '(5432)',
    }

    const envVars =
      `\nDB_CONNECTION=${db}\n` +
      'DB_HOST=127.0.0.1\n' +
      `DB_PORT=${dbPort[db]}\n` +
      'DB_DATABASE=database\n' +
      'DB_DEBUG=false\n' +
      'DB_USERNAME=root\n' +
      'DB_PASSWORD=root\n' +
      'DB_AUTO_CONNECT=(true)\n'

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

  async createDockerComposeFile(projectPath, db) {
    const dockerComposeFile = `${projectPath}/docker-compose.yml`
    const message = 'Creating docker-compose.yml file in project'

    const spinner = this.createSpinner(message)

    if (message) {
      spinner.color = 'yellow'

      spinner.start()
    }

    try {
      await new File(
        Path.resources(`scaffolds/databaseComponent/${db}/docker-compose.yml`),
      )
        .loadSync()
        .copy(dockerComposeFile)

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
