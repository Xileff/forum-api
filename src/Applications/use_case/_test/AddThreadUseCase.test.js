const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('shoud orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'ini thread',
      body: 'ini isi thread',
    };

    // Dependency
    const mockThreadRepository = new ThreadRepository();

    // Mocking needed function
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: 'user-123',
      })));

    // creating the use case instance
    const threadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await threadUseCase.execute(useCasePayload, 'owner-123');

    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    }));

    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread(useCasePayload), 'owner-123');
  });
});
