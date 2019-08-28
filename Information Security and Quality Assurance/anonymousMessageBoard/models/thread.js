const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const replySchema = require('./reply.js').replySchema;

const threadSchema = new Schema({
  text: {
    type: String,
    required: true
  },

  created_on: {
    type: String
  },

  bumped_on: {
    type: String
  },

  replies: {
    type: [replySchema],
    default: []
  },

  reported: {
    type: Boolean,
    default: false
  },

  delete_password: {
    type: String,
    required: true
  }
});

const Thread = model('Thread', threadSchema);

module.exports = { threadSchema, Thread};
