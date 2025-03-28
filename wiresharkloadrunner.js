import React, { useState } from "react";
import { Container, Typography, Button, Box, TextField } from "@mui/material";
import FileSaver from "file-saver";
import pcap from "pcap"; // Use node-pcap for better parsing

const App = () => {
  const [loadRunnerScript, setLoadRunnerScript] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      parsePcapFile(file);
    }
  };

  const parsePcapFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target.result;
      const pcapSession = pcap.decode(buffer);

      let script = "LoadRunner Script Generated from PCAP\n\n";

      pcapSession.on("packet", (packet) => {
        if (packet.payload.payload.payload.sport === 80 || packet.payload.payload.payload.sport === 443) {
          const httpPayload = extractHttpPayload(packet.payload.payload.payload.data);
          if (httpPayload) {
            script += generateLoadRunnerCode(httpPayload) + "\n\n";
          }
        }
      });

      pcapSession.on("end", () => {
        setLoadRunnerScript(script);
      });
    };
    reader.readAsArrayBuffer(file);
  };

  const extractHttpPayload = (data) => {
    try {
      const textDecoder = new TextDecoder("utf-8");
      const decodedData = textDecoder.decode(new Uint8Array(data));
      return decodedData.includes("HTTP") ? decodedData : null;
    } catch (error) {
      console.error("Error extracting HTTP payload:", error);
      return null;
    }
  };

  const generateLoadRunnerCode = (httpRequest) => {
    const lines = httpRequest.split("\n");
    if (lines.length === 0) return "";

    const requestLine = lines[0].split(" ");
    if (requestLine.length < 2) return "";

    const method = requestLine[0];
    const url = requestLine[1];

    let headers = "";
    let body = "";
    let isBody = false;

    lines.slice(1).forEach((line) => {
      if (line.trim() === "") isBody = true;
      else if (isBody) body += line + "\n";
      else headers += `"${line.trim()}\\n" +\n`;
    });

    return `web_custom_request("Request",
    "URL=${url}",
    "Method=${method}",
    "Headers=${headers}",
    ${body ? `"Body=${body}",` : ""}
    LAST);`;
  };

  const downloadScript = () => {
    const blob = new Blob([loadRunnerScript], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, "loadrunner_script.c");
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h4">PCAP to LoadRunner Converter</Typography>
        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          Upload PCAP File
          <input type="file" hidden onChange={handleFileChange} accept=".pcap" />
        </Button>
        {fileName && <Typography sx={{ mt: 2 }}>File: {fileName}</Typography>}
        {loadRunnerScript && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Generated LoadRunner Script:</Typography>
            <TextField
              multiline
              rows={10}
              fullWidth
              value={loadRunnerScript}
              variant="outlined"
              sx={{ mt: 2 }}
            />
            <Button variant="contained" color="success" onClick={downloadScript} sx={{ mt: 2 }}>
              Download Script
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default App;