var decoder = ttyrec.decoder;

describe('ttyrec Rec Stream', function () {

  it('should encode a stream for one packet', function(done) {
    var recStream = new ttyrec.RecStream();

    var text = 'bla';
    recStream.on('data', function(record) {
      var results = decoder.decode(record);
      var records = results[0];
      var r = records[0];
      expect(r.packet).to.eql(new ttyrec.Buffer(text));
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
        expect(trecords[0].packet).to.eql(new ttyrec.Buffer(text1));
        expect(trecords[1].packet).to.eql(new ttyrec.Buffer(text2));
        recStream.end();
        done();
      }
    });

    recStream.write(text1);
    setTimeout(function() {
      recStream.write(text2);
    },10);
  });

  it('should pass stream options', function(done) {
    var options = { highWaterMark: 1 };
    var recStream = new ttyrec.RecStream(options);
    recStream.on('data', function(record) {
      done();
    });

    var largeChunk = new ttyrec.Buffer('0123456789abcdefghijklmnopqrstuvwxyz');
    recStream.write(largeChunk);
  });

  it('should pass Rec stream options', function(done) {
    var options = { highWaterMark: 1 };
    var recStream = new ttyrec.RecStream(options);

    var largeChunk = new ttyrec.Buffer('0123456789abcdefghijklmnopqrstuvwxyz');
    var canContinueWriting = recStream.write(largeChunk);
    expect(canContinueWriting).to.be(false);
    done();

  });

  it('should work with utf8', function(done) {
    var text = '0123456789𡥂';

    var recStream = new ttyrec.RecStream();
    recStream.setEncoding('utf8');

    recStream.on('data', function(utfRecord) {
      var record = new Buffer(utfRecord);
      var results = decoder.decode(record);
      var records = results[0];
      var r = records[0];
      expect(r.packet).to.eql(new Buffer(text));
      done();
    });

    recStream.write(text);
  });
});
