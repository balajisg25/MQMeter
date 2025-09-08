import React, { useState } from 'react';
import {
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Box,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';

const backgroundStyle = {
  minHeight: '100vh',
  backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const glassStyle = {
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: 15,
  padding: 30,
  width: 320,
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  color: 'white',
};

const inputsStyle = {
  color: 'white',
  '& .MuiInputBase-root': {
    color: 'white',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 25,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'white',
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  mb: 2,
};

export default function GlassLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://your-backend-api.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, rememberMe }),
      });
      if (!response.ok) {
        // Handle error response
        console.error('Login failed');
        return;
      }
      const data = await response.json();
      console.log('Login success', data);
      // Further processing like saving tokens, redirecting user
    } catch (error) {
      console.error('Error during login', error);
    }
  };

  return (
    <Box sx={backgroundStyle}>
      <Paper elevation={0} sx={glassStyle}>
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            sx={inputsStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: 'white' }} />
                </InputAdornment>
              ),
            }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            sx={inputsStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: 'white' }} />
                </InputAdornment>
              ),
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{ color: 'white' }}
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
              }
              label="Remember me"
              sx={{ color: 'white' }}
            />
            <Link href="#" underline="none" sx={{ color: 'white', fontSize: '0.9rem' }}>
              Forgot password?
            </Link>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              borderRadius: 25,
              backgroundColor: 'white',
              color: '#4a148c',
              height: 45,
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#f3e5f5' },
            }}
          >
            Login
          </Button>
        </form>
        <Typography align="center" sx={{ mt: 2, color: 'white', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link href="#" underline="none" sx={{ fontWeight: 'bold', color: 'white' }}>
            Register
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
