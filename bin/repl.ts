import { Ignite } from '@athenna/core'

const ignite = await new Ignite().load(import.meta.url, { bootLogs: false })

const repl = await ignite.repl()

await import('@athenna/common').then(common => {
  Object.keys(common).forEach(key => (repl.context[key] = common[key]))
})
