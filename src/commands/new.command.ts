import { Config } from '@athenna/config'
import { Exec, File, Folder } from '@athenna/common'
import { sep, basename, isAbsolute } from 'node:path'
import { Argument, BaseCommand } from '@athenna/artisan'
import { NotEmptyFolderException } from '#src/exceptions/not.empty.folder.exception'

export class NewCommand extends BaseCommand {
  @Argument({ required: true, description: 'Your project folder name.' })
  private name: string

  private branch: string
  private isSlim: boolean
  private readonly url = 'https://github.com/AthennaIO/AthennaIO.git'

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

    const type = await this.prompt.list(
      'What type of application do you wish to create?',
      ['REST API', 'CLI'],
    )

    this.isSlim = await this.prompt.confirm(
      'Do you wish to create a slim project style?',
    )

    this.branch = this.getApplicationBranch(type)

    await this[this.branch.replace('-slim', '')]()
  }

  public getApplicationBranch(result: string) {
    const map = {
      CLI: 'cli',
      'REST API': 'http',
    }

    if (this.isSlim) {
      return map[result].concat('-slim')
    }

    return map[result]
  }

  public async cli(): Promise<void> {
    this.logger.simple('\n({bold,green} [ GENERATING CLI ])\n')

    await this.clone()

    this.logger
      .instruction()
      .head('Run following commands to get started:')
      .add(`cd ${this.name}`)
      .add('node artisan')
      .render()
  }

  public async http(): Promise<void> {
    this.logger.simple('\n({bold,green} [ GENERATING HTTP SERVER ])\n')

    await this.clone()

    this.logger
      .instruction()
      .head('Run following commands to get started:')
      .add(`cd ${this.name}`)
      .add('node artisan serve')
      .render()
  }

  public async clone(): Promise<void> {
    let projectPath = Path.storage(`projects/${this.name}`)
    let concretePath = `${Config.get('rc.callPath')}${sep}${this.name}`

    if (isAbsolute(this.name)) {
      projectPath = Path.storage(`projects/${basename(this.name)}`)
      concretePath = this.name
    }

    if (await Folder.exists(concretePath)) {
      throw new NotEmptyFolderException(concretePath)
    }

    const task = this.logger.task()

    task.addPromise(
      `Clone scaffold project from ${this.paint.purple.bold(
        this.url,
      )} in branch ${this.paint.purple.bold(this.branch)}`,
      async () => {
        await Exec.command(
          `git clone --branch ${this.branch} ${this.url} ${projectPath}`,
        )
      },
    )

    task.addPromise('Move project to your path', async () => {
      await Exec.command(`mv ${projectPath} ${concretePath}`)
    })

    task.addPromise(
      `Install dependencies using ${this.paint.yellow.bold('npm')}`,
      async () => {
        await Exec.command('npm install --silent --production=false', {
          cwd: concretePath,
        })
      },
    )

    task.add('Remove unnecessary files', async task => {
      await Folder.safeRemove(`${concretePath}/.git`)
      await Folder.safeRemove(`${concretePath}/.github`)
      await File.safeRemove(`${concretePath}/README.md`)

      await task.complete()
    })

    if (!this.isSlim) {
      task.add(`Create ${this.paint.yellow.bold('.env')} files`, async task => {
        const file = new File(`${concretePath}/.env.example`, '')

        if (!file.fileExists) {
          return task.complete()
        }

        await file.copy(`${concretePath}/.env`)
        await file.copy(`${concretePath}/.env.test`)

        await task.complete()
      })
    }

    await task.run()

    console.log()

    await this.logger.success('Project successfully created.')
  }
}
