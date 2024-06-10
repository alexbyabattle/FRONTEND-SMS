import React from 'react';
import { Typography, Box } from '@mui/material';
import image from '../../data/image';

const NonScamDetails = () => {
    return (
        <Box
          border={2}
          borderColor="green"
          padding={2}
          borderRadius={5}
          marginTop={7}
          marginLeft={2} 
          marginRight={2} 
        >
          <Typography variant="h4" color="green" align="center">
            MESSAGE PROVIDED IS NOT_SPAM
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center">
            <img
              alt="gcla admin"
              width="100px"
              height="100px"
              src={image.spam3}
              style={{ cursor: "pointer", borderRadius: "50%" }}
            />
          </Box>
        </Box>
      );
    };

export default NonScamDetails;
