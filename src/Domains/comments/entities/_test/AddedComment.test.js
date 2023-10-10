const AddedComment = require('../AddedComment');

describe('an AddedComment entity', () => {
  it('should throw error when payload didnt contain needed property', () => {
    // Arrange
    const payload = {
      content: 'ini komentar',
    };

    // Action and ASSERT
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload didnt meet data type specification', () => {
    // Arrange
    const payload = {
      id: true,
      content: 12109102,
      owner: 1.5,
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'ini komentar',
      owner: 'user-123',
    };

    // Action
    const addedComment = new AddedComment(payload);
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
