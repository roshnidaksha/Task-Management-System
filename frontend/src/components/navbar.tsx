import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const Navbar = () => {
    const navigate = useNavigate();
    function handleLogin() {
        navigate("/login");
    }

    function handleSignup() {
        navigate("/signup");
    }

    return (
        <AppBar position="static" className={"px-0 md: px-4"}>
            <Toolbar>
                <div>
                    <Link to={"/"} className={"no-underline"}>
                        <Typography variant="h6" className={"text-White"}>
                            Innovation Hub
                        </Typography>
                    </Link>
                </div>

                <div className={"flex-grow"} />

                <div className={"mr-4"}>
                    <Button color="inherit" onClick={handleSignup}>
                        <Typography className={"text-white"}>
                            Sign Up
                        </Typography>
                    </Button>
                </div>

                <div className={"mr-2 flex min-w-[30px] items-center gap-2 md:mr-6"}>
                    <div className={"hidden md: block"}>
                        <Typography className={"text-white"}>
                            Welcome
                        </Typography>
                    </div>
                </div>

                <Button color="inherit" onClick={handleLogin}>
                    <Typography className={"text-white"}>
                        Login
                    </Typography>
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;