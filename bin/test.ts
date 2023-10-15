import { command } from '@athenna/artisan/testing/plugins'
import { Runner, assert, specReporter } from '@athenna/test'

await Runner.setTsEnv()
  .addPlugin(assert())
  .addPlugin(command())
  .addReporter(specReporter())
  .addPath('tests/e2e/**/*.ts')
  .addPath('tests/unit/**/*.ts')
  .setCliArgs(process.argv.slice(2))
  .setGlobalTimeout(60000)
  .run()
