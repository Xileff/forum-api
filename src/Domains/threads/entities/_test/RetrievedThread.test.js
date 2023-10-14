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
});
