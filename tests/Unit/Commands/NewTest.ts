/**
 * @athenna/cli
 *
 * (c) Victor Tesoura Júnior <txsoura@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { New } from '../../../src/Commands/New'

describe('\n NewTest', () => {
  it('should be able to create a new project', async () => {
    const string = await new New().project('.')

    console.log(string)
  }, 20000)
})
