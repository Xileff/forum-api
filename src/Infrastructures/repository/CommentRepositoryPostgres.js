const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const RetrievedComment = require('../../Domains/comments/entities/RetrievedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(comment, owner, threadId) {
    const id = `comment-${this._idGenerator()}`;
    const { content } = comment;
    const isDelete = false;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, isDelete, date, owner, threadId],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async deleteComment(commentId, ownerId, threadId) {
    const checkQuery = {
      text: 'SELECT owner FROM comments WHERE id = $1 AND thread = $2',
      values: [commentId, threadId],
    };
    const checkComment = await this._pool.query(checkQuery);

    if (!checkComment.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }

    const { owner } = checkComment.rows[0];

    if (owner !== ownerId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }

    const deleteQuery = {
      text: 'UPDATE comments SET is_delete = true, content = \'**komentar telah dihapus**\' WHERE id = $1 AND owner = $2 AND thread = $3 RETURNING id',
      values: [commentId, ownerId, threadId],
    };

    await this._pool.query(deleteQuery);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: 'SELECT c.id, u.username, c.date, c.content FROM comments c JOIN users u ON c.owner = u.id WHERE thread = $1 AND is_delete = false',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((row) => new RetrievedComment({
      id: row.id, username: row.username, date: row.date.toISOString(), content: row.content,
    }));
  }
}

module.exports = CommentRepositoryPostgres;
