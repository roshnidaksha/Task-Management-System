import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    Grid,
    TextField,
    Alert
} from '@mui/material'
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useAuth } from "../contexts/AuthContext.tsx"

const ProfilePage = () => {
    const navigate = useNavigate();
    const auth = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState("");
    const [newName, setNewName] = useState("");
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleFormVisibility = (type) => {
        if (type === "username") {
            setFormType("username");
        } else {
            setFormType("password");
        }
        setShowForm(true);
    };

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(event.target.value);
    };

    const handleUpdateUser = async () => {
        var user = auth.user;
        var pass = auth.pass;
        if (formType === "username") {
            pass = "";
        }

        setIsError(false);
        setErrorMessage("");

        try {
            const response = await fetch("http://localhost:3001/api/updateUserDetails", {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ new: newName, username: user, password: pass }),
            });
        
            if (response.ok) {
                const responseData = await response.json();
                setErrorMessage(responseData.Message);
                console.log(responseData); // handle success
                if (formType === "username") {
                    auth.updateUsername(newName);
                } else {
                    auth.updatePassword(newName);
                }
            } else {
                const errorData = await response.json();
                setIsError(true);
                setErrorMessage(errorData.error);
                console.error(`Error: ${response.status}`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Box>
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#80d8ff', 
                    borderRadius: 2, 
                    m: 1, 
                    p: 1,    
                }}
            >
                <Typography variant='h4' sx={{ fontWeight: 700 }}>
                    Profile Page
                </Typography>

                <AccountCircle sx={{ fontSize: 100 }} />
            </Box>

            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#80d8ff', 
                    borderRadius: 2, 
                    m: 1, 
                    p: 1,    
                }}
            >
                <Typography variant='h6' sx={{ fontWeight: 700 }}>
                    <p>Username: {auth.user}
                    <Button color="inherit">
                        <Typography component="div" onClick={() => handleFormVisibility("username")} sx={{ ml: 2 }}>
                            Change Username?
                        </Typography>
                    </Button></p>

                    <p>Password: ........
                    <Button color="inherit">
                        <Typography component="div" onClick={() => handleFormVisibility("password")} sx={{ ml: 2 }}>
                            Change Password?
                        </Typography>
                    </Button></p>
                </Typography>

                {showForm && (
                    <div>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id={formType}
                                label={formType}
                                name={formType}
                                autoComplete={formType}
                                autoFocus
                                value={newName}
                                onChange={handleFormChange}
                                helperText={"Enter new username/password"}
                            />
                        </Grid>

                        {isError && (
                            <Alert severity="error">
                                {errorMessage}
                            </Alert>
                        )}

                        {!isError && errorMessage.includes("success") && (
                            <Alert severity="success">
                                {errorMessage}
                            </Alert>
                        )}

                        <Button
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            onClick={handleUpdateUser}
                        >
                            Update
                        </Button>
                    </div>
                )}

            </Box>
        </Box>
    );
}

export default ProfilePage;