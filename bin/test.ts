import { assert } from '@japa/assert'
import { Importer } from '@athenna/test'
import { specReporter } from '@japa/spec-reporter'
import { configure, processCliArgs, run } from '@japa/runner'

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/unit/**/*.test.ts', 'tests/e2e/**/*.test.ts'],
    plugins: [assert()],
    reporters: [specReporter()],
    importer: Importer.import,
    timeout: 60000,
  },
})

run()
