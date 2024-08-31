import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FlightsTable from './components/FlightTable';
import BadRequestPage from './components/BadRequest';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<FlightsTable />} />
      <Route path="/bad-request" element={<BadRequestPage />} />
    </Routes>
  );
};

export default App;
