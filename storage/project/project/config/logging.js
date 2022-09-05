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

  default: Env('LOG_CHANNEL', 'application'),

  /*
  |--------------------------------------------------------------------------
  | Log Channels
  |--------------------------------------------------------------------------
  |
  | Here you may configure the log channels for your application.
  |
  | Available Drivers:
  |   "console", "debug", "discord", "file", "null", "pino", "slack", "telegram".
  | Available Formatters:
  |   "cli", "simple", "nest", "json", "request", "message", "pino-pretty(only for pino driver)".
  |
  */

  channels: {
    application: {
      driver: 'console',
      formatter: 'simple',
      streamType: 'stdout',
      formatterConfig: {},
    },
    console: {
      driver: 'console',
      formatter: 'cli',
      streamType: 'stdout',
      formatterConfig: {},
    },
    exception: {
      driver: 'console',
      formatter: 'none',
      streamType: 'stdout',
    },
    request: {
      driver: 'console',
      formatter: 'request',
      streamType: 'stdout',
      formatterConfig: {
        asJson: false,
      },
    },
    pino: {
      driver: 'pino',
      formatter: 'pino-pretty',
      formatterConfig: {
        colorize: true,
      },
    },
    debug: {
      driver: 'debug',
      formatter: 'nest',
      namespace: 'api:main',
      formatterConfig: {
        level: 'DEBUG',
        context: 'Debugger',
      },
    },
    discard: {
      driver: 'null',
    },
    file: {
      driver: 'file',
      formatter: 'simple',
      filePath: Path.logs('athenna.log'),
      formatterConfig: {},
    },
    slack: {
      driver: 'slack',
      formatter: 'message',
      url: 'your-slack-webhook-url',
      formatterConfig: {},
    },
    discord: {
      driver: 'discord',
      formatter: 'message',
      username: 'Athenna',
      url: 'your-discord-webhook-url',
      formatterConfig: {},
    },
    telegram: {
      driver: 'telegram',
      formatter: 'message',
      token: 'your-telegram-bot-token',
      chatId: 0,
      parseMode: 'HTML',
      formatterConfig: {},
    },
  },
}
