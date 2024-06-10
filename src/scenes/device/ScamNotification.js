import React from 'react';
import { Typography, Box } from '@mui/material';
import image from '../../data/image';
import { Link } from 'react-router-dom';

const ScamDetails = () => {
  return (
    <Box
      border={2}
      borderColor="red"
      padding={2}
      borderRadius={5}
      marginTop={7}
      marginLeft={2} // Add margin left
      marginRight={2} // Add margin right
    >
      <Typography variant="h4" color="error" align="center">
        MESSAGE PROVIDED IS SPAM
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center">
        <img
          alt="gcla admin"
          width="100px"
          height="100px"
          src={image.spam4}
          style={{ cursor: "pointer", borderRadius: "50%" }}
        />
      </Box>
      <Typography variant="h4" color="white" align="center">
          call  911    or   report  who  sent the  SMS to <Link> www.tcra.go.tz </Link>  
      </Typography>
    </Box>
  );
};

export default ScamDetails;
