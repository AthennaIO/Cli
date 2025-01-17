/**
 * @athenna/cli
 *
 * (c) Victor Tesoura Júnior <txsoura@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Path } from '@athenna/common'
import { Test, type Context } from '@athenna/test'
import { BaseConsoleTest } from '@athenna/core/testing/BaseConsoleTest'

export default class UpdateCommandTest extends BaseConsoleTest {
  @Test()
  public async shouldBeAbleToUpdateAthennaCLIVersion({ command }: Context) {
    const output = await command.run('update', {
      path: Path.fixtures('consoles/update-cli.ts'),
    })

    output.assertSucceeded()
    output.assertLogged('UPDATING CLI')
    output.assertLogged('Successfully updated')
  }
}
