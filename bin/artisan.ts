#!/usr/bin/env node --experimental-import-meta-resolve

import { Ignite } from '@athenna/core'

const ignite = await new Ignite().load(import.meta.url, { bootLogs: false })

await ignite.artisan(process.argv, { displayName: 'Artisan' })
