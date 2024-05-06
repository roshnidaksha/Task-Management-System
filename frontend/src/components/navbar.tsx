import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useAuth } from "../contexts/AuthContext.tsx"

// Navbar component to be displayed at the top at all times
const Navbar = () => {
    const navigate = useNavigate();
    const auth = useAuth();

    const handleLogout = async () => {
        auth.logout();
        navigate("/");
    };

    function handleLogin() {
        navigate("/login");
    }

    function handleSignup() {
        navigate("/signup");
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    <Button component={Link} to={"/"} color="inherit">
                        <Typography sx={{ mr: 2, fontWeight: 700 }}>
                            Innovation Hub
                        </Typography>
                    </Button>
                </Box>

                {!auth.isLogin && (
                <Button color="inherit" onClick={handleSignup} sx={{ mr: 2 }}>
                    <Typography component="div">
                        Sign Up
                    </Typography>
                </Button>
                )}

                {!auth.isLogin && (
                <Button color="inherit" onClick={handleLogin} sx={{ mr: 2 }}>
                    <Typography component="div">
                        Login
                    </Typography>
                </Button>
                )}

                {auth.isLogin && (
                <Button color="inherit" onClick={handleLogout} sx={{ mr: 2 }}>
                    <Typography component="div">
                        Logout
                    </Typography>
                </Button>
                )}

                {auth.isLogin && (
                <Typography >
                    Welcome {auth.user}
                </Typography>
                )}

            </Toolbar>
        </AppBar>
    );
}

export default Navbar;