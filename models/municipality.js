var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    municipalitySchema;

municipalitySchema = new Schema({
  name: String,
  cat: String,
  code: Number,
  remain: Number,
  budget: Number,
  ratio: Number,
  year: Number
});

module.exports = mongoose.model('Municipality', municipalitySchema, 'municipalities');
