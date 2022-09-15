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
  |   "console", "discord", "file", "null", "slack", "telegram".
  | Available Formatters:
  |   "cli", "simple", "json", "request", "message".
  |
  */

  channels: {
    application: {
      driver: 'console',
      formatter: 'simple',
    },
    console: {
      driver: 'console',
      formatter: 'cli',
    },
    exception: {
      driver: 'console',
      formatter: 'none',
      streamType: 'stderr',
    },
    request: {
      driver: 'console',
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
