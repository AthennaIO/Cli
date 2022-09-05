import { Artisan } from '@athenna/artisan'

/*
|--------------------------------------------------------------------------
| Console Commands
|--------------------------------------------------------------------------
|
| Here is where you can register console commands for your application.
| These commands are loaded by the ArtisanProvider.
|
*/

Artisan.command('hello', function () {
  this.success('Hello from Athenna!')
})
  .description('Athenna just says hello.')
  .createHelp()
