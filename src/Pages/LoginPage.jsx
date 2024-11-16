import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Box,
} from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://xeno-sde-internship-assignment.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleGoogleLogin = (response) => {
    const { credential } = response;
    axios
      .post(
        "https://xeno-sde-internship-assignment.onrender.com/api/auth/google",
        { token: credential }
      )
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        console.error("Google login failed", error);
      });
  };

  const handleSignUpRedirect = () => {
    navigate("/signup"); // Navigate to the sign-up page
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
              Login
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
              onClick={handleLogin}
              fullWidth
            >
              Login
            </Button>
            <div
              style={{
                width: "100%",
                height: "40px",
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={(error) => console.log(error)}
              />
            </div>
            <Typography
              variant="body2"
              color="textSecondary"
              style={{
                marginTop: "20px",
                cursor: "pointer",
                textAlign: "center",
              }}
              onClick={handleSignUpRedirect}
            >
              Don't have an account? Sign Up
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;
