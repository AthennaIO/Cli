import { Test } from '@athenna/test'
import { Artisan } from '@athenna/artisan'
import { File, Folder, Path } from '@secjs/utils'

export class InstallDatabaseCommandTest extends Test {
  get timeout() {
    return 100000
  }

  async afterEach() {
    await Folder.safeRemove(Path.pwd('project'))
  }

  /**
   * Run your test.
   *
   * @param {import('@athenna/test').HttpTestContext} ctx
   */
  async shouldBeAbleToInstallDatabaseComponentInAthennaProject({ assert }) {
    await Artisan.call('new project --type slim')

    process.env.CALL_PATH = Path.pwd('project')

    await Artisan.call('install:database')

    assert.isTrue(await File.exists(Path.pwd('project/config/database.js')))
  }
}
