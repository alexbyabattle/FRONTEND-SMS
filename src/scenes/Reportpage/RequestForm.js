import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  MenuItem,
  Grid,
  Paper,
  Box,
  CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';

const initialValues = {
  deviceName: '',
  sms: '',
  selectedUsers: [],
  dateTime: dayjs(),
};

const validationSchema = yup.object().shape({
  deviceName: yup.string().required('Required device Name'),
  sms: yup.string().required('Required scam message'),
  selectedUsers: yup.array(),
  dateTime: yup.date().required('Date and time is required'),
});

const Request = () => {
  const [responseStatus, setResponseStatus] = useState(null);
  const [responseCode, setResponseCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const theme = useTheme();
  const circularProgressColor = theme.palette.mode === 'dark' ? 'white' : 'black';

  const handleClassify = async (values) => {
    try {

      setLoading(true);

      const userId = localStorage.getItem('userId');
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken || !userId) {
        console.error('Access token or user ID not found in local storage');
        return;
      }

      const postData = {
        users: [{ id: userId }],
        deviceName: values.deviceName,
        sms: values.sms,
        dateTime: values.dateTime.toISOString(),
        status: '',
      };

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      // Send request to classify SMS
      const classifyResponse = await axios.post(
        'http://127.0.0.1:5000/classify',
        {
          text: values.sms,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Set status based on prediction
      postData.status =
        classifyResponse.data.prediction === 'Not spam' ? 'Not_spam' : 'Spam';

      // Send request to save device data
      const saveResponse = await axios.post(
        'http://localhost:8083/api/v1/device/save',
        postData,
        config
      );

      // Update UI based on response
      setResponseStatus(saveResponse.data.header.responseStatus);
      setResponseCode(saveResponse.data.header.responseCode);
      formik.resetForm();

      // Navigate based on prediction
      if (classifyResponse.data.prediction === 'Not spam') {
        navigate('/NonScam');
      } else {
        navigate('/scam');
      }
    } catch (error) {
      console.error(error);
    }finally {
      setLoading(false);
    }
  };


  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleClassify,
  });

  return (
    <div>
      <Paper
        style={{
          padding: 20,
          marginBottom: 20,
          marginLeft: '20px',
          marginRight: '60px',
        }}
      >
        <h1>CHECK IF MESSAGE IS SPAM</h1>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Device Name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.deviceName}
                name="deviceName"
                error={formik.touched.deviceName && !!formik.errors.deviceName}
                helperText={formik.touched.deviceName && formik.errors.deviceName}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="SCAM MESSAGE"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.sms}
                name="sms"
                error={formik.touched.sms && !!formik.errors.sms}
                helperText={formik.touched.sms && formik.errors.sms}
              />
            </Grid>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={6}>
                <DateTimePicker
                  value={formik.values.dateTime}
                  onChange={(newValue) =>
                    formik.setFieldValue('dateTime', newValue)
                  }
                  disableFuture
                  views={['year', 'month', 'day', 'hours', 'minutes']}
                />
              </Grid>
            </LocalizationProvider>
          </Grid>

          <div style={{ marginTop: '20px' }}>
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              style={{ padding: '10px 20px', fontSize: '16px' }}
            >
              Submit
            </Button>
          </div>

          <Box sx={{ display: 'flex' , justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              {loading && <CircularProgress size={100} style={{ color: circularProgressColor, marginLeft: 10 }} />}
          </Box>
        </form>
      </Paper>

      {responseStatus && (
        <div
          style={{
            display: 'inline-block',
            padding: '1px 1px',
            borderRadius: '1px',
            backgroundColor:
              responseCode === '0'
                ? 'success'
                : responseCode === '1'
                  ? 'error'
                  : 'transparent',
            borderColor:
              responseCode === '0'
                ? 'success'
                : responseCode === '1'
                  ? 'error'
                  : 'transparent',
            borderWidth: '1px',
            borderStyle: 'solid',
            color: 'white',
          }}
        >
          <p>{responseStatus}</p>
        </div>
      )}
    </div>
  );
};

export default Request;
