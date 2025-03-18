import React, { useState } from "react";
import { Container, Button, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const SLA_THRESHOLD = 3.0; // Example SLA threshold in seconds

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [executionDate, setExecutionDate] = useState("");
  const [executionTime, setExecutionTime] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      processExcelData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  const processExcelData = (data) => {
    const extractedTransactions = data.map((row) => ({
      transactionName: row["Transaction Name"],
      minTime: row["Minimum (s)"],
      avgTime: row["Average (s)"],
      maxTime: row["Maximum (s)"],
      percentile90: row["90th Percentile (s)"],
      slaStatus: row["90th Percentile (s)"] <= SLA_THRESHOLD ? "Pass" : "Fail",
    }));

    setTransactions(extractedTransactions);
    
    const date = new Date();
    setExecutionDate(date.toISOString().split("T")[0]);
    setExecutionTime(date.toLocaleTimeString());
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(transactions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Performance Report");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "Performance_Report.xlsx");
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 2 }}>
        LoadRunner Performance Report
      </Typography>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />
      {transactions.length > 0 && (
        <>
          <Typography variant="h6" sx={{ my: 2 }}>
            Execution Date: {executionDate} | Execution Time: {executionTime}
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
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx, index) => (
                <TableRow key={index} sx={{ backgroundColor: tx.slaStatus === "Fail" ? "#ffebee" : "inherit" }}>
                  <TableCell>{tx.transactionName}</TableCell>
                  <TableCell>{tx.minTime}</TableCell>
                  <TableCell>{tx.avgTime}</TableCell>
                  <TableCell>{tx.maxTime}</TableCell>
                  <TableCell>{tx.percentile90}</TableCell>
                  <TableCell sx={{ color: tx.slaStatus === "Fail" ? "red" : "green" }}>{tx.slaStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="contained" color="primary" onClick={exportToExcel}>
            Export to Excel
          </Button>
        </>
      )}
    </Container>
  );
};

export default App;