const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentUseCase = require('../CommentUseCase');

describe('CommentUseCase', () => {
  describe('add function', () => {
    it('should orcestrating the add comment action correctly', async () => {
      // Arrange
      const commentPayload = {
        content: 'Ini komentar',
      };

      // Dependency
      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      // Mocking needed function
      mockCommentRepository.addComment = jest.fn()
        .mockImplementation(() => Promise.resolve(new AddedComment({
          id: 'comment-123',
          content: commentPayload.content,
          owner: 'user-123',
        })));

      // Mocking isThreadExist in threadRepository
      mockThreadRepository.isThreadExist = jest.fn().mockReturnValue(true);

      // creating the use case instance
      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      // Action
      const addedComment = await commentUseCase.add(commentPayload, 'user-123', 'thread-123');

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: commentPayload.content,
        owner: 'user-123',
      }));

      expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment(commentPayload), 'user-123', 'thread-123');
    });
  });

  describe('delete function', () => {
    it('should orchestrating the delete comment action correctly', async () => {
      // Arrange
      const commentId = 'comment-123';
      const threadId = 'thread-123';
      const userId = 'user-123';

      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      mockThreadRepository.isThreadExist = jest.fn()
        .mockImplementation(() => Promise.resolve(true));
      mockCommentRepository.isCommentExist = jest.fn()
        .mockImplementation(() => Promise.resolve(true));
      mockCommentRepository.isCommentOwner = jest.fn()
        .mockImplementation(() => Promise.resolve(true));
      mockCommentRepository.deleteComment = jest.fn()
        .mockImplementation(() => Promise.resolve(commentId));

      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      // Action
      const deletedComment = await commentUseCase.delete(commentId, threadId, userId);

      // Assert
      expect(deletedComment).toStrictEqual(commentId);
      expect(mockCommentRepository.deleteComment).toBeCalledWith(commentId, userId, threadId);
    });
  });
});
