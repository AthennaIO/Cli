import { CoreLoader } from '@athenna/core'
import { TestLoader } from '@athenna/test'
import { Path, Folder } from '@secjs/utils'
import { ArtisanLoader, ConsoleKernel } from '@athenna/artisan'

export class Kernel extends ConsoleKernel {
  /**
   * Register the commands for the application.
   *
   * @return {any[]}
   */
  get commands() {
    const internalCommands = [
      ...CoreLoader.loadCommands(),
      ...TestLoader.loadCommands(),
      ...ArtisanLoader.loadCommands(),
    ]

    const appCommands = new Folder(Path.console('Commands'))
      .loadSync()
      .getFilesByPattern('**/*.js', true)
      .map(command => import(command.href))

    if (Env('NODE_ENV') === 'production') {
      return appCommands
    }

    return [...internalCommands, ...appCommands]
  }

  /**
   * Register the custom templates for the application.
   *
   * @return {any[]}
   */
  get templates() {
    return [...TestLoader.loadTemplates(), ...ArtisanLoader.loadTemplates()]
  }
}
