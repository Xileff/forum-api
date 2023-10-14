const AddComment = require('../../Domains/comments/entities/AddComment');

class CommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async add(useCasePayload, owner, threadId) {
    const comment = new AddComment(useCasePayload);
    return this._commentRepository.addComment(comment, owner, threadId);
  }

  async delete(commentId, threadId, userId) {
    return this._commentRepository.deleteComment(commentId, threadId, userId);
  }

  async get(threadId) {
    return this._commentRepository.getComments(threadId);
  }
}

module.exports = CommentUseCase;
