import { File, Folder } from '@athenna/common'
import { Test, AfterEach, type Context } from '@athenna/test'
import { BaseConsoleTest } from '@athenna/core/testing/BaseConsoleTest'

export default class NewCommandTest extends BaseConsoleTest {
  @AfterEach()
  public async afterEach() {
    await Folder.safeRemove(Path.pwd('project'))
  }

  @Test()
  public async shouldBeAbleToCreateAHttpProject({ command, assert }: Context) {
    const output = await command.run('new project', {
      path: Path.fixtures('consoles/confirm-restapi.ts'),
    })

    output.assertSucceeded()

    assert.isFalse(await Folder.exists(Path.pwd('project/.git')))
    assert.isFalse(await Folder.exists(Path.pwd('project/.github')))
    assert.isFalse(await Folder.exists(Path.pwd('project/README.md')))
    assert.isTrue(await File.exists(Path.pwd('project/.env')))
    assert.isTrue(await File.exists(Path.pwd('project/.env.test')))
    assert.isTrue(await File.exists(Path.pwd('project/.env.example')))
    assert.isTrue(await File.exists(Path.pwd('project/bootstrap/main.ts')))
  }

  @Test()
  public async shouldBeAbleToCreateASlimHttpProject({ command, assert }: Context) {
    const output = await command.run('new project', {
      path: Path.fixtures('consoles/confirm-restapi-slim.ts'),
    })

    output.assertSucceeded()

    assert.isFalse(await Folder.exists(Path.pwd('project/.git')))
    assert.isFalse(await Folder.exists(Path.pwd('project/.github')))
    assert.isFalse(await Folder.exists(Path.pwd('project/README.md')))
    assert.isFalse(await File.exists(Path.pwd('project/.env')))
    assert.isFalse(await File.exists(Path.pwd('project/.env.test')))
    assert.isFalse(await File.exists(Path.pwd('project/.env.example')))
    assert.isTrue(await File.exists(Path.pwd('project/bin/main.ts')))
  }

  @Test()
  public async shouldBeAbleToCreateACliProject({ command, assert }: Context) {
    const output = await command.run('new project', {
      path: Path.fixtures('consoles/confirm-cli.ts'),
    })

    output.assertSucceeded()

    assert.isFalse(await Folder.exists(Path.pwd('project/.git')))
    assert.isFalse(await Folder.exists(Path.pwd('project/.github')))
    assert.isFalse(await Folder.exists(Path.pwd('project/README.md')))
    assert.isTrue(await File.exists(Path.pwd('project/.env')))
    assert.isTrue(await File.exists(Path.pwd('project/.env.test')))
    assert.isTrue(await File.exists(Path.pwd('project/.env.example')))
    assert.isTrue(await File.exists(Path.pwd('project/bootstrap/main.ts')))
  }

  @Test()
  public async shouldBeAbleToCreateASlimCliProject({ command, assert }: Context) {
    const output = await command.run('new project', {
      path: Path.fixtures('consoles/confirm-cli-slim.ts'),
    })

    output.assertSucceeded()

    assert.isFalse(await Folder.exists(Path.pwd('project/.git')))
    assert.isFalse(await Folder.exists(Path.pwd('project/.github')))
    assert.isFalse(await Folder.exists(Path.pwd('project/README.md')))
    assert.isFalse(await File.exists(Path.pwd('project/.env')))
    assert.isFalse(await File.exists(Path.pwd('project/.env.test')))
    assert.isFalse(await File.exists(Path.pwd('project/.env.example')))
    assert.isTrue(await File.exists(Path.pwd('project/bin/main.ts')))
  }

  @Test()
  public async shouldBeAbleToCreateADifferentArtisanFileForNodeJSVersionsBellowV20({ command, assert }: Context) {
    const output = await command.run('new project', {
      path: Path.fixtures('consoles/confirm-restapi-bellow-v20.ts'),
    })

    output.assertSucceeded()

    const artisanFile = new File(Path.pwd('project/artisan.js')).getContentAsStringSync()

    assert.isTrue(artisanFile.includes('./bootstrap/artisan.js'))
    assert.isTrue(artisanFile.includes('--no-warnings'))
    assert.isTrue(artisanFile.includes('--loader=ts-node/esm'))
    assert.isTrue(await File.exists(Path.pwd('project/bootstrap/main.ts')))
  }

  @Test()
  public async shouldBeAbleToCreateADifferentArtisanFileForNodeJSVersionsBellowV20ForSlimApps({
    command,
    assert,
  }: Context) {
    const output = await command.run('new project', {
      path: Path.fixtures('consoles/confirm-restapi-slim-bellow-v20.ts'),
    })

    output.assertSucceeded()

    const artisanFile = new File(Path.pwd('project/artisan.js')).getContentAsStringSync()

    assert.isTrue(artisanFile.includes('./bin/artisan.js'))
    assert.isTrue(artisanFile.includes('--no-warnings'))
    assert.isTrue(artisanFile.includes('--loader=ts-node/esm'))
    assert.isTrue(await File.exists(Path.pwd('project/bin/main.ts')))
  }

  @Test()
  public async shouldThrowAnExceptionWhenTheProjectRootPathAlreadyExist({ command }: Context) {
    await command.run('new project', {
      path: Path.fixtures('consoles/confirm-restapi.ts'),
    })

    const output = await command.run('new project', {
      path: Path.fixtures('consoles/confirm-restapi.ts'),
    })

    output.assertFailed()
    output.assertLogged('The directory')
    output.assertLogged('already exists. Try another project name or delete')
  }
}
