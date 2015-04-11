var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    enterpriseSchema;

enterpriseSchema = new Schema({
  name: String,
  cat: String,
  remain: Number,
  budget: Number,
  ratio: Number,
  year: Number,
  code: Number
});

module.exports = mongoose.model('Enterprise', enterpriseSchema, 'enterprises');
