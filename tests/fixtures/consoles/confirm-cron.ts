import { Mock } from '@athenna/test'
import { Path } from '@athenna/common'
import { Ignite } from '@athenna/core'
import { Prompt } from '@athenna/artisan'

Mock.when(Prompt.prototype, 'confirm').resolve(false)
Mock.when(Prompt.prototype, 'list').resolve('CRON')

const ignite = await new Ignite().load(Path.toHref(Path.bin('artisan.ts')), { bootLogs: false })

await ignite.console(process.argv, { displayName: 'Artisan' })
