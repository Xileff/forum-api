const RetrievedComment = require('../RetrievedComment');

describe('Retrieved Comment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'ini komentar',
    };

    expect(() => new RetrievedComment(payload)).toThrowError('RETRIEVED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: true,
      username: 10101,
      date: true,
      content: 'ini komentar',
    };

    expect(() => new RetrievedComment(payload)).toThrowError('RETRIEVED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
