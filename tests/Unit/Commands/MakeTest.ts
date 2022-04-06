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
import { Make } from '../../../src/Commands/Make'

describe('\n MakeTest', () => {
  it('should be able to create a controller file', async () => {
    await new Make(Path.storage()).controller('TestControllers', { extension: 'ts' })

    expect(existsSync(Path.storage('app/Http/Controllers/TestController.ts'))).toBeTruthy()
  }, 60000)

  it('should be able to create a middleware file', async () => {
    await new Make(Path.storage()).middleware('TestMiddlewares', { extension: 'ts' })

    expect(existsSync(Path.storage('app/Http/Middlewares/TestMiddleware.ts'))).toBeTruthy()
  }, 60000)

  afterEach(async () => {
    await Folder.safeRemove('storage/app')
  })
})
