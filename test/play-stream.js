var path = require('path');
var fs = require('fs');
var expect = require('expect.js');
var path = require('path');

var ttyrec = require('../lib/ttyrec.js');
var encoder = ttyrec.encoder;

describe('ttyrec Play Stream', function () {

  it('should encode a stream for one packet', function(done) {
    var playStream = new ttyrec.PlayStream();

    var text = 'bla';
    playStream.on('data', function(t) {
      expect(t).to.eql(new Buffer(t));
      playStream.end();
      done();
    });
    var encoded = encoder.encode(0,0,new Buffer(text));
    playStream.write(encoded);
  });


});
