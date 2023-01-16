/**
 * @athenna/cli
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@athenna/common'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@athenna/core` allows defining
| a status code, error code and help for every exception.
|
| @example
| new NotFoundDatabaseException('message', 500, 'E_RUNTIME_EXCEPTION', 'Restart computer.')
|
*/

export class NotFoundDatabaseException extends Exception {
  /**
   * Return a new instance of NotFoundDatabaseExceptionException.
   *
   * @param {string} dbName
   */
  constructor(dbName) {
    super(
      `The database ${dbName} is not supported by @athenna/database. Run ({yellow} "athenna install:database --help") to check the available databases.`,
      500,
      'E_SIMPLE_CLI',
    )
  }
}
