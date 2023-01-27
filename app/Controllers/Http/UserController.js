'use strict'

const User = use('App/Models/User')

const Hash = use('Hash')

class UserController {
  /**
   * Display user profile.
   * GET user
   */
  async show ({ auth }){
    const user = await User.findOrFail(auth.user.id);

    return user;
  }

  /**
   * Update user profile.
   * PUT or PATCH user
   */
  async update ({ request, auth }) {
    const user = await User.findOrFail(auth.user.id);
    const data = request.only(['username', 'email']);

    user.username = data.username;
    user.email = data.email;

    user.save();
  }

  /**
   * Change user password.
   * POST user/changePassword
   */
  async changePassword ({ request, auth }) {
    const user = await User.findOrFail(auth.user.id);
    const { newPassword } = request.all();

    user.password = await Hash.make(newPassword)

    user.save();
  }

  async follow ({ params, auth, response }) {
    const userToFollow = await User.findOrFail(params.id);
    var followers = userToFollow.followers;

    const user = await User.findOrFail(auth.user.id);
    var following = user.following;

    if(userToFollow.id === user.id) { // if user is trying to follow itself
      return response.status(400).send({ error: 'You can not follow yourself' });
    }

    if(followers.users.indexOf(user.id) > -1){ // if user already follows
      return response.status(400).send({ error: 'You are already following this user'});
    }

    if(following.users.indexOf(userToFollow.id) > -1){ // if user already follows
      return response.status(400).send({ error: 'You are already following this user'});
    }

    followers.users.push(user.id);
    following.users.push(userToFollow.id);

    userToFollow.followers = JSON.stringify(followers);
    user.following = JSON.stringify(following);

    userToFollow.save();
    user.save();

    return true;
  }

  async unfollow ({ params, auth, response }) {
    const userToFollow = await User.findOrFail(params.id);
    var followers = userToFollow.followers;

    const user = await User.findOrFail(auth.user.id);
    var following = user.following;

    if(userToFollow.id === user.id) { // if user is trying to unfollow itself
      return response.status(400).send({ error: 'You can not unfollow yourself' });
    }

    if(followers.users.indexOf(user.id) == -1){ // if user already unfollows
      return response.status(400).send({ error: 'You are already unfollowing this user'});
    }

    if(following.users.indexOf(userToFollow.id) == -1){ // if user already unfollows
      return response.status(400).send({ error: 'You are already following this user'});
    }

    for(var i = 0; i < followers.users.length; i++) {
      if(followers.users[i] === user.id) {
        followers.users.splice(i, 1);
      }
    }
    for(var i = 0; i < following.users.length; i++) {
      if(following.users[i] === userToFollow.id) {
        following.users.splice(i, 1);
      }
    }

    userToFollow.followers = JSON.stringify(followers);
    user.following = JSON.stringify(following);

    userToFollow.save();
    user.save();

    return true;
  }
}

module.exports = UserController
