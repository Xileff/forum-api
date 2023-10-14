class RetrievedThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, title, body, date, username,
    } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
  }
}

module.exports = RetrievedThread;
