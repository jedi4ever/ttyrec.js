var path = require('path');
var fs = require('fs');
var expect = require('expect.js');

var ttyrec = require('../lib/ttyrec');

describe('ttyrec decode', function () {

  it('should find one record in a chunk with one record', function(done) {
    var decoder = ttyrec.decoder;
    var encoder = ttyrec.encoder;

    var onerecord = encoder.encode(10, 20, new Buffer('abc'));
    expect(decoder.decode(onerecord)[0].length).to.be(1);
    done();
  });

  it('should find two records in a chunk with two record', function(done) {
    var decoder = ttyrec.decoder;
    var encoder = ttyrec.encoder;

    var onerecord = encoder.encode(10, 20, new Buffer('abc'));
    var tworecord = encoder.encode(10, 20, new Buffer('abc'));
    var bothrecords = Buffer.concat([ onerecord, tworecord]);

    expect(decoder.decode(bothrecords)[0].length).to.be(2);
    done();
  });

  it('should find one record in a incomplete chunk with two record', function(done) {
    var decoder = ttyrec.decoder;
    var encoder = ttyrec.encoder;

    var onerecord = encoder.encode(10, 20, new Buffer('abc'));
    var tworecord = encoder.encode(10, 20, new Buffer('abc'));

    var bothrecords = Buffer.concat([ onerecord, tworecord]);
    var incompleteRecords = bothrecords.slice(0, -2);

    var records = decoder.decode(incompleteRecords)[0];
    var firstRecord = records[0];

    expect(records.length).to.be(1);
    expect(firstRecord.packet.toString()).to.be('abc');
    expect(firstRecord.header.usec).to.be(20);
    expect(firstRecord.header.sec).to.be(10);
    done();
  });

});
