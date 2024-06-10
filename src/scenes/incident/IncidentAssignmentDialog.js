import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';


const initialValues = {
  selectedUsers: [],
  dateTime: dayjs(),
};

const checkoutSchema = yup.object().shape({

  selectedUsers: yup.array(),
  dateTime: yup.date().required('Date and time is required'),
});

function MyFormDialog({ open, onClose, loadIncidentDetails, showSnackbar , selectedIncidents }) {

  const [selectTouched, setSelectTouched] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleIncidentAssignment = async (values) => {
    try {
      //console.log('Preparing to send data:', { selectedIncidents, selectedUsers: values.selectedUsers, dateTime: values.dateTime });
      console.log('Selected Incidents:', selectedIncidents);
  
      const postData = {
        incidentIds: selectedIncidents, 
        userIds: values.selectedUsers, 
        
      };
  
      console.log('Data to be sent:', postData);
  
      const response = await axios.post('http://localhost:8082/api/incident/assignment', postData);
  
      console.log('Response received:', response);
  
      if (response.status === 200) {
        const responseCode = response.data.header.responseCode;
        const responseStatus = response.data.header.responseStatus;
  
        // Determine snackbar color based on response code
        const snackbarColor = responseCode === 0 ? 'success' : 'error';
  
        // Use response status as the snackbar message
        showSnackbar(snackbarColor, responseStatus);
        console.log('Success: Data has been posted to the API');
        loadIncidentDetails();
        onClose();
        setSelectTouched(false);
      } else {
        // Use response status as the snackbar message for error cases
        showSnackbar('error', response.data.header.responseStatus);
        console.error('Error: Something went wrong with the API request');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  


  useEffect(() => {
    axios
      .get('http://localhost:8082/api/user/list')
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          // Filter users with roleName 'admin'
          const adminUsers = response.data.data.filter(user => user.roles.some(role => role.roleName === 'ADMIN'));
          setUsers(adminUsers);
        } else {
          console.error('Invalid response structure:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);
  

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>  ASSIGN INCIDENT TO PARTICULAR ADMIN  </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={checkoutSchema}
          onSubmit={handleIncidentAssignment}
        >
          {({ values, errors, touched, handleBlur, handleChange, setFieldTouched }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    variant="filled"
                    label="IT ASSIGNED TASK"
                    onBlur={() => {
                      setSelectTouched(true); // Mark select as touched
                    }}
                    onChange={(e) => {
                      const selectedIds = e.target.value;
                      setSelectedUsers(selectedIds);
                      setSelectTouched(false); // Clear the selectTouched state
                      handleChange(e);
                    }}
                    value={values.selectedUsers}
                    name="selectedUsers"
                    helperText={selectTouched && values.selectedUsers.length === 0 && 'At least one user must be selected'}
                    SelectProps={{
                      multiple: true,
                      renderValue: (selected) => {
                        return selected
                          .map((selectedUser) => {
                            const user = users.find((user) => user.id === selectedUser);
                            return user ? user.name : '';
                          })
                          .join(', ');
                      },
                    }}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid item xs={6}>
                    <div style={{ marginTop: '10px' }} />
                    <DateTimePicker
                      value={values.dateTime}
                      onChange={(newValue) =>
                        handleChange({
                          target: { name: 'dateTime', value: newValue },
                        })
                      }
                      disableFuture
                      views={['year', 'month', 'day', 'hours', 'minutes']}
                    />
                  </Grid>
                </LocalizationProvider>
              </Grid>

              <DialogActions>
                <Button type="submit" variant="contained" color="secondary">
                  Submit
                </Button>
                <Button onClick={onClose} color="secondary">
                  Cancel
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default MyFormDialog;




























