'use strict'

const { RouteResource } = require('@adonisjs/framework/src/Route/Manager');

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('/auth', "AuthController.authenticate");
Route.post('/users', "AuthController.register");

Route.group(() => {
  Route.get('/', "AppController.index");

  // profile
  Route.get('/user', "UserController.index");
  Route.get('/user/profile', "UserController.getProfile");
  Route.put('/user/profile', "UserController.updateProfile");

  // posts


  // actions (like, follow, comment)

}).middleware(['auth:jwt']);
