/**
 * @athenna/cli
 *
 * (c) Victor Tesoura Júnior <txsoura@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { File, Path } from '@athenna/common'
import { BaseCommand } from '@athenna/artisan'

export class UpdateCommand extends BaseCommand {
  public static signature(): string {
    return 'update'
  }

  public static description(): string {
    return 'Update Athenna CLI to the latest version.'
  }

  public async handle(): Promise<void> {
    this.logger.simple('[ UPDATING CLI ]\n')

    const task = this.logger.task()

    task.addPromise('Updating ({bold,yellow} @athenna/cli)', () => {
      return this.npm.install('@athenna/cli', { args: ['-g'] })
    })

    await task.run()

    const pkgJson = await new File(Path.pwd('package.json')).getContentAsJson()

    this.logger.success(
      `Successfully updated ({bold,yellow} @athenna/cli) to version ({bold,yellow} ${pkgJson.version})`,
    )
  }
}
