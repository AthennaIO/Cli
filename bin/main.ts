#!/usr/bin/env node

import 'reflect-metadata'
import sourceMapSupport from 'source-map-support'

import { Ignite } from '@athenna/core'
import { UpdateNotificationHelper } from '#src/helpers/updatenotification.helper'

sourceMapSupport.install({ handleUncaughtExceptions: false })

const ignite = await new Ignite().load(import.meta.url, {
  bootLogs: false,
  athennaRcPath: '.athennarc.prod.json',
})

Config.set('app.version', `Athenna CLI v${process.env.APP_VERSION}`)

await UpdateNotificationHelper.verify()

await ignite.console(process.argv, { displayName: 'Athenna' })
