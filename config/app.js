import { File } from '@athenna/common'
import { ProviderHelper } from '@athenna/core'

const { name, version, description } = JSON.parse(
  new File('../package.json').getContentSync().toString(),
)

export default {
  /*
  |--------------------------------------------------------------------------
  | Default environment
  |--------------------------------------------------------------------------
  |
  | Default environment of the application.
  |
  */

  environment: process.env.NODE_ENV || 'local',

  /*
  |--------------------------------------------------------------------------
  | Application debug
  |--------------------------------------------------------------------------
  |
  | Set if the application will start in debug mode or not. If in debug mode,
  | the application will show sensitive logs and return sensitive data on errors.
  |
  */

  debug: Env('APP_DEBUG', true),

  /*
  |--------------------------------------------------------------------------
  | Application Name
  |--------------------------------------------------------------------------
  |
  | This value is the name of your application and can used when you
  | need to place the application's name in a email, view or
  | other location.
  |
  */

  name: name || Env('APP_NAME', 'Athenna'),

  /*
  |--------------------------------------------------------------------------
  | Application Version
  |--------------------------------------------------------------------------
  |
  | This value is the version of your application and can used when you
  | need to place the application's version in a route, view or
  | other location.
  |
  */

  version,

  /*
  |--------------------------------------------------------------------------
  | Application Description
  |--------------------------------------------------------------------------
  |
  | This value is the description of your application and can used when you
  | need to place the application's description in swagger, view or
  | other location.
  |
  */

  description: description || Env('APP_DESCRIPTION', 'Athenna is awesome!'),

  /*
  |--------------------------------------------------------------------------
  | Application key
  |--------------------------------------------------------------------------
  |
  | This value is the application key used to make hashs and to authorize,
  | requests.
  |
  */

  appKey: Env('APP_KEY', '12345'),

  /*
  |--------------------------------------------------------------------------
  | Application source url
  |--------------------------------------------------------------------------
  |
  | This value is the application source url, usually a link to a git repo-
  | sitory.
  |
  */

  source: Env('APP_SOURCE', 'https://github.com/AthennaIO'),

  /*
  |--------------------------------------------------------------------------
  | Documentation url
  |--------------------------------------------------------------------------
  |
  | This value is the application documentation url, usually a link to the
  | main documentation of the API.
  |
  */

  documentation: Env('APP_DOMAIN', 'http://localhost:1335'),

  /*
  |--------------------------------------------------------------------------
  | Default Locale
  |--------------------------------------------------------------------------
  |
  | Default locale to be used by Intl provider. You can always switch drivers
  | in runtime or use the official Intl middleware to detect the driver
  | based on HTTP headers/query string.
  |
  */

  locale: Env('APP_LOCALE', 'pt'),

  /*
  |--------------------------------------------------------------------------
  | Graceful shutdown callback
  |--------------------------------------------------------------------------
  |
  | Configure all the defaults graceful shutdown callbacks to listen to Node.js
  | SIG events.
  |
  */

  gracefulShutdown: {
    SIGINT: async () => {
      await ProviderHelper.shutdownAll(false)

      process.exit()
    },
    SIGTERM: async signal => {
      await ProviderHelper.shutdownAll()

      process.kill(process.pid, signal)
    },
  },
  /*
  |--------------------------------------------------------------------------
  | Application providers
  |--------------------------------------------------------------------------
  |
  | The service providers listed here will be automatically loaded on the
  | ignite of your application. Feel free to add your own services to
  | this array to grant expanded functionality to your applications.
  |
  */

  providers: [
    import('@athenna/logger/providers/LoggerProvider'),
    import('@athenna/core/providers/ServiceProvider'),
    import('@athenna/core/providers/RepositoryProvider'),
    import('@athenna/artisan/providers/ArtisanProvider'),
    import('@athenna/artisan/providers/TemplateProvider'),
    import('#providers/AppServiceProvider'),
  ],

  /*
  |--------------------------------------------------------------------------
  | Application preloads
  |--------------------------------------------------------------------------
  |
  | The files listed here will be automatically loaded on the application
  | ignite of your application. Fell free to add your own preloads to this
  | array.
  |
  */

  preloads: [],
}
