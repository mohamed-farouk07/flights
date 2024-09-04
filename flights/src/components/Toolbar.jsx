import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchCurrentUser } from '../services/AuthService';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser)); // Parse and set user data from local storage
        } else {
          const userData = await fetchCurrentUser();
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData)); // Store fetched user data in local storage
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        localStorage.removeItem('token'); // Clear token if an error occurs
        navigate('/login'); // Redirect to login
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token from local storage
    localStorage.removeItem('user'); // Clear user data from local storage
    navigate('/login');
  };

  if (loading) {
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Loading...</Typography>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography variant="h6">
            {user ? `Welcome, ${user.name}` : 'Not logged in'}
          </Typography>
          {user && (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
