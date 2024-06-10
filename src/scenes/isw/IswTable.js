import React, { useState, useEffect } from 'react';
import { Box, IconButton,  Snackbar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Delete } from '@mui/icons-material';
import Header from '../../components/Header';
import axios from 'axios';
import DeleteDialog from './DeleteIswDialog';
import IswDetailsDialog from './IswDetailsDialog';
import IswEditDialog from './IswEditDialog';

const IswTable = () => {

  

  // handling  populating the data after submitting
  const [rows, setRows] = useState([]);

  const loadIsws = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/isw/list');
      const { data } = response.data;
  
      const formattedData = data.map((item) => ({
        id: item.id,
        iswName: item.iswName,
        incidentTitle: item.incidents.map((incident) => incident.incidentTitle).join(', '),
        incidentType: item.incidents.map((incident) => incident.incidentType).join(', '),
      }));
  
      setRows(formattedData);
  
      if (response.data.header.responseCode === 0) {
        showSnackbar(0, response.data.header.responseStatus);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar(1, 'Error Message'); // Example usage of showSnackbar with responseCode 1
    }
  };
  

  useEffect(() => {
    loadIsws();
  }, []);
  
  
  
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

  

  
  // handling   delete  button  to be  able  to delete the  details
  
  const [selectedIswId, setSelectedIswId] = useState(null); // To store the selected ISW ID for deletion
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);


  const handleDeleteClick = (iswId) => {
    setSelectedIswId(iswId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedIswId(null); // Reset the selected ISW ID
    loadIsws();
  };

  // handling  displaying of details

  const [iswDetailsDialogOpen, setIswDetailsDialogOpen] = useState(false);
  const [selectedIswIdForDetails, setSelectedIswIdForDetails] = useState(null);

  const openIswDetailsDialog = (iswId) => {
    setSelectedIswIdForDetails(iswId);
    setIswDetailsDialogOpen(true);
  };

  const closeIswDetailsDialog = () => {
    setSelectedIswIdForDetails(null);
    setIswDetailsDialogOpen(false);
  };

  // handling edit dialog 

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedIswIdForEdit, setSelectedIswIdForEdit] = useState(null);

  
  const handleEditClick = (iswId) => {
    setSelectedIswIdForEdit(iswId);
    setIsEditDialogOpen(true);
  };

  const closeIswEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedIswIdForEdit(null);
  };


  const columns = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'iswName',
      headerName: 'Incident Solving way',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'incidentTitle',
      headerName: 'Incident Title',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'incidentType',
      headerName: 'Incident Type',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 150,
      renderCell: ({ row }) => {
        return (
          <Box display="flex" justifyContent="center">
            <IconButton 
              color="secondary"  
              onClick={() => handleDeleteClick(row.id)}
            >
                <Delete style={{ color: 'red' }} />
            </IconButton>

            <IconButton color="info" onClick={() => handleEditClick(row.id)} >
              <EditOutlinedIcon />
            </IconButton>

            <IconButton color="success" onClick={() => openIswDetailsDialog(row.id)} >
              <VisibilityOutlinedIcon style={{ color: 'green' }} />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="INCIDENT SOLVING WAY" />

     

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        iswId={selectedIswId}
        loadIsws={loadIsws}
        showSnackbar={showSnackbar}
      />
     
       <IswDetailsDialog
        id={selectedIswIdForDetails}
        open={iswDetailsDialogOpen}
        onClose={closeIswDetailsDialog}
      />  
       

      
 
       <IswEditDialog
        id={selectedIswIdForEdit}
        open={isEditDialogOpen}
        onClose={closeIswEditDialog}
        loadIsws={loadIsws}
      />      

      <Box m="40px 0 0 0" height="72vh">
        <DataGrid rows={rows} columns={columns} />
      </Box>

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

export default IswTable;
