import { Test } from '@athenna/test'
import { Artisan } from '@athenna/artisan'
import { Folder, Path } from '@athenna/common'

export class NewCommandTest extends Test {
  get timeout() {
    return 60000
  }

  async afterEach() {
    await Folder.safeRemove(Path.pwd('projectCli'))
    await Folder.safeRemove(Path.pwd('projectSlim'))
    await Folder.safeRemove(Path.pwd('projectHttp'))
    await Folder.safeRemove(Path.pwd('projectDefault'))
  }

  /**
   * @param {import('@athenna/test').HttpTestContext} ctx
   */
  async shouldBeAbleToCreateAthennaProject({ assert }) {
    await Artisan.call('new projectDefault')

    assert.isTrue(await Folder.exists(Path.pwd('projectDefault/app')))
  }

  /**
   * @param {import('@athenna/test').HttpTestContext} ctx
   */
  async shouldBeAbleToCreateAthennaCliProject({ assert }) {
    await Artisan.call(`new ${Path.pwd('projectCli')} --type cli`)

    assert.isTrue(await Folder.exists(Path.pwd('projectCli/app')))
  }

  /**
   * @param {import('@athenna/test').HttpTestContext} ctx
   */
  async shouldBeAbleToCreateAthennaSlimProject({ assert }) {
    await Artisan.call(`new ${Path.pwd('projectSlim')} --type slim`)

    assert.isTrue(await Folder.exists(Path.pwd('projectSlim/app')))
  }

  /**
   * @param {import('@athenna/test').HttpTestContext} ctx
   */
  async shouldBeAbleToCreateAthennaHttpProject({ assert }) {
    await Artisan.call(`new ${Path.pwd('projectHttp')} --type http`)

    assert.isTrue(await Folder.exists(Path.pwd('projectHttp/app')))
  }

  /**
   * @param {import('@athenna/test').HttpTestContext} ctx
   */
  async shouldThrowNotEmptyFolderException({ assert }) {
    await Artisan.call('new projectDefault --type slim')
    await Artisan.call('new projectDefault --type slim')
  }

  /**
   * @param {import('@athenna/test').HttpTestContext} ctx
   */
  async shouldThrowNotFoundProjectTypeException({ assert }) {
    await Artisan.call('new projectDefault --type not-found')
  }
}
