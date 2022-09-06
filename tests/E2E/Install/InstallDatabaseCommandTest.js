import { Test } from '@athenna/test'
import { Artisan } from '@athenna/artisan'
import { File, Folder, Path } from '@secjs/utils'

export class InstallDatabaseCommandTest extends Test {
  get timeout() {
    return 100000
  }

  async afterEach() {
    await Folder.safeRemove(Path.pwd('projectDb'))
  }

  /**
   * @param {import('@athenna/test').HttpTestContext} ctx
   */
  async shouldBeAbleToInstallDatabaseComponentInAthennaProject({ assert }) {
    await Artisan.call('new projectDb --type slim')

    assert.isTrue(await Folder.exists(Path.pwd('projectDb/app')))

    process.env.CALL_PATH = Path.pwd('projectDb')

    await Artisan.call('install:database')

    const packageJson = await new File(Path.pwd('projectDb/package.json')).load()

    assert.isTrue(packageJson.getContentSync().includes('@athenna/database'))
  }
}
