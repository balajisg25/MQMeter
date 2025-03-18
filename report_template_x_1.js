import React, { useState, useCallback } from "react";
import { 
  Container, 
  Typography, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody,
  CircularProgress,
  Box
} from "@mui/material";
import * as XLSX from "xlsx";

const SLA_THRESHOLD = 3.0;

const App = () => {
  const [testDetails, setTestDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processExcelData = useCallback((data) => {
    try {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Invalid Excel data format");
      }

      let details = {};
      let transactionsData = [];
      let transactionStartIndex = -1;

      data.forEach((row, index) => {
        if (Array.isArray(row) && row.length > 0) {
          const key = String(row[0] || "").trim();
          const value = String(row[1] || "No Data").trim();

          switch (key) {
            case "Run Time":
              details.runTime = value;
              break;
            case "Duration":
              details.duration = value;
              break;
            case "Scenario Name":
              details.scenarioName = value;
              break;
            case "Result Name":
              details.resultName = value;
              break;
            case "SLA":
              details.sla = value;
              break;
            case "TRANSACTIONS":
              transactionStartIndex = index + 3;
              break;
            default:
              break;
          }
        }
      });

      if (transactionStartIndex === -1) {
        throw new Error("Transactions section not found");
      }

      for (let i = transactionStartIndex; i < data.length; i++) {
        const row = data[i];
        if (!Array.isArray(row) || row.length < 9) continue;
        if (String(row[0] || "").toLowerCase().includes("transaction name")) continue;

        const convertToSeconds = (value) => {
          if (value === undefined || value === null || value === "") return "No Data";
          const parsed = parseFloat(value);
          return isNaN(parsed) ? "No Data" : Number(parsed.toFixed(3));
        };

        const percentile90Raw = row[6]; // Keep raw value for debugging
        const percentile90 = convertToSeconds(percentile90Raw);
        
        // Explicit SLA status calculation
        let slaPass;
        if (percentile90 === "No Data") {
          slaPass = "N/A";
        } else {
          const percentileValue = Number(percentile90);
          slaPass = percentileValue <= SLA_THRESHOLD ? "Pass" : "Fail";
          // Debug logging
          console.log({
            transaction: row[0],
            rawValue: percentile90Raw,
            convertedValue: percentile90,
            slaThreshold: SLA_THRESHOLD,
            slaPass: slaPass
          });
        }

        transactionsData.push({
          transactionName: String(row[0] || "Unknown").trim(),
          minTime: convertToSeconds(row[2]),
          avgTime: convertToSeconds(row[3]),
          maxTime: convertToSeconds(row[4]),
          percentile90,
          slaPass,
          passCount: Number(row[7] || 0),
          failCount: Number(row[8] || 0),
        });
      }

      setTestDetails(details);
      setTransactions(transactionsData);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        processExcelData(jsonData);
      } catch (err) {
        setError("Error processing file: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Error reading file");
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
  }, [processExcelData]);

  const failedSLATransactions = transactions.filter(tx => tx.slaPass === "Fail");

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ my: 2 }}>
        LoadRunner Performance Report
      </Typography>
      
      <Box sx={{ my: 2 }}>
        <input 
          type="file" 
          accept=".xlsx,.xls" 
          onChange={handleFileUpload}
          disabled={loading}
        />
        {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </Box>

      {testDetails && (
        <>
          <Typography variant="h6" sx={{ my: 2 }}>
            Test Execution Details
          </Typography>
          <Table sx={{ my: 2 }}>
            <TableBody>
              <TableRow>
                <TableCell>Run Time</TableCell>
                <TableCell>{testDetails.runTime}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Duration</TableCell>
                <TableCell>{testDetails.duration}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Scenario Name</TableCell>
                <TableCell>{testDetails.scenarioName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Result Name</TableCell>
                <TableCell>{testDetails.resultName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>SLA</TableCell>
                <TableCell sx={{ color: testDetails.sla === "Not Defined" ? "red" : "green" }}>
                  {testDetails.sla}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Typography variant="h6" sx={{ my: 2 }}>
            Transactions
          </Typography>
          <Table sx={{ my: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Transaction Name</TableCell>
                <TableCell>Min (s)</TableCell>
                <TableCell>Avg (s)</TableCell>
                <TableCell>Max (s)</TableCell>
                <TableCell>90th Percentile (s)</TableCell>
                <TableCell>SLA Status</TableCell>
                <TableCell>Pass Count</TableCell>
                <TableCell>Fail Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx, index) => (
                <TableRow 
                  key={index} 
                  sx={{ backgroundColor: tx.slaPass === "Fail" ? "#ffebee" : tx.slaPass === "N/A" ? "#fff3e0" : "inherit" }}
                >
                  <TableCell>{tx.transactionName}</TableCell>
                  <TableCell>{tx.minTime}</TableCell>
                  <TableCell>{tx.avgTime}</TableCell>
                  <TableCell>{tx.maxTime}</TableCell>
                  <TableCell>{tx.percentile90}</TableCell>
                  <TableCell 
                    sx={{ 
                      color: tx.slaPass === "Fail" ? "red" : tx.slaPass === "Pass" ? "green" : "orange" 
                    }}
                  >
                    {tx.slaPass}
                  </TableCell>
                  <TableCell>{tx.passCount}</TableCell>
                  <TableCell>{tx.failCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {failedSLATransactions.length > 0 && (
            <>
              <Typography variant="h6" sx={{ my: 2 }}>
                Response Times Exceeding SLA ({SLA_THRESHOLD}s)
              </Typography>
              <Table sx={{ my: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Transaction Name</TableCell>
                    <TableCell>90th Percentile (s)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {failedSLATransactions.map((tx, index) => (
                    <TableRow key={index} sx={{ backgroundColor: "#ffebee" }}>
                      <TableCell>{tx.transactionName}</TableCell>
                      <TableCell sx={{ color: "red" }}>{tx.percentile90}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default App;