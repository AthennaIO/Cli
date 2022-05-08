/**
 * @athenna/cli
 *
 * (c) Victor Tesoura Júnior <txsoura@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ora from 'ora'

import { Exec } from '@secjs/utils'

export class CliHelper {
  /**
   * Run a command with a spinner.
   *
   * @param {string} command
   * @param {string} [log]
   * @return {Promise<void>}
   */
  static async runCommand(command, log) {
    const spinner = ora(log)

    if (log) {
      spinner.color = 'yellow'

      spinner.start()
    }

    try {
      await Exec.command(command)

      if (log) spinner.succeed(log)
    } catch (err) {
      // console.log(err)
      if (log) spinner.fail(log)

      throw err
    }
  }
}
