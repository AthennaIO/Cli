/**
 * @athenna/cli
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@secjs/utils'

export class NodeExecException extends Exception {
  public constructor(command: string) {
    const content = `Error has occurred when executing the command "${command}"`

    super(content, 500, 'NODE_EXEC_ERROR')
  }
}
