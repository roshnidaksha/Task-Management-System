import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from '@mui/material/IconButton';
import Typography from "@mui/material/Typography";
import Menu from '@mui/material/Menu';
import Button from "@mui/material/Button";
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useAuth } from "../contexts/AuthContext.tsx"

const settings = ['Profile', 'Dashboard', 'Tasks', 'Timeline', 'Calender', 'Logout'];

// Navbar component to be displayed at the top at all times
const Navbar = () => {
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const navigate = useNavigate();
    const auth = useAuth();
    const userId = auth.user;

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = (menuOption) => {
        if (menuOption === "Profile") {
            navigate(`/profile/${userId}`)
        }
        setAnchorElUser(null);
    };

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
                <Box sx = {{ display: 'flex', flexGrow: 0 }}>
                    <Button color="inherit" onClick={handleSignup} sx={{ mr: 2 }}>
                        <Typography component="div">
                            Sign Up
                        </Typography>
                    </Button>
                    <Button color="inherit" onClick={handleLogin} sx={{ mr: 2 }}>
                        <Typography component="div">
                            Login
                        </Typography>
                    </Button>
                </Box>
                )}

                {auth.isLogin && (
                <Button color="inherit" onClick={handleLogout} sx={{ mr: 2 }}>
                    <Typography component="div">
                        Logout
                    </Typography>
                </Button>
                )}

                {auth.isLogin && (
                <Box sx = {{ display: 'flex', flexGrow: 0 }}>
                    <Typography sx={{ mr: 2 }}>
                        Welcome {auth.user}
                    </Typography>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ mr: 2, p: 0 }}>
                            <AccountCircle />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-navbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        keepMounted
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {settings.map((setting) => (
                            <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                                <Typography textAlign="center">
                                    {setting}
                                </Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
                )}

            </Toolbar>
        </AppBar>
    );
}

export default Navbar;