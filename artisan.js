#!/usr/bin/env node

import { Exec } from '@athenna/common'

Exec.artisan('./bin/artisan.js', {
  nodeOptions: [
    '--enable-source-maps',
    '--disable-warning=DEP0180',
    '--disable-warning=DEP0040',
    '--import=@athenna/tsconfig',
  ],
})
