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
import { Make } from './Commands/Make'
import { version } from '../package.json'

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
    const newCommand = new New(this.clientFolder)
    const makeCommand = new Make(this.clientFolder)

    this.program
      .command('new')
      .argument('<name>', 'Your project name')
      .option('-t, --type <type>', 'Current types available: http', 'http')
      .description('Scaffold a new Athenna project')
      .action(newCommand.project.bind(newCommand))
      .showHelpAfterError()
      .createHelp()

    this.program
      .command('make:controller')
      .argument('<name>', 'Your controller name')
      .option(
        '-e, --extension <extension>',
        'Current extension available: ts',
        'ts',
      )
      .option('--no-lint', 'Do not run eslint in the controller')
      .description(
        'Make a new controller file inside app/Http/Controllers directory',
      )
      .action(makeCommand.controller.bind(makeCommand))
      .showHelpAfterError()
      .createHelp()

    this.program
      .command('make:middleware')
      .argument('<name>', 'Your middleware name')
      .option(
        '-e, --extension <extension>',
        'Current extension available: ts',
        'ts',
      )
      .option('--no-lint', 'Do not run eslint in the middleware', false)
      .description(
        'Make a new middleware file inside app/Http/Middlewares directory',
      )
      .action(makeCommand.middleware.bind(makeCommand))
      .showHelpAfterError()
      .createHelp()

    await this.program.parseAsync(process.argv)
  }
}
