import 'reflect-metadata'
import sourceMapSupport from 'source-map-support'

import { Ignite } from '@athenna/core/src/Ignite'

async function main() {
  sourceMapSupport.install()

  await new Ignite(__filename).httpServer()
}

main().catch()
