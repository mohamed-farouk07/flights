import React from "react";
import { Button, TextField, Typography, Paper, Box } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/LoginService";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const onSubmit = async (data) => {
    try {
      const result = await loginUser(data);
      setSuccess(`Login successful! Welcome back, ${result.name}.`);
      setError("");
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result));
      navigate("/");
    } catch (err) {
      setSuccess("");
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
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
            Login
          </Typography>
          <LockOpenIcon
            color="primary"
            style={{ marginLeft: 8, fontSize: "50px" }}
          />
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box marginBottom={2}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Box>
          <Box marginBottom={2}>
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
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
            Login
          </Button>{" "}
          <Box marginTop={2}>
            <Typography>
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{ textDecoration: "none", color: "#3f51b5" }}
              >
                Register here
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginForm;
