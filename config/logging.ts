/**
 * @athenna/cli
 *
 * (c) Victor Tesoura Júnior <txsoura@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default {
  /*
  |--------------------------------------------------------------------------
  | Default Log Channel
  |--------------------------------------------------------------------------
  |
  | This option defines the default log channel that gets used when writing
  | messages to the logs. The name specified in this option should match
  | one of the channels defined in the "channels" configuration object.
  |
  */

  default: 'application',

  /*
  |--------------------------------------------------------------------------
  | Log Channels
  |--------------------------------------------------------------------------
  |
  | Here you may configure the log channels for your application.
  |
  | Available Drivers: "console", "debug", "file".
  | Available Formatters: "context", "debug", "json", "log".
  |
  */

  channels: {
    application: {
      driver: 'console',
      level: 'INFO',
      context: 'Logger',
      formatter: 'log',
      streamType: 'stdout',
    },
  },
}
