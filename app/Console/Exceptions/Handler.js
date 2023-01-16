/**
 * @athenna/cli
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ConsoleExceptionHandler } from '@athenna/artisan'

/*
|--------------------------------------------------------------------------
| Console Exception Handler
|--------------------------------------------------------------------------
|
| Athenna will forward all exceptions occurred during an Artisan command
| execution to the following class. You can learn more about exception
| handling by reading docs.
|
*/

export class Handler extends ConsoleExceptionHandler {
  /**
   * The global exception handler of all Artisan commands.
   *
   * @param {any} error
   */
  async handle(error) {
    return super.handle(error)
  }
}
