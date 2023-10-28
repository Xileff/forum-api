const AddComment = require('../../Domains/comments/entities/AddComment');

class CommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async add(useCasePayload, owner, threadId) {
    await this._threadRepository.verifyThreadExists(threadId);
    const comment = new AddComment(useCasePayload);
    return this._commentRepository.addComment(comment, owner, threadId);
  }

  async delete(commentId, threadId, userId) {
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExists(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, userId);
    return this._commentRepository.deleteComment(commentId, userId, threadId);
  }
}

module.exports = CommentUseCase;
