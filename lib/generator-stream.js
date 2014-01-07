'use strict';

var events = require('events');
var util = require('util');

var Transform = require('stream').Transform;

function defaultHandler(stream, record, callback) {
  stream.push(record);
  callback(null);
}

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
 * @name TtyGeneratorStream
 * @param {Hash} options
 */
function TtyGeneratorStream(options) {

  var self = this;

  if (options === undefined) {
    self.settings = {};
  } else {
    // Copy the options
    self.settings = JSON.parse(JSON.stringify(options));
  }

  self.time = null;

  if (options && options.handler) {
    self.handler = options.handler;
  } else {
    self.handler = defaultHandler;
    self.settings.objectMode = true;
  }

  // Run parent constructor
  Transform.call(this, self.settings);

}

util.inherits(TtyGeneratorStream, Transform);

module.exports = TtyGeneratorStream;

TtyGeneratorStream.prototype._transform = function(chunk, encoding, callback) {

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

  var record = {
      header: {
        sec: sec,
        usec: usec
      },
      packet: bufferChunk
  };

  self.handler(self, record, callback);

};

