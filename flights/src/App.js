import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FlightsTable from './components/FlightTable';
import BadRequestPage from './components/BadRequest';
import RegisterForm from './pages/register/RegisterForm';
import LoginForm from './pages/login/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/" element={<ProtectedRoute element={FlightsTable} />} />
      <Route path="/bad-request" element={<BadRequestPage />} />
    </Routes>
  );
};

export default App;
