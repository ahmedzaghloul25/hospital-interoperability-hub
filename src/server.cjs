const net = require("node:net");
const { createMllpDecoder } = require("./mllp-decoder.cjs");

const server = net.createServer((socket) => {
  // Each connection needs its own retained bytes.
  const decode = createMllpDecoder();

  socket.on("data", (chunk) => {
    const messages = decode(chunk);

    for (const message of messages) {
      const segments = message.split("\r");
      if (segments[segments.length - 1] === "") segments.pop();
      const pv1Segment = segments.find((segment) => segment.startsWith("PV1|"));
      if (!pv1Segment) {
        console.error("Validation Error", {
          code: "AE",
          reason: "Missing PV1 segment",
        });
        continue;
      }
      const patientVisit1 = pv1Segment.split("|")[19];
      if (!patientVisit1) {
        console.error("Validation Error", {
          code: "AE",
          reason: "Missing PV1-19 field",
        });
        continue;
      }
      const patientEncounterId = patientVisit1.split("^")[0];
      if (!patientEncounterId || patientEncounterId === "") {
        console.error("Validation Error", {
          code: "AE",
          reason: "Missing PV1-19 identifier",
        });
        continue;
      }
      const pidSegment = segments.find((segment) => segment.startsWith("PID|"));
      if (!pidSegment) {
        console.error("Validation Error", {
          code: "AE",
          reason: "Missing PID segment",
        });
        continue;
      }
      const patientIdSegment = pidSegment.split("|")[3];
      if (!patientIdSegment) {
        console.error("Validation Error", {
          code: "AE",
          reason: "Missing PID-3 field",
        });
        continue;
      }
      const patientId = patientIdSegment.split("^")[0];
      if (!patientId) {
        console.error("Validation Error", {
          code: "AE",
          reason: "Missing PID-3 identifier",
        });
        continue;
      }
    }
  });

  socket.on("error", (error) => {
    console.error("Connection error:", error.code);
  });
});

server.on("error", (error) => {
  console.error("Listener error:", error.code);
});

server.listen(2575, "127.0.0.1", () => {
  console.log("Listening on 127.0.0.1:2575");
});
