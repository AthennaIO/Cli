import { Route } from '@athenna/core/container'

/*
|--------------------------------------------------------------------------
| Http Routes
|--------------------------------------------------------------------------
|
| Here is where you can register http routes for your application. These
| routes are loaded by the HttpRouteProvider.
|
*/

Route.group(() => {
  Route.get('/', 'WelcomeController.show')

  Route.group(() => {
    Route.get('/', 'WelcomeController.show')
    Route.get('/welcome', 'WelcomeController.show')
  }).prefix('/api')
}).middleware('ResponseMiddleware')
