import React, { useState } from "react";
import { 
    Container, Paper, Typography, Button, TextField, Table, TableHead, TableBody, TableRow, TableCell 
} from "@mui/material";

function App() {
    const [loadRunnerScript, setLoadRunnerScript] = useState("");

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                let script = "";

                if (file.name.endsWith(".json")) {
                    const json = JSON.parse(content);
                    script = convertJsonToLoadRunner(json);
                } else if (file.name.endsWith(".xml")) {
                    script = convertXmlToLoadRunner(content);
                }

                setLoadRunnerScript(script);
            } catch (error) {
                alert("Error parsing file. Make sure it's a valid API collection.");
            }
        };
        reader.readAsText(file);
    };

    const convertJsonToLoadRunner = (json) => {
        let script = `// LoadRunner script generated from API Collection\n#include "lrun.h"\n#include "web_api.h"\n#include "lrw_custom_body.h"\n\nAction()\n{\n`;

        if (json.item) {
            json.item.forEach((item) => {
                const request = item.request || item;
                const url = request.url.raw || request.url;
                const method = request.method;
                const headers = request.header
                    ? request.header.map(h => `"${h.key}: ${h.value}"`).join(", ")
                    : "";
                let body = request.body?.raw ? `"${request.body.raw.replace(/"/g, '\\"')}"` : "";

                script += `\tweb_custom_request("${item.name || "API_Request"}",\n`;
                script += `\t\t"URL=${url}",\n`;
                script += `\t\t"Method=${method}",\n`;
                if (body) script += `\t\t"Body=${body}",\n`;
                if (headers) script += `\t\t"Header=${headers}",\n`;
                script += `\t\tLAST);\n\n`;
            });
        }

        script += `\treturn 0;\n}\n`;
        return script;
    };

    const convertXmlToLoadRunner = (xmlString) => {
        let script = `// LoadRunner script generated from SoapUI XML\n#include "lrun.h"\n#include "web_api.h"\n#include "lrw_custom_body.h"\n\nAction()\n{\n`;

        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlString, "text/xml");
        const requests = xml.getElementsByTagName("con:request");

        for (let i = 0; i < requests.length; i++) {
            const request = requests[i];
            const url = request.getAttribute("endpoint");
            const method = request.getAttribute("method");
            const body = request.textContent.trim();

            script += `\tweb_custom_request("SOAP_Request_${i}",\n`;
            script += `\t\t"URL=${url}",\n`;
            script += `\t\t"Method=${method}",\n`;
            if (body) script += `\t\t"Body=\\"${body.replace(/"/g, '\\"')}\\"",\n`;
            script += `\t\tLAST);\n\n`;
        }

        script += `\treturn 0;\n}\n`;
        return script;
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Convert API Collection to LoadRunner Script
                </Typography>

                <Button variant="contained" component="label" sx={{ mb: 2 }}>
                    Upload File
                    <input type="file" hidden accept=".json,.xml" onChange={handleFileUpload} />
                </Button>

                <TextField
                    label="Generated LoadRunner Script"
                    multiline
                    fullWidth
                    rows={15}
                    value={loadRunnerScript}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    sx={{ mb: 3 }}
                />

                <Typography variant="h6" gutterBottom>
                    Supported API Collection Formats
                </Typography>

                <Table sx={{ mb: 2 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Tool</b></TableCell>
                            <TableCell><b>Export Format</b></TableCell>
                            <TableCell><b>File Type</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Postman</TableCell>
                            <TableCell>Collection v2.1 or v2.0</TableCell>
                            <TableCell>.json</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Insomnia</TableCell>
                            <TableCell>Insomnia v4 JSON</TableCell>
                            <TableCell>.json</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>SoapUI</TableCell>
                            <TableCell>XML Project</TableCell>
                            <TableCell>.xml</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
}

export default App;