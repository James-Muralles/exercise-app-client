import React, { useState } from 'react';
import { Box, Typography, TextField, Button, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { setLogin } from '@/state';

const loginSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .test('custom-validation', 'Invalid username', (value) => {
      // Add your custom validation logic here
      // Return true if the value is valid, or return a string with an error message if it's invalid
      return /* your validation logic */;
    }),
  password: yup.string().required('Password is required'),
});


const initialLoginValues = {
  username: '',
  password: '',
};

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // State variables for username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch('http://localhost/1337/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate('/home');
    }
  };

  // Handle form submission
  const handleLogin = async (values, onSubmitProps) => {
    await login(values, onSubmitProps);
    // with the username and password.
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <Formik
      onSubmit={handleLogin}
      initialValues={initialLoginValues}
      validationSchema={loginSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        // setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
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
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                error={Boolean(touched.username) && Boolean(errors.username)}
                helperText={touched.username && errors.username}
                fullWidth
                margin="normal"
              />
              <TextField
                style={{
                  width: '100%',
                  background: 'white',
                }}
                label="Password"
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                fullWidth
                margin="normal"
              />
              <Button
                onClick={() => {
                  resetForm();
                }}
                variant="contained"
                style={{
                  backgroundColor: theme.palette.secondary[200],
                  color: theme.palette.tertiary[500],
                  border: `1px solid ${theme.palette.tertiary[500]}`,
                }}
                type="submit"
              >
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
                  border: `1px solid ${theme.palette.tertiary[500]}`,
                }}
                type="submit"
              >
                Log In
              </Button>
            </Box>
          )}
        </form>
      )}
    </Formik>
  );
};

export default LoginForm;
