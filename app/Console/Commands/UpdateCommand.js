/**
 * @athenna/cli
 *
 * (c) Victor Tesoura Júnior <txsoura@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import chalk from 'chalk'

import { basename, isAbsolute, sep } from 'node:path'

import { Command } from '@athenna/artisan'
import { Folder, Path, File } from '@athenna/common'

export class UpadateCommand extends Command {
  /**
   * The name and signature of the console command.
   */
  get signature() {
    return 'update'
  }

  /**
   * The console command description.
   */
  get description() {
    return 'Update Athenna cli to latest version.'
  }

  /**
   * Execute the console command.
   *
   * @return {Promise<void>}
   */
  async handle(projectName, options) {
    this.log(this.createRainbow('Athenna'))

    await this.update()
  }

  /**
   * The update command handler.
   *
   * @return {Promise<void>}
   */
  async update(projectName) {
    this.title('STARTING UPDATE...\n', 'bold', 'green')

    const updateCommand ='npm install -g @athenna/cli'

    await this.execCommand(
      updateCommand,
      `Updating...`,
    )

    console.log()

    const packageJson = await new File(Path.pwd('package.json')).getContent()

    let { version } = JSON.parse(packageJson.toString())
    version = chalk.bold.green(version)


    this.success(`Updated successfully to version ${version}.`)
  }
}
