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
| new NotEmptyFolderException('message', 500, 'E_RUNTIME_EXCEPTION', 'Restart computer.')
|
*/

export class NotEmptyFolderException extends Exception {
  /**
   * Return a new instance of NotEmptyFolderException.
   *
   * @param {string} projectName
   */
  constructor(projectName) {
    const message = `The directory ({yellow} "${projectName}") already exists. Try another project name or delete "${projectName}" folder.`

    super(message, 500, 'E_SIMPLE_CLI')
  }
}
