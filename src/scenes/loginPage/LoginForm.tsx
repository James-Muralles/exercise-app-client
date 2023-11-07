import React, { useState } from 'react';
import { Box, Typography, TextField, Button, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { setLogin } from '@/state';
import { LoginFormValues } from '@/state/types';

const loginSchema = yup.object().shape({
  username: yup.string().required('required'),
  password: yup.string().required('required'),
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
  
const login = async (values: LoginFormValues, onSubmitProps: { resetForm: () => void; }) => {
  console.log("Attempting to log in...");
  try {
    const loggedInResponse = await fetch('http://localhost:1337/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (!loggedInResponse.ok) {
      // Handle the case where login failed (e.g., wrong credentials)
      console.log("Login failed.");
      return;
    }

    const loggedIn = await loggedInResponse.json();
    console.log("Logged in:", loggedIn);

    onSubmitProps.resetForm();
    
    // Only update the state if the login was successful
    dispatch(
      setLogin({
        user: loggedIn.user,
        token: loggedIn.token,
      })
    );

          navigate('/createTemplate');

    
  } catch (error) {
    // Handle network errors or other issues
    console.error("Login error:", error);
  }
};
    
// const handleFormSubmit = async (values: LoginFormValues, onSubmitProps: { resetForm: () => void; }) => {
//     await login(values, onSubmitProps);
//     navigate('/home');

//   };
  const handleFormSubmit = async (values: LoginFormValues, onSubmitProps: { resetForm: () => void; }) => {
    await login(values, onSubmitProps);
    console.log("Before navigation");
    navigate('/home');
    console.log("After navigation");
};
    

  return (
    <Formik
      onSubmit={handleFormSubmit} 
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
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          {isMobileScreen ? (
            <>
              <TextField
                style={{
                  width: '100%',
                  background: 'white',
                }}
                label="Username"
                name='username'
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
                name='password'
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
                name="username"
                onBlur={handleBlur}
                onChange={handleChange}
                error={Boolean(touched.username) && Boolean(errors.username)}
                helperText={touched.username && errors.username}
                variant="outlined"
                margin="normal"
                value={values.username}
              />
              <TextField
                style={{
                  width: '40vh',
                  background: 'white',
                }}
                label="Password"
                name="password"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                variant="outlined"
                value={values.password}
              />
              <Button
                onClick={() => {
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
            </Box>
          )}
        </form>
      )}
    </Formik>
  );
};

export default LoginForm;
