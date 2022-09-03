import { Exception } from '@athenna/core'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@athenna/core` allows defining
| a status code, error code and help for every exception.
|
| @example
| new NotFoundProjectTypeException('message', 500, 'E_RUNTIME_EXCEPTION', 'Restart computer.')
|
*/

export class NotFoundProjectTypeException extends Exception {
  /**
   * Return a new instance of NotFoundProjectTypeException.
   *
   * @param {string} type
   */
  constructor(type) {
    const message = `The project type ({yellow} "${type}") doesnt exist.`

    super(
      message,
      500,
      'E_NOT_FOUND_PROJECT_TYPE_ERROR',
      `Try running "athenna new --help" to see the available project types.`,
    )
  }
}
