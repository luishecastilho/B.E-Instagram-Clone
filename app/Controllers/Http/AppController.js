'use strict'

const Post = use('App/Models/Post');
const User= use('App/Models/User');

class AppController {
  /**
   * Home page, list all the posts and my user data
   */
  async index ({  auth }) {
    const posts = await Post.query().with("user").fetch();
    const user = await User.findOrFail(auth.user.id);

    return {
      posts: posts,
      user: user
    };
  }
}

module.exports = AppController
