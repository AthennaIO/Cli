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
    return 'install:test'
  }

  /**
   * The console command description.
   */
  get description() {
    return 'Install the test component in your Athenna application.'
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

    this.title('INSTALLING TEST COMPONENT\n', 'bold', 'green')

    const projectPath = `${Env('CALL_PATH')}`

    await this.installTestPackage(projectPath)
    await this.createTestsFolder(projectPath)
    await this.addTestCommandsToKernel(projectPath)

    console.log()

    this.success('Athenna test component successfully installed.')
  }

  async installTestPackage(projectPath) {
    const cdCommand = `cd ${projectPath}`
    const npmInstallCommand = `${cdCommand} && npm install @athenna/test`

    await this.execCommand(
      npmInstallCommand,
      `Installing @athenna/test package in your project`,
    )
  }

  async createTestsFolder(projectPath) {
    const testsFolderPath = `${projectPath}/tests`
    const message = 'Creating tests folder in project root path'

    const spinner = this.createSpinner(message)

    if (message) {
      spinner.color = 'yellow'

      spinner.start()
    }

    try {
      await new Folder(Path.resources('scaffolds/testComponent/tests')).copy(
        testsFolderPath,
      )

      if (message) spinner.succeed(message)
    } catch (err) {
      if (message) spinner.fail(message)

      throw err
    }
  }

  async addTestCommandsToKernel(projectPath) {
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
        "import { TestCommandsLoader } from '@athenna/test'\n",
      )

      await FilePropertiesHelper.addContentToArrayProperty(
        kernelPath,
        'const internalCommands = ',
        '...TestCommandsLoader.loadCommands()',
      )

      await FilePropertiesHelper.addContentToArrayGetter(
        kernelPath,
        'templates',
        '...TestCommandsLoader.loadTemplates()',
      )

      if (message) spinner.succeed(message)
    } catch (err) {
      if (message) spinner.fail(message)

      throw err
    }
  }
}
