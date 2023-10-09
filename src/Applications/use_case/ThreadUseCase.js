const AddThread = require('../../Domains/threads/entities/AddThread');

class ThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async add(useCasePayload, owner) {
    const thread = new AddThread(useCasePayload);
    return this._threadRepository.addThread(thread, owner);
  }
}

module.exports = ThreadUseCase;
