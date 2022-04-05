/**
 * @secjs/cli
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import chalk from 'chalk'
import { Is } from '@secjs/utils'

export class Logger {
  private chalk: any

  public constructor() {
    this.chalk = chalk
  }

  get bold(): this {
    this.chalk = this.chalk.bold

    return this
  }

  get info(): this {
    this.chalk = this.chalk.cyan

    return this
  }

  get debug(): this {
    this.chalk = this.chalk.magenta

    return this
  }

  get warn(): this {
    this.chalk = this.chalk.yellow

    return this
  }

  get error(): this {
    this.chalk = this.chalk.red

    return this
  }

  get success(): this {
    this.chalk = this.chalk.green

    return this
  }

  log(content: any) {
    if (Is.String(content)) {
      const matches = content.match(/\({(.*?)} (.*?)\)/)

      if (matches) {
        const chalkMethodsString = matches[1].replace(/\s/g, '')
        const chalkMethodsArray = chalkMethodsString.split(',')
        const message = matches[2]

        let chalk = this.chalk

        chalkMethodsArray.forEach(chalkMethod => {
          if (!chalk[chalkMethod]) return

          chalk = chalk[chalkMethod]
        })

        content = content
          .replace(`({${matches[1]}} `, '')
          .replace(`({${matches[1]}}`, '')
          .replace(`${matches[2]})`, chalk(message))
      }
    }

    console.log(this.chalk(content))
    this.chalk = chalk
  }
}
