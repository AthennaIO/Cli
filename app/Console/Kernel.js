import { CoreLoader } from '@athenna/core'
import { Folder, Path } from '@athenna/common'
import { ArtisanLoader, ConsoleKernel } from '@athenna/artisan'

export class Kernel extends ConsoleKernel {
  /**
   * Register the commands for the application.
   *
   * @return {any[]}
   */
  get commands() {
    const appCommands = new Folder(Path.console('Commands'))
      .loadSync()
      .getFilesByPattern(`**/*.${Path.ext()}`, true)
      .map(command => import(command.href))

    if (Env('NODE_ENV') === 'production') {
      return appCommands
    }

    const internalCommands = [
      ...CoreLoader.loadCommands(),
      ...ArtisanLoader.loadCommands(),
    ]

    const testCommandsPath = Path.nodeModules('@athenna/test/src/Commands')
    const testCommands = new Folder(testCommandsPath)
      .loadSync()
      .getFilesByPattern('**/*.js', true)
      .map(command => import(command.href))

    internalCommands.push(...testCommands)

    return [...internalCommands, ...appCommands]
  }

  /**
   * Register the custom templates for the application.
   *
   * @return {any[]}
   */
  get templates() {
    if (Env('NODE_ENV') === 'production') {
      return ArtisanLoader.loadTemplates()
    }

    const testTemplatesPath = Path.nodeModules('@athenna/test/templates')
    const testTemplates = new Folder(testTemplatesPath)
      .loadSync()
      .getFilesByPattern('**/*.edge', true)

    return [...testTemplates, ...ArtisanLoader.loadTemplates()]
  }
}
