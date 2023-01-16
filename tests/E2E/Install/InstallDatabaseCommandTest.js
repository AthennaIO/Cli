/**
 * @athenna/cli
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Test } from '@athenna/test'
import { Artisan } from '@athenna/artisan'
import { File, Folder, Path } from '@athenna/common'

export class InstallDatabaseCommandTest extends Test {
  get timeout() {
    return 100000
  }

  async beforeAll() {
    process.env.CALL_PATH = Path.pwd()
  }

  async afterEach() {
    await Folder.safeRemove(Path.pwd('projectDb'))
  }

  /**
   * @param {import('@athenna/test').HttpTestContext} ctx
   */
  async shouldBeAbleToInstallDatabaseComponentInAthennaProject({ assert }) {
    await Artisan.call('new projectDb --type cli')

    assert.isTrue(await Folder.exists(Path.pwd('projectDb/app')))

    process.env.CALL_PATH = Path.pwd('projectDb')

    await Artisan.call('install:database --db=postgres --no-lint')

    const packageJson = await new File(Path.pwd('projectDb/package.json')).load()

    assert.isTrue(packageJson.getContentSync().includes('@athenna/database'))
  }

  /**
   * @param {import('@athenna/test').HttpTestContext} ctx
   */
  async shouldThrowAnExceptionWhenDbDoesNotSupportTheDbChosen({ assert }) {
    const { stderr } = await Artisan.callInChild('install:database --db not-found --no-lint')

    assert.isTrue(stderr.includes('The database not-found is not supported by @athenna/database.'))
  }
}
