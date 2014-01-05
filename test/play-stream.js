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

  it('should handle the correct delay for a stream with absolute timestamp packet ', function(done) {
    var playStream = new ttyrec.PlayStream();

    var text = 'bla';
    playStream.on('data', function(t) {
      expect(t).to.eql(new Buffer(t));
      playStream.end();
      done();
    });
    var encoded = encoder.encode(1000,0,new Buffer(text));
    playStream.write(encoded);
  });

  it('should encode a stream for two packet', function(done) {
    var playStream = new ttyrec.PlayStream();

    var playedRecords = [];
    var text1 = 'beep';
    var text2 = 'boop';

    playStream.on('data', function(t) {
      playedRecords.push(t);

      if (playedRecords.length === 2) {
        expect(playedRecords[0]).to.eql(new Buffer(text1));
        expect(playedRecords[1]).to.eql(new Buffer(text2));
        playStream.end();
        done();
      }
    });

    var encoded1 = encoder.encode(0,0,new Buffer(text1));
    var tenMsec = 10 * 1000 ; // in usec
    var encoded2 = encoder.encode(0, tenMsec ,new Buffer(text2));

    playStream.write(encoded1);
    playStream.write(encoded2);
  });

  it('should pass Play stream options', function(done) {
    var options = { highWaterMark: 1 };
    var playStream = new ttyrec.PlayStream(options);

    playStream.on('data', function(t) {
      done();
    });

    var text = '0123456789';
    var encoded = encoder.encode(0,0,new Buffer(text));
    playStream.write(encoded);
  });

  it('should work with utf8', function(done) {
    var playStream = new ttyrec.PlayStream();

    var text = '0123456789𡥂';

    playStream.setEncoding('utf8');

    playStream.on('data', function(t) {
      expect(t).to.be(text);
      expect(t).to.be.a('string');
      done();
    });

    var encoded = encoder.encode(0,0,new Buffer(text));
    playStream.write(encoded);
  });

});
