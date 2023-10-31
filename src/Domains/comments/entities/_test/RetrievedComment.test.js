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
      isDelete: 'benar',
    };

    expect(() => new RetrievedComment(payload)).toThrowError('RETRIEVED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create retrievedComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:57.000Z',
      content: 'ini komentar',
      isDelete: false,
    };

    const {
      id, username, date, content, isDelete,
    } = new RetrievedComment(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
    expect(isDelete).toEqual(payload.isDelete);

    const deletedCommentPayload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:57.000Z',
      content: 'ini komentar',
      isDelete: true,
    };

    const {
      id: deletedCommentId,
      username: deletedCommentUsername,
      date: deletedCommentDate,
      content: deletedCommentContent,
      isDelete: deletedCommentIsDelete,
    } = new RetrievedComment(deletedCommentPayload);

    expect(deletedCommentId).toEqual(deletedCommentPayload.id);
    expect(deletedCommentUsername).toEqual(deletedCommentPayload.username);
    expect(deletedCommentDate).toEqual(deletedCommentPayload.date);
    expect(deletedCommentContent).toEqual('**komentar telah dihapus**');
    expect(deletedCommentIsDelete).toEqual(deletedCommentPayload.isDelete);
  });
});
