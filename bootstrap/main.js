#!/usr/bin/env node

/**
 * @athenna/cli
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Ignite } from '@athenna/core'

async function main() {
  process.env.NODE_ENV = 'production'
  process.env.CALL_PATH = process.cwd()

  const application = await new Ignite().fire(import.meta.url, {
    bootLogs: false,
  })
  const artisan = await application.bootArtisan()

  await artisan.main('Athenna')
}

main().catch()
