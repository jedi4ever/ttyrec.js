'use strict';

var events = require('events');
var util = require('util');

var encoder = require('./encoder');

var Transform = require('stream').Transform;

var hrtime = process.hrtime;

if (typeof(hrtime) !== 'function') {
  hrtime = function(prev) {

    var tsNow = new Date().getTime(); // only msec resolution
    var sec, msec, nsec;

    if (prev === undefined) {
      sec = Math.floor(tsNow / 1000);
      msec = tsNow % 1000 ;
      nsec = 1e6 * msec;

    } else {
      var tsPrev = prev[0] * 1e9 + prev[1];
      var delta = tsNow * 1e6 - tsPrev;

      sec = Math.floor(delta / 1000);
      msec = delta % 1000 ;
      nsec = 1e6 * msec;

    }

    return [ sec, nsec ];
  };
}

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
  var bufferChunk;

  if (encoding === 'buffer') {
    bufferChunk = chunk;
  }

  if (encoding === 'utf8') {
    bufferChunk = new Buffer(chunk, 'utf8');
  }

  if (self.time === null) {
    // This is the first we are writing
    self.time = hrtime();
    sec = 0;
    usec = 0;
  } else {
    // This is next time
    var diff = hrtime(self.time);
    sec = diff[0] ;
    usec =  Math.round(diff[1] / 1e3);
  }

  // Join the header and chunk in one buffer/packet
  var packetBuffer = encoder.encode(sec, usec, bufferChunk);

  // Push the ttyrec packet
  self.push(packetBuffer);

  // Signal we are done with no errors
  callback(null);
};

