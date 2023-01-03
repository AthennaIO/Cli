export default {
  /*
  |--------------------------------------------------------------------------
  | Default Mailer
  |--------------------------------------------------------------------------
  |
  | This option controls the default mailer that is used to send any email
  | messages sent by your application. Alternative mailers may be setup
  | and used as needed; however, this mailer will be used by default.
  |
  */

  default: Env('MAIL_MAILER', 'smtp'),

  /*
  |--------------------------------------------------------------------------
  | Mailer Configurations
  |--------------------------------------------------------------------------
  |
  | Here you may configure all the mailers used by your application plus
  | their respective settings. Several examples have been configured for
  | you, and you are free to add your own as your application requires.
  |
  | Athenna supports a variety of mail "transport" drivers to be used while
  | sending an e-mail. You will specify which one you are using for your
  | mailers below. You are free to add additional mailers as required.
  |
  | Supported: "smtp".
  |
  */

  mailers: {
    smtp: {
      driver: 'smtp',
      host: Env('MAIL_HOST', 'localhost'),
      port: Env('MAIL_PORT', 587),
      auth: {
        user: Env('MAIL_USERNAME'),
        pass: Env('MAIL_PASSWORD'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    },
  },
}
