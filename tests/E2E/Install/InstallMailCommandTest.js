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

export class InstallMailCommandTest extends Test {
  get timeout() {
    return 100000
  }

  async beforeAll() {
    process.env.CALL_PATH = Path.pwd()
  }

  async afterEach() {
    await Folder.safeRemove(Path.pwd('projectMail'))
  }

  /**
   * @param {import('@athenna/test').HttpTestContext} ctx
   */
  async shouldBeAbleToInstallMailComponentInAthennaProject({ assert }) {
    await Artisan.call('new projectMail --type cli')

    assert.isTrue(await Folder.exists(Path.pwd('projectMail/app')))

    process.env.CALL_PATH = Path.pwd('projectMail')

    await Artisan.call('install:mail --no-lint')

    const packageJson = await new File(Path.pwd('projectMail/package.json')).load()

    assert.isTrue(packageJson.getContentSync().includes('@athenna/mail'))
  }
}
