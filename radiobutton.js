import React, { useState } from "react";
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box } from "@mui/material";

const ScreenOne = () => <Box p={2}>This is Screen One</Box>;
const ScreenTwo = () => <Box p={2}>This is Screen Two</Box>;
const ScreenThree = () => <Box p={2}>This is Screen Three</Box>;

export default function App() {
  const [selectedScreen, setSelectedScreen] = useState("screen1");

  return (
    <Box p={3}>
      <FormControl>
        <FormLabel>Select Screen</FormLabel>
        <RadioGroup
          row
          value={selectedScreen}
          onChange={(e) => setSelectedScreen(e.target.value)}
        >
          <FormControlLabel value="screen1" control={<Radio />} label="Screen 1" />
          <FormControlLabel value="screen2" control={<Radio />} label="Screen 2" />
          <FormControlLabel value="screen3" control={<Radio />} label="Screen 3" />
        </RadioGroup>
      </FormControl>

      <Box mt={2} p={2} border={1}>
        {selectedScreen === "screen1" && <ScreenOne />}
        {selectedScreen === "screen2" && <ScreenTwo />}
        {selectedScreen === "screen3" && <ScreenThree />}
      </Box>
    </Box>
  );
}