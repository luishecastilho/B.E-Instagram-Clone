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
Route.post('/register', "AuthController.register");

Route.group(() => {
  Route.get('/', "AppController.index");

  // posts
  Route.resource("post", "PostController").apiOnly();
  Route.put("/post/like/:id", "PostController.like");
  Route.put("/post/dislike/:id", "PostController.dislike");

  // user profile
  Route.get('/user', "UserController.show");
  Route.put('/user', "UserController.update");
  Route.post('/user/changePassword', "UserController.changePassword");

  Route.post('/user/follow/:id', "UserController.follow");
  Route.post('/user/unfollow/:id', "UserController.unfollow");

  // comments
  Route.resource("comment", "CommentController").apiOnly().except(['index', 'show']);

}).middleware(['auth:jwt']);
