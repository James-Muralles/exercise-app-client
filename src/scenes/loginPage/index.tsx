import React, { useState } from 'react';
import { Box, Typography, TextField, Button, useMediaQuery, useTheme} from '@mui/material';
import LoginForm from '@/scenes/loginPage/LoginForm';


const LoginPage = () => {
  return (
    <Box sx={{width: '100%'}}>
     <LoginForm/>
    </Box>
  );
};

export default LoginPage;
