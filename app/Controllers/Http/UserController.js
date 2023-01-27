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

  async changePassword ({ request, auth }) {
    const user = await User.findOrFail(auth.user.id);
    const { newPassword } = request.all();

    user.password = await Hash.make(newPassword)

    user.save();
  }
}

module.exports = UserController
