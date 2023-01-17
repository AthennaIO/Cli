/**
 * @athenna/cli
 *
 * (c) Victor Tesoura Júnior <txsoura@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import chalk from 'chalk'
import chalkRainbow from 'chalk-rainbow'
import Table from 'cli-table'
import figlet from 'figlet'

import { File, Path, HttpClient } from '@athenna/common'
import { Logger } from '@athenna/logger'

export class VersionUpdateHelper {
  static async execute() {
    const repositoryUrl =
      'https://raw.githubusercontent.com/AthennaIO/Cli/develop/package.json'
    const packageJson = await new File(Path.pwd('package.json')).getContent()

    let { version } = JSON.parse(packageJson.toString())
    let { version: repositoryVersion } = await HttpClient.get(
      repositoryUrl,
    ).json()

    if (repositoryVersion !== version) {
      const rainbow = await chalkRainbow(figlet.textSync('Athenna'))
      const table = new Table({})
      const logger = Logger.getVanillaLogger({
        driver: 'console',
        formatter: 'none',
      })
      const updateCommand = chalk.bold.cyan('athenna update')

      version = chalk.bold.gray(version)
      repositoryVersion = chalk.bold.green(repositoryVersion)

      table.push([
        `    Update available ${version} → ${repositoryVersion}    \n     Run ${updateCommand} to update    `,
      ])

      logger.error(rainbow)
      logger.error(table.toString())

      process.exit()
    }
  }
}
