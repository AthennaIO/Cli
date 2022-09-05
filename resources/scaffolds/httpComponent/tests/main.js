import { assert } from '@japa/assert'
import { TestSuite } from '@athenna/test'
import { specReporter } from '@japa/spec-reporter'
import { runFailedTests } from '@japa/run-failed-tests'
import { processCliArgs, configure, run } from '@japa/runner'

/*
|--------------------------------------------------------------------------
| Service container mocking
|--------------------------------------------------------------------------
|
| Reserve this space to set mocks for the service container using the global
| 'ioc' instance. It's important for this code to stay before where we
| ignite the application.
*/

// ioc.mock('App/Services/WelcomeService', WelcomeServiceMock)

/*
|--------------------------------------------------------------------------
| Configure tests
|--------------------------------------------------------------------------
|
| The configure method accepts the configuration to configure the Japa
| tests runner.
|
| The first method call "processCliArgs" process the command line arguments
| and turns them into a config object. Using this method is not mandatory.
|
| Please consult japa.dev/runner-config for the config docs.
*/

configure({
  ...processCliArgs(TestSuite.getArgs()),
  ...{
    suites: [
      {
        name: 'E2E',
        files: ['tests/E2E/**/*Test.js', 'tests/E2E/**/*TestFn.js'],
        configure: suite => TestSuite.httpEnd2EndSuite(suite),
      },
      {
        name: 'Unit',
        files: ['tests/Unit/**/*Test.js', 'tests/Unit/**/*TestFn.js'],
        configure: suite => TestSuite.unitSuite(suite),
      },
    ],
    plugins: [assert(), runFailedTests()],
    reporters: [specReporter()],
    importer: filePath => TestSuite.importer(filePath),
  },
})

/*
|--------------------------------------------------------------------------
| Run tests
|--------------------------------------------------------------------------
|
| The following "run" method is required to execute all the tests.
|
*/

run()
