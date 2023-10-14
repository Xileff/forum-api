const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentUseCase = require('../CommentUseCase');

describe('CommentUseCase', () => {
  it('should orcestrating the add comment action correctly', async () => {
    // Arrange
    const commentPayload = {
      content: 'Ini komentar',
    };

    // Dependency
    const mockCommentRepository = new CommentRepository();

    // Mocking needed function
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedComment({
        id: 'comment-123',
        content: commentPayload.content,
        owner: 'user-123',
      })));

    // creating the use case instance
    const commentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await commentUseCase.add(commentPayload, 'user-123');

    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      content: commentPayload.content,
      owner: 'user-123',
    }));

    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment(commentPayload), 'user-123');
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const commentId = 'comment-123';
    const threadId = 'thread-123';
    const userId = 'user-123';
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve(commentId));

    const commentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const deletedComment = await commentUseCase.delete(commentId, threadId, userId);

    // Assert
    expect(deletedComment).toStrictEqual(commentId);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(commentId, threadId, userId);
  });

  it('should orchestrating the get comments action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const comments = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
      },
      {
        id: 'comment-456',
        username: 'dicoding',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
      },
    ];
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getComments = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));

    const commentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const retrievedComments = await commentUseCase.get(threadId);

    // Assert
    expect(retrievedComments).toStrictEqual(comments);
    expect(mockCommentRepository.getComments).toBeCalledWith(threadId);
  });
});
