import React, { useState } from 'react';
import { Box, Typography, TextField, Button, useMediaQuery, useTheme} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import  {Formik} from "formik";


const LoginForm = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // State variables for username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Handle form submission
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    navigate('/home');
    
    // with the username and password.
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
      <form onSubmit={handleLogin}>
        {isMobileScreen ? (
          // Mobile view
          <>
          {/* <Typography  variant="h4">Login</Typography> */}
            <TextField
              style={{
                width: '100%',
                background: 'white',
              }}
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              style={{
                width: '100%',
                background: 'white',
              }}
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button  
             variant="contained"
              style={{
                backgroundColor: theme.palette.secondary[200],
                color: theme.palette.tertiary[500],
                border: `1px solid ${theme.palette.tertiary[500]}`
                      }}
              type="submit">
          Log In
        </Button>
          </>
        ) : (
          // Desktop view
          
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
      {/* <Typography  variant="h4">Login</Typography> */}

            <TextField
              style={{
                width: '40vh',
                background: 'white',
              }}
              label="Username"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              style={{
                width: '40vh',
                background: 'white',
              }}
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
             <Button  
             variant="contained"
              style={{
                backgroundColor: theme.palette.secondary[200],
                color: theme.palette.tertiary[500],
                border: `1px solid ${theme.palette.tertiary[500]}`
                      }}
              type="submit">
          Log In
        </Button>
          </Box>
        )}
       
      </form>
  );
};

export default LoginForm;
