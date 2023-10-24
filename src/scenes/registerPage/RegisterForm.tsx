import React, { useState } from 'react';
import { Box, Typography, TextField, Button, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';



const RegisterForm = () => {
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState('loginPage');  
  const [isRegistered, setIsRegistered] = useState('not complete');
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));

  

  // State variables for name, username, password, and email
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  

  // Handle form submission
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
    setIsRegistered("Completed");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRegistered("Completed");
    console.log("registered successfully")
    setSelectedPage('loginPage');
    navigate('/');
    }catch(e){
      console.error('Registration Failed', e);
      setIsRegistered('not complete');
    }

    
  };

  return (
    <Box >
      {/* <Typography variant="h4">Register</Typography> */}
      <form onSubmit={handleRegister}>
        {isMobileScreen ? (
          // Mobile view
          <>
            <TextField
             style={{
               width: '100%',
               background: 'white',
               
              }}
              label="name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setUsername(e.target.value)}
              />
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
              label="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
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
            <Button variant="contained"
              style={{
                backgroundColor: theme.palette.secondary[200],
                color: theme.palette.tertiary[500],
                border: `1px solid ${theme.palette.tertiary[500]}`
                      }}
              type="submit">
          Register
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
            <TextField
              style={{
                width: '40vh',
                background: 'white',
              }}
              label="name"
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
              label="email"
              variant="outlined"
              margin="normal"
              value={email}
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
             <Button variant="contained"
              style={{
                backgroundColor: theme.palette.secondary[200],
                color: theme.palette.tertiary[500],
                border: `1px solid ${theme.palette.tertiary[500]}`
                      }}
              type="submit">
          Register
        </Button>
          </Box>
        )}
       
      </form>
    </Box>
  );
};

export default RegisterForm;
