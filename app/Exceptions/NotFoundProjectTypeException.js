import { Exception } from '@athenna/common'

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
    const message = `The project type ({yellow} "${type}") doesnt exist. Try running ({yellow} "athenna new --help") to see the available project types.`

    super(message, 500, 'E_SIMPLE_CLI')
  }
}
