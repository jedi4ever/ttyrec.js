var encoder = ttyrec.encoder;

describe('ttyrec Play Stream', function () {

  it('should encode a stream for one packet', function(done) {
    var playStream = new ttyrec.PlayStream();

    var text = 'bla';
    playStream.on('data', function(t) {
      expect(t.toString()).to.be(text);
      playStream.end();
      done();
    });
    var encoded = encoder.encode(0,0,new ttyrec.Buffer(text));
    playStream.write(encoded);
  });

  it('should handle the correct delay for a stream with absolute timestamp packet ', function(done) {
    var playStream = new ttyrec.PlayStream();

    var text = 'bla';
    playStream.on('data', function(t) {
      expect(t.toString()).to.be(text);
      playStream.end();
      done();
    });
    var encoded = encoder.encode(1000,0,new ttyrec.Buffer(text));
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
        expect(playedRecords[0].toString()).to.be(text1);
        expect(playedRecords[1].toString()).to.be(text2);
        playStream.end();
        done();
      }
    });

    var encoded1 = encoder.encode(0,0,new ttyrec.Buffer(text1));
    var tenMsec = 10 * 1000 ; // in usec
    var encoded2 = encoder.encode(0, tenMsec ,new ttyrec.Buffer(text2));

    playStream.write(encoded1);
    playStream.write(encoded2);
  });

  it('should pass Play stream options', function(done) {
    var options = { highWaterMark: 1 };
    var playStream = new ttyrec.PlayStream(options);

    var text = '0123456789';
    var encoded = encoder.encode(0,0,new ttyrec.Buffer(text));
    var canContinueWriting = playStream.write(encoded);
    expect(canContinueWriting).to.be(false);
    done();
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

    var encoded = encoder.encode(0,0,new ttyrec.Buffer(text));
    playStream.write(encoded);
  });

  it('should not wait with speed 0', function(done) {
    var playStream = new ttyrec.PlayStream();
    playStream.setSpeed(0);

    var text = '0123456789';

    var count = 0;
    playStream.on('data', function(t) {
      count++;
      if (count === 2) {
        done();
      }
    });

    var encoded1 = encoder.encode(0,0,new ttyrec.Buffer(text));
    var encoded2 = encoder.encode(1000,0,new ttyrec.Buffer(text));
    playStream.write(encoded1);
    playStream.write(encoded2);
  });

});
