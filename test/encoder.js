var path = require('path');
var fs = require('fs');
var expect = require('expect.js');
var path = require('path');

var ttyrec = require('../lib/ttyrec.js');

describe('ttyrec encoder', function () {

  it('should have length of 13 for 1 char', function(done) {
    var encoder = ttyrec.encoder;
    var sec = 10;
    var usec = 10;
    var chunk = new Buffer(1);
    chunk[0] = 'a';

    var record = encoder.encode(sec, usec, chunk) ;
    expect(record.length).to.be(13);
    done();
  });

});
