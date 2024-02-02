import * as React from "react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { LockOutlined } from "@mui/icons-material";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {};

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };
    
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const [isInvalidUsername, setIsInvalidUsername] = useState(false);
    const [isInvalidPassword, setIsInvalidPassword] = useState(false);

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
                <Avatar sx={{m: 1, bgcolor: "primary.light"}}>
                    <LockOutlined />
                </Avatar>

                <Typography variant="h5">SignUp</Typography>

                <Box sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
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
                        </Grid>
                    
                        <Grid item xs={12}>
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
                        </Grid>
                    </Grid>

                    <Button
                      fullWidth
                      variant="contained"
                      sx={{mt: 3, mb: 2}}
                      onClick={handleSignup}
                    >
                        SignUp
                    </Button>

                    <Grid container justifyContent={"flex-end"}>
                        <Grid item>
                            <Link to="/loginPage">Already have an accout? Login</Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
          </Container>
        </>
    );
};

export default Signup;