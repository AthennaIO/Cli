import { File, Folder } from '@athenna/common'
import { Prompt, Artisan } from '@athenna/artisan'
import { BaseCliTest } from '@athenna/core/testing/BaseCliTest'
import { Test, Mock, AfterEach, BeforeEach, type Stub, type Context } from '@athenna/test'

export default class NewCommandTest extends BaseCliTest {
  public processExitMock: Stub

  @BeforeEach()
  public async beforeEach() {
    this.processExitMock = Mock.when(process, 'exit').return(undefined)
  }

  @AfterEach()
  public async afterEach() {
    Mock.restoreAll()

    await Folder.safeRemove(Path.storage())
    await Folder.safeRemove(Path.pwd('project'))
  }

  @Test()
  public async shouldBeAbleToCreateAHttpProject({ assert }: Context) {
    Mock.when(Prompt.prototype, 'confirm').resolve(false)
    Mock.when(Prompt.prototype, 'list').resolve('REST API')

    await Artisan.call('new project', false)

    assert.isTrue(this.processExitMock.calledWith(0))
    assert.isFalse(await Folder.exists(Path.pwd('project/.git')))
    assert.isFalse(await Folder.exists(Path.pwd('project/.github')))
    assert.isTrue(await File.exists(Path.pwd('project/.env')))
    assert.isTrue(await File.exists(Path.pwd('project/.env.test')))
    assert.isTrue(await File.exists(Path.pwd('project/.env.example')))
    assert.isTrue(await File.exists(Path.pwd('project/bootstrap/main.ts')))
  }

  @Test()
  public async shouldBeAbleToCreateASlimHttpProject({ assert }: Context) {
    Mock.when(Prompt.prototype, 'confirm').resolve(true)
    Mock.when(Prompt.prototype, 'list').resolve('REST API')

    await Artisan.call('new project', false)

    assert.isTrue(this.processExitMock.calledWith(0))
    assert.isFalse(await Folder.exists(Path.pwd('project/.git')))
    assert.isFalse(await Folder.exists(Path.pwd('project/.github')))
    assert.isFalse(await File.exists(Path.pwd('project/.env')))
    assert.isFalse(await File.exists(Path.pwd('project/.env.test')))
    assert.isFalse(await File.exists(Path.pwd('project/.env.example')))
    assert.isTrue(await File.exists(Path.pwd('project/bin/main.ts')))
  }

  @Test()
  public async shouldBeAbleToCreateACliProject({ assert }: Context) {
    Mock.when(Prompt.prototype, 'confirm').resolve(false)
    Mock.when(Prompt.prototype, 'list').resolve('CLI')

    await Artisan.call('new project', false)

    assert.isTrue(this.processExitMock.calledWith(0))
    assert.isFalse(await Folder.exists(Path.pwd('project/.git')))
    assert.isFalse(await Folder.exists(Path.pwd('project/.github')))
    assert.isTrue(await File.exists(Path.pwd('project/.env')))
    assert.isTrue(await File.exists(Path.pwd('project/.env.test')))
    assert.isTrue(await File.exists(Path.pwd('project/.env.example')))
    assert.isTrue(await File.exists(Path.pwd('project/bootstrap/main.ts')))
  }

  @Test()
  public async shouldBeAbleToCreateASlimCliProject({ assert }: Context) {
    Mock.when(Prompt.prototype, 'confirm').resolve(true)
    Mock.when(Prompt.prototype, 'list').resolve('CLI')

    await Artisan.call('new project', false)

    assert.isTrue(this.processExitMock.calledWith(0))
    assert.isFalse(await Folder.exists(Path.pwd('project/.git')))
    assert.isFalse(await Folder.exists(Path.pwd('project/.github')))
    assert.isFalse(await File.exists(Path.pwd('project/.env')))
    assert.isFalse(await File.exists(Path.pwd('project/.env.test')))
    assert.isFalse(await File.exists(Path.pwd('project/.env.example')))
    assert.isTrue(await File.exists(Path.pwd('project/bin/main.ts')))
  }

  @Test()
  public async shouldThrowAnExceptionWhenTheProjectRootPathAlreadyExist({ assert }: Context) {
    Mock.when(Prompt.prototype, 'confirm').resolve(false)
    Mock.when(Prompt.prototype, 'list').resolve('REST API')

    await Artisan.call('new project', false)
    await Artisan.call('new project', false)

    assert.isTrue(this.processExitMock.calledWith(1))
  }
}
