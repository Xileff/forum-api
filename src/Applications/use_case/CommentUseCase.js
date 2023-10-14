const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddComment = require('../../Domains/comments/entities/AddComment');

class CommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async add(useCasePayload, owner, threadId) {
    const comment = new AddComment(useCasePayload);
    const countThread = await this._threadRepository.countThreadById(threadId);
    if (countThread !== 1) {
      throw new NotFoundError('thread tidak ditemukan');
    }
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
