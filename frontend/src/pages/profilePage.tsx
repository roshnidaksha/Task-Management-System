import * as React from "react";
import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert
} from '@mui/material'
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useAuth } from "../contexts/AuthContext.tsx"

const ProfilePage = () => {

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

  const handleDeleteUser = async () => {

  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
      {/* Profile Picture */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: { xs: 2, sm: 3 },
          borderStyle: 'solid',
          borderColor: '#d1d1d1',
          borderWidth: 2,
          borderRadius: 4,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          m: 2,
          bgcolor: 'background.paper',
          width: { xs: '90%', sm: '60%' },
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
          Profile Page
        </Typography>
        <AccountCircle sx={{ fontSize: 120, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Welcome, {auth.user || 'Guest'}
        </Typography>
      </Box>

      {/* About me */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          p: { xs: 2, sm: 3 },
          borderStyle: 'solid',
          borderColor: '#d1d1d1',
          borderWidth: 2,
          borderRadius: 4,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          m: 2,
          bgcolor: 'background.paper',
          width: { xs: '90%', sm: '60%' },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          About Me
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {'Add a short bio to let others know more about you.'}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleFormVisibility('bio')}
        >
          Edit Bio
        </Button>
      </Box>

      {/* Account Settings Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          p: { xs: 2, sm: 3 },
          borderStyle: 'solid',
          borderColor: '#d1d1d1',
          borderWidth: 2,
          borderRadius: 4,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          m: 2,
          bgcolor: 'background.paper',
          width: { xs: '90%', sm: '60%' },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Account Settings
        </Typography>

        {/* Username */}
        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          Username: {auth.user}
          <Button
            variant="text"
            color="primary"
            onClick={() => handleFormVisibility('username')}
            sx={{ ml: 2 }}
          >
            Edit
          </Button>
        </Typography>

        {/* Password */}
        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          Password: ********
          <Button
            variant="text"
            color="primary"
            onClick={() => handleFormVisibility('password')}
            sx={{ ml: 2 }}
          >
            Change
          </Button>
        </Typography>

        {/* Form for updating */}
        {showForm && (
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              margin="normal"
              required
              id={formType}
              label={`New ${formType}`}
              name={formType}
              value={newName}
              onChange={handleFormChange}
              helperText={`Enter new ${formType}`}
            />
            {isError && <Alert severity="error">{errorMessage}</Alert>}
            {!isError && errorMessage.includes('success') && (
              <Alert severity="success">{errorMessage}</Alert>
            )}
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleUpdateUser}
            >
              Update
            </Button>
          </Box>
        )}
      </Box>

      {/* Delete Account Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: { xs: '90%', sm: '60%' },
          p: 2,
          mt: 2,
        }}
      >
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteUser}
          sx={{
            fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(255, 72, 69, 0.5)',
          }}
        >
          Delete Account
        </Button>
      </Box>
    </Box>
  );
}

export default ProfilePage;