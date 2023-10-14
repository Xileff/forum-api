const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadUseCase = require('../ThreadUseCase');

describe('ThreadUseCase', () => {
  describe('add function', () => {
    it('should orchestrating the add thread action correctly', async () => {
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
      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
      });

      // Action
      const addedThread = await threadUseCase.add(useCasePayload, 'owner-123');

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: 'user-123',
      }));

      expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread(useCasePayload), 'owner-123');
    });
  });

  describe('get function', () => {
    it('should orchestrating the get thread action correctly', async () => {
      // Arrange
      const threadId = 'thread-123';

      // Dependency
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();

      // Mocking needed function
      mockThreadRepository.getThread = jest.fn()
        .mockImplementation(() => Promise.resolve({
          id: threadId,
          title: 'ini thread',
          body: 'ini isi thread',
          date: '2021-08-08T07:22:53.000Z',
          username: 'dicoding',
        }));

      mockCommentRepository.getCommentsByThreadId = jest.fn()
        .mockImplementation(() => Promise.resolve([{
          id: 'comment-123',
          username: 'dicoding',
          date: '2021-08-08T07:22:53.000Z',
          content: 'ini komentar',
        }]));

      // creating the use case instance
      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      // Action
      const thread = await threadUseCase.get(threadId);

      // Assert
      expect(thread).toStrictEqual({
        id: threadId,
        title: 'ini thread',
        body: 'ini isi thread',
        date: '2021-08-08T07:22:53.000Z',
        username: 'dicoding',
        comments: [{
          id: 'comment-123',
          username: 'dicoding',
          date: '2021-08-08T07:22:53.000Z',
          content: 'ini komentar',
        }],
      });

      expect(mockThreadRepository.getThread).toBeCalledWith(threadId);
      expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    });
  });
});
