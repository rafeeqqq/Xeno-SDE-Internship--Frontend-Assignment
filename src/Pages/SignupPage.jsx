import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Box,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login"); // Navigate to the login page
  };

  return (
    <Container>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={12} sm={6}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            padding={3}
            boxShadow={3}
            borderRadius={2}
          >
            <Typography variant="h4" gutterBottom>
              Sign Up
            </Typography>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSignup}
              fullWidth
            >
              Sign Up
            </Button>

            <Typography
              variant="body2"
              color="textSecondary"
              style={{
                marginTop: "20px",
                cursor: "pointer",
                textAlign: "center",
              }}
              onClick={handleLoginRedirect}
            >
              Already have an account? Log In
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignupPage;
