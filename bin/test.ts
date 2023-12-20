import { Runner } from '@athenna/test'
import { command } from '@athenna/artisan/testing/plugins'

await Runner.setTsEnv()
  .addAssertPlugin()
  .addPlugin(command())
  .addPath('tests/e2e/**/*.ts')
  .addPath('tests/unit/**/*.ts')
  .setCliArgs(process.argv.slice(2))
  .setGlobalTimeout(60000)
  .run()
