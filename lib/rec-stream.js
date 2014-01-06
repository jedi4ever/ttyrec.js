'use strict';

var events = require('events');
var util = require('util');

var encoder = require('./encoder');
var TtyGeneratorStream = require('./generator-stream');

/**
 * @constructor
 * @name TtyRecStream
 * @param {Hash} options
 */
var TtyRecStream = function(options) {

  var self = this;

  if (options === undefined) {
    self.settings = {};
  } else {
    // Copy the options
    self.settings = JSON.parse(JSON.stringify(options));
  }

  self.settings.handler = function(stream, record, callback) {
    var header = record.header;

    var packetBuffer = encoder.encode(header.sec, header.usec, record.packet);
    stream.push(packetBuffer);
    callback(null);
  };

  // Run parent constructor
  TtyGeneratorStream.call(this, self.settings);

};

util.inherits(TtyRecStream, TtyGeneratorStream);

module.exports = TtyRecStream;
