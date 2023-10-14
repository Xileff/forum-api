const AddThread = require('../../Domains/threads/entities/AddThread');

class ThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async add(useCasePayload, owner) {
    const thread = new AddThread(useCasePayload);
    return this._threadRepository.addThread(thread, owner);
  }

  async get(threadId) {
    const thread = await this._threadRepository.getThread(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    return { ...thread, comments };
  }
}

module.exports = ThreadUseCase;
