import React from 'react';
import { Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from './Toolbar';

const BadRequestPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Paper style={{ padding: 20, textAlign: 'center' }}>
      <Navbar />
      <Typography variant="h4" gutterBottom>
        Bad Request
      </Typography>
      <Typography variant="body1" paragraph>
        We encountered an error with your request. Please check the details and try again.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleGoHome}>
        Go to Home
      </Button>
    </Paper>
  );
};

export default BadRequestPage;
