# Ttyrec.js

a native implementation for encoding and decoding ttyrec files.

[![Build Status](https://travis-ci.org/jedi4ever/ttyrec.js.png)](https://travis-ci.org/jedi4ever/ttyrec.js)

# Usage
This implements a duplex / `transform` stream v2 .  Therefore only node v0.10.x is supported.

It also provides a few simple executable:

- `ttyrec` : records ttyrec file from the current terminal
- `ttyplay`: plays ttyrec files
- `ttytime`: shows the number of seconds is in the ttyrecord file
- `ttyrec++` : similar to ttyrec but generator a json file


- See [Ttyrec format specification](http://en.wikipedia.org/wiki/Ttyrec#Technical_file_format_specification)
- See [Ttyrec++](https://github.com/ewaters/ttyrec-plusplus)

# Installation

[![NPM](https://nodei.co/npm/ttyrec.png?downloads=true&stars=true)](https://nodei.co/npm/ttyrec/)

`npm install ttyrec`

## Write recStream
```js
var fs = require('fs');
var pty = require('pty');

var ttyrec = require('ttyrec');
var ttyrecStream = new ttyrec.recStream();

var fileStream = fs.createWriteStream('ttyrecord');

var _pty = pty.spawn('/bin/bash');
process.stdin.pipe(_pty);

_pty.pipe(ttyrecStream);
ttyrecStream.pipe(fileStream);
```

## Read playStream
```js
var fs = require('fs');

var ttyrec = require('ttyrec');
var fileStream = fs.createReadStream('ttyrecord');

var ttyplayStream = new ttyrec.playStream();

// Play at half the speed
ttyplayStream.setSpeed(0.5);

fileStream.pipe(ttyplayStream);
ttyplayStream.pipe(process.stdout);
```

## parseStream
```js
var fs = require('fs');

var ttyrec = require('ttyrec');
var fileStream = fs.createReadStream('ttyrecord');

var ttyparseStream = new ttyrec.parseStream();

// No waiting = speed 0
ttyparseStream.setSpeed(0);

fileStream.pipe(ttyparseStream);
ttyparseStream.on('data', function(record) {
  console.log(record.header);
  console.log(record.packet);
});
```

## Encode
```js
var ttyrec = require('ttyrec');
var encoder = ttyrec.encoder;
var sec = 0;
var usec = 10;
var record = encoder.encode(sec, usec, new Buffer('abc');
```

## Decode (parseBuffer)
```js
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
- only handles buffer streams(non-encoded streams)
- only works on v0.10.x

# Todo
- enhance the executables to mimic arguments from real ttyrec and ttyplay (almost, need peek + help)
- make v0.11 and v0.8 compatible
- handle special resizing escape codes for ttyrec
- browserify this code (almost, only process.hrtime does not exist in browser)
- help page
