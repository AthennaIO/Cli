import { Exception } from '@athenna/common'

export class NotEmptyFolderException extends Exception {
  public constructor(name: string) {
    const status = 500
    const help = undefined
    const code = 'E_SIMPLE_CLI'
    const message = `The directory ({yellow} "${name}") already exists. Try another project name or delete ({yellow} "${name}") folder.`

    super({ code, help, status, message })
  }
}
