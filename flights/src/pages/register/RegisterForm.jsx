import React, { useState } from "react";
import { Button, TextField, Typography, Paper, Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { registerUser } from "../../services/RegisterService";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userData = { name, email, password };
      const result = await registerUser(userData);
      setSuccess(`Registration successful! Welcome, ${result.name}.`);
      setError("");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      padding={2}
    >
      <Paper style={{ padding: 20, maxWidth: 600, width: "100%" }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          marginBottom={2}
        >
          <Typography variant="h4" gutterBottom>
            Register
          </Typography>
          <AccountCircleIcon
            color="primary"
            style={{ marginLeft: 8, fontSize: "50px" }}
          />
        </Box>
        <form onSubmit={handleSubmit}>
          <Box marginBottom={2}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Box>
          <Box marginBottom={2}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Box>
          <Box marginBottom={2}>
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Box>
          {error && (
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="primary" gutterBottom>
              {success}
            </Typography>
          )}
          <Button variant="contained" color="primary" type="submit">
            Register
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterForm;
