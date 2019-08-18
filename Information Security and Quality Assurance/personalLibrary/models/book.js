const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({

  title: {
    type: String,
    required: true,
    min: 1,
    max: 100
  },

  author: {
    type: String,
    min: 1,
    max: 100,
  },

  comments: {
    type: [String],
    default: []
  },

   commentcount: {
     type: Number,
     default: 0
   }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = {Book};
