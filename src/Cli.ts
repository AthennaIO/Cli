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

import { resolve } from 'path'
import { Command } from 'commander'
import { New } from './Commands/New'
import { version } from '../package.json'
import { Config, Path } from '@secjs/utils'

export class Cli {
  private clientFolder: string
  private program: Command

  public constructor() {
    this.clientFolder = process.cwd()

    this.program = new Command()

    /**
     * Change all process.cwd commands to return the
     * root path where @athenna/cli is stored
     */
    process.chdir(resolve(__dirname, '..'))

    console.log(chalkRainbow(figlet.textSync('Athenna')))

    this.program.version(`v${version}`, '-v, --version')
  }

  async main() {
    await new Config().safeLoad(Path.config('logging'))

    const newCommand = new New(this.clientFolder)

    this.program
      .command('new')
      .argument('<name>', 'Your project name')
      .option('-t, --type <type>', 'Current types available: http', 'http')
      .description('Scaffold a new Athenna project')
      .action(newCommand.project.bind(newCommand))
      .showHelpAfterError()
      .createHelp()

    await this.program.parseAsync(process.argv)
  }
}
