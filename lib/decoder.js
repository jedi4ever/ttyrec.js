'use strict';

function parseBuffer(chunk) {

  var buffer = chunk.slice(0);

  var recordResult = parseRecord(buffer);

  var record = recordResult[0];
  var rest = recordResult[1];

  if ( record === null) {
    return [ [] , rest ];
  } else {
    var bufferResult = parseBuffer(rest);
    var records = bufferResult[0];
    var bufferRest = bufferResult[1];

    var allRecords ;

    if (records.length === 0) {
      allRecords = [ record ];
    } else {
      allRecords = [ record ];
      allRecords = allRecords.concat(records);
    }

    return [ allRecords , bufferRest ];
  }
}

function parseHeader(chunk) {
  var result = {};

  if (chunk.length >= 12) {
    // 32Bit  (= 4 Bytes) Little Endian
    var sec = chunk.readUInt32LE(0);
    var usec = chunk.readUInt32LE(4);
    var length = chunk.readUInt32LE(8);

    var header = {
      sec: sec,
      usec: usec,
      length: length
    };

    var rest = chunk.slice(12);
    return [ header, rest ];

  } else {
    return [ null, chunk ];
  }
}

function parsePacket(chunk, length) {

  if (chunk.length >= length) {

    // Note: slice second param is not the end position but the length to slice
    var packet = chunk.slice(0,length);
    var rest = chunk.slice(length);

    return [ packet , rest ];

  } else {
    return [ null , chunk ];
  }
}

function parseRecord(chunk) {

  var headerResult = parseHeader(chunk);

  var header = headerResult[0];
  var headerRest = headerResult[1];

  if ( header === null) {
    return [ null, headerRest ];
  } else {

    var packetResult = parsePacket(headerRest , header.length);
    var packet = packetResult[0];
    var packetRest = packetResult[1];

    if (packet === null) {
      return [ null , chunk ];
    } else {
      var record = {
        header: header,
        packet: packet
      };

      return [ record, packetRest ];
    }
  }

}

module.exports = {
  parseBuffer: parseBuffer,
  decode: parseBuffer,
  parseRecord: parseRecord,
  parseHeader: parseHeader,
  parsePacket: parsePacket
};
