import { Ignite } from '@athenna/core'

const ignite = await new Ignite().load(import.meta.url, { bootLogs: false })

await ignite.console(process.argv, { displayName: 'Artisan' })
