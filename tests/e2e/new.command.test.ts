import { File, Folder } from '@athenna/common'
import { Prompt, Artisan } from '@athenna/artisan'
import { BaseE2ETest } from '#tests/helpers/base.e2e.test'
import { ExitFaker, Test, type Context } from '@athenna/test'

export default class NewCommandTest extends BaseE2ETest {
  @Test()
  public async shouldBeAbleToCreateAHttpProject({ assert }: Context) {
    Prompt.prototype.confirm = () => Promise.resolve(false)
    Prompt.prototype.list = () => Promise.resolve('REST API')

    await Artisan.call('new project', false)

    assert.isTrue(ExitFaker.faker.calledWith(0))
    assert.isFalse(await Folder.exists(Path.pwd('project/.git')))
    assert.isFalse(await Folder.exists(Path.pwd('project/.github')))
    assert.isTrue(await File.exists(Path.pwd('project/.env')))
    assert.isTrue(await File.exists(Path.pwd('project/.env.test')))
    assert.isTrue(await File.exists(Path.pwd('project/.env.example')))
    assert.isTrue(await File.exists(Path.pwd('project/bootstrap/main.ts')))
  }

  @Test()
  public async shouldBeAbleToCreateASlimHttpProject({ assert }: Context) {
    Prompt.prototype.confirm = () => Promise.resolve(true)
    Prompt.prototype.list = () => Promise.resolve('REST API')

    await Artisan.call('new project', false)

    assert.isTrue(ExitFaker.faker.calledWith(0))
    assert.isFalse(await Folder.exists(Path.pwd('project/.git')))
    assert.isFalse(await Folder.exists(Path.pwd('project/.github')))
    assert.isFalse(await File.exists(Path.pwd('project/.env')))
    assert.isFalse(await File.exists(Path.pwd('project/.env.test')))
    assert.isFalse(await File.exists(Path.pwd('project/.env.example')))
    assert.isTrue(await File.exists(Path.pwd('project/bin/main.ts')))
  }

  @Test()
  public async shouldBeAbleToCreateACliProject({ assert }: Context) {
    Prompt.prototype.confirm = () => Promise.resolve(false)
    Prompt.prototype.list = () => Promise.resolve('CLI')

    await Artisan.call('new project', false)

    assert.isTrue(ExitFaker.faker.calledWith(0))
    assert.isFalse(await Folder.exists(Path.pwd('project/.git')))
    assert.isFalse(await Folder.exists(Path.pwd('project/.github')))
    assert.isTrue(await File.exists(Path.pwd('project/.env')))
    assert.isTrue(await File.exists(Path.pwd('project/.env.test')))
    assert.isTrue(await File.exists(Path.pwd('project/.env.example')))
    assert.isTrue(await File.exists(Path.pwd('project/bootstrap/main.ts')))
  }

  @Test()
  public async shouldBeAbleToCreateASlimCliProject({ assert }: Context) {
    Prompt.prototype.confirm = () => Promise.resolve(true)
    Prompt.prototype.list = () => Promise.resolve('CLI')

    await Artisan.call('new project', false)

    assert.isTrue(ExitFaker.faker.calledWith(0))
    assert.isFalse(await Folder.exists(Path.pwd('project/.git')))
    assert.isFalse(await Folder.exists(Path.pwd('project/.github')))
    assert.isFalse(await File.exists(Path.pwd('project/.env')))
    assert.isFalse(await File.exists(Path.pwd('project/.env.test')))
    assert.isFalse(await File.exists(Path.pwd('project/.env.example')))
    assert.isTrue(await File.exists(Path.pwd('project/bin/main.ts')))
  }

  @Test()
  public async shouldThrowAnExceptionWhenTheProjectRootPathAlreadyExist({ assert }: Context) {
    Prompt.prototype.confirm = () => Promise.resolve(false)
    Prompt.prototype.list = () => Promise.resolve('REST API')

    await Artisan.call('new project', false)
    await Artisan.call('new project', false)

    assert.isTrue(ExitFaker.faker.calledWith(1))
  }
}
