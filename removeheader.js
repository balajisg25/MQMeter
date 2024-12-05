import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, Box, Alert } from "@mui/material";

const FileEditor = () => {
  const [files, setFiles] = useState([]);
  const [regexPattern, setRegexPattern] = useState("web_add_(header|auto_header|cookie)|web_set_sockets|lr_think_time|web_revert_j"); // Updated pattern
  const [message, setMessage] = useState("");
  const [modifiedFiles, setModifiedFiles] = useState([]);

  // Handle folder selection and file reading
  const handleFileSelect = (event) => {
    const selectedFiles = event.target.files;
    const cFiles = Array.from(selectedFiles).filter((file) => file.name.endsWith(".c"));
    setFiles(cFiles);
    setModifiedFiles([]);
    setMessage("");
  };

  // Delete lines matching regex in the file
  const deleteLines = (file, regexPattern) => {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result;
      const pattern = new RegExp(regexPattern, "g");

      // Split content into lines and filter out lines that match the pattern
      const updatedContent = content
        .split("\n")
        .filter((line) => !pattern.test(line)) // Remove lines matching the regex
        .join("\n");

      // Create a new file blob with updated content
      const newFile = new Blob([updatedContent], { type: file.type });
      const modifiedFile = new File([newFile], file.name, { type: file.type });

      // Add the modified file to the state
      setModifiedFiles((prev) => [...prev, modifiedFile]);
      setMessage(`Lines matching the pattern were deleted in ${file.name}`);
    };
    reader.onerror = () => {
      setMessage("Error reading the file.");
    };

    // Read the file content as text
    reader.readAsText(file);
  };

  // Download the modified files
  const downloadFile = (file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Card sx={{ minWidth: 275, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Remove Headers Button
          </Typography>
          <Box sx={{ my: 2 }}>
            <input
              type="file"
              webkitdirectory="true"
              directory="true"
              onChange={handleFileSelect}
              style={{ display: "none" }}
              id="fileInput"
            />
            <Button
              variant="contained"
              component="label"
              htmlFor="fileInput"
              sx={{
                backgroundColor: "black", // Set background color to black
                color: "white", // Set text color to white
                '&:hover': {
                  backgroundColor: "#333", // Darken the button on hover
                },
                marginRight: 2,
              }}
            >
              Select Folder
            </Button>
          </Box>
          <TextField
            label="Regex Pattern"
            variant="outlined"
            fullWidth
            value={regexPattern}
            onChange={(e) => setRegexPattern(e.target.value)}
            sx={{ my: 2 }}
          />
          <Box sx={{ my: 2 }}>
            {files.length > 0 && (
              <div>
                <Typography variant="h6">Files:</Typography>
                <ul>
                  {files.map((file, index) => (
                    <li key={index}>
                      {file.name}{" "}
                      <Button
                        sx={{ color: "black", marginLeft: 1 }}
                        onClick={() => deleteLines(file, regexPattern)}
                      >
                        Delete Lines
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {message && (
              <Alert severity="info" sx={{ my: 2 }}>
                {message}
              </Alert>
            )}
            {modifiedFiles.length > 0 && (
              <div>
                <Typography variant="h6">Modified Files:</Typography>
                <ul>
                  {modifiedFiles.map((file, index) => (
                    <li key={index}>
                      {file.name}{" "}
                      <Button
                        sx={{ color: "black", marginLeft: 1 }}
                        onClick={() => downloadFile(file)}
                      >
                        Download
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FileEditor;