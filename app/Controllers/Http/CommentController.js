'use strict'

const Comment = use('App/Models/Comment');

/**
 * Resourceful controller for interacting with comments
 */
class CommentController {

  /**
   * Create/save a new comment.
   * POST comments
   */
  async store ({ request, auth }) {

    const { post_id, content } = request.all();

    const comment = await Comment.create({
      post_id: post_id,
      user_id: auth.user.id,
      content: content
    });

    return comment;
  }

  /**
   * Update comment details.
   * PUT or PATCH comments/:id
   */
  async update ({ params, request, response, auth }) {
    const comment = await Comment.findOrFail(params.id);
    const content = request.only('content').content;

    if(comment.user_id !== auth.user.id) {
      return response.status(400).json({ error: 'You can not update a comment that is not yours.'})
    }

    comment.content = content;

    comment.save();

    return comment;
  }

  /**
   * Delete a comment with id.
   * DELETE comments/:id
   */
  async destroy ({ params, auth, response }) {
    const comment = await Comment.findOrFail(params.id);

    if(comment.user_id !== auth.user.id) {
      return response.status(400).json({ error: 'You can not delete a comment that is not yours.'})
    }

    comment.delete();
  }
}

module.exports = CommentController
