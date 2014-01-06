'use strict';

var events = require('events');
var util = require('util');
var jsesc = require('jsesc');

var TtyGeneratorStream = require('./generator-stream');

/**
 * @constructor
 * @name TtyRecPlusPlusStream
 * @param {Hash} options
 */
var TtyRecPlusPlusStream = function(options) {

  var self = this;

  if (options === undefined) {
    self.settings = {};
  } else {
    // Copy the options
    self.settings = JSON.parse(JSON.stringify(options));
  }


  // Push the ttyrec++ packet
  self.settings.handler = function(stream, record, callback) {
    // Join the header and chunk in one buffer/packet
    var packetBuffer = {
      sec: record.header.sec,
      usec: record.header.usec,
      data: jsesc(record.packet.toString('utf8'))
    };
    stream.push(packetBuffer);
    callback(null);
  };

  self.settings.objectMode = true;

  // Run parent constructor
  TtyGeneratorStream.call(this, self.settings);

};

util.inherits(TtyRecPlusPlusStream, TtyGeneratorStream);

module.exports = TtyRecPlusPlusStream;
