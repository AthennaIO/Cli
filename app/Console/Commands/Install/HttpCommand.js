import { File, Folder, Path } from '@secjs/utils'
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
    return 'install:http'
  }

  /**
   * The console command description.
   */
  get description() {
    return 'Install the http component in your Athenna application.'
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

    this.title('INSTALLING HTTP COMPONENT\n', 'bold', 'green')

    const projectPath = `${Env('CALL_PATH')}`

    await this.installHttpPackage(projectPath)
    await this.createBootstrapFile(projectPath)
    await this.createHttpConfigFile(projectPath)
    await this.createHttpFolder(projectPath)
    await this.createRouteFile(projectPath)
    await this.createTestFile(projectPath)
    await this.addHttpCommandsToKernel(projectPath)

    console.log()

    this.success('Athenna http component successfully installed.')
  }

  async installHttpPackage(projectPath) {
    const cdCommand = `cd ${projectPath}`
    const npmInstallCommand = `${cdCommand} && npm install @athenna/http`

    await this.execCommand(
      npmInstallCommand,
      `Installing @athenna/http package in your project`,
    )
  }

  async createHttpFolder(projectPath) {
    const httpFolder = `${projectPath}/app/Http`
    const message = 'Creating app/Http folder in project'

    const spinner = this.createSpinner(message)

    if (message) {
      spinner.color = 'yellow'

      spinner.start()
    }

    try {
      await new Folder(Path.resources('scaffolds/httpComponent/Http')).copy(
        httpFolder,
      )

      if (message) spinner.succeed(message)
    } catch (err) {
      if (message) spinner.fail(message)

      throw err
    }
  }

  async createHttpConfigFile(projectPath) {
    const httpConfigFile = `${projectPath}/config/http.js`
    const message = 'Creating config/http.js file in project'

    const spinner = this.createSpinner(message)

    if (message) {
      spinner.color = 'yellow'

      spinner.start()
    }

    try {
      await new File(Path.resources('scaffolds/httpComponent/config/http.js'))
        .loadSync()
        .copy(httpConfigFile)

      if (message) spinner.succeed(message)
    } catch (err) {
      if (message) spinner.fail(message)

      throw err
    }
  }

  async createRouteFile(projectPath) {
    const routeFile = `${projectPath}/routes/http.js`
    const message = 'Creating routes/http.js file in project'

    const spinner = this.createSpinner(message)

    if (message) {
      spinner.color = 'yellow'

      spinner.start()
    }

    try {
      await new File(Path.resources('scaffolds/httpComponent/routes/http.js'))
        .loadSync()
        .copy(routeFile)

      if (message) spinner.succeed(message)
    } catch (err) {
      if (message) spinner.fail(message)

      throw err
    }
  }

  async createTestFile(projectPath) {
    const testFile = `${projectPath}/tests/main.js`
    const message = 'Creating tests/main.js file in project'

    const spinner = this.createSpinner(message)

    if (message) {
      spinner.color = 'yellow'

      spinner.start()
    }

    try {
      await new File(Path.resources('scaffolds/httpComponent/tests/main.js'))
        .loadSync()
        .copy(testFile)

      if (message) spinner.succeed(message)
    } catch (err) {
      if (message) spinner.fail(message)

      throw err
    }
  }

  async createBootstrapFile(projectPath) {
    const bootstrapFile = `${projectPath}/bootstrap/main.js`
    const message = 'Creating bootstrap/main.js file in project'

    const spinner = this.createSpinner(message)

    if (message) {
      spinner.color = 'yellow'

      spinner.start()
    }

    try {
      await new File(
        Path.resources('scaffolds/httpComponent/bootstrap/main.js'),
      )
        .loadSync()
        .copy(bootstrapFile)

      if (message) spinner.succeed(message)
    } catch (err) {
      if (message) spinner.fail(message)

      throw err
    }
  }

  async addHttpCommandsToKernel(projectPath) {
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
        "import { HttpCommandsLoader } from '@athenna/http'\n",
      )

      await FilePropertiesHelper.addContentToArrayProperty(
        kernelPath,
        'const internalCommands = ',
        '...HttpCommandsLoader.loadCommands()',
      )

      await FilePropertiesHelper.addContentToArrayGetter(
        kernelPath,
        'templates',
        '...HttpCommandsLoader.loadTemplates()',
      )

      if (message) spinner.succeed(message)
    } catch (err) {
      if (message) spinner.fail(message)

      throw err
    }
  }
}
