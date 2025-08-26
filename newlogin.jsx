// App.js
import React, { useState, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Switch } from '@mui/material';
import Login from './Login';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode palette
          primary: { main: '#2e7d32' }, // Green
          background: { default: '#f9fbe7' },
        }
      : {
          // Dark mode palette
          primary: { main: '#388e3c' },
          background: { default: '#212121' },
        }),
  },
});

export default function App() {
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 3 }}>
        <Switch checked={mode === 'dark'} onChange={() => setMode(mode === 'light' ? 'dark' : 'light')} />
        <Login />
      </Box>
    </ThemeProvider>
  );
}


// Login.js
import React, { useState } from 'react';
import { Box, TextField, Button, Checkbox, FormControlLabel, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

export default function Login() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    // send data to backend here
  };
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <LockIcon color="primary" fontSize="large" />
      <Typography variant="h5" sx={{ mb: 2 }}>Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Username" value={user} onChange={(e) => setUser(e.target.value)}
          fullWidth required sx={{ mb: 2 }} />
        <TextField label="Password" type="password" value={pass}
          onChange={(e) => setPass(e.target.value)} fullWidth required sx={{ mb: 2 }} />
        <FormControlLabel control={<Checkbox color="primary" />} label="Remember me" sx={{ mb: 2 }} />
        <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
      </form>
    </Box>
  );
}

// server.js or app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'login_db',
  password: 'yourpassword',
  port: 5432,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  const user = result.rows;
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ message: 'Login successful', token: 'jwt-or-session-token' });
});

app.listen(5000, () => console.log('Server running'));
