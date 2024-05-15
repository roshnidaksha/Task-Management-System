import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext.tsx"
import {
  Container,
  CssBaseline,
  Box,
  Alert,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const [isInvalidUsername, setIsInvalidUsername] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const checkInvalidUsername = () => {
    if (username.length < 1 || username.length > 30 || username.includes(" ")) {
      setIsInvalidUsername(true);
      return true;
    } else {
      setIsInvalidUsername(false);
      return false;
    }
  };

  const checkInvalidPassword = () => {
    if (password.length < 6) {
      setIsInvalidPassword(true);
      return true;
    } else {
      setIsInvalidPassword(false);
      return false;
    }
  };

  const handleLogin = async () => {
    setIsError(false);
    setErrorMessage("");

    const isInvalidUsername = checkInvalidUsername();
    const isInvalidPassword = checkInvalidPassword();

    if (isInvalidPassword || isInvalidUsername) {
      setIsError(true);
      setErrorMessage("Invalid username / password");
    } else {
      try {
        const response = await fetch("http://localhost:3001/api/login", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData); // handle success
          auth.toggleStatus(true);
          auth.updateUsername(username);
          auth.updatePassword(password);
          navigate("/");
        } else {
          const errorData = await response.json();
          setIsError(true);
          setErrorMessage(errorData.error);
          console.error(`Error: ${response.status}`);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <>
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            mt: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
            <LockOutlined />
          </Avatar>

          <Typography variant="h5">Login</Typography>

          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={handleUsernameChange}
              error={isInvalidUsername}
              helperText={"Username must be between 1 and 30 characters and cannot contain spaces"}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              error={isInvalidPassword}
              helperText={"Password must be at least 6 characters long"}
            />

            {isError && (
              <Alert severity="error">
                {errorMessage}
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
            >
              Login
            </Button>

            <Grid container justifyContent={"flex-end"}>
              <Grid item>
                <Link to="/signup">Don't have an accout? Click to SignUp</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;