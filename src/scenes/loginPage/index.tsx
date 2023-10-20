import React, { useState } from 'react';
import { Box, Typography, TextField, Button, useMediaQuery, useTheme } from '@mui/material';

const LoginPage = () => {
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // State variables for username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Handle form submission
  const handleLogin = (e) => {
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
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {isMobileScreen ? (
          <Box marginTop={2}>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>
        ) : (
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
        <Button variant="contained" color="primary" type="submit">
          Log In
        </Button>
      </form>
    </Box>
  );
};

export default LoginPage;
