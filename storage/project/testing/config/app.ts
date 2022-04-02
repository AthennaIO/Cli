export default {
  /*
  |--------------------------------------------------------------------------
  | Default environment
  |--------------------------------------------------------------------------
  |
  | Default environment of the application.
  |
  */

  environment: process.env.NODE_ENV || 'production',

  /*
  |--------------------------------------------------------------------------
  | Application Name
  |--------------------------------------------------------------------------
  |
  | This value is the name of your application and can be used when you
  | need to place the application's name in an email or other location.
  |
  */

  name: Env('APP_NAME', 'Athenna'),

  /*
  |--------------------------------------------------------------------------
  | Application Version
  |--------------------------------------------------------------------------
  |
  | This value is the version of your application and can be used when you
  | need to place the application's version in a route, view or
  | other location.
  |
  */

  version: '1.0.0',

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

  description: Env('APP_DESCRIPTION', 'Athenna Framework'),

  /*
  |--------------------------------------------------------------------------
  | Application host
  |--------------------------------------------------------------------------
  |
  | This value is the HOST of your application and its used to access your
  | application.
  |
  */

  host: Env('HOST', '127.0.0.1'),

  /*
  |--------------------------------------------------------------------------
  | Application port
  |--------------------------------------------------------------------------
  |
  | This value is the PORT of your application, and it's used to access your
  | application.
  |
  */

  port: Env('PORT', 1335),

  /*
  |--------------------------------------------------------------------------
  | Application domain
  |--------------------------------------------------------------------------
  |
  | This value is the APP_DOMAIN of your application, and it's used to access
  | your application.
  |
  */

  domain: Env('APP_DOMAIN', 'http://localhost:1335'),

  /*
  |--------------------------------------------------------------------------
  | Application source url
  |--------------------------------------------------------------------------
  |
  | This value is the application source url, usually a link to a git
  | repository.
  |
  */

  source: Env('APP_SOURCE', 'https://github.com/AthennaIO'),

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
    require('@athenna/http/src/Providers/HttpServerProvider'),
    require('@athenna/http/src/Providers/HttpRouteProvider'),
    require('@athenna/logger/src/Providers/LoggerProvider'),
    require('@athenna/core/src/Providers/ServicesProvider'),
    require('@athenna/core/src/Providers/ControllerProvider'),
    require('@athenna/core/src/Providers/MiddlewareProvider'),

    require('providers/AppServiceProvider'),
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
  preloads: ['../routes/http'],
}
