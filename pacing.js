import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Grid,
} from '@mui/material';

const PacingCalculator = () => {
  const [users, setUsers] = useState('');
  const [targetVolume, setTargetVolume] = useState('');
  const [pacingType, setPacingType] = useState('TPS');
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const numUsers = parseFloat(users);
    const volume = parseFloat(targetVolume);

    if (isNaN(numUsers) || isNaN(volume) || numUsers <= 0 || volume <= 0) {
      alert('Please enter valid positive numbers for users and target volume.');
      return;
    }

    let pacing;
    if (pacingType === 'TPS') {
      // TPS formula: Pacing = NumUsers / Volume
      pacing = (numUsers / volume).toFixed(0);
    } else if (pacingType === 'TPH') {
      // TPH formula: Pacing = NumUsers / (Volume / 3600)
      pacing = (numUsers / (volume / 3600)).toFixed(0);
    }

    setResult(`Pacing (${pacingType}): ${pacing}`);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#f4f6f8',
      }}
    >
      <Card sx={{ maxWidth: 400, p: 2 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Pacing Calculator
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Number of Users"
                variant="outlined"
                value={users}
                onChange={(e) => setUsers(e.target.value)}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Targeted Volume"
                variant="outlined"
                value={targetVolume}
                onChange={(e) => setTargetVolume(e.target.value)}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Select Pacing Type:</Typography>
              <RadioGroup
                row
                value={pacingType}
                onChange={(e) => setPacingType(e.target.value)}
              >
                <FormControlLabel value="TPS" control={<Radio />} label="TPS" />
                <FormControlLabel value="TPH" control={<Radio />} label="TPH" />
              </RadioGroup>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleCalculate}
              >
                Calculate
              </Button>
            </Grid>
            {result && (
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  align="center"
                  color="text.secondary"
                  gutterBottom
                >
                  {result}
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PacingCalculator;