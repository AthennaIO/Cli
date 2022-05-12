/**
 * @athenna/cli
 *
 * (c) Victor Tesoura Júnior <txsoura@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import figlet from 'figlet'
import chalkRainbow from 'chalk-rainbow'

import { Command } from 'commander'
import { resolve } from 'node:path'
import { Config, File, Path } from '@secjs/utils'

import { New } from '#src/Commands/New'

export class Cli {
  /**
   * The path where the cli were called.
   *
   * @type {string}
   */
  #callPath

  /**
   * The commander instance.
   *
   * @type {Command}
   */
  #commander

  /**
   * Creates a new instance of Cli.
   */
  constructor() {
    this.#callPath = process.cwd()

    this.#commander = new Command()

    /**
     * Change all process.cwd commands to return the
     * root path where @athenna/cli is stored
     */
    process.chdir(resolve(__dirname, '..'))

    process.stdout.write(chalkRainbow(figlet.textSync('Athenna')) + '\n' + '\n')

    const { version } = new File('../package.json')
      .loadSync()
      .getContentSync()
      .toJSON()

    this.#commander.version(`v${version}`, '-v, --version')
  }

  /**
   * Register the commands and execute the CLI.
   *
   * @return {Promise<void>}
   */
  async main() {
    await new Config().safeLoad(Path.config('logging.js'))

    const newCommand = new New(this.#callPath)

    this.#commander
      .command('new')
      .description('Scaffold a new Athenna project.')
      .argument('<name>', 'Your project name.')
      .option(
        '-t, --type <type>',
        'Current types available: http, cli.',
        'http',
      )
      .action(newCommand.project.bind(newCommand))
      .showHelpAfterError()
      .createHelp()

    await this.#commander.parseAsync(process.argv)
  }
}

new Cli().main()
