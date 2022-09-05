import { Path } from '@secjs/utils'
import { DatabaseLoader } from '@athenna/database'

export default {
  /*
  |--------------------------------------------------------------------------
  | Default Database Connection Name
  |--------------------------------------------------------------------------
  |
  | Here you may specify which of the database connections below you wish
  | to use as your default connection for all database work. Of course
  | you may use many connections at once using the Database library.
  |
  */
  default: Env('DB_CONNECTION', 'postgres'),

  /*
  |--------------------------------------------------------------------------
  | Database Connections
  |--------------------------------------------------------------------------
  |
  | Here are each of the database connections setup for your application.
  | Of course, examples of configuring each database platform that is
  | supported by Athenna is shown below to make development simple.
  |
  */

  connections: {
    mysql: {
      driver: 'mysql',
      host: '127.0.0.1',
      port: 3307,
      database: 'athenna',
      username: 'root',
      password: '12345',
      logging: ['error', 'warn'],
      entities: await DatabaseLoader.loadEntities('mysql'),
      migrations: [Path.stubs('database/migrations/**/*.js')],
      synchronize: false,
    },

    postgres: {
      driver: 'postgres',
      host: 'localhost',
      port: 5433,
      database: 'postgres',
      username: 'postgres',
      password: '12345',
      logging: ['error', 'warn'],
      entities: await DatabaseLoader.loadEntities('postgres'),
      migrations: [Path.stubs('database/migrations/**/*.js')],
      synchronize: false,
    },
  },

  /*
  |--------------------------------------------------------------------------
  | Migration Repository Table
  |--------------------------------------------------------------------------
  |
  | This table keeps track of all the migrations that have already run for
  | your application. Using this information, we can determine which of
  | the migrations on disk haven't actually been run in the database.
  |
  */

  migrations: Env('DB_MIGRATIONS', 'migrations'),
}
