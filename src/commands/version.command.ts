import { Exec, HttpClient } from '@athenna/common'
import { Argument, BaseCommand } from '@athenna/artisan'
import { IGNORE_REPOS } from '#src/constants/ignorerepos'

export class VersionCommand extends BaseCommand {
  @Argument({
    required: false,
    description: 'Specific Athenna package to discover version of.',
  })
  private pkg: string

  public static signature(): string {
    return 'version'
  }

  public static description(): string {
    return 'Retrieve the version of all Athenna packages or from single one.'
  }

  public async handle(): Promise<void> {
    this.logger.simple('({bold,green} [ LIST VERSION ])\n')

    const pkgs = await this.getPkgNames()
    const table = await this.getTableVersionFor(...pkgs)

    table.render()
  }

  public async getPkgNames() {
    if (this.pkg) {
      return [this.pkg]
    }

    const repositories = await HttpClient.builder()
      .prefixUrl('https://api.github.com')
      .header('Accept', 'application/vnd.github+json')
      .header('X-GitHub-Api-Version', '2022-11-28')
      .get('/orgs/AthennaIO/repos')
      .json<any[]>()

    return repositories.map(repository => repository.name)
  }

  public async getTableVersionFor(...pkgs: string[]) {
    const table = this.logger.table().head('Package', 'Version')

    await Exec.concurrently(pkgs, async pkg => {
      if (IGNORE_REPOS.includes(pkg)) {
        return
      }

      const { name: version } = await HttpClient.builder()
        .prefixUrl('https://api.github.com')
        .resolveBodyOnly(true)
        .throwHttpErrors(false)
        .header('Accept', 'application/vnd.github+json')
        .header('X-GitHub-Api-Version', '2022-11-28')
        .get(`/repos/AthennaIO/${pkg}/releases/latest`)
        .json<any>()

      if (!version) {
        this.logger.error(
          `The repository ${pkg} could not be found in AthennaIO GitHub organization`,
        )

        return
      }

      table.row([
        this.paint.yellow(`@athenna/${pkg.toLowerCase()}`),
        this.paint.yellow(version),
      ])
    })

    return table
  }
}
