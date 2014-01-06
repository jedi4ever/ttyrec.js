var decoder = ttyrec.decoder;

describe('ttyrec Rec++ Stream', function () {

  it('should encode a stream for one packet', function(done) {
    var recStream = new ttyrec.RecPlusPlusStream();

    var text = '0123456789𡥂';
    recStream.on('data', function(record) {
      recStream.end();
      done();
    });
    recStream.write(text);
  });

  it('should pass stream options', function(done) {
    var options = { highWaterMark: 1 };
    var recStream = new ttyrec.RecPlusPlusStream();
    recStream.on('data', function(record) {
      done();
    });

    var largeChunk = new ttyrec.Buffer('0123456789abcdefghijklmnopqrstuvwxyz');
    recStream.write(largeChunk);
  });

});
