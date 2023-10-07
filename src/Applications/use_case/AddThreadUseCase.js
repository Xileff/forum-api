const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, owner) {
    const thread = new AddThread(useCasePayload);
    return this._threadRepository.addThread(thread, owner);
  }
}

module.exports = AddThreadUseCase;
