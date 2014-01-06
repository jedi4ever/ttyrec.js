var playStream = require('./play-stream');
var recStream = require('./rec-stream');
var recPlusPlusStream = require('./rec-plus-plus-stream');

var parseStream = require('./parse-stream');
var generatorStream = require('./generator-stream');
var encoder = require('./encoder.js');
var decoder = require('./decoder.js');

module.exports = {
  PlayStream: playStream,
  RecStream: recStream,
  RecPlusPlusStream: recPlusPlusStream,
  ParseStream: parseStream,
  GeneratorStream: generatorStream,
  encoder: encoder,
  decoder: decoder,
  Buffer: Buffer,
  process: process
};
