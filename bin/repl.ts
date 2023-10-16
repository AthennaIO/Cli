import { Ignite } from '@athenna/core'

const ignite = await new Ignite().load(import.meta.url, { bootLogs: false })

const repl = await ignite.repl()

await repl.importAll('@athenna/common')
