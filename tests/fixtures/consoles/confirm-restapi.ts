import { Mock } from '@athenna/test'
import { Ignite } from '@athenna/core'
import { Prompt } from '@athenna/artisan'

Mock.when(Prompt.prototype, 'confirm').resolve(false)
Mock.when(Prompt.prototype, 'list').resolve('REST API')

const ignite = await new Ignite().load(Path.toHref(Path.bin('artisan.ts')), { bootLogs: false })

await ignite.console(process.argv, { displayName: 'Artisan' })
