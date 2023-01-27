'use strict'

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

    const posts = await Post.query().with("user").fetch();

    return posts;
  }

  /**
   * Create/save a new post.
   * POST posts
   */
  async store ({ request, auth }) {

    const data = request.only(['content', 'description', 'type']);

    const post = await Post.create({ user_id: auth.user.id, likes: { users: []}, ...data })

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
  async update ({ params, request, auth, response }) {
    const data = request.only(['description']);

    const post = await Post.findOrFail(params.id);

    if(post.user_id !== auth.user.id) {
      return response.status(401);
    }

    post.description = data.description;

    post.save();

    return post;
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
  async like ({ params, auth, response }) {
    const post = await Post.findOrFail(params.id);
    var likes = post.likes;

    console.log(likes.users.indexOf(auth.user.id))
    if(likes.users.indexOf(auth.user.id) > -1) {
      return response.status(401);
    }

    likes.users.push(auth.user.id);

    post.likes = JSON.stringify(likes);

    post.save();

    return post;
  }

  /**
   * Dislike a post
   * PUT posts/dislike/:id
   */
  async dislike ({ params, auth, response }) {
    const post = await Post.findOrFail(params.id);
    var likes = post.likes;

    if(likes.users.indexOf(auth.user.id) == -1) {
      return response.status(401);
    }

    for(var i = 0; i < likes.users.length; i++) {
      if(likes.users[i] === auth.user.id) {
        likes.users.splice(i, 1);
      }
    }

    post.likes = JSON.stringify(likes);

    post.save();

    return post;
  }
}

module.exports = PostController
