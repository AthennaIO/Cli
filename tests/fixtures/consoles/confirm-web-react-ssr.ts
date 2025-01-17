/**
 * @athenna/cli
 *
 * (c) Victor Tesoura Júnior <txsoura@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Mock } from '@athenna/test'
import { Path } from '@athenna/common'
import { Ignite } from '@athenna/core'
import { Prompt } from '@athenna/artisan'

Mock.when(Prompt.prototype, 'confirm').resolve(false)
Mock.when(Prompt.prototype, 'list').resolve('WEB REACT SSR')

const ignite = await new Ignite().load(Path.toHref(Path.bin('artisan.ts')), { bootLogs: false })

await ignite.console(process.argv, { displayName: 'Artisan' })
