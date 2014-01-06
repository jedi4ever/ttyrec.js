'use strict';

var events = require('events');
var util = require('util');
var async = require('async');

var Transform = require('stream').Transform;
var decoder = require('./decoder');

// Default is to push the complete record
function defaultHandler(stream, record, speed, callback) {
  stream.push(record);
  callback(null);
}

/**
 * @constructor
 * @name TtyParserStream
 * @param {Hash} options
 */
var TtyParserStream = function(options) {

  var self = this;

  if (options === undefined) {
    self.settings = {};
  } else {
    // Copy the options
    self.settings = JSON.parse(JSON.stringify(options));
  }

  if (options && options.handler) {
    self.handler = options.handler;
  } else {
    self.handler = defaultHandler;
  }

  // PlaceHolder for unparsed chunk parts
  self.prevChunk = null;

  self.prevRecord = null;

  self.speed = 1;

  // Run parent constructor
  Transform.call(this, self.settings);

};

util.inherits(TtyParserStream, Transform);

module.exports = TtyParserStream;

TtyParserStream.prototype._transform = function(chunk, encoding, callback) {

  var self = this;

  var combinedChunk ;

  if (self.prevChunk === null) {
    combinedChunk = chunk.slice(0);
  } else {
    combinedChunk = Buffer.concat([self.prevChunk, chunk]);
  }

  var bufferResult = decoder.parseBuffer(combinedChunk);
  var records = bufferResult[0];

  self.prevChunk = bufferResult[1];

  var iterator = function(record, callback) {
    var ts, prevTs ;

    ts = (record.header.sec * 1000) + (record.header.usec/1000);

    if (self.prevRecord === null) {
      // For the first record,
      // by setting prevTs to the timestamp
      // the first deltaTs becomes 0
      prevTs = ts;
    } else {
      prevTs = (self.prevRecord.header.sec * 1000) + (self.prevRecord.header.usec/1000);
    }

    var deltaTs;

    if (self.speed === 0) {
      deltaTs = 0;
    } else {
      deltaTs = (ts - prevTs) / self.speed ;
    }

    self.prevRecord = record;

    if (self.speed === 0) {
      self.handler(self, record, self.speed, callback);
    } else {
      setTimeout(function() {
        self.handler(self, record, self.speed, callback);
      }, deltaTs);
    }
  };

  async.eachSeries(records, iterator, function(err) {
    return callback(null);
  });

};

TtyParserStream.prototype._flush = function(callback) {
  callback(null);
};

TtyParserStream.prototype.setSpeed = function(speed) {
  var self = this;

  self.speed = speed;
};
