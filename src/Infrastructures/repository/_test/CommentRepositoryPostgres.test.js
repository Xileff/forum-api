const CommentsTableTestHelper = require('../../../../tests/CommentsTestTableHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added coment correctly', async () => {
      // Arrange
      const newComment = new AddComment({
        content: 'ini komentar',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await commentRepositoryPostgres.addComment(newComment, 'user-123', 'thread-123');

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const newComment = new AddComment({
        content: 'ini komentar',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await UsersTableTestHelper.addUser({ id: 'user-321' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-321', owner: 'user-321' });
      const addedComment = await commentRepositoryPostgres.addComment(newComment, 'user-321', 'thread-321');

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: newComment.content,
        owner: 'user-321',
      }));
    });
  });

  describe('deleteComment', () => {
    it('should delete the comment from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const id = await commentRepositoryPostgres.deleteComment('comment-123', 'user-123', 'thread-123');

      // Assert
      expect(id).toStrictEqual('comment-123');
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(0);
    });
  });

  describe('getCommentsByThreadId', () => {
    it('should get a list of comments correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'someguy' });
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'anotherguy' });

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      await CommentsTableTestHelper.addComment({ id: 'comment-123', thread: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-321', thread: 'thread-123', owner: 'user-321' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect(comments).toHaveLength(2);
      const [comment1, comment2] = comments;
      expect(comment1.id).toStrictEqual('comment-123');
      expect(comment1.username).toStrictEqual('someguy');
      expect(comment2.id).toStrictEqual('comment-321');
      expect(comment2.username).toStrictEqual('anotherguy');
    });
  });

  describe('verifyCommentOwner', () => {
    it('should throw AuthorizationError when comment not owned by owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'someguy' });
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'anotherguy' });

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      await CommentsTableTestHelper.addComment({ id: 'comment-123', thread: 'thread-123', owner: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-321')).rejects.toThrowError('Anda tidak berhak mengakses resource ini');
    });
  });
});
