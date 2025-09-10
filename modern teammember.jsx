CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  photo_url TEXT,
  date_of_birth DATE,
  wedding_anniversary DATE,
  mobile VARCHAR(30)
);


const express = require('express');
const pool = require('./db');
const app = express();
app.use(express.json());

// Fetch all team members
app.get('/api/team-members', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM team_members ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Add more API routes (POST, PUT, DELETE) as needed

app.listen(3001, () => {
  console.log('API running on port 3001');
});


import React, { useState, useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import TeamMemberCard from "../components/TeamMemberCard"; // Update the path as needed

const TeamMembersPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/team-members")
      .then((res) => res.json())
      .then((data) => {
        setTeamMembers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Team Members
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 3
        }}
      >
        {teamMembers.map((member) => (
          <TeamMemberCard key={member.id} {...member} />
        ))}
      </Box>
    </Container>
  );
};

export default TeamMembersPage;


import React from "react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Stack,
  Box
} from "@mui/material";

const TeamMemberCard = ({ name, photo_url, date_of_birth, wedding_anniversary, mobile }) => (
  <Card sx={{ maxWidth: 330, minWidth: 270, m: 1, boxShadow: 3 }}>
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
      <Avatar
        src={photo_url}
        alt={name}
        sx={{ width: 88, height: 88, mb: 1.5 }}
      />
    </Box>
    <CardContent>
      <Stack spacing={1}>
        <Typography variant="h6" align="center">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Date of Birth: {date_of_birth}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Wedding Anniversary: {wedding_anniversary}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Mobile: {mobile}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);

export default TeamMemberCard;
