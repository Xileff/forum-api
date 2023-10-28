const RetrievedThread = require('../RetrievedThread');

describe('RetrievedThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'abc',
    };

    expect(() => new RetrievedThread(payload)).toThrowError('RETRIEVED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      title: 'abc',
      body: 'abc',
      date: 'abc',
      username: 'abc',
    };

    expect(() => new RetrievedThread(payload)).toThrowError('RETRIEVED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create retrievedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'abc',
      body: 'abc',
      date: '2021-08-08T07:59:57.000Z',
      username: 'abc',
    };

    // Action
    const {
      id, title, body, date, username,
    } = new RetrievedThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
