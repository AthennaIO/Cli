import { Color, Exception } from '@athenna/common'

export class NotFoundProjectTypeException extends Exception {
  public constructor(type: string, supported: string[]) {
    const status = 500
    const help = undefined
    const code = 'E_SIMPLE_CLI'
    const message = `The project type ${Color.yellow.bold(
      type,
    )} is not supported by Athenna. Athenna has support only for ${Color.yellow.bold(
      supported.join(', '),
    )} applications. If you wish to create the ${Color.yellow.bold(
      type,
    )} project type, please open an issue at ${Color.purple.bold(
      'https://github.com/AthennaIO/Core/issues/new/choose',
    )}`

    super({ code, help, status, message })
  }
}
