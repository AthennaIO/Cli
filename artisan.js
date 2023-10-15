#!/usr/bin/env node

import { Exec } from '@athenna/common'

Exec.artisan('./bin/artisan.js', {
  nodeOptions: ['--enable-source-maps', '--import=@athenna/tsconfig'],
})
