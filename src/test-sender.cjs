const net = require("node:net");

const socket = net.createConnection({ port: 2575, host: "127.0.0.1" }, () => {
  const hl7 =
    [
      "MSH|^~\\&|HIS|DEMO_HOSPITAL|PMS|DEMO_HOSPITAL|20260907103000||ADT^A01^ADT_A01|MSG-6001|T|2.5.1",
      "EVN|A01|20260907103000",
      "PID|1||PAT-1002^^^DEMO_HOSPITAL^MR||TEST^PATIENT",
      "PV1|1|I|WARD1^ROOM1^BED1|||||||MED|||||||||ENC-2002^^^DEMO_HOSPITAL^VN",
    ].join("\r") + "\r";

  const frame = Buffer.concat([
    Buffer.from([0x0b]),
    Buffer.from(hl7, "utf8"),
    Buffer.from([0x1c, 0x0d]),
  ]);

  socket.end(frame);
});
