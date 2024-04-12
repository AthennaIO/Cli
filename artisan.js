#!/usr/bin/env node

import { Exec } from '@athenna/common'

Exec.artisan('./bin/artisan.js', {
  nodeOptions: [
    '--no-warnings',
    '--enable-source-maps',
    '--import=@athenna/tsconfig',
  ],
})
