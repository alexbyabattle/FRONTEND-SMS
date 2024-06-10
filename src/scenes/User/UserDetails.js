import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  Snackbar,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/material';

const UserDetails = () => {
  const { id } = useParams();
  const theme = useTheme();
  const borderColor = theme.palette.mode === 'dark' ? 'white' : 'black';

  const [userData, setUserData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('success');

  const loadUserDetails = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('Access token not found in local storage');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8083/api/v1/users/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      console.log('Response data:', response.data);
      const { data } = response.data;
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      console.error('Full error object:', error);
      showSnackbar('error', 'Error fetching user details');
    }
  };

  useEffect(() => {
    loadUserDetails();
  }, [id]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (responseCode, responseStatus) => {
    setSnackbarMessage(responseStatus);
    setSnackbarColor(responseCode);
    setSnackbarOpen(true);
  };

  return (
    <Box elevation={3}>
      {userData && (
        <Box elevation={3} sx={{ padding: '10px', marginBottom: '8px', border: `1px solid ${borderColor}`, marginLeft: "7px", marginRight: "5px" }}>
          <Box display="flex">
            <Box flex="1">
              <Typography variant="h6">USER DETAILS</Typography>
              <ul>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>User Name:</strong> {userData.name}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>Phone Number:</strong> {userData.phoneNumber}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>Location:</strong> {userData.location}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>Email:</strong> {userData.email}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>Department:</strong> {userData.department}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>CreatedAt:</strong> {userData.createdAt}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>Role:</strong> {userData.role}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>Department:</strong> {userData.department}
                  </Typography>
                </li>
              </ul>
            </Box>
          </Box>
        </Box>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        sx={{ backgroundColor: snackbarColor }}
      />
    </Box>
  );
};

export default UserDetails;
