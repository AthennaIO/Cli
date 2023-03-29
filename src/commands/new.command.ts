import { Config } from '@athenna/config'
import { Exec, File, Folder } from '@athenna/common'
import { sep, basename, isAbsolute } from 'node:path'
import { Argument, BaseCommand, Option } from '@athenna/artisan'
import { NotEmptyFolderException } from '#src/exceptions/not.empty.folder.exception'
import { NotFoundProjectTypeException } from '#src/exceptions/not.found.project.type.exception'

export class NewCommand extends BaseCommand {
  @Argument({ required: true, description: 'Your project folder name.' })
  private name: string

  @Option({
    signature: '-t, --type [type]',
    description:
      'The type of the project. Currenty types available: http and cli.',
    default: 'http',
  })
  private type: string

  private isLaravel: boolean
  private readonly supported = ['http', 'cli']
  private readonly url = 'https://github.com/AthennaIO/AthennaIO.git'
  private readonly shellAlias = process.platform === 'win32' ? 'sh ' : './'

  public static signature(): string {
    return 'new'
  }

  public static description(): string {
    return 'Create a new Athenna project.'
  }

  public async handle(): Promise<void> {
    this.logger.rainbow('Athenna')

    await Folder.safeRemove(Path.storage())
    await new Folder(Path.storage()).load()

    this.isLaravel = await this.prompt.confirm(
      'Do you wish to create a Laravel project style?',
    )

    if (!this.supported.includes(this.type)) {
      throw new NotFoundProjectTypeException(this.type, this.supported)
    }

    await this[this.type]()
  }

  public async cli(): Promise<void> {
    this.logger.simple('\n({bold,green} [ GENERATING CLI ])\n')

    await this.clone('cli')

    this.logger
      .instruction()
      .head('Run following commands to get started:')
      .add(`cd ${this.name}`)
      .add(`${this.shellAlias}node artisan`)
      .render()
  }

  public async http(): Promise<void> {
    this.logger.simple('\n({bold,green} [ GENERATING HTTP SERVER ])\n')

    await this.clone('http')

    this.logger
      .instruction()
      .head('Run following commands to get started:')
      .add(`cd ${this.name}`)
      .add(`${this.shellAlias}node artisan test`)
      .add(`${this.shellAlias}node artisan serve`)
      .render()
  }

  public async clone(branch: string): Promise<void> {
    if (!this.isLaravel) {
      branch = `${branch}-slim`
    }

    let projectPath = Path.storage(`projects/${this.name}`)
    let concretePath = `${Config.get('rc.callPath')}${sep}${this.name}`

    if (isAbsolute(this.name)) {
      projectPath = Path.storage(`projects/${basename(this.name)}`)
      concretePath = this.name
    }

    if (await Folder.exists(concretePath)) {
      throw new NotEmptyFolderException(concretePath)
    }

    const cloneCommand = `git clone --branch ${branch} ${this.url} ${projectPath}`
    const moveProjectCommand = `mv ${projectPath} ${concretePath}`
    const runNpmInstallCommand = `cd ${concretePath} && npm install --silent --production=false`

    await this.logger
      .task()
      .add(
        `Clone scaffold project from ${this.paint.purple.bold(
          this.url,
        )} in branch ${this.paint.purple.bold(branch)}`,
        async task => {
          await Exec.command(cloneCommand)
            .then(() => task.complete())
            .catch(() => task.fail())
        },
      )
      .add('Move project to your path', async task => {
        await Exec.command(moveProjectCommand)
          .then(() => task.complete())
          .catch(() => task.fail())
      })
      .add(
        `Install dependencies using ${this.paint.yellow.bold('npm')}`,
        async task => {
          await Exec.command(runNpmInstallCommand)
            .then(() => task.complete())
            .catch(() => task.fail())
        },
      )
      .add(
        `Remove unnecessary files and create ${this.paint.yellow.bold(
          '.env',
        )} files`,
        async task => {
          await Folder.safeRemove(`${concretePath}/.git`)
          await Folder.safeRemove(`${concretePath}/.github`)

          const file = new File(`${concretePath}/.env.example`, '')

          if (!file.fileExists) {
            return task.complete()
          }

          await file.copy(`${concretePath}/.env`)
          await file.copy(`${concretePath}/.env.test`)

          await task.complete()
        },
      )
      .run()

    console.log()

    await this.logger.success('Project successfully created.')
  }
}
