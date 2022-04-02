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

export class Cli {
  private program: Command

  public constructor() {
    this.program = new Command()

    console.log(figlet.textSync('Athenna'))

    this.program.version(`v${version}`, '-v, --version')
  }

  async main() {
    const newCommand = new New()

    this.program
      .command('new')
      .argument('<project-name>', 'Your project name')
      .action(newCommand.project.bind(newCommand))

    await this.program.parseAsync(process.argv)
  }
}
