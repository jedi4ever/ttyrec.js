var path = require('path');
var fs = require('fs');
var expect = require('expect.js');
var path = require('path');

var ttyrec = require('../lib/ttyrec.js');
var decoder = ttyrec.decoder;

describe('ttyrec Rec Stream', function () {

  it('should encode a stream for one packet', function(done) {
    var recStream = new ttyrec.RecStream();

    var text = 'bla';
    recStream.on('data', function(record) {
      var results = decoder.decode(record);
      var records = results[0];
      var r = records[0];
      expect(r.packet).to.eql(new Buffer(text));
      expect(r.header.sec).to.be(0);
      expect(r.header.usec).to.be(0);
      expect(r.header.length).to.be(3);
      recStream.end();

      done();
    });
    recStream.write(text);
  });

  it('should encode a stream for two packet', function(done) {
    var recStream = new ttyrec.RecStream();

    var text1 = 'beep';
    var text2 = 'boop';
    var trecords = [];

    recStream.on('data', function(record) {
      var results = decoder.decode(record);
      var records = results[0];
      var r = records[0];
      trecords.push(r);

      if (trecords.length === 2) {
        expect(trecords[0].packet).to.eql(new Buffer(text1));
        expect(trecords[1].packet).to.eql(new Buffer(text2));
        recStream.end();
        done();
      }
    });

    recStream.write(text1);
    setTimeout(function() {
      recStream.write(text2);
    },10);
  });

});
