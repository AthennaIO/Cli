/**
 * @athenna/cli
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import chalk from 'chalk'
import { Logger } from './Logger'

export class CtxLogger {
  private static logger = new Logger()

  static info(message: string): void {
    const ctx = chalk.bold.cyan('[  info  ]')

    this.logger.log(`${ctx} ${message}`)
  }

  static warn(message: string): void {
    const ctx = chalk.bold.yellow('[  warn  ]')

    this.logger.log(`${ctx} ${message}`)
  }

  static error(message: string): void {
    const ctx = chalk.bold.red('[  error  ]')

    this.logger.log(`${ctx} ${message}`)
  }

  static debug(message: string): void {
    const ctx = chalk.bold.magenta('[  debug  ]')

    this.logger.log(`${ctx} ${message}`)
  }

  static success(message: string): void {
    const ctx = chalk.bold.green('\n[  success  ]')

    this.logger.log(`${ctx} ${message}`)
  }
}
