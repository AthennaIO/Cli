import { Config } from '@athenna/config'
import { sep, isAbsolute } from 'node:path'
import { Exec, File, Folder } from '@athenna/common'
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

    const type = await this.prompt.list(
      'What type of application do you wish to create?',
      ['REST API', 'CLI'],
    )

    this.isSlim = await this.prompt.confirm(
      'Do you wish to create a slim project style?',
    )

    this.branch = this.getApplicationBranch(type)

    switch (type) {
      case 'CLI':
        await this.cli()
        break
      case 'REST API':
        await this.http()
        break
    }
  }

  public isBellowV20(): boolean {
    if (process.env.TESTING_BELLOW_V20) {
      return true
    }

    const major = process.version.split('.')[0]

    return parseInt(major) < 20
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
    let projectPath = `${Config.get('rc.callPath')}${sep}${this.name}`

    if (isAbsolute(this.name)) {
      projectPath = this.name
    }

    if (await Folder.exists(projectPath)) {
      throw new NotEmptyFolderException(projectPath)
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

    task.addPromise(
      `Install dependencies using ${this.paint.yellow.bold('npm')}`,
      async () => {
        await Exec.command('npm install --silent --production=false', {
          cwd: projectPath,
        })
      },
    )

    task.add('Remove unnecessary files', async task => {
      await Folder.safeRemove(`${projectPath}/.git`)
      await Folder.safeRemove(`${projectPath}/.github`)
      await File.safeRemove(`${projectPath}/README.md`)

      await task.complete()
    })

    if (!this.isSlim) {
      task.add(`Create ${this.paint.yellow.bold('.env')} files`, async task => {
        const file = new File(`${projectPath}/.env.example`, '')

        if (!file.fileExists) {
          return task.complete()
        }

        await file.copy(`${projectPath}/.env`)
        await file.copy(`${projectPath}/.env.test`)

        await task.complete()
      })
    }

    if (this.isBellowV20()) {
      task.addPromise(
        `Configure ${this.paint.yellow.bold(
          'artisan.js',
        )} file for Node.js versions bellow v20.x`,
        async () => {
          await File.safeRemove(`${projectPath}/artisan.js`)
          await this.generator
            .properties({
              artisanPath: this.isSlim
                ? './bin/artisan.js'
                : './bootstrap/artisan.js',
            })
            .path(`${projectPath}/artisan.js`)
            .template('artisan')
            .make()
        },
      )
    }

    await task.run()

    console.log()

    await this.logger.success('Project successfully created.')
  }
}
