const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const threadSchema = require('./thread.js').threadSchema;

const messageBoardSchema = Schema({
  title: {
    type: String,
    required: true
  },

  threads: {
    type: [threadSchema],
    default: []
  },

  delete_password: {
    type: String,
    required: true
  }
});

const MessageBoard = model('MessageBoard', messageBoardSchema);

module.exports = MessageBoard;
