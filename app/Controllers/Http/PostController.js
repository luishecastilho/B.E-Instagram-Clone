'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Post = use('App/Models/Post');

/**
 * Resourceful controller for interacting with posts
 */
class PostController {
  /**
   * Show a list of all posts.
   * GET posts
   */
  async index () {

    // later it has be filtered for only users that I follow

    const posts = await Post.all();

    return posts;
  }

  /**
   * Create/save a new post.
   * POST posts
   */
  async store ({ request, auth }) {

    const data = request.only(['content', 'description', 'type']);

    const post = await Post.create({ user_id: auth.user.id, ...data })

    return post;
  }

  /**
   * Display a single post.
   * GET posts/:id
   */
  async show ({ params }) {
    const post = await Post.findOrFail(params.id);

    return post;
  }

  /**
   * Update post details.
   * PUT or PATCH posts/:id
   */
  async update ({ params, request, auth }) {
    const data = request.only(['description']);

    const post = await Post.findOrFail(params.id);

    if(post.user_id !== auth.user.id) {
      return response.status(401);
    }

    await Post.update(post.id, data);
  }

  /**
   * Delete a post with id.
   * DELETE posts/:id
   */
  async destroy ({ params, response, auth }) {
    const post = await Post.findOrFail(params.id);

    if(post.user_id !== auth.user.id) {
      return response.status(401);
    }

    await post.delete();
  }

  /**
   * Like a post
   * PUT posts/like/:id
   */
  async like ({ params, request, auth }) {
    const post = await Post.findOrFail(params.id);

  }
}

module.exports = PostController
