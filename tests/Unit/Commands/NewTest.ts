/**
 * @athenna/cli
 *
 * (c) Victor Tesoura Júnior <txsoura@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { existsSync } from 'fs'
import { Folder, Path } from '@secjs/utils'
import { New } from '../../../src/Commands/New'

describe('\n NewTest', () => {
  it('should be able to create a new http project', async () => {
    await new New(Path.pwd()).project('test', { type: 'http' })

    expect(existsSync(Path.pwd('test/.env'))).toBeTruthy()
    expect(existsSync(Path.pwd('test/app'))).toBeTruthy()
    expect(existsSync(Path.pwd('test/config'))).toBeTruthy()
    expect(existsSync(Path.pwd('test/providers'))).toBeTruthy()
    expect(existsSync(Path.pwd('test/node_modules'))).toBeTruthy()
  }, 60000)

  afterEach(async () => {
    await Folder.safeRemove('test')
  })
})
