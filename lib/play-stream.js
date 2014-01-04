'use strict';

var events = require('events');
var util = require('util');
var async = require('async');

var Transform = require('stream').Transform;
var decoder = require('./decoder');

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

  // PlaceHolder for unparsed chunk parts
  self.prevChunk = null;

  self.prevRecord = null;

  // Run parent constructor
  Transform.call(this, self.settings);

};

util.inherits(TtyPlayStream, Transform);

module.exports = TtyPlayStream;

TtyPlayStream.prototype._transform = function(chunk, encoding, callback) {

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

    var deltaTs = ts - prevTs;

    self.prevRecord = record;

    setTimeout(function() {
      self.push(record.packet);
      callback(null);
    }, deltaTs);
  };

  async.eachSeries(records, iterator, function(err) {
    return callback(null);
  });

};

TtyPlayStream.prototype._flush = function(callback) {
  callback(null);
};

