var playstream = require('./play-stream');
var recstream = require('./rec-stream');
var encoder = require('./encoder.js');
var decoder = require('./decoder.js');

module.exports = {
  PlayStream: playstream,
  RecStream: recstream,
  encoder: encoder,
  decoder: decoder,
  Buffer: Buffer,
  process: process
};
