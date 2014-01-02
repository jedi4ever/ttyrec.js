# Ttyrec.js

a native implementation for encoding and decoding ttyrec files.

[![Build Status](https://travis-ci.org/jedi4ever/ttyrec.js.png)](https://travis-ci.org/jedi4ever/ttyrec.js)

# Usage
This implements a duplex / `transform` stream v2 . 

## Write recStream
```
  var ttyrec = require('ttyrec');
  var ttyrecStream = new ttyrec.recStream();
  process.stdout.pipe(ttyrecStream);
  process.stdout.pipe(ttyrecStream);
```

## Read playStream
```
  var ttyrec = require('ttyrec');
  var ttyplayStream = new ttyrec.playStream();
  ttyrecStream.pipe(process.stdout);
```

## Encode
```
  var ttyrec = require('ttyrec');
  var encoder = ttyrec.encoder;
  var sec = 0;
  var usec = 10;
  var record = encoder.encode(sec, usec, new Buffer('abc');
```

## Decode (parseBuffer)
```
  var ttyrec = require('ttyrec');
  var decoder = ttyrec.decoder;
  var results = decoder.decode(arecord);

  // This returns an array of
  // [0] = records
  // [1] = rest of chunk not parsed
  var records = result[0];
  var record = records[0];
  var rest = result[1];

  var header = record.header;
  console.log(header.sec, header.usec, header.length)
  var packet = record.packet; // Buffer
  console.log(packet.toString());

```

# Limitations
- only decodes relative timestamps,need to handle non-relative timestamps
- only handles buffered (non encoded streams)

# Todo
- handle correct timing
- enable correct delay for first packet
- avoid too much recursion
- handle special resizing escape codes for ttyrec
- add more tests
- browserify this code
