/**
 * @athenna/cli
 *
 * (c) Victor Tesoura Júnior <txsoura@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Instruction } from '@athenna/artisan'
import { File, Path, HttpClient, Color } from '@athenna/common'

export class UpdateNotificationHelper {
  public static async verify() {
    const repositoryUrl =
      'https://raw.githubusercontent.com/AthennaIO/Cli/main/package.json'
    const pkgJson = await new File(Path.pwd('package.json')).getContentAsJson()

    const { version } = await HttpClient.get(repositoryUrl).json<any>()

    if (pkgJson.version !== version) {
      const oldVersion = Color.bold.gray(pkgJson.version)
      const newVersion = Color.bold.green(version)
      const updateCommand = Color.bold.yellow('athenna update')

      new Instruction()
        .head(`🚨 Update available ${oldVersion} → ${newVersion} 🚨`)
        .add(`Run ${updateCommand} command to update to ${newVersion}.`)
        .render()
    }
  }
}
