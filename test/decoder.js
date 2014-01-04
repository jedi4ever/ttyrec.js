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

  it('should find no record in a chunk with an incomplete record', function(done) {
    var decoder = ttyrec.decoder;
    var encoder = ttyrec.encoder;

    var onerecord = encoder.encode(10, 20, new Buffer('abc'));
    var incompleteRecord = onerecord.slice(0, -2);

    // 0 records found
    expect(decoder.decode(incompleteRecord)[0].length).to.be(0);
    // Rest equals the incompleteRecord
    expect(decoder.decode(incompleteRecord)[1]).to.eql(incompleteRecord);
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

  it.skip('should not blow up with too much recursion', function(done) {
    var decoder = ttyrec.decoder;
    var encoder = ttyrec.encoder;
    var chunks = [];

    var nr = 10000;
    for (var i=0;i<nr;i++) {
      var record = encoder.encode(i, 20, new Buffer('a'));
      chunks.push(record);
    }

    var bigChunk = Buffer.concat(chunks);
    var records = decoder.decode(bigChunk)[0];

    expect(records.length).to.be(nr);
    done();
  });

});
