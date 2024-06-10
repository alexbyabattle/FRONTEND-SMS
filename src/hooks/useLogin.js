import { useState } from 'react';
import axios from 'axios';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

const useLogin = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('success');
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const checkoutSchema = yup.object().shape({
    email: yup.string().required('Required email'),
    password: yup.string().required('Required password'),
  });

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, color) => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarOpen(true);
  };

  const handleFormSubmit = async (values, formik) => {
    try {
      const formattedData = {
        email: values.email,
        password: values.password,
      };

      const response = await axios.post(
        'http://localhost:8082/api/auth/authenticate',
        formattedData
      );

      if (response.data.header.responseCode === '0') {
        // Success response
        navigate('/');
      } else {
        // Error response
        showSnackbar(response.data.header.responseStatus, 'error');
      }
      formik.resetForm();
    } catch (error) {
      // Handle network error or other issues
      showSnackbar('An error occurred. Please try again later.', 'error');
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: checkoutSchema,
    onSubmit: handleFormSubmit,
  });

  return {
    formik,
    snackbarOpen,
    snackbarMessage,
    snackbarColor,
    handleCloseSnackbar,
  };
};

export default useLogin;
