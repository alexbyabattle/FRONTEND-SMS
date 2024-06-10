import React, { useState, useEffect } from 'react';
import { Button, TextField, MenuItem, Grid, Dialog, DialogTitle, DialogContent, DialogActions , Box } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup'; 
import dayjs from 'dayjs';
import { useAddUser } from '../../hooks/useAddUser';
import axios from 'axios'; // Import axios

const initialValues = {
  userName: '',
  phoneNumber: '',
  email: '',
  location: '',
  department: '', 
  password: '', 
  selectedRoles: [],
  dateTime: dayjs(),
};

const checkoutSchema = yup.object().shape({
  userName: yup.string().required('Required device name'),
  phoneNumber: yup.string().required('Required device number'),
  email: yup.string().email("Invalid email").required("Required"),
  location: yup.string().required('Required manufacturer'),
  department: yup.string().required('Department required'),
  password: yup.string().required('Password required'),
  selectedRoles: yup.array(),
  dateTime: yup.date().required('Date and time is required'),
});

function MyFormDialog({ open, onClose, loadUsers, showSnackbar }) {
  const { addUser , isLoading, error } = useAddUser(); // Initialize the useAddUser hook
  const [roles, setRoles] = useState([]); // Define roles state
  const [selectTouched, setSelectTouched] = useState(false); // Define selectTouched state
  const [selectedRoles, setSelectedRoles] = useState([]); // Define selectedRoles state

  useEffect(() => {
    axios
      .get('http://localhost:8082/api/role')
      .then((response) => {
        // Check if the "data" property exists and is an array
        if (response.data && Array.isArray(response.data.data)) {
          setRoles(response.data.data);
        } else {
          console.error('Invalid response structure:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching roles:', error);
      });
  }, []); 

  const handleFormSubmit = async (values) => {
    // Call addUser from the useAddUser hook
    await addUser(values, loadUsers, showSnackbar, onClose);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Device</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={checkoutSchema}
          onSubmit={handleFormSubmit} // Use handleFormSubmit for form submission
        >
          {({ values, errors, touched, handleBlur, handleChange }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    type="text"
                    label="UserName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.userName}
                    name="userName"
                    error={touched.userName && !!errors.userName}
                    helperText={touched.userName && errors.userName}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    type="text"
                    label="phoneNumber"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phoneNumber}
                    name="phoneNumber"
                    error={touched.phoneNumber && !!errors.phoneNumber}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    type="text"
                    label="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    type="text"
                    label="location"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.location}
                    name="location"
                    error={touched.location && !!errors.location}
                    helperText={touched.location && errors.location}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    type="text"
                    label="department"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.department}
                    name="department"
                    error={touched.department && !!errors.department}
                    helperText={touched.department && errors.department}
                  />
                </Grid>

                
                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    type="text"
                    label="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                  />
                </Grid>
                  
                <Grid item xs={6}>
                  {roles.length > 0 && (
                    <TextField
                      select
                      fullWidth
                      variant="filled"
                      label="role of  users"
                      onBlur={() => {
                        setSelectTouched(true); // Mark select as touched
                      }}
                      onChange={(e) => {
                        const selectedIds = e.target.value;
                        setSelectedRoles(selectedIds);
                        setSelectTouched(false); // Clear the selectTouched state
                        handleChange(e);
                      }}
                      value={values.selectedRoles}
                      name="selectedRoles"
                      helperText={selectTouched && values.selectedRoles.length === 0 && 'At least one role must be selected'}
                      SelectProps={{
                        multiple: true,
                        renderValue: (selected) => {
                          return selected
                            .map((selectedRoles) => {
                              const role = roles.find((role) => role.id === selectedRoles);
                              return role ? role.roleName : '';
                            })
                            .join(', ');
                        },
                      }}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.roleName}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}

                </Grid>


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

              <DialogActions>
                <Button type="submit" variant="contained" color="secondary"  disabled= {isLoading}>
                  Submit
                </Button>
                <Button onClick={onClose} color="secondary">
                  Cancel
                </Button>
              </DialogActions>
              { error  &&  <Box  className= {error} > {error } </Box>}
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default MyFormDialog;
