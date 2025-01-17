/**
 * @athenna/cli
 *
 * (c) Victor Tesoura Júnior <txsoura@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Test, type Context } from '@athenna/test'
import { BaseConsoleTest } from '@athenna/core/testing/BaseConsoleTest'

export default class VersionCommandTest extends BaseConsoleTest {
  @Test()
  public async shouldBeAbleToListAllAthennaRepositoriesVersion({ command }: Context) {
    const output = await command.run('version')

    output.assertSucceeded()
    output.assertLogged('@athenna/artisan')
    output.assertLogged('@athenna/core')
    output.assertLogged('@athenna/cli')
    output.assertLogged('@athenna/database')
  }

  @Test()
  public async shouldBeAbleToListOneSingleAthennaRepositoryVersion({ command }: Context) {
    const output = await command.run('version artisan')

    output.assertSucceeded()
    output.assertLogged('@athenna/artisan')
  }

  @Test()
  public async shouldThrowErrorWhenRepositoryDoesNotExist({ command }: Context) {
    const output = await command.run('version not-found')

    output.assertSucceeded()
    output.assertLogged('The repository not-found could not be found in AthennaIO GitHub organization')
  }
}
