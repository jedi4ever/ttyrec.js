'use strict';

var events = require('events');
var util = require('util');

var encoder = require('./ttyrec').encoder;

var Transform = require('stream').Transform;

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

  self.time = null;
  // Run parent constructor
  Transform.call(this, self.settings);

};

util.inherits(TtyRecStream, Transform);

module.exports = TtyRecStream;

TtyRecStream.prototype._transform = function(chunk, encoding, callback) {

  var self = this;

  var sec, usec;

  if (self.time === null) {
    // This is the first we are writing
    self.time = process.hrtime();
    sec = 0;
    usec = 0;
  } else {
    // This is next time
    var diff = process.hrtime(self.time);
    sec = diff[0] ;
    usec =  Math.round(diff[1] / 1e3);
  }

  // Join the header and chunk in one buffer/packet
  var packetBuffer = encoder.encode(sec, usec, chunk);

  // Push the ttyrec packet
  self.push(packetBuffer);

  // Signal we are done with no errors
  callback(null);
};

