const AddedThread = require('../../Domains/threads/entities/AddedThread');
const RetrievedThread = require('../../Domains/threads/entities/RetrievedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(thread, owner) {
    const id = `thread-${this._idGenerator()}`;
    const { title, body } = thread;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, date, owner],
    };

    const result = await this._pool.query(query);
    return new AddedThread({ ...result.rows[0] });
  }

  async getThread(threadId) {
    const query = {
      text: `SELECT t.id, t.title, t.body, t.date, u.username
      FROM threads t
      LEFT JOIN users u ON t.owner = u.id
      WHERE t.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    const {
      id, title, body, date, username,
    } = result.rows[0];

    return new RetrievedThread({
      id, title, body, date: date.toISOString(), username,
    });
  }

  async isThreadExist(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rowCount === 1;
  }
}

module.exports = ThreadRepositoryPostgres;
