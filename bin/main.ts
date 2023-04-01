#!/usr/bin/env -S node --experimental-import-meta-resolve

import { Ignite } from '@athenna/core'

const ignite = await new Ignite().load(import.meta.url, {
  bootLogs: false,
  athennaRcPath: './.athennarc.prod.json',
})

Config.set('app.version', `Athenna CLI v${process.env.APP_VERSION}`)

await ignite.artisan(process.argv, { displayName: 'Athenna' })
