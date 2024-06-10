import { useState } from 'react';
import axios from 'axios';

export const useAddUser = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const addUser = async (userData, loadUsers, showSnackbar, onClose) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8082/api/user/create', userData);

      if (response.status === 200) {
        const responseCode = response.data.header.responseCode;
        const responseStatus = response.data.header.responseStatus;

        // Determine snackbar color based on response code
        const snackbarColor = responseCode === 0 ? 'success' : 'error';

        // Use response status as the snackbar message
        showSnackbar(snackbarColor, responseStatus);
        console.log('Success: Data has been posted to the API');
        loadUsers();
        onClose();

        // Save user details to localStorage upon successful addition
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        // Use response status as the snackbar message for error cases
        showSnackbar('error', response.data.header.responseStatus);
        console.error('Error: Something went wrong with the API request');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { addUser, isLoading, error };
};
