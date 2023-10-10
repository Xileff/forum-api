class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);
    this.content = payload.content;
  }

  _verifyPayload({ content }) {
    if (!content) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (!content.match(/^[\w\s]+$/)) {
      throw new Error('ADD_COMMENT.CONTAIN_RESTRICTED_CHARACTER');
    }
  }
}

module.exports = AddComment;
