import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  IconButton,
  Snackbar,
} from '@mui/material';
import { useParams } from 'react-router-dom';


import MyFormDialog from './DeviceAssignmentDialog';
import ChangeStatusDialog from './ChangeDeviceStatus';
import { useTheme } from '@mui/material';
import UnassignDialog from './DeviceUnassignmentDialog';

const DeviceDetails = () => {
  const { id } = useParams();
  const theme = useTheme();
  const borderColor = theme.palette.mode === 'dark' ? 'white' : 'black';

  const [deviceData, setDeviceData] = useState(null);

  const loadDeviceDetails = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('Access token not found in local storage');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };

    axios
      .get(`http://localhost:8083/api/v1/device/get/${id}`, config)
      .then((response) => {
        console.log('Response data:', response.data);
        const { data } = response.data;
        setDeviceData(data);
      })
      .catch((error) => {
        console.error('Error fetching device details:', error);
        console.error('Full error object:', error);
      });
  };

  useEffect(() => {
    loadDeviceDetails();
  }, [id]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDeviceAssignmentDialog = (deviceId) => {
    setIsDialogOpen(true);
  };


  const [isUnassignDialogOpen, setIsUnassignDialogOpen] = useState(false);

  const openUserUnassignmentDialog = (deviceId) => {
    setIsUnassignDialogOpen(true);
  };

  

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('success');

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
      {deviceData && (
        <Box elevation={3} sx={{ padding: '10px', marginBottom: '8px', border: `1px solid ${borderColor}`, marginLeft: "7px", marginRight: "5px" }}>
          <Box display="flex">
            <Box flex="1">
              <Typography variant="h6">SCAM MESSAGE DETAILS</Typography>
              <ul>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>Device Name:</strong> {deviceData.deviceName}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>SCAM MESSAGE:</strong> {deviceData.sms}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>CreatedAt:</strong> {deviceData.createdAt}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>Status:</strong> {deviceData.status}
                  </Typography>
                </li>
              </ul>
            </Box>

            <Box flex="1">
              <ul>
                <strong style={{ marginLeft: '4px' }}>DEVICE REGISTERED BY :</strong>
                {deviceData.users && deviceData.users.map((user, index) => (
                  <li key={index}>
                    <Typography variant="body1">
                      <strong style={{ marginRight: '10px' }}>User Name:</strong> {user.name}
                    </Typography>
                    <Typography variant="body1">
                      <strong style={{ marginRight: '10px' }} >Phone Number:</strong> {user.phoneNumber}
                    </Typography>
                    <Typography variant="body1">
                      <strong style={{ marginRight: '10px' }} >Location:</strong> {user.location}
                    </Typography>
                    <Typography variant="body1">
                      <strong style={{ marginRight: '10px' }} >Department:</strong> {user.department}
                    </Typography>
                    <Typography variant="body1">
                      <strong style={{ marginRight: '10px' }}>Assigned At:</strong> {user.createdAt}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Box>

          </Box>
        </Box>
      )}
      

      <MyFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        loadDeviceDetails={loadDeviceDetails}
        selectedDevices={[id]}
        showSnackbar={showSnackbar}
      />

      <UnassignDialog
        open={isUnassignDialogOpen}
        onClose={() => setIsUnassignDialogOpen(false)}
        loadDeviceDetails={loadDeviceDetails}
        selectedDevices={[id]}
        showSnackbar={showSnackbar}
      />

      
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

export default DeviceDetails;
