import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Tabs, Tab, Box } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const App = () => {
  const [selectedTab, setSelectedTab] = useState('tab1');
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([
    { headerName: "Make", field: "make", filter: true },
    { headerName: "Model", field: "model", filter: true },
    { headerName: "Price", field: "price", filter: true }
  ]);

  const tabs = [
    { value: 'tab1', label: 'Tab 1' },
    { value: 'tab2', label: 'Tab 2' },
    { value: 'tab3', label: 'Tab 3' },
  ];

  useEffect(() => {
    // Check local storage for data
    const cachedData = localStorage.getItem(`data_${selectedTab}`);
    if (cachedData) {
      setRowData(JSON.parse(cachedData));
    } else {
      // Fetch data when the selectedTab changes
      axios.post('/api/data', { tab: selectedTab })
        .then(response => {
          setRowData(response.data);
          localStorage.setItem(`data_${selectedTab}`, JSON.stringify(response.data));
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [selectedTab]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Tabs value={selectedTab} onChange={handleTabChange}>
          {tabs.map(tab => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </AppBar>
      <Box p={2}>
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={rowData}
            pagination={true}
            onGridReady={(params) => params.api.sizeColumnsToFit()}
          />
        </div>
      </Box>
    </div>
  );
};

export default App;