#!/usr/bin/env -S node --experimental-import-meta-resolve

import { Ignite } from '@athenna/core'

const ignite = await new Ignite().load(import.meta.url, {
  bootLogs: false,
  athennaRcPath: './.athennarc.prod.json',
})

await ignite.artisan(process.argv, { displayName: 'Athenna' })
