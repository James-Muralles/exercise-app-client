import React, { useState } from 'react';
import { Box, Typography, TextField, Button, useMediaQuery, useTheme } from '@mui/material';

const LoginPage = () => {
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // State variables for username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Handle form submission
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // You can perform the login action here, e.g., send a request to your server
    // with the username and password.
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <Box>
      <Typography variant="h4">Login</Typography>
      <form onSubmit={handleLogin}>
        {isMobileScreen ? (
          // Mobile view
          <>
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
          </>
        ) : (
          // Desktop view
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
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
             <Button variant="contained" color="primary" type="submit">
          Log In
        </Button>
          </Box>
        )}
       
      </form>
    </Box>
  );
};

export default LoginPage;
