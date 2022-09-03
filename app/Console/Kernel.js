import { TestCommandsLoader } from '@athenna/test'
import { ArtisanLoader, ConsoleKernel } from '@athenna/artisan'

export class Kernel extends ConsoleKernel {
  /**
   * Register the commands for the application.
   *
   * @return {any[]}
   */
  get commands() {
    const internalCommands = []

    if (Env('NODE_ENV') !== 'production') {
      internalCommands.push(
        ...ArtisanLoader.loadCommands(),
        ...TestCommandsLoader.loadCommands(),
      )
    }

    return [...internalCommands, import('#app/Console/Commands/NewCommand')]
  }

  /**
   * Register the custom templates for the application.
   *
   * @return {any[]}
   */
  get templates() {
    return [...TestCommandsLoader.loadTemplates()]
  }
}
