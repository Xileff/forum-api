const AddComment = require('../AddComment');

describe('an AddComment entity', () => {
  it('should throw error when payload didnt contain needed property', () => {
    // Arrange
    const payload = {
      a: 1,
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload didnt meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload contain restricted character', () => {
    // Arrange
    const payload = {
      content: 'DELETE * FROM comments;',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.CONTAIN_RESTRICTED_CHARACTER');
  });

  it('should create addComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'abc',
    };

    // Action
    const { content } = new AddComment(payload);

    // Assert
    expect(content).toEqual(payload.content);
  });
});
