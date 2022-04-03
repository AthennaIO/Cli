/**
 * @athenna/cli
 *
 * (c) Victor Tesoura Júnior <txsoura@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import figlet from 'figlet'
import { Command } from 'commander'
import { New } from './Commands/New'
import { version } from '../package.json'
import chalkRainbow from 'chalk-rainbow'

export class Cli {
  private program: Command

  public constructor() {
    this.program = new Command()

    console.log(chalkRainbow(figlet.textSync('Athenna')))

    this.program.version(`v${version}`, '-v, --version')
  }

  async main() {
    const newCommand = new New()

    this.program
      .command('new')
      .argument('<name>', 'Your project name')
      .option('-t, --type <type>', 'Current types available: http', 'http')
      .description('Scaffold a new Athenna project')
      .action(newCommand.project.bind(newCommand))
      .createHelp()

    await this.program.parseAsync(process.argv)
  }
}
