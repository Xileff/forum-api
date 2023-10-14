const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddComment = require('../../Domains/comments/entities/AddComment');

class CommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async add(useCasePayload, owner, threadId) {
    const comment = new AddComment(useCasePayload);
    const isThreadExist = await this._threadRepository.isThreadExist(threadId);
    if (!isThreadExist) {
      throw new NotFoundError('thread tidak ditemukan');
    }
    return this._commentRepository.addComment(comment, owner, threadId);
  }

  async delete(commentId, threadId, userId) {
    const isThreadExist = await this._threadRepository.isThreadExist(threadId);
    const isCommentExist = await this._commentRepository.isCommentExist(commentId);

    if (!isThreadExist || !isCommentExist) {
      throw new NotFoundError('Resource yang anda cari tidak ditemukan');
    }

    const isAuthorized = await this._commentRepository.isCommentOwner(commentId, userId);
    if (!isAuthorized) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }

    return this._commentRepository.deleteComment(commentId, userId, threadId);
  }
}

module.exports = CommentUseCase;
