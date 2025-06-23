import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Paper,
} from '@mui/material';
import axios from 'axios';

function FilePromptUploader() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const readFileText = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });

  const handleSubmit = async () => {
    if (!file || !prompt) {
      alert('Please select a file and enter a prompt.');
      return;
    }

    setLoading(true);
    try {
      const fileText = await readFileText(file);
      const res = await axios.post('http://localhost:5000/api/mistral', {
        prompt,
        fileText,
      });

      setResult(res.data.result);
    } catch (err) {
      console.error(err);
      alert('Failed to get response from Mistral.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Mistral File + Prompt Interface
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        <Button variant="outlined" component="label">
          {file ? file.name : 'Upload File'}
          <input
            type="file"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Button>

        <TextField
          label="Enter your prompt"
          multiline
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </Box>

      {result && (
        <Paper elevation={2} sx={{ mt: 4, p: 2, whiteSpace: 'pre-wrap' }}>
          <Typography variant="subtitle1" gutterBottom>
            Result:
          </Typography>
          <Typography variant="body1">{result}</Typography>
        </Paper>
      )}
    </Container>
  );
}

export default FilePromptUploader;