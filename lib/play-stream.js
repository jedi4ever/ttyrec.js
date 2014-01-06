'use strict';

var events = require('events');
var util = require('util');

var TtyParseStream = require('./parse-stream');

/**
 * @constructor
 * @name TtyPlayStream
 * @param {Hash} options
 */
var TtyPlayStream = function(options) {

  var self = this;

  if (options === undefined) {
    self.settings = {};
  } else {
    // Copy the options
    self.settings = JSON.parse(JSON.stringify(options));
  }

  self.settings.handler = function(stream, record, speed, callback) {
    stream.push(record.packet);
    callback(null);
  };

  // Run parent constructor
  TtyParseStream.call(this, self.settings);

};

util.inherits(TtyPlayStream, TtyParseStream);

module.exports = TtyPlayStream;

