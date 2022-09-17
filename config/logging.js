import { Path } from '@secjs/utils'

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

  default: Env('LOG_CHANNEL', 'console'),

  /*
  |--------------------------------------------------------------------------
  | Log Channels
  |--------------------------------------------------------------------------
  |
  | Here you may configure the log channels for your application.
  |
  | Available Drivers:
  |   "stack", "console", "discord", "file", "null", "slack", "telegram".
  | Available Formatters:
  |   "cli", "simple", "json", "request", "message".
  |
  */

  channels: {
    stack: {
      driver: 'stack',
      channels: ['application'],
    },

    application: {
      driver: 'console',
      level: 'trace',

      formatter: 'simple',
    },
    console: {
      driver: 'console',
      level: 'trace',

      formatter: 'cli',
    },
    exception: {
      driver: 'console',
      level: 'trace',
      streamType: 'stderr',

      formatter: 'none',
    },
    request: {
      driver: 'console',
      level: 'trace',

      formatter: 'request',
      formatterConfig: {
        asJson: false,
      },
    },
    discard: {
      driver: 'null',
    },
    file: {
      driver: 'file',
      level: 'trace',
      filePath: Path.logs('athenna.log'),

      formatter: 'simple',
      formatterConfig: {},
    },
    slack: {
      driver: 'slack',
      level: 'fatal',
      url: 'your-slack-webhook-url',

      formatter: 'message',
      formatterConfig: {},
    },
    discord: {
      driver: 'discord',
      level: 'fatal',
      username: 'Athenna',
      url: 'your-discord-webhook-url',

      formatter: 'message',
      formatterConfig: {},
    },
    telegram: {
      driver: 'telegram',
      level: 'fatal',
      chatId: 0,
      parseMode: 'HTML',
      token: 'your-telegram-bot-token',

      formatter: 'message',
      formatterConfig: {},
    },
  },
}
