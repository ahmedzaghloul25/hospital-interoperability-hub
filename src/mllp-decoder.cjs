const { Buffer } = require("buffer");
function createMllpDecoder() {
  // mllp message format
  // 0B-vertical tab  (message)    1C-file separator    0D-carriage return
  /*
   * Find the complete FS + CR (0x1C 0x0D) ending after it.
   * If that ending is incomplete, retain the bytes and wait.
   * Extract the content after VT and before FS.
   * Remove the consumed frame, including its ending, then check for another frame.
   */
  let pending = Buffer.alloc(0);

  return function push(chunk) {
    let messages = [];
    // add new chunks to the pending buffer
    pending = Buffer.concat([pending, chunk]);
    // find the vertical tab (0x0b) and the file separator + carriage return (0x1c 0x0d)
    let startIndex = pending.indexOf(0x0b);
    let endIndex = pending.indexOf(Buffer.from([0x1c, 0x0d]), startIndex + 1);

    while (
      startIndex !== -1 &&
      endIndex !== -1 
    ) {
      // extract the message between the VT and FS
      let message = pending.subarray(startIndex + 1, endIndex);

      messages.push(message.toString());
      // remove the consumed frame from the pending buffer
      pending = pending.subarray(endIndex + 2);
      startIndex = pending.indexOf(0x0b);
      endIndex = pending.indexOf(Buffer.from([0x1c, 0x0d]), startIndex + 1);
    }
    return messages;
  };
}

module.exports = {createMllpDecoder};