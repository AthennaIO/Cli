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
| new NotEmptyFolderException('message', 500, 'E_RUNTIME_EXCEPTION', 'Restart computer.')
|
*/

export class NotEmptyFolderException extends Exception {
  /**
   * Return a new instance of NotEmptyFolderException.
   *
   * @param {string} projectName
   */
  constructor(projectName) {
    const message = `The directory ({yellow} "${projectName}") already exists. Try another project name or delete ({yellow} "${projectName}") folder.`

    super(message, 500, 'E_SIMPLE_CLI')
  }
}
