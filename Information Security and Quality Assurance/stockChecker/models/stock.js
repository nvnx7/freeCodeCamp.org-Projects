const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const stockSchema = new Schema({
  stock: {
    type: String,
    required: true,
    unique: true
  },

  price: {
    type: String,
    required: true
  },

  likes: {
    type: Number,
    default: 0
  },

  ipAddresses: [{
    type: String,
    default: []
  }]
});

const Stock = model('Stock', stockSchema);

module.exports = {Stock};
