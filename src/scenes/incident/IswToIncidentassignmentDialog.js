import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { useState  } from 'react';
import axios from 'axios';
import { Formik , Form } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const initialValues = {
  iswName: '',
  selectedIncidents: [],
  dateTime: dayjs(),
};

const checkoutSchema = yup.object().shape({
  iswName: yup.string().required('Required incident solving way'),
  selectedIncidents: yup.array(),
  dateTime: yup.date().required('Date and time are required'),
});

function  IswToIncident({ open, onClose, loadIncidentDetails, showSnackbar , selectedIncidents }) {
  const [selectTouched, setSelectTouched] = useState(false);
  
  

  const handleFormSubmit = async (values) => {
    try {
      const postData = {
        iswName: values.iswName,
        incidents: selectedIncidents.map((id) => ({ id })),
        dateTime: values.dateTime,
      };
  
      console.log('Posting data:', postData); // Log the data being posted
  
      const response = await axios.post('http://localhost:8082/api/isw/create', postData);
  
      console.log('Response:', response); // Log the response object
  
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
  }
  

  

  

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle> Add Incident Solving  Way</DialogTitle>
      <DialogContent>
        <DialogContentText> </DialogContentText>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema}
        >
          {({ values, errors, touched, handleBlur, handleChange }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Solving Way"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.iswName}
                    name="iswName"
                    error={touched.iswName && !!errors.iswName}
                    helperText={touched.iswName && errors.iswName}
                  />
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
};

export default IswToIncident;
