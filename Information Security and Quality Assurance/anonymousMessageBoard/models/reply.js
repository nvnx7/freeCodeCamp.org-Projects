const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const replySchema = new Schema({
  text: {
    type: String,
    required: true
  },

  created_on: {
    type: String,
    default: new Date().toLocaleString()
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

const Reply = model('Reply', replySchema);

module.exports = {replySchema, Reply};
