/**
 * @athenna/cli
 *
 * (c) Victor Tesoura Júnior <txsoura@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Config, File, Folder, Path } from '@secjs/utils'

import { New } from '#src/Commands/New'

test.group('NewTest', group => {
  group.setup(async () => {
    await new Config().safeLoad(Path.config('logging.js'))
  })

  group.teardown(async () => {
    await Folder.safeRemove(Path.pwd('cliProject'))
    await Folder.safeRemove(Path.pwd('httpProject'))
  })

  test('should be able to create a new http project', async ({ assert }) => {
    await new New(Path.pwd()).project('httpProject', { type: 'http' })

    assert.isTrue(File.existsSync(Path.pwd('httpProject/.env')))
    assert.isTrue(File.existsSync(Path.pwd('httpProject/app')))
    assert.isTrue(File.existsSync(Path.pwd('httpProject/config')))
    assert.isTrue(File.existsSync(Path.pwd('httpProject/providers')))
    assert.isTrue(File.existsSync(Path.pwd('httpProject/node_modules')))
  }).timeout(60000)

  test('should be able to create a new cli project', async ({ assert }) => {
    await new New(Path.pwd()).project('cliProject', { type: 'cli' })

    assert.isTrue(File.existsSync(Path.pwd('cliProject/.env')))
    assert.isTrue(File.existsSync(Path.pwd('cliProject/app')))
    assert.isTrue(File.existsSync(Path.pwd('cliProject/config')))
    assert.isTrue(File.existsSync(Path.pwd('cliProject/providers')))
    assert.isTrue(File.existsSync(Path.pwd('cliProject/node_modules')))
  }).timeout(60000)
})
