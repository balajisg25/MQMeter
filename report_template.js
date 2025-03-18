import React, { useState } from "react";
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import * as XLSX from "xlsx";

const SLA_THRESHOLD = 3.0; // SLA threshold for 90th percentile

const App = () => {
  const [testDetails, setTestDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0]; // Assuming the first sheet contains data
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      processExcelData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  const processExcelData = (data) => {
    let details = {};
    let transactionsData = [];
    let transactionStartIndex = -1;

    data.forEach((row, index) => {
      if (Array.isArray(row) && row.length > 0) {
        const key = row[0] ? String(row[0]).trim() : ""; // Convert to string before trimming
        const value = row[1] ? String(row[1]).trim() : "No Data"; // Handle undefined cases

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
            transactionStartIndex = index + 2; // Transactions start after this
            break;
          default:
            break;
        }
      }
    });

    if (transactionStartIndex !== -1) {
      for (let i = transactionStartIndex; i < data.length; i++) {
        const row = data[i];
        if (!Array.isArray(row) || row.length < 7) continue; // Skip invalid rows

        const transaction = {
          transactionName: row[0] ? String(row[0]).trim() : "Unknown",
          slaStatus: row[1] ? String(row[1]).trim() : "No Data",
          minTime: row[2] ? Number(row[2]) : "No Data",
          avgTime: row[3] ? Number(row[3]) : "No Data",
          maxTime: row[4] ? Number(row[4]) : "No Data",
          percentile90: row[6] ? Number(row[6]) : "No Data",
          slaPass: row[6] && !isNaN(row[6]) && parseFloat(row[6]) <= SLA_THRESHOLD ? "Pass" : "Fail",
        };

        transactionsData.push(transaction);
      }
    }

    setTestDetails(details);
    setTransactions(transactionsData);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 2 }}>
        LoadRunner Performance Report
      </Typography>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />

      {testDetails && (
        <>
          <Typography variant="h6" sx={{ my: 2 }}>
            **Test Execution Details**
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
            **Transactions**
          </Typography>
          <Table sx={{ my: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Transaction Name</TableCell>
                <TableCell>90th Percentile (s)</TableCell>
                <TableCell>SLA Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx, index) => (
                <TableRow key={index} sx={{ backgroundColor: tx.slaPass === "Fail" ? "#ffebee" : "inherit" }}>
                  <TableCell>{tx.transactionName}</TableCell>
                  <TableCell>{tx.percentile90}</TableCell>
                  <TableCell sx={{ color: tx.slaPass === "Fail" ? "red" : "green" }}>{tx.slaPass}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default App;