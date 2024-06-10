import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {

  Typography,
  Box,
  IconButton,
  Snackbar,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { AddToQueue, AddCard, ChangeCircle } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import MyFormDialog from './IncidentAssignmentDialog';
import IswToIncident from './IswToIncidentassignmentDialog';
import ChangeStatusDialog from '../device/ChangeDeviceStatus';
import { useTheme } from '@mui/material';


const IncidentDetails = () => {



  const { id } = useParams(); // Extract the id parameter from the route

  const theme = useTheme();
  const borderColor = theme.palette.mode === 'dark' ? 'white' : 'black';

  const [incidentData, setIncidentData] = useState(null);

  const loadIncidentDetails = () => {
    console.log('Fetching incident details for ID:', id);

    // Verify the Axios GET request payload
    axios
      .get(`http://localhost:8082/api/incident/${id}`)
      .then((response) => {
        console.log('Response data:', response.data); // Log response data
        // Extract the "data" field from the response
        const { data } = response.data;
        setIncidentData(data);
      })
      .catch((error) => {
        console.error('Error fetching incident details:', error);
        // Log the entire error object for more information
        console.error('Full error object:', error);
      });
  };

  useEffect(() => {
    loadIncidentDetails();
  }, [id]);



  // handling opening and closing of IncidentASsignment to admin  Dialog  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openIncidentAssignmentDialog = (incidentId) => {
    setIsDialogOpen(true);
  };


  // handling opening and closing of solving way to incident Dialog  

  const [isIswToIncidentDialogOpen, setIsIswToIncidentDialogOpen] = useState(false);

  const openIncidentSolvingWayDialog = (incidentId) => {
    setIsIswToIncidentDialogOpen(true);
  };


  // handling opening and closing of changing status of device Dialog  

  const [isStatusOfDeviceDialogOpen, setIsStatusOfDeviceDialogOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  const openStatusOfDeviceDialog = () => {

    if (incidentData && incidentData.devices.length > 0) {

      const deviceId = incidentData.devices[0].id;
      setIsStatusOfDeviceDialogOpen(true);
      setSelectedDeviceId(deviceId);
    } else {
      console.error('No devices found for the incident');
    }
  };



  // handling  opening and closing of SnackBar 

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('success'); // Default snackbar color is 'success'

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (responseCode, responseStatus) => {
    // Determine snackbar color based on responseCode
    setSnackbarMessage(responseStatus);
    setSnackbarColor(responseCode);
    setSnackbarOpen(true);
  };





  return (

    <Box
      elevation={3}
    >

      {incidentData && (
        <Box
          elevation={3}
          sx={{
            padding: '10px',
            marginBottom: '8px',
            border: `1px solid ${borderColor}`,
            marginLeft: "7px",
            marginRight: "5px",
          }}

        >

          <Box display="flex">
            <Box flex="1" marginRight="16px">
              <strong style={{ marginLeft: '4px', marginRight: '15px' }}> INCIDENTS:  </strong>
              <Typography variant="body1" style={{ marginLeft: '8px' }}>
                <strong style={{ marginRight: '10px' }}  >INCIDENT TITLE:</strong> {incidentData.incidentTitle}
              </Typography>
              <Typography variant="body1" style={{ marginLeft: '8px' }}>
                <strong style={{ marginRight: '10px' }} >INCIDENT TYPE :  </strong> {incidentData.incidentType}
              </Typography>
              <Typography variant="body1">
                <strong style={{ marginRight: '10px' }}> status: </strong>
                <Box
                  bgcolor={
                    ["FINE", "ACTIVE", "SOLVED", "PROVIDED", "APPROVED"].includes(incidentData.status)
                      ? "#4CAF50"
                      : ["Pending", "FAULT", "PENDING", "Solution_Pending", "In_Active"].includes(incidentData.status)
                        ? "#f44336"
                        : "#FFFFFF"
                  }
                  color="#FFFFFF"
                  p={1}
                  borderRadius={15}
                  width={80}
                  height={40}
                  display="inline-flex"
                  justifyContent="center"
                  alignItems="center"
                  style={{ marginLeft: 10 }}

                  component="span"
                >
                  {incidentData.status}
                </Box>
              </Typography>
              <Typography variant="body1" style={{ marginLeft: '8px' }}>
                <strong style={{ marginRight: '10px' }}> SUBMITTED AT :</strong> {incidentData.createdAt}
              </Typography>
            </Box>


            <Box flex="1">
              <strong style={{ marginLeft: '4px' }}>DEVICES:</strong>
              <ul>
                {incidentData.devices.map((device, index) => (
                  <li key={index}>
                    <Typography variant="body1">
                      <strong style={{ marginRight: '10px' }} >deviceName:</strong> {device.deviceName}
                    </Typography>
                    <Typography variant="body1">
                      <strong style={{ marginRight: '10px' }} > deviceNumber: </strong> {device.deviceNumber}
                    </Typography>
                    <Typography variant="body1">
                      <strong style={{ marginRight: '10px' }} > manufactural: </strong> {device.manufactural}
                    </Typography>
                    <Typography variant="body1">
                      <strong style={{ marginRight: '10px' }}> status: </strong>
                      <Box
                        bgcolor={
                          ["FINE", "Active", "Solved", "Provided", "Approved"].includes(device.status)
                            ? "#4CAF50"
                            : ["Pending", "FAULT", "PENDING", "Solution_Pending", "In_Active"].includes(device.status)
                              ? "#f44336"
                              : "#FFFFFF"
                        }
                        color="#FFFFFF"
                        p={1}
                        borderRadius={15}
                        width={80}
                        height={40}
                        display="inline-flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{ marginLeft: 10 }}

                        component="span"
                      >
                        {device.status}
                      </Box>
                    </Typography>

                  </li>
                ))}
              </ul>
            </Box>

            <Box flex="1" >
              <ul>
                <strong style={{ marginLeft: '4px' }}>USER REPORTED INCIDENT: </strong>
                {incidentData.users
                  .filter(user => user.department !== 'IT')
                  .map((user, index) => (
                    <li key={index}>
                      <Typography variant="body1">
                        <strong style={{ marginRight: '10px' }}>UserName:</strong> {user.userName}
                      </Typography>
                      <Typography variant="body1">
                        <strong style={{ marginRight: '10px' }} > phoneNumber: </strong> {user.phoneNumber}
                      </Typography>
                      <Typography variant="body1">
                        <strong style={{ marginRight: '10px' }} > department: </strong> {user.department}
                      </Typography>
                      <Typography variant="body1">
                        <strong style={{ marginRight: '10px' }}> location: </strong> {user.location}
                      </Typography>
                    </li>
                  ))}
              </ul>
            </Box>


          </Box>
        </Box>
      )}


      {incidentData && (
        <Box
          elevation={3}
          sx={{
            padding: '10px',
            marginBottom: '8px',
            border: `1px solid ${borderColor}`,
            marginLeft: "7px",
            marginRight: "5px",
          }}

        >


          <Box display="flex" justifyContent="space-between">
            <Box flex="1" marginRight="16px" justifyContent="column">

              <Tooltip title="Assign Admin Incident">
                <IconButton color="success" onClick={() => openIncidentAssignmentDialog(incidentData.id)}>
                  <AddToQueue style={{ color: "white", fontSize: 32 }} />
                </IconButton>
              </Tooltip>
              <ul>
                <strong style={{ marginLeft: '4px' }}> INCIDENT ASSIGNED TO (IT): </strong>
                {incidentData.users
                  .filter(user => user.department === 'IT')
                  .map((user, index) => (
                    <li key={index}>
                      <Typography variant="body1">
                        <strong style={{ marginRight: '10px' }}>UserName:</strong> {user.userName}
                      </Typography>
                      <Typography variant="body1">
                        <strong style={{ marginRight: '10px' }} > phoneNumber: </strong> {user.phoneNumber}
                      </Typography>
                      <Typography variant="body1">
                        <strong style={{ marginRight: '10px' }} > department: </strong> {user.department}
                      </Typography>
                      <Typography variant="body1">
                        <strong style={{ marginRight: '10px' }}> location: </strong> {user.location}
                      </Typography>
                      <Typography variant="body1">
                        <strong style={{ marginRight: '10px' }}> Assigned At: </strong> {user.createdAt}
                      </Typography>
                    </li>
                  ))}
              </ul>
            </Box>




            <Box flex="1" marginRight="16px" justifyContent="column">

              <Tooltip title="Assign ISW to Incident ">
                <IconButton color="success" onClick={() => openIncidentSolvingWayDialog(incidentData.id)}>
                  <AddCard style={{ color: "white", fontSize: 32 }} />
                </IconButton>
              </Tooltip>

              <ul>
                <strong style={{ marginLeft: '4px' }}> SOLVING WAYS: </strong>
                {incidentData.solvingWays

                  .map((solvingWay, index) => (
                    <li key={index}>
                      <Typography variant="body1">
                        {solvingWay.iswName}
                      </Typography>
                    </li>
                  ))}
              </ul>
            </Box>




            <Box flex="1">
              <div style={{ position: 'relative' }}>
                <Box style={{ position: 'absolute', top: '50px', left: '50px', display: 'flex', alignItems: 'center' }} >
                  <Box justifyContent="column"  >
                    <Box >
                      <strong > CHANGE DEVICE STATUS </strong>
                    </Box>
                    <Box style={{ position: 'absolute', top: '20px', left: '50px', alignItems: 'center' }}>
                      <Tooltip title="Change status of the Device">
                        <IconButton
                          onClick={() => openStatusOfDeviceDialog(incidentData.id)}
                          sx={{ bgcolor: 'secondary.main', width: 60, height: 60 }}
                        >
                          <ChangeCircle style={{ color: "white", fontSize: 32 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>

              </div>
            </Box>


          </Box>
        </Box>
      )}


      <MyFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        loadIncidentDetails={loadIncidentDetails}
        selectedIncidents={[id]}
        showSnackbar={showSnackbar}
      />

      <IswToIncident
        open={isIswToIncidentDialogOpen}
        onClose={() => setIsIswToIncidentDialogOpen(false)}
        loadIncidentDetails={loadIncidentDetails}
        selectedIncidents={[id]}
        showSnackbar={showSnackbar}
      />


      <ChangeStatusDialog
        open={isStatusOfDeviceDialogOpen}
        onClose={() => setIsStatusOfDeviceDialogOpen(false)}
        deviceId={selectedDeviceId}
        showSnackbar={showSnackbar}
        loadIncidentDetails={loadIncidentDetails}
        incidentData={incidentData}
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

export default IncidentDetails;